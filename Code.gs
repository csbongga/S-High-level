// ==========================================
// Classroom Participation Gamification API
// คัดลอกโค้ดนี้ไปวางใน Extensions -> Apps Script
// ==========================================
const TEACHER_PIN = "3535"; // รหัส PIN อาจารย์ (สามารถเปลี่ยนได้)
const TARGET_SCORE = 20;   // คะแนนเต็มเป้าหมาย

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return createJsonResponse({ status: "success", students: [], target: TARGET_SCORE });
  }
  
  const students = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0]) continue; // ข้ามแถวที่ไม่มีรหัสนักศึกษา
    
    const ask = Number(row[4]) || 0;
    const answer = Number(row[5]) || 0;
    const help = Number(row[6]) || 0;
    const total = ask + answer + help;
    
    students.push({
      rowIndex: i + 1,
      student_id: String(row[0]).trim(),
      full_name: String(row[1] || "").trim(),
      nickname: String(row[2] || "").trim(),
      photo_url: String(row[3] || "").trim(),
      ask_count: ask,
      answer_count: answer,
      help_count: help,
      total_score: total
    });
  }
  
  return createJsonResponse({
    status: "success",
    target: TARGET_SCORE,
    students: students
  });
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const { pin, student_id, action, custom_amount } = body;
    
    // ตรวจสอบ PIN อาจารย์
    if (pin !== TEACHER_PIN) {
      return createJsonResponse({ status: "error", message: "รหัส PIN ไม่ถูกต้อง" });
    }
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();
    let targetRow = -1;
    
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim() === String(student_id).trim()) {
        targetRow = i + 1;
        break;
      }
    }
    
    if (targetRow === -1) {
      return createJsonResponse({ status: "error", message: "ไม่พบรหัสนักศึกษานี้ในตาราง" });
    }
    
    // คอลัมน์: E(5)=ถาม, F(6)=ตอบ, G(7)=ช่วยงาน
    let colIndex = 0;
    if (action === "ask") colIndex = 5;
    else if (action === "answer") colIndex = 6;
    else if (action === "help") colIndex = 7;
    
    if (colIndex > 0) {
      const currentVal = Number(sheet.getRange(targetRow, colIndex).getValue()) || 0;
      const amount = custom_amount !== undefined ? Number(custom_amount) : 1;
      const newVal = Math.max(0, currentVal + amount);
      sheet.getRange(targetRow, colIndex).setValue(newVal);
      
      // อัปเดตสูตร total_score ที่คอลัมน์ H(8) ให้คำนวณอัตโนมัติ
      sheet.getRange(targetRow, 8).setFormula(`=SUM(E${targetRow}:G${targetRow})`);
      SpreadsheetApp.flush();
      
      return createJsonResponse({
        status: "success",
        message: "บันทึกคะแนนเรียบร้อย",
        student_id: student_id,
        new_val: newVal
      });
    }
    
    return createJsonResponse({ status: "error", message: "ประเภทคะแนนไม่ถูกต้อง" });
  } catch (err) {
    return createJsonResponse({ status: "error", message: err.toString() });
  }
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
