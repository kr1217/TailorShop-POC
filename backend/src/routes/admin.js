const express = require('express');
const router = express.Router();
const { runBackup } = require('../utils/backup');
const Metadata = require('../models/Metadata');

// Get Backup Info
router.get('/backup-info', async (req, res) => {
  try {
    const lastBackupAt = await Metadata.findByPk('last_backup_at');
    const lastBackupSize = await Metadata.findByPk('last_backup_size');
    const lastBackupName = await Metadata.findByPk('last_backup_name');

    res.json({
      success: true,
      lastBackupAt: lastBackupAt ? lastBackupAt.value : null,
      lastBackupSize: lastBackupSize ? lastBackupSize.value : null,
      lastBackupName: lastBackupName ? lastBackupName.value : null
    });
  } catch (err) {
    console.error('Backup Info Error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch backup info' });
  }
});

// Manual Backup Trigger
router.post('/manual-backup', async (req, res) => {
  try {
    const { force } = req.body;
    const result = await runBackup(force === true); 
    
    if (result.status === 'no_change') {
      return res.status(200).json({ 
        success: true, 
        status: 'no_change',
        message: "The latest version of database is already backed up."
      });
    }

    res.status(200).send({ 
      success: true, 
      status: 'success',
      message: "Backup completed successfully and uploaded to Google Drive." 
    });
  } catch (err) {
    console.error('Manual Backup Error:', err);
    res.status(500).send({ 
      success: false, 
      error: err.message || "Failed to process backup." 
    });
  }
});

module.exports = router;
