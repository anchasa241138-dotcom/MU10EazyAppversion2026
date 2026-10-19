/**
 * Google Apps Script สำหรับรับ Webhook จากระบบ Mobi SmartLab 10
 * และส่งอีเมลผ่าน Gmail / Google Workspace ของหน่วยงานโดยอัตโนมัติ (ฟรี 100%)
 * 
 * วิธีการติดตั้ง:
 * 1. เข้าไปที่ https://script.google.com/
 * 2. กด "New project" (โครงการใหม่)
 * 3. ลบโค้ดเดิมทั้งหมด แล้วคัดลอกโค้ดด้านล่างนี้ไปวาง
 * 4. กดปุ่ม "Deploy" (การทำให้ใช้งานได้) -> เลือก "New deployment" (การทำให้ใช้งานได้รายการใหม่)
 * 5. เลือกประเภท: "Web app" (เว็บแอป)
 * 6. ตั้งค่า:
 *    - Description: Mobi SmartLab 10 Email Service
 *    - Execute as: Me (บัญชีของฉัน)
 *    - Who has access: Anyone (ทุกคน)
 * 7. กด "Deploy" และอนุญาตสิทธิ์ (Authorize access)
 * 8. นำ URL ของ Web App ที่ได้ ไปบันทึกในระบบ หรือเก็บไว้ใช้งาน
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var recipient = data.to;
    var subject = data.subject;
    var htmlBody = data.htmlBody;
    
    if (!recipient || !subject) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Missing recipient or subject'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // ส่งอีเมลผ่าน Gmail
    GmailApp.sendEmail(recipient, subject, "โปรดดูรายละเอียดรายงานผลการตรวจวิเคราะห์ความปลอดภัยด้านอาหาร", {
      htmlBody: htmlBody,
      name: "Mobi SmartLab 10 (เขตสุขภาพที่ 10)"
    });
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Email sent successfully to ' + recipient
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Mobi SmartLab 10 Email Service is Running.");
}
