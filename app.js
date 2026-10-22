/**
 * Classroom Quest - Cozy Game UI Edition
 * Inspired by Animal Restaurant & Cottagecore RPG Game UI
 */

// ==========================================
// 1. MOCK DATA WITH CUTE AVATARS
// ==========================================
const DEFAULT_DEMO_STUDENTS = [
  { student_id: "6501001", full_name: "นายปิติ สุขใจ", nickname: "ปิติ", photo_url: "", ask_count: 5, answer_count: 8, help_count: 3, total_score: 16, emoji: "🦊" },
  { student_id: "6501002", full_name: "น.ส.มานี มีแชร์", nickname: "มานี", photo_url: "", ask_count: 8, answer_count: 6, help_count: 5, total_score: 19, emoji: "🐱" },
  { student_id: "6501003", full_name: "นายชูใจ ใจดี", nickname: "ชูใจ", photo_url: "", ask_count: 2, answer_count: 12, help_count: 2, total_score: 16, emoji: "🐶" },
  { student_id: "6501004", full_name: "น.ส.ดวงใจ รักเรียน", nickname: "ดวง", photo_url: "", ask_count: 4, answer_count: 7, help_count: 9, total_score: 20, emoji: "🐰" },
  { student_id: "6501005", full_name: "นายกล้าหาญ ชาญชัย", nickname: "กล้า", photo_url: "", ask_count: 6, answer_count: 5, help_count: 1, total_score: 12, emoji: "🐻" },
  { student_id: "6501006", full_name: "นายวีระ ชัยชนะ", nickname: "วี", photo_url: "", ask_count: 1, answer_count: 4, help_count: 6, total_score: 11, emoji: "🐼" },
  { student_id: "6501007", full_name: "น.ส.นภา ฟ้าใส", nickname: "ฟ้า", photo_url: "", ask_count: 3, answer_count: 5, help_count: 2, total_score: 10, emoji: "🐥" },
  { student_id: "6501008", full_name: "นายกานต์ สว่างวงศ์", nickname: "กานต์", photo_url: "", ask_count: 2, answer_count: 3, help_count: 4, total_score: 9, emoji: "🐹" },
  { student_id: "6501009", full_name: "น.ส.แพรวา ทอฝัน", nickname: "แพร", photo_url: "", ask_count: 4, answer_count: 2, help_count: 2, total_score: 8, emoji: "🐨" },
  { student_id: "6501010", full_name: "นายธนา มั่งคั่ง", nickname: "บอส", photo_url: "", ask_count: 1, answer_count: 3, help_count: 1, total_score: 5, emoji: "🐯" },
  { student_id: "6501011", full_name: "นายเอกชัย ตั้งใจ", nickname: "เอก", photo_url: "", ask_count: 2, answer_count: 1, help_count: 1, total_score: 4, emoji: "🐸" },
  { student_id: "6501012", full_name: "น.ส.กมลทิพย์ งามตา", nickname: "ทิพย์", photo_url: "", ask_count: 0, answer_count: 2, help_count: 1, total_score: 3, emoji: "🐧" },
  { student_id: "6501013", full_name: "นายณัฐพล คนขยัน", nickname: "นัท", photo_url: "", ask_count: 1, answer_count: 1, help_count: 0, total_score: 2, emoji: "🐵" },
  { student_id: "6501014", full_name: "น.ส.วรรณภา สดใส", nickname: "วัน", photo_url: "", ask_count: 1, answer_count: 0, help_count: 1, total_score: 2, emoji: "🦄" },
  { student_id: "6501015", full_name: "นายธีรภัทร ชาญวิทย์", nickname: "ภูมิ", photo_url: "", ask_count: 0, answer_count: 1, help_count: 0, total_score: 1, emoji: "🐿️" },
];

const MASCOT_MESSAGES = [
  "\"ยินดีต้อนรับสู่คลาสเรียน! ใครจะเก็บครบ 20 แต้มเป็นคนแรกนะ? เมี้ยว~ 🐾\"",
  "\"ยกมือถามอาจารย์ ได้ดาวเพิ่ม 1 แต้มทันทีเลยนะ โฮ่ง! 🌟\"",
  "\"ตอบถูกหรือตอบผิดไม่สำคัญ สำคัญที่ได้ลองคิดและกล้าตอบ! 🎯\"",
  "\"ช่วยเหลือเพื่อนๆ ในแล็บ หรือช่วยงานอาจารย์ มีแต้มพิเศษให้นะ 🤝\"",
  "\"บรรยากาศในห้องเรียนน่ารักมาก ขอให้ทุกคนสนุกกับการเขียนโปรแกรมนะ! 💖\""
];

// ==========================================
// 2. STATE & CONFIGURATION
// ==========================================
const APP_STATE = {
  courseTitle: localStorage.getItem("cq2_course_title") || "การเขียนโปรแกรมภาษาระดับสูง (High-level Programming)",
  gasUrl: localStorage.getItem("cq2_gas_url") || "",
  teacherPin: localStorage.getItem("cq2_teacher_pin") || "1234",
  refreshInterval: Number(localStorage.getItem("cq2_refresh_interval")) || 5,
  soundEnabled: localStorage.getItem("cq2_sound_enabled") !== "false",
  targetScore: 20,
  students: [],
  isTeacherAuthenticated: false,
  activeView: "student", // 'student' | 'teacher'
  refreshTimer: null,
  isUpdating: false,
};

// ==========================================
// 3. SOUND SYNTHESIZER (CUTE COZY SOUNDS)
// ==========================================
class SoundFX {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  // Cute Game Coin Chime
  playCoin() {
    if (!APP_STATE.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1046.50, now); // C6
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
      osc.frequency.setValueAtTime(1567.98, now + 0.16); // G6

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {}
  }

  // Level Up Celebration
  playLevelUp() {
    if (!APP_STATE.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = this.ctx.currentTime + i * 0.09;

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.25, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.35);
      });
    } catch (e) {}
  }

  // Gentle Click
  playClick() {
    if (!APP_STATE.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {}
  }
}

const sfx = new SoundFX();

// ==========================================
// 4. HELPER: AVATAR
// ==========================================
function getAvatarUrl(student) {
  if (student.photo_url && student.photo_url.trim().startsWith("http")) {
    return student.photo_url.trim();
  }
  const seed = encodeURIComponent(student.nickname || student.student_id);
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}&backgroundColor=fdf6e2`;
}

// ==========================================
// 5. TOAST NOTIFICATIONS
// ==========================================
function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");

  const colors = {
    success: "bg-[#76cba0] border-[#3b7b59] text-[#13492e]",
    info: "bg-[#70b8ee] border-[#346c98] text-[#143e5e]",
    warn: "bg-[#f8c74a] border-[#9e7616] text-[#4f3905]",
    error: "bg-[#f38f88] border-[#9c4842] text-[#5c1b17]",
  };

  toast.className = `px-4 py-2.5 rounded-2xl border-2 shadow-lg flex items-center gap-2.5 text-xs sm:text-sm font-bold font-game transition-all transform translate-y-2 opacity-0 pointer-events-auto ${colors[type] || colors.info}`;
  
  let icon = "fa-check";
  if (type === "info") icon = "fa-star";
  if (type === "error") icon = "fa-circle-exclamation";

  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove("translate-y-2", "opacity-0");
  });

  setTimeout(() => {
    toast.classList.add("translate-y-2", "opacity-0");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ==========================================
// 6. DATA LAYER
// ==========================================
async function loadStudentsData(silent = false) {
  try {
    if (APP_STATE.gasUrl && APP_STATE.gasUrl.trim() !== "") {
      const url = `${APP_STATE.gasUrl}?t=${Date.now()}`;
      const res = await fetch(url);
      const json = await res.json();
      
      if (json.status === "success" && Array.isArray(json.students)) {
        APP_STATE.students = json.students;
        APP_STATE.targetScore = json.target || 20;
        updateConnectionStatus(true);
      } else {
        throw new Error(json.message || "ข้อมูลไม่ถูกต้อง");
      }
    } else {
      // Demo Mode
      const stored = localStorage.getItem("cq2_demo_students");
      if (stored) {
        APP_STATE.students = JSON.parse(stored);
      } else {
        APP_STATE.students = JSON.parse(JSON.stringify(DEFAULT_DEMO_STUDENTS));
        saveDemoStudents();
      }
      updateConnectionStatus(false);
    }
  } catch (err) {
    console.error(err);
    if (!silent) showToast(`โหลดข้อมูลไม่สำเร็จ: ${err.message}`, "error");
    updateConnectionStatus(false, true);
  } finally {
    renderCurrentView();
  }
}

function saveDemoStudents() {
  localStorage.setItem("cq2_demo_students", JSON.stringify(APP_STATE.students));
}

function updateConnectionStatus(isLive, isError = false) {
  const badge = document.getElementById("connectionBadge");
  if (!badge) return;

  if (isError) {
    badge.className = "text-[11px] font-semibold text-rose-700 bg-rose-100 px-2 py-0.2 rounded-full border border-rose-300";
    badge.textContent = "เชื่อมต่อไม่ได้";
  } else if (isLive) {
    badge.className = "text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.2 rounded-full border border-emerald-300";
    badge.textContent = "Google Sheets (Live)";
  } else {
    badge.className = "text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.2 rounded-full border border-amber-300";
    badge.textContent = "Demo Mode";
  }
}

// ==========================================
// 7. RECORD SCORE
// ==========================================
async function recordScore(studentId, action, amount = 1) {
  if (APP_STATE.isUpdating) return;
  APP_STATE.isUpdating = true;
  sfx.playCoin();

  const student = APP_STATE.students.find(s => s.student_id === studentId);
  const actionName = action === "ask" ? "ถาม" : (action === "answer" ? "ตอบ" : "ช่วยงาน");

  if (APP_STATE.gasUrl && APP_STATE.gasUrl.trim() !== "") {
    try {
      showToast(`กำลังบันทึกคะแนน ${student?.nickname || studentId}...`, "info");
      
      const res = await fetch(APP_STATE.gasUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          pin: APP_STATE.teacherPin,
          student_id: studentId,
          action: action,
          custom_amount: amount
        })
      });

      const result = await res.json();
      if (result.status === "success") {
        showToast(`+${amount} คะแนน${actionName} ให้ "${student?.nickname || studentId}" แล้ว! 🎯`, "success");
        await loadStudentsData(true);
      } else {
        throw new Error(result.message || "ไม่สามารถบันทึกได้");
      }
    } catch (e) {
      showToast(`เกิดข้อผิดพลาด: ${e.message}`, "error");
    } finally {
      APP_STATE.isUpdating = false;
    }
  } else {
    if (student) {
      const prevTotal = student.total_score;
      if (action === "ask") student.ask_count = Math.max(0, student.ask_count + amount);
      if (action === "answer") student.answer_count = Math.max(0, student.answer_count + amount);
      if (action === "help") student.help_count = Math.max(0, student.help_count + amount);
      student.total_score = student.ask_count + student.answer_count + student.help_count;

      saveDemoStudents();
      renderCurrentView();

      showToast(`+${amount} คะแนน${actionName} ให้ "${student.nickname}" แล้ว! ✨`, "success");

      if (prevTotal < 20 && student.total_score >= 20) {
        triggerCelebration(student);
      }
    }
    APP_STATE.isUpdating = false;
  }
}

function triggerCelebration(student) {
  sfx.playLevelUp();
  if (window.confetti) {
    window.confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 }
    });
  }
  showToast(`🎉 ยินดีด้วย! "${student.nickname}" พิชิตภารกิจ 20 แต้มเต็มแล้ว! 🐾`, "success");
}

// ==========================================
// 8. RENDER: STUDENT CONTEST RANKING
// ==========================================
function renderStudentView() {
  const students = [...APP_STATE.students];
  students.sort((a, b) => {
    if (b.total_score !== a.total_score) return b.total_score - a.total_score;
    if (b.answer_count !== a.answer_count) return b.answer_count - a.answer_count;
    return b.ask_count - a.ask_count;
  });

  renderHallOfFame(students);

  // Calculate Class Average Progress to 20
  const target = APP_STATE.targetScore || 20;
  const avgScore = students.length > 0 ? (students.reduce((acc, cur) => acc + cur.total_score, 0) / students.length) : 0;
  const avgPercent = Math.min(100, Math.round((avgScore / target) * 100));
  
  const progBar = document.getElementById("classProgressBar");
  const progLabel = document.getElementById("classProgressLabel");
  const progPercent = document.getElementById("classProgressPercent");
  if (progBar) progBar.style.width = `${avgPercent}%`;
  if (progLabel) progLabel.textContent = `ค่าเฉลี่ยทั้งคลาส (${avgScore.toFixed(1)} / ${target} แต้ม)`;
  if (progPercent) progPercent.textContent = `${avgPercent}%`;

  // Filter students
  const query = (document.getElementById("studentSearchInput")?.value || "").trim().toLowerCase();
  const filtered = students.filter(s => 
    s.full_name.toLowerCase().includes(query) ||
    s.nickname.toLowerCase().includes(query) ||
    s.student_id.toLowerCase().includes(query)
  );

  const countBadge = document.getElementById("studentCountBadge");
  if (countBadge) countBadge.textContent = `${filtered.length} คน`;

  const container = document.getElementById("leaderboardList");
  if (!container) return;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-[#8f755e]">
        <p class="text-sm">ไม่พบรายชื่อนักศึกษาที่ค้นหา</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(s => {
    const rank = students.findIndex(orig => orig.student_id === s.student_id) + 1;
    
    // Stamp Icon
    let stampHtml = `<div class="rank-stamp-normal font-game">${rank}</div>`;
    if (rank === 1) stampHtml = `<div class="rank-stamp-1 font-game">1</div>`;
    else if (rank === 2) stampHtml = `<div class="rank-stamp-2 font-game">2</div>`;
    else if (rank === 3) stampHtml = `<div class="rank-stamp-3 font-game">3</div>`;

    const percent = Math.min(100, Math.round((s.total_score / target) * 100));
    const isCompleted = s.total_score >= target;

    return `
      <div class="bg-[#fcf8f0] border-2 border-[#ebd8c1] rounded-2xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-[#bfa283] transition-all shadow-xs">
        
        <!-- Left: Stamp + Avatar + Name -->
        <div class="flex items-center gap-3 min-w-0">
          ${stampHtml}

          <div class="relative shrink-0">
            <img src="${getAvatarUrl(s)}" alt="Avatar" class="w-11 h-11 rounded-full bg-[#faedd9] border-2 border-[#8b6543] object-cover shadow-xs">
            <span class="absolute -bottom-1 -right-1 text-sm">${s.emoji || "🐾"}</span>
          </div>

          <div class="min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-bold text-sm sm:text-base text-[#4d3725]">${s.nickname || s.full_name}</span>
              ${s.nickname ? `<span class="text-xs text-[#8f755e] truncate">(${s.full_name})</span>` : ""}
              ${isCompleted ? `<span class="text-[10px] font-bold bg-[#76cba0] text-[#13492e] px-2 py-0.5 rounded-full border border-[#3b7b59]">🎁 MAX 20</span>` : ""}
            </div>
            <p class="text-[11px] text-[#9a8067] font-game">${s.student_id}</p>
          </div>
        </div>

        <!-- Right: Score Badges & Mini Progress -->
        <div class="w-full sm:w-64 flex flex-col gap-1 self-end sm:self-center">
          
          <div class="flex items-center justify-between text-xs">
            <!-- Badges -->
            <div class="flex items-center gap-1.5 font-game">
              <span class="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200 text-[10px]" title="ถาม">💡 ${s.ask_count}</span>
              <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px]" title="ตอบ">⭐ ${s.answer_count}</span>
              <span class="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 text-[10px]" title="ช่วยงาน">🤝 ${s.help_count}</span>
            </div>

            <!-- Score Number with Star (Like Pinterest 4.89 ⭐) -->
            <div class="font-game font-bold text-sm text-[#4d3725] flex items-center gap-1">
              <span class="text-amber-500">⭐</span>
              <span>${s.total_score}</span>
              <span class="text-[#8f755e] text-[11px]">/ ${target}</span>
            </div>
          </div>

          <!-- Mini Striped Progress -->
          <div class="w-full bg-[#edd9c0] rounded-full h-2 overflow-hidden border border-[#bfa283]">
            <div class="h-full rounded-full bg-[#78cc9e] transition-all duration-300" style="width: ${percent}%;"></div>
          </div>

        </div>

      </div>
    `;
  }).join("");
}

function renderHallOfFame(students) {
  if (!students || students.length === 0) return;

  const topOverall = students[0];
  if (topOverall) {
    document.getElementById("hofOverallName").textContent = topOverall.nickname || topOverall.full_name;
    document.getElementById("hofOverallScore").textContent = topOverall.total_score;
    document.getElementById("hofOverallImg").src = getAvatarUrl(topOverall);
  }

  const topAsk = [...students].sort((a, b) => b.ask_count - a.ask_count)[0];
  if (topAsk) {
    document.getElementById("hofAskName").textContent = topAsk.nickname || topAsk.full_name;
    document.getElementById("hofAskScore").textContent = topAsk.ask_count;
    document.getElementById("hofAskImg").src = getAvatarUrl(topAsk);
  }

  const topAnswer = [...students].sort((a, b) => b.answer_count - a.answer_count)[0];
  if (topAnswer) {
    document.getElementById("hofAnswerName").textContent = topAnswer.nickname || topAnswer.full_name;
    document.getElementById("hofAnswerScore").textContent = topAnswer.answer_count;
    document.getElementById("hofAnswerImg").src = getAvatarUrl(topAnswer);
  }

  const topHelp = [...students].sort((a, b) => b.help_count - a.help_count)[0];
  if (topHelp) {
    document.getElementById("hofHelpName").textContent = topHelp.nickname || topHelp.full_name;
    document.getElementById("hofHelpScore").textContent = topHelp.help_count;
    document.getElementById("hofHelpImg").src = getAvatarUrl(topHelp);
  }
}

// ==========================================
// 9. RENDER: TEACHER STAFF MANAGEMENT (LAPTOP VIEW)
// ==========================================
function renderTeacherView() {
  const container = document.getElementById("teacherCardGrid");
  if (!container) return;

  const query = (document.getElementById("teacherSearchInput")?.value || "").trim().toLowerCase();
  const students = [...APP_STATE.students].filter(s =>
    s.full_name.toLowerCase().includes(query) ||
    s.nickname.toLowerCase().includes(query) ||
    s.student_id.toLowerCase().includes(query)
  );

  if (students.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-8 text-[#8f755e]">
        <p class="text-sm">ไม่พบนักศึกษาที่ตรงกับการค้นหา</p>
      </div>
    `;
    return;
  }

  container.innerHTML = students.map(s => {
    return `
      <div class="bg-[#fcf8f0] border-3 border-[#c2a689] rounded-2xl p-3.5 shadow-sm flex flex-col justify-between gap-3 hover:border-[#8b6543] transition-all">
        
        <!-- Header Info -->
        <div class="flex items-center gap-3">
          <div class="relative shrink-0">
            <img src="${getAvatarUrl(s)}" alt="Avatar" class="w-13 h-13 rounded-full bg-[#fdf5e2] border-2 border-[#8b6543] object-cover shadow-inner">
            <span class="absolute -bottom-1 -right-1 text-sm">${s.emoji || "🐾"}</span>
          </div>

          <div class="min-w-0 flex-1">
            <h4 class="font-bold text-base text-[#4d3725] leading-tight truncate">${s.nickname || s.full_name}</h4>
            <p class="text-xs text-[#8f755e] truncate">${s.full_name}</p>
            <p class="text-xs font-bold text-amber-700 font-game mt-0.5">รวม: ${s.total_score} / 20 แต้ม ⭐</p>
          </div>

          <div class="text-[11px] font-game text-[#a0846c] bg-[#ebd8c1] px-2 py-0.5 rounded-md">
            ${s.student_id.slice(-4)}
          </div>
        </div>

        <!-- 3 Color Coded Pill Buttons (Just like Pinterest buttons!) -->
        <div class="grid grid-cols-3 gap-2 pt-1 border-t-2 border-dashed border-[#ebd8c1]">
          <button onclick="recordScore('${s.student_id}', 'ask', 1)" class="game-btn btn-pill-sky text-xs py-2 px-1">
            <i class="fa-solid fa-plus text-[10px]"></i> <span>ถาม (${s.ask_count})</span>
          </button>
          <button onclick="recordScore('${s.student_id}', 'answer', 1)" class="game-btn btn-pill-mint text-xs py-2 px-1">
            <i class="fa-solid fa-plus text-[10px]"></i> <span>ตอบ (${s.answer_count})</span>
          </button>
          <button onclick="recordScore('${s.student_id}', 'help', 1)" class="game-btn btn-pill-coral text-xs py-2 px-1">
            <i class="fa-solid fa-plus text-[10px]"></i> <span>ช่วย (${s.help_count})</span>
          </button>
        </div>

        <!-- Undo Minus Row -->
        <div class="flex justify-between items-center text-[11px] text-[#8f755e] px-1">
          <span>คลิกผิด:</span>
          <div class="flex gap-2 font-game">
            <button onclick="recordScore('${s.student_id}', 'ask', -1)" class="hover:text-rose-600 underline">ลดถาม</button>
            <button onclick="recordScore('${s.student_id}', 'answer', -1)" class="hover:text-rose-600 underline">ลดตอบ</button>
            <button onclick="recordScore('${s.student_id}', 'help', -1)" class="hover:text-rose-600 underline">ลดช่วย</button>
          </div>
        </div>

      </div>
    `;
  }).join("");
}

function renderCurrentView() {
  if (APP_STATE.activeView === "student") {
    renderStudentView();
  } else {
    renderTeacherView();
  }
}

// Random Mascot Speech
function triggerCheerMessage() {
  sfx.playClick();
  const randomIndex = Math.floor(Math.random() * MASCOT_MESSAGES.length);
  const msgEl = document.getElementById("mascotMessage");
  if (msgEl) {
    msgEl.textContent = MASCOT_MESSAGES[randomIndex];
  }
}

// ==========================================
// 10. SETUP EVENT LISTENERS
// ==========================================
function setupEventListeners() {
  const btnViewStudent = document.getElementById("btnViewStudent");
  const btnViewTeacher = document.getElementById("btnViewTeacher");
  const studentView = document.getElementById("studentView");
  const teacherView = document.getElementById("teacherView");
  const pinModal = document.getElementById("pinModal");
  const pinInput = document.getElementById("pinInput");
  const pinErrorMsg = document.getElementById("pinErrorMsg");

  btnViewStudent.addEventListener("click", () => {
    sfx.playClick();
    APP_STATE.activeView = "student";
    studentView.classList.remove("hidden");
    teacherView.classList.add("hidden");
    renderStudentView();
  });

  btnViewTeacher.addEventListener("click", () => {
    sfx.playClick();
    if (!APP_STATE.isTeacherAuthenticated) {
      pinModal.classList.remove("hidden");
      pinInput.value = "";
      pinErrorMsg.classList.add("hidden");
      pinInput.focus();
    } else {
      activateTeacherView();
    }
  });

  function activateTeacherView() {
    APP_STATE.activeView = "teacher";
    studentView.classList.add("hidden");
    teacherView.classList.remove("hidden");
    renderTeacherView();
  }

  // Teacher PIN
  document.getElementById("btnSubmitPin").addEventListener("click", verifyPin);
  pinInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") verifyPin();
  });

  function verifyPin() {
    const entered = pinInput.value.trim();
    if (entered === APP_STATE.teacherPin) {
      APP_STATE.isTeacherAuthenticated = true;
      pinModal.classList.add("hidden");
      // Show Settings button once PIN is verified
      document.getElementById("btnOpenSettings")?.classList.remove("hidden");
      sfx.playLevelUp();
      showToast("ยินดีต้อนรับอาจารย์! เข้าสู่โต๊ะผู้สอนแล้ว 👨‍🍳", "success");
      activateTeacherView();
    } else {
      pinErrorMsg.classList.remove("hidden");
      sfx.playClick();
    }
  }

  document.getElementById("btnCancelPin").addEventListener("click", () => {
    pinModal.classList.add("hidden");
  });

  document.getElementById("btnLockTeacher")?.addEventListener("click", () => {
    APP_STATE.isTeacherAuthenticated = false;
    // Hide Settings button when locked
    document.getElementById("btnOpenSettings")?.classList.add("hidden");
    btnViewStudent.click();
    showToast("ล็อกโต๊ะอาจารย์เรียบร้อยแล้ว", "info");
  });

  // Search
  document.getElementById("studentSearchInput")?.addEventListener("input", renderStudentView);
  document.getElementById("teacherSearchInput")?.addEventListener("input", renderTeacherView);

  // Sound
  const btnToggleSound = document.getElementById("btnToggleSound");
  const soundIcon = document.getElementById("soundIcon");
  btnToggleSound.addEventListener("click", () => {
    APP_STATE.soundEnabled = !APP_STATE.soundEnabled;
    localStorage.setItem("cq2_sound_enabled", APP_STATE.soundEnabled);
    if (APP_STATE.soundEnabled) {
      soundIcon.className = "fa-solid fa-volume-high text-xs";
      sfx.playCoin();
      showToast("เปิดเสียงเกมแล้ว 🔔", "info");
    } else {
      soundIcon.className = "fa-solid fa-volume-xmark text-xs";
      showToast("ปิดเสียงแล้ว 🔇", "info");
    }
  });

  if (!APP_STATE.soundEnabled) soundIcon.className = "fa-solid fa-volume-xmark text-xs";

  // Claim Rule Modal button
  document.getElementById("btnClaimRule")?.addEventListener("click", () => {
    sfx.playClick();
    alert("📜 กติกาคะแนนการมีส่วนร่วม (เต็ม 20 คะแนน):\n\n1. ยกมือถามข้อสงสัยในคลาส: +1 แต้ม\n2. ตอบคำถามที่อาจารย์ถาม: +1 แต้ม\n3. ช่วยเหลืองานในห้อง หรือช่วยเพื่อน: +1 แต้ม\n\nใครเก็บครบ 20 แต้มก่อนจะได้รับของขวัญพิเศษประจำคลาส!");
  });

  // Settings Modal Handlers
  const settingsModal = document.getElementById("settingsModal");
  function openSettingsModal() {
    if (!APP_STATE.isTeacherAuthenticated) {
      // Must authenticate first
      pinModal.classList.remove("hidden");
      pinInput.value = "";
      pinErrorMsg.classList.add("hidden");
      pinInput.focus();
      return;
    }
    document.getElementById("settingCourseTitle").value = APP_STATE.courseTitle;
    document.getElementById("settingGasUrl").value = APP_STATE.gasUrl;
    document.getElementById("settingTeacherPin").value = APP_STATE.teacherPin;
    document.getElementById("settingRefreshInterval").value = APP_STATE.refreshInterval;
    settingsModal.classList.remove("hidden");
  }

  document.getElementById("btnOpenSettings")?.addEventListener("click", openSettingsModal);
  document.getElementById("btnTeacherSettings")?.addEventListener("click", openSettingsModal);

  document.getElementById("btnCloseSettings").addEventListener("click", () => {
    settingsModal.classList.add("hidden");
  });

  document.getElementById("btnSaveSettings").addEventListener("click", () => {
    const newTitle = document.getElementById("settingCourseTitle").value.trim();
    const newGas = document.getElementById("settingGasUrl").value.trim();
    const newPin = document.getElementById("settingTeacherPin").value.trim() || "1234";
    const newInterval = Number(document.getElementById("settingRefreshInterval").value);

    APP_STATE.courseTitle = newTitle;
    APP_STATE.gasUrl = newGas;
    APP_STATE.teacherPin = newPin;
    APP_STATE.refreshInterval = newInterval;

    localStorage.setItem("cq2_course_title", newTitle);
    localStorage.setItem("cq2_gas_url", newGas);
    localStorage.setItem("cq2_teacher_pin", newPin);
    localStorage.setItem("cq2_refresh_interval", newInterval);

    document.getElementById("courseTitleDisplay").textContent = newTitle || "Classroom Quest";

    settingsModal.classList.add("hidden");
    showToast("บันทึกการตั้งค่าเรียบร้อยแล้ว!", "success");
    setupAutoRefresh();
    loadStudentsData();
  });

  document.getElementById("btnResetDemo").addEventListener("click", () => {
    if (confirm("ต้องการรีเซ็ตข้อมูลตัวอย่างกลับเป็นค่าเริ่มต้นหรือไม่?")) {
      localStorage.removeItem("cq2_demo_students");
      loadStudentsData();
      showToast("รีเซ็ตข้อมูลตัวอย่างเรียบร้อยแล้ว", "info");
    }
  });
}

function setupAutoRefresh() {
  if (APP_STATE.refreshTimer) clearInterval(APP_STATE.refreshTimer);

  if (APP_STATE.refreshInterval > 0) {
    APP_STATE.refreshTimer = setInterval(() => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "SELECT")) return;
      loadStudentsData(true);
    }, APP_STATE.refreshInterval * 1000);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const titleEl = document.getElementById("courseTitleDisplay");
  if (titleEl) titleEl.textContent = APP_STATE.courseTitle;

  setupEventListeners();
  setupAutoRefresh();
  loadStudentsData();
});
