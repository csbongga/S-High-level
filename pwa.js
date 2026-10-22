/**
 * Classroom Quest - PWA Helper
 * Handles Service Worker registration, install prompts (Android/Chrome/Edge),
 * iOS Safari Add-to-Home-Screen guide modal, and standalone detection.
 */

(function initPwa() {
  let deferredPrompt = null;
  let installBtn = null;

  // 1. Standalone Mode Detection (Installed App)
  const isStandalone = 
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||
    document.referrer.includes('android-app://');

  // 2. iOS Detection (iPhone, iPad, iPod - non-standalone Safari)
  const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase()) && !window.MSStream;

  // 3. Early capture of beforeinstallprompt (must be registered at top-level)
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn && !isStandalone) {
      installBtn.classList.remove('hidden');
    }
  });

  // 4. Register Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Determine relative path to sw.js based on subfolder depth
      const isSubfolder = window.location.pathname.includes('/high-level/') || window.location.pathname.includes('/web-programming/');
      const swPath = isSubfolder ? '../sw.js' : './sw.js';

      navigator.serviceWorker.register(swPath)
        .then((reg) => {
          console.log('Classroom Quest PWA ServiceWorker active on scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('Classroom Quest PWA ServiceWorker registration failed:', err);
        });
    });
  }

  // 5. Inject iOS Guide Modal into DOM
  function injectIosModal() {
    if (document.getElementById('iosInstallModal')) return;

    const modal = document.createElement('div');
    modal.id = 'iosInstallModal';
    modal.className = 'fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 hidden';
    modal.innerHTML = `
      <div class="wood-board-subtle max-w-sm w-full p-6 text-center space-y-4 relative bg-[#fdf8ed] shadow-2xl animate-fade-in">
        <button id="btnCloseIosModal" class="btn-close-game absolute top-3 right-3 text-sm" aria-label="ปิด">✕</button>
        
        <div class="w-14 h-14 rounded-full bg-amber-200 border-2 border-[#6f4e30] flex items-center justify-center text-3xl mx-auto shadow-inner">
          📲
        </div>

        <div>
          <h3 class="font-bold text-base text-[#4e3a27]">วิธีติดตั้งบน iPhone / iPad</h3>
          <p class="text-xs text-[#8f755e]">ติดตั้งลงหน้าจอโฮมเพื่อเปิดใช้งานแบบเต็มจอ</p>
        </div>

        <div class="space-y-3 text-left text-xs bg-[#f6ecdb] p-3.5 rounded-xl border border-[#ebd8c1] font-game">
          <div class="flex items-start gap-2.5">
            <span class="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">1</span>
            <p class="text-[#553f2c]">แตะปุ่ม <b>แชร์ (Share)</b> <i class="fa-solid fa-arrow-up-from-bracket text-sky-600"></i> ที่แถบด้านล่างของ Safari</p>
          </div>
          <div class="flex items-start gap-2.5">
            <span class="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">2</span>
            <p class="text-[#553f2c]">เลื่อนลงมาแล้วแตะ <b>"เพิ่มไปยังหน้าจอโฮม" (Add to Home Screen <i class="fa-regular fa-square-plus text-emerald-600"></i>)</b></p>
          </div>
          <div class="flex items-start gap-2.5">
            <span class="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">3</span>
            <p class="text-[#553f2c]">แตะ <b>"เพิ่ม" (Add)</b> ที่มุมขวาบน จะได้ไอคอนแอปบนหน้าจอมือถือทันที!</p>
          </div>
        </div>

        <button id="btnGotItIos" class="game-btn btn-pill-mint w-full py-2.5 text-xs font-bold shadow-md">
          เข้าใจแล้ว
        </button>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('btnCloseIosModal')?.addEventListener('click', () => modal.classList.add('hidden'));
    document.getElementById('btnGotItIos')?.addEventListener('click', () => modal.classList.add('hidden'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    });
  }

  // 6. Setup Install Button
  function setupInstallButton() {
    installBtn = document.getElementById('btnPwaInstall');
    if (!installBtn) return;

    // Hide button if already in standalone app mode
    if (isStandalone) {
      installBtn.classList.add('hidden');
      return;
    }

    // If deferredPrompt was already captured before DOMContentLoaded, reveal button
    if (deferredPrompt) {
      installBtn.classList.remove('hidden');
    }

    // On iOS Safari, reveal button directly so user can see instructions
    if (isIos) {
      installBtn.classList.remove('hidden');
    }

    // On desktop browsers (Chrome/Edge), show button if prompt is available or user can click
    // Also reveal button by default on mobile browsers if not standalone
    if (!isStandalone) {
      // Keep available
    }

    installBtn.addEventListener('click', () => {
      if (deferredPrompt) {
        // Native browser install prompt (Android, Chrome, Edge)
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User installed Classroom Quest PWA');
            installBtn.classList.add('hidden');
          }
          deferredPrompt = null;
        });
      } else if (isIos) {
        // iOS Safari manual instructions modal
        injectIosModal();
        document.getElementById('iosInstallModal')?.classList.remove('hidden');
      } else {
        // Fallback for desktop/other browsers without active deferredPrompt
        alert("💡 วิธีติดตั้งแอปลงเครื่อง:\n\nคลิกที่ไอคอนติดตั้งแอป (รูปคอมพิวเตอร์/ลูกศรชี้ลง) บนแถบ URL ด้านบนของเบราว์เซอร์ Chrome/Edge หรือเลือกเมนู 'ติดตั้ง Classroom Quest'");
      }
    });

    // Successfully installed event
    window.addEventListener('appinstalled', () => {
      installBtn?.classList.add('hidden');
      deferredPrompt = null;
      console.log('Classroom Quest PWA installed successfully!');
    });
  }

  // Init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupInstallButton);
  } else {
    setupInstallButton();
  }
})();
