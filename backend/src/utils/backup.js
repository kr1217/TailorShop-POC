const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { google } = require('googleapis');
const cron = require('node-cron');
const Customer = require('../models/Customer');
const Metadata = require('../models/Metadata');

const SERVICE_ACCOUNT_FILE = path.join(__dirname, '../../service-account.json');
const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || 'YOUR_FOLDER_ID_HERE';

async function uploadToDrive(filePath, fileName) {
  let auth;
  
  if (process.env.GOOGLE_REFRESH_TOKEN) {
    auth = new google.auth.OAuth2(
      (process.env.GOOGLE_CLIENT_ID || '').trim(),
      (process.env.GOOGLE_CLIENT_SECRET || '').trim(),
      'http://localhost'
    );
    auth.setCredentials({ 
      refresh_token: (process.env.GOOGLE_REFRESH_TOKEN || '').trim() 
    });
  } else {
    auth = new google.auth.GoogleAuth({
      keyFile: SERVICE_ACCOUNT_FILE,
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });
  }

  const drive = google.drive({ version: 'v3', auth });
  const fileMetadata = { name: fileName, parents: [GOOGLE_DRIVE_FOLDER_ID] };
  const media = { 
    mimeType: 'application/gzip', 
    body: fs.createReadStream(filePath) 
  };

  const response = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id',
  });
  return response.data.id;
}

async function hasDataChanged() {
  const lastBackupDoc = await Metadata.findByPk('last_backup_at');
  if (!lastBackupDoc) return true;

  const lastBackupAt = new Date(lastBackupDoc.value);
  const latestChange = await Customer.findOne({ order: [['updatedAt', 'DESC']] });
  
  if (!latestChange) return false;
  
  return latestChange.updatedAt > lastBackupAt;
}

const runBackup = (force = false) => {
  return new Promise(async (resolve, reject) => {
    if (!force) {
      const changed = await hasDataChanged();
      if (!changed) {
        console.log('No changes detected since last backup. Skipping...');
        return resolve({ status: 'no_change' });
      }
    }

    const baseName = `tailor_db_backup_${Date.now()}`;
    const sqlPath = path.join(__dirname, `../../${baseName}.sql`);
    const gzipPath = path.join(__dirname, `../../${baseName}.gz`);

    console.log(`Starting MySQL backup: ${baseName}.sql`);

    // MySQL dump command
    // Note: In production/Docker, MYSQL_HOST is usually 'mysql'
    const host = process.env.MYSQL_HOST || 'localhost';
    const user = process.env.MYSQL_USER || 'root';
    const pass = process.env.MYSQL_PASSWORD || '';
    const db = process.env.MYSQL_DATABASE || 'tailor_poc';

    const dumpCmd = `mysqldump --host=${host} --user=${user} --password=${pass} ${db} > "${sqlPath}"`;

    exec(dumpCmd, (error) => {
      if (error) {
        console.error(`Backup Command Error: ${error.message}`);
        return reject(error);
      }
      
      console.log('SQL dump created. Compressing...');
      
      // Compress the SQL file
      const gzipCmd = `gzip -c "${sqlPath}" > "${gzipPath}"`;
      
      exec(gzipCmd, async (gzipError) => {
        if (gzipError) {
          console.error(`Compression Error: ${gzipError.message}`);
          return reject(gzipError);
        }

        console.log('Backup compressed. Uploading to Google Drive...');
        try {
          let fileSize = 0;
          if (fs.existsSync(gzipPath)) {
            fileSize = fs.statSync(gzipPath).size;
          }

          await uploadToDrive(gzipPath, `${baseName}.gz`);
          
          // Update metadata
          await Metadata.upsert({ key: 'last_backup_at', value: new Date() });
          await Metadata.upsert({ key: 'last_backup_size', value: fileSize });
          await Metadata.upsert({ key: 'last_backup_name', value: `${baseName}.gz` });
          
          console.log('Backup successfully saved to Google Drive.');
          resolve({ status: 'success', fileName: `${baseName}.gz`, size: fileSize });
        } catch (uploadError) {
          console.error('Upload Failed:', uploadError);
          reject(uploadError);
        } finally {
          // Cleanup
          if (fs.existsSync(sqlPath)) fs.unlinkSync(sqlPath);
          if (fs.existsSync(gzipPath)) fs.unlinkSync(gzipPath);
        }
      });
    });
  });
};

cron.schedule('0 12 * * 0', async () => {
  console.log('Starting Weekly Automated Backup...');
  try {
    await runBackup();
  } catch (err) {
    console.error('Automated Backup Failed:', err);
  }
});

module.exports = { runBackup, hasDataChanged };
