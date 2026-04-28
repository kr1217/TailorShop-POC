import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { FormInputs } from '../types/customer';

export const generateReceiptHtml = (data: FormInputs, orderId: string) => {
  const safeString = (val: any) => String(val || '');
  const totalAmount = parseFloat(safeString(data.orderDetails?.totalPrice).replace(/[^\d.-]/g, '')) || 0;
  const advanceAmount = parseFloat(safeString(data.orderDetails?.advancePayment).replace(/[^\d.-]/g, '')) || 0;
  const balanceAmount = totalAmount - advanceAmount;

  const dueDateStr = data.orderDetails?.dueDate 
    ? new Date(data.orderDetails.dueDate).toLocaleDateString('en-PK', { 
        day: '2-digit', month: 'short', year: 'numeric' 
      })
    : 'Not Set';

  const itemsHtml = data.orderDetails.items.map((item, idx) => `
    <div style="display: flex; align-items: center; margin-bottom: 5px;">
      <span style="width: 60px;">Item ${idx + 1}:</span>
      <div style="width: 16px; height: 16px; border-radius: 50%; background-color: ${item.colorCode}; border: 1px solid #ccc; margin-right: 10px;"></div>
      <span style="color: #555;">${item.fabricNote || 'Standard'}</span>
    </div>
  `).join('');

  return `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px; color: #111; }
          .header { text-align: center; margin-bottom: 20px; }
          .title { font-size: 24px; font-weight: 800; color: #2C3E50; margin-bottom: 5px; }
          .subtitle { font-size: 14px; color: #555; }
          .divider { border-bottom: 2px solid #2C3E50; margin: 15px 0; }
          .info-row { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .info-col { flex: 1; }
          .label { font-size: 10px; color: #777; text-transform: uppercase; letter-spacing: 1px; }
          .value { font-size: 18px; font-weight: 700; }
          .section-title { font-size: 18px; font-weight: 800; color: #2C3E50; margin-bottom: 10px; }
          .summary-box { background-color: #F8F9FA; padding: 10px; margin-bottom: 10px; display: flex; justify-content: space-between; }
          .due-box { border-left: 4px solid #C29B0B; background-color: #F8F9FA; padding: 10px; display: flex; justify-content: space-between; margin-bottom: 20px; }
          .due-date { font-weight: 800; color: #c0392b; }
          .payment-area { width: 60%; margin-left: auto; border-top: 1px dashed #ccc; padding-top: 10px; }
          .payment-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
          .balance { font-size: 20px; font-weight: 800; color: ${balanceAmount > 0 ? '#c0392b' : '#27ae60'}; }
          .footer { text-align: center; margin-top: 40px; border-top: 1px dashed #ccc; pt: 20px; }
          .urdu { font-family: 'Noto Nastaliq Urdu', serif; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">AL-RIAZ TAILORS (الریاض ٹیلرز)</div>
          <div class="subtitle">Opposite Main Market, Block C</div>
          <div class="subtitle">Tel: 0300-1234567 | Order ID: #${orderId}</div>
          <div class="divider"></div>
        </div>

        <div class="info-row">
          <div class="info-col">
            <div class="label">Customer Name</div>
            <div class="value">${data.personalInfo.name}</div>
          </div>
          <div class="info-col" style="text-align: right;">
            <div class="label">Phone</div>
            <div class="value">${data.personalInfo.phone}</div>
          </div>
        </div>

        <div class="section-title">Order Summary</div>
        <div class="summary-box">
          <span>Total Garments (سوٹس):</span>
          <span style="font-weight: 700;">${data.orderDetails.quantity} Items</span>
        </div>

        <div style="padding-left: 10px; margin-bottom: 20px;">
          ${itemsHtml}
        </div>

        <div class="due-box">
          <span>Due Date (واپسی):</span>
          <span class="due-date">${dueDateStr}</span>
        </div>

        <div class="payment-area">
          <div class="payment-row">
            <span>Total Amount:</span>
            <span style="font-weight: 700;">Rs. ${totalAmount.toLocaleString()}</span>
          </div>
          <div class="payment-row">
            <span>Advance / Deposit:</span>
            <span style="font-weight: 700;">Rs. ${advanceAmount.toLocaleString()}</span>
          </div>
          <div class="payment-row" style="margin-top: 10px;">
            <span style="font-size: 18px; font-weight: 800;">Balance:</span>
            <span class="balance">Rs. ${balanceAmount.toLocaleString()}</span>
          </div>
        </div>

        <div class="footer">
          <div style="font-style: italic; color: #555;">"Please bring this receipt at the time of pickup."</div>
          <div style="font-size: 12px; color: #999; margin-top: 5px;">(وصولی کے وقت یہ رسید لازمی ساتھ لائیں)</div>
        </div>
      </body>
    </html>
  `;
};

export const printToFile = async (data: FormInputs, orderId: string) => {
  const html = generateReceiptHtml(data, orderId);
  const { uri } = await Print.printToFileAsync({ html });
  await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
};
