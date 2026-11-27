// TM2 Valmet DNA Operatör Simülatörü Çekirdek Mantığı (V2 — Canlı Hat Akışı & Güncel Lojikler)

let state = {};
let activeScreenId = "shower_water";
let editorMode = false;
let currentTargetNode = null;

function initState() {
  const nodesMap = {};
  INITIAL_NODES.forEach(n => {
    nodesMap[n.id] = JSON.parse(JSON.stringify(n));
  });

  state = {
    currentStep: 1,
    yankeeSpeed: 120,
    wireSpeed: 0,
    headboxPress: 0,
    jwRatio: 0.000,
    stockFlow: 0,
    vacuumRunning: false,
    showersReady: false,
    coatingRunning: false,
    pressClosed: false,
    pressLoaded: false,
    screensRunning: false,
    dilutionRunning: false,
    headboxFilled: false,
    headboxAuto: false,
    utmRunning: false,
    stockOn: false,
    hoodReady: false,
    reelReady: false,
    tailCutterActive: false,
    paperThreaded: false,
    nodes: nodesMap
  };
  activeScreenId = "shower_water";
  logEvent("Simülasyon başlatıldı. Yankee Run (120 m/dk), keçe grubu duruyor.", "ok");
}

function logEvent(msg, type = "") {
  const logEl = document.getElementById("event-log");
  const li = document.createElement("li");
  const now = new Date().toLocaleTimeString("tr-TR", { hour12: false });
  li.textContent = `[${now}] ${msg}`;
  if (type === "err") li.classList.add("log-err");
  if (type === "ok") li.classList.add("log-ok");
  logEl.prepend(li);
}

function showInterlockError(msg) {
  const box = document.getElementById("interlock-alert");
  document.getElementById("interlock-alert-msg").textContent = msg;
  box.classList.remove("hidden");
  logEvent("KİLİT ENGELİ: " + msg, "err");
}

function hideInterlockError() {
  document.getElementById("interlock-alert").classList.add("hidden");
}

function updateTelemetry() {
  document.getElementById("tele-yankee-speed").textContent = `${state.yankeeSpeed} m/min`;
  document.getElementById("tele-wire-speed").textContent = `${state.wireSpeed} m/min`;
  document.getElementById("tele-hbx-press").textContent = `${state.headboxPress} kPa`;
  document.getElementById("tele-jw-ratio").textContent = state.jwRatio.toFixed(3);
  document.getElementById("tele-stock-flow").textContent = `${state.stockFlow} l/min`;

  const prodEl = document.getElementById("tele-prod-status");
  if (state.paperThreaded) {
    prodEl.textContent = "RUN / ÜRETİMDE";
    prodEl.className = "tele-val status-running";
  } else {
    prodEl.textContent = `ADIM ${state.currentStep}/${STEPS.length}`;
    prodEl.className = "tele-val status-stopped";
  }

  // Ön şart hapları
  const hpOn = state.nodes.hp_sealing_pump.state.endsWith("run");
  const hpPill = document.getElementById("pill-hp-water");
  hpPill.textContent = hpOn ? "HP Sealing Water: ÇALIŞIYOR" : "HP Sealing Water: KAPALI";
  hpPill.className = hpOn ? "pill pill-green" : "pill pill-warn";

  const utmPill = document.getElementById("pill-utm-status");
  utmPill.textContent = state.utmRunning ? "UTM: ÇALIŞIYOR" : "UTM: DURUYOR";
  utmPill.className = state.utmRunning ? "pill pill-green" : "pill pill-warn";

  const tailWaterOn = state.nodes.sw_fresh.state.endsWith("run");
  const tailPill = document.getElementById("pill-tail-water");
  tailPill.textContent = tailWaterOn ? "Tail Cutter Suyu (70.3 Fresh W.): ÇALIŞIYOR" : "Tail Cutter Suyu (70.3 Fresh W.): KAPALI";
  tailPill.className = tailWaterOn ? "pill pill-green" : "pill pill-warn";
}

function evaluateProgress() {
  const s = state.nodes;
  state.showersReady =
    s.osc_wire_needle.state.endsWith("run") &&
    s.osc_wire_fan.state.endsWith("run") &&
    s.osc_coating.state.endsWith("run") &&
    s.sw_3500.state.endsWith("run") &&
    s.cww_200.state.endsWith("run") &&
    s.cww_2800.state.endsWith("run") &&
    s.scww_350.state.endsWith("run");

  state.hoodReady = s.hood_wet_close.active && s.hood_dry_close.active && s.hood_damper_temp.active;
  state.reelReady = s.reel_drum_m6.speedMode === "Run" && s.reel_spool_m7.state.endsWith("run");

  while (state.currentStep <= STEPS.length) {
    const stepObj = STEPS[state.currentStep - 1];
    if (stepObj.checkDone(state)) {
      logEvent(`Adım ${state.currentStep} tamamlandı: ${stepObj.title}`, "ok");
      state.currentStep++;
      hideInterlockError();
    } else {
      break;
    }
  }

  renderTabs();
  renderMissionPanel();
  renderPipeAnimations();
  renderHotspots();
  updateTelemetry();
}

function renderTabs() {
  const container = document.getElementById("screen-tabs");
  container.innerHTML = "";
  const currentStepObj = STEPS[Math.min(state.currentStep - 1, STEPS.length - 1)];

  SCREENS.forEach(scr => {
    const btn = document.createElement("button");
    btn.className = "tab-btn";
    if (scr.id === activeScreenId) btn.classList.add("active");
    if (currentStepObj && scr.id === currentStepObj.screen) btn.classList.add("target-screen");
    btn.textContent = `${scr.code} ${scr.name}`;
    btn.onclick = () => {
      activeScreenId = scr.id;
      renderTabs();
      renderPipeAnimations();
      renderHotspots();
    };
    container.appendChild(btn);
  });
}

function renderMissionPanel() {
  const stepIdx = Math.min(state.currentStep - 1, STEPS.length - 1);
  const stepObj = STEPS[stepIdx];
  const coachOn = document.getElementById("chk-coach-mode").checked;

  if (state.currentStep > STEPS.length) {
    document.getElementById("step-counter").textContent = "TAMAMLANDI";
    document.getElementById("mission-title").textContent = "Tebrikler! Kağıt Bağlandı ve Makine Üretimde";
    document.getElementById("mission-desc").textContent = "Tüm kilit (interlock) şartlarını doğru sırayla geçerek TM2 makinesini başarıyla devreye aldınız.";
    document.getElementById("mission-hint-box").classList.add("hidden");
  } else {
    document.getElementById("step-counter").textContent = `ADIM ${state.currentStep} / ${STEPS.length}`;
    document.getElementById("mission-title").textContent = stepObj.title;
    document.getElementById("mission-desc").textContent = stepObj.desc;
    document.getElementById("mission-target-text").textContent = stepObj.targetText;
    document.getElementById("mission-hint-box").classList.toggle("hidden", !coachOn);
  }

  const listEl = document.getElementById("step-list");
  listEl.innerHTML = "";
  STEPS.forEach(st => {
    const li = document.createElement("li");
    li.textContent = `${st.id}. ${st.title}`;
    if (st.id < state.currentStep) li.classList.add("done");
    if (st.id === state.currentStep) li.classList.add("current");
    // Tıklanabilir adım geçişi
    li.onclick = () => {
      state.currentStep = st.id;
      activeScreenId = st.screen;
      hideInterlockError();
      renderTabs();
      renderMissionPanel();
      renderPipeAnimations();
      renderHotspots();
    };
    listEl.appendChild(li);
  });
}

// Resim Üzeri Canlı Boru Hattı Akış Animasyonu
function renderPipeAnimations() {
  const svg = document.getElementById("pipe-overlay");
  svg.innerHTML = "";

  PIPE_LINES.filter(p => p.screen === activeScreenId).forEach(pipe => {
    const isRunning = pipe.activeWhen(state);

    const baseLine = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    baseLine.setAttribute("points", pipe.points);
    baseLine.setAttribute("class", "pipe-base");
    svg.appendChild(baseLine);

    if (isRunning) {
      const flowLine = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
      flowLine.setAttribute("points", pipe.points);
      flowLine.setAttribute("class", `pipe-flow ${pipe.kind}`);
      svg.appendChild(flowLine);
    }
  });
}

function renderHotspots() {
  const scr = SCREENS.find(s => s.id === activeScreenId);
  document.getElementById("active-screen-subtitle").textContent = `${scr.code} — ${scr.name}`;

  const imgEl = document.getElementById("dcs-bg-image");
  const fallbackEl = document.getElementById("dcs-fallback-grid");
  imgEl.style.display = "block";
  fallbackEl.style.display = "none";
  imgEl.src = scr.image;
  imgEl.onerror = () => {
    imgEl.style.display = "none";
    fallbackEl.style.display = "flex";
    fallbackEl.innerHTML = `<h3>${scr.code} — ${scr.name}</h3><p>Görsel bulunamadı: <code>${scr.image}</code><br>Fotoğrafı <b>images/</b> klasörüne koyduğunuzda arka plan ve boru hattı akışları tam oturacaktır.</p>`;
  };

  const layer = document.getElementById("hotspot-layer");
  layer.innerHTML = "";
  const coachOn = document.getElementById("chk-coach-mode").checked;
  const currentStepObj = STEPS[Math.min(state.currentStep - 1, STEPS.length - 1)];

  Object.values(state.nodes)
    .filter(n => n.screen === activeScreenId)
    .forEach(node => {
      const el = document.createElement("div");
      el.className = "dna-node";
      el.style.left = node.x + "%";
      el.style.top = node.y + "%";

      if (coachOn && currentStepObj && currentStepObj.screen === activeScreenId) {
        el.classList.add("pulse-target");
      }

      if (node.type === "motor") {
        const circle = document.createElement("div");
        circle.className = `dna-circle state-${node.state}`;
        circle.textContent = node.state === "fault" ? "X" : "M";
        el.appendChild(circle);

        if (node.state === "auto-run" || node.state === "man-run") {
          const arrows = document.createElement("span");
          arrows.className = "run-arrows";
          arrows.textContent = ">>";
          el.appendChild(arrows);
        }
      } else {
        const box = document.createElement("div");
        box.className = "dna-btn-box" + (node.active ? " active-green" : "");
        if (node.indicator) {
          const ind = document.createElement("span");
          ind.className = `ind-square ind-${node.indicator}`;
          box.appendChild(ind);
        }
        const txt = document.createElement("span");
        txt.textContent = node.label;
        box.appendChild(txt);
        el.appendChild(box);
      }

      const tag = document.createElement("span");
      tag.className = "node-tag";
      tag.textContent = node.label;
      el.appendChild(tag);

      // Sürükle-bırak (Koordinat Düzenleme Modu)
      el.onmousedown = (e) => {
        if (!editorMode) return;
        e.preventDefault();
        const rect = document.getElementById("dcs-viewport").getBoundingClientRect();
        const onMove = (ev) => {
          const nx = Math.max(2, Math.min(98, ((ev.clientX - rect.left) / rect.width) * 100));
          const ny = Math.max(2, Math.min(98, ((ev.clientY - rect.top) / rect.height) * 100));
          node.x = Math.round(nx * 10) / 10;
          node.y = Math.round(ny * 10) / 10;
          el.style.left = node.x + "%";
          el.style.top = node.y + "%";
        };
        const onUp = () => {
          window.removeEventListener("mousemove", onMove);
          window.removeEventListener("mouseup", onUp);
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
      };

      el.onclick = () => {
        if (editorMode) return;
        openFaceplate(node);
      };

      layer.appendChild(el);
    });
}

function openFaceplate(node) {
  currentTargetNode = node;
  const modal = document.getElementById("faceplate-modal");
  document.getElementById("fp-title").textContent = node.label;
  document.getElementById("fp-state-text").textContent = node.state ? node.state.toUpperCase() : (node.active ? "AKTİF" : "PASİF");
  document.getElementById("fp-mode-text").textContent = node.mode || "DCS Kontrol";

  const dyn = document.getElementById("fp-dynamic-controls");
  const btns = document.getElementById("fp-buttons");
  dyn.innerHTML = "";
  btns.innerHTML = "";

  if (node.id === "qcs_yankee_speed") {
    dyn.innerHTML = `
      <div class="fp-input-group">
        <label>Yankee Hız Referansı (m/dk):</label>
        <select id="inp-speed">
          <option value="120" ${state.yankeeSpeed===120?"selected":""}>120 m/dk (Senkron Başlangıç)</option>
          <option value="700" ${state.yankeeSpeed===700?"selected":""}>700 m/dk (Pres & Duş Hızı)</option>
          <option value="900" ${state.yankeeSpeed===900?"selected":""}>900 m/dk (Elek Devreye Alma)</option>
          <option value="1100" ${state.yankeeSpeed===1100?"selected":""}>1100 m/dk (Hamur & Kağıt Bağlama)</option>
          <option value="2000" ${state.yankeeSpeed===2000?"selected":""}>2000 m/dk (Tam Üretim Hızı)</option>
        </select>
      </div>`;
    addFpBtn("Hızı Uygula", true, () => {
      const val = parseInt(document.getElementById("inp-speed").value, 10);
      if (val >= 700 && !state.vacuumRunning) {
        return showInterlockError("Turbo Vakum sistemi devreye alınmadan makine 600–700 m/dk üzerine hızlandırılamaz!");
      }
      if (val >= 900 && !state.pressLoaded) {
        return showInterlockError("Suction Press Roll yüklenmeden (Load) makine 700 m/dk üzerine çıkarılamaz!");
      }
      state.yankeeSpeed = val;
      if (state.nodes.suction_press_m3.speedMode === "Run") {
        state.wireSpeed = val;
      }
      if (state.headboxAuto) {
        state.headboxPress = Math.round(val * 0.467);
        state.jwRatio = 0.970;
      }
      logEvent(`Yankee hız referansı ${val} m/dk olarak ayarlandı.`);
      closeFaceplate();
      evaluateProgress();
    });
  } else if (node.id === "qcs_stock_flow") {
    dyn.innerHTML = `
      <div class="fp-input-group">
        <label>SW & HW Stock Flow (Mod: L — l/min):</label>
        <select id="inp-flow">
          <option value="1000">1000 l/min (İlk Hamur Akışı)</option>
          <option value="1200">1200 l/min (Kağıt Oluşumu Başlangıcı)</option>
          <option value="1350" selected>1350 l/min (İdeal Kağıt Bağlama Debisi)</option>
        </select>
      </div>`;
    addFpBtn("Debiyi Uygula (L Modu)", true, () => {
      if (!state.stockOn) {
        return showInterlockError("Önce Shortcuts -> Stock ON ile hamuru açmalısınız!");
      }
      state.stockFlow = parseInt(document.getElementById("inp-flow").value, 10);
      node.active = true;
      logEvent(`SW/HW Stock Flow 'L' modunda ${state.stockFlow} l/min olarak ayarlandı.`);
      closeFaceplate();
      evaluateProgress();
    });
  } else if (node.id === "suction_press_m3" || node.id === "reel_drum_m6") {
    ["Durdur", "Tatil Hızı", "Crawl", "Run"].forEach(opt => {
      addFpBtn(opt, opt === "Crawl" || opt === "Run", () => handleDriveCommand(node, opt));
    });
  } else {
    if (node.state === "fault") {
      addFpBtn("Fault Reset (Arıza Kaldır)", true, () => {
        node.state = "auto-stop";
        node.mode = "Auto";
        logEvent(`${node.label} arızası (Fault) temizlendi, otomatik hazır konuma geçti.`);
        closeFaceplate();
        evaluateProgress();
      });
    }
    if (node.type === "motor") {
      addFpBtn("Auto Mod", false, () => {
        node.mode = "Auto";
        if (node.state === "man-stop") node.state = "auto-stop";
        if (node.state === "man-run") node.state = "auto-run";
        logEvent(`${node.label} Auto moduna alındı.`);
        closeFaceplate();
        evaluateProgress();
      });
      addFpBtn("Start", true, () => handleGenericStart(node));
      addFpBtn("Stop", false, () => {
        node.state = node.mode === "Auto" ? "auto-stop" : "man-stop";
        closeFaceplate();
        evaluateProgress();
      });
    } else {
      addFpBtn("Çalıştır / Aktif Et", true, () => handleButtonAction(node));
    }
  }

  modal.classList.remove("hidden");
}

function addFpBtn(text, isPrimary, onClick) {
  const btn = document.createElement("button");
  btn.textContent = text;
  if (isPrimary) btn.classList.add("btn-primary-fp");
  btn.onclick = onClick;
  document.getElementById("fp-buttons").appendChild(btn);
}

function closeFaceplate() {
  document.getElementById("faceplate-modal").classList.add("hidden");
}

function handleDriveCommand(node, cmd) {
  if (node.id === "suction_press_m3") {
    const sitaOk = state.nodes.scww_350.state.endsWith("run");
    if ((cmd === "Crawl" || cmd === "Run") && !sitaOk) {
      return showInterlockError("Press sita yağlama suyu (SCWW 350 kPa) kapalı! Su açılmadan keçe grubu döndürülemez.");
    }
    if (cmd === "Run" && node.speedMode !== "Crawl" && state.wireSpeed === 0) {
      return showInterlockError("Önce keçe grubunu 'Crawl' modunda döndürüp kontrol etmelisiniz!");
    }
    node.speedMode = cmd;
    const running = cmd === "Crawl" || cmd === "Run" || cmd === "Tatil Hızı";
    const st = running ? "auto-run" : "auto-stop";
    node.state = st;
    state.nodes.lead_roll_m2.state = st;
    state.nodes.forming_roll_m1.state = st;
    state.wireSpeed = cmd === "Run" ? state.yankeeSpeed : (cmd === "Crawl" ? 30 : 0);
    logEvent(`Keçe/Elek grubu '${cmd}' moduna alındı (${state.wireSpeed} m/dk).`);
  } else if (node.id === "reel_drum_m6") {
    if (cmd === "Run" && node.speedMode !== "Crawl") {
      return showInterlockError("Mal sarıcıyı (Reel Drum) önce 'Crawl' ile döndürüp ardından 'Run' moduna almalısınız!");
    }
    node.speedMode = cmd;
    node.state = (cmd === "Crawl" || cmd === "Run") ? "auto-run" : "auto-stop";
    logEvent(`Reel Drum (M6) '${cmd}' moduna geçti.`);
  }
  closeFaceplate();
  evaluateProgress();
}

function handleGenericStart(node) {
  // 1. OSİLASYON KİLİTLERİ (70.3 Shower Water)
  if (node.id === "sw_3500" && !state.nodes.osc_wire_needle.state.endsWith("run")) {
    return showInterlockError("Elek iğneli osilasyon motoru (Wire Needle İstasyon - 1407) çalışmadan SCWW 3500 kPa devreye girmez!");
  }
  if (node.id === "cww_2800" && !state.nodes.osc_wire_fan.state.endsWith("run")) {
    return showInterlockError("Elek dökücü osilasyon motoru (Wire Fan İstasyon - 1408) çalışmadan CWW 2800 kPa devreye girmez!");
  }
  if (node.id === "scww_2000" && !state.nodes.osc_felt_needle.state.endsWith("run")) {
    return showInterlockError("Keçe iğneli osilasyon motoru (Felt Needle İstasyon - 2410) çalışmadan SCWW 2000 kPa devreye girmez!");
  }

  // 2. TAIL CUTTER SUYU (70.3 Fresh Water) — Stock ON sonrası açılır
  if (node.id === "sw_fresh" && !state.stockOn) {
    return showInterlockError("Fresh Water (Tail Cutter Suyu) hamur almadan (Stock ON) önce açılmamalıdır!");
  }

  // 3. TURBO VAKUM
  if (node.id === "vac_group_start") {
    if (!state.nodes.vac_group_auto.active) {
      return showInterlockError("Önce 'Vacuum Group Auto' butonuna basarak manueldeki turbo blower'ı otomatiğe almalısınız!");
    }
    if (state.wireSpeed < 120) {
      return showInterlockError("Makine ve keçe grubu 120 m/dk senkron hıza çıkmadan vakum grubu başlatılamaz!");
    }
    state.vacuumRunning = true;
    node.state = "auto-run";
    state.nodes.turbo_blower_m.state = "auto-run";
    state.nodes.sep_pump_1.state = "auto-run";
    state.nodes.sep_pump_2.state = "auto-run";
    logEvent("Turbo Vakum sistemi devreye girdi (-40 kPa / -36 kPa emiş aktif).");
  } else {
    node.state = node.mode === "Auto" ? "auto-run" : "man-run";
    logEvent(`${node.label} çalıştırıldı — hat akışı başladı.`);
  }
  closeFaceplate();
  evaluateProgress();
}

function handleButtonAction(node) {
  if (node.id === "vac_group_auto") {
    node.active = true;
    state.nodes.turbo_blower_m.mode = "Auto";
    state.nodes.turbo_blower_m.state = "auto-stop";
    logEvent("Vacuum Group Auto aktif: Turbo Blower otomatiğe geçti.");
  } else if (node.id === "coating_start") {
    if (!state.showersReady) {
      return showInterlockError("Duşlar ve osilatörler devreye alınmadan Coating başlatılamaz!");
    }
    node.active = true;
    state.coatingRunning = true;
    state.nodes.mod_pump.state = "auto-run";
    state.nodes.coat_pump.state = "auto-run";
    state.nodes.rel_pump.state = "auto-run";
    logEvent("Coating pompaları (Modifier, Coating, Release) devreye alındı.");
  } else if (node.id === "doc_cutoff" || node.id === "doc_creping" || node.id === "doc_cleaning") {
    if (!state.coatingRunning) {
      return showInterlockError("10.9 Coating kimyasalları devreye alınmadan Yankee raspaları basılamaz!");
    }
    node.active = true;
    logEvent(`${node.label} basıldı.`);
  } else if (node.id === "press_close") {
    const activeDocs = [state.nodes.doc_cutoff.active, state.nodes.doc_creping.active, state.nodes.doc_cleaning.active].filter(Boolean).length;
    if (activeDocs < 2) {
      return showInterlockError("En az 2 raspa (Cut off / Cleaning / Creping) basılı olmadan pres yaklaştırılamaz (Close)!");
    }
    node.active = true;
    state.pressClosed = true;
    logEvent("Saha ustası Suction Press Roll'u CLOSE (yakınlaştırma) konumuna getirdi.");
  } else if (node.id === "press_load") {
    if (!state.pressClosed) {
      return showInterlockError("Pres önce 'CLOSE' konumuna getirilmeden 'LOAD' (baskı) yapılamaz!");
    }
    node.active = true;
    state.pressLoaded = true;
    logEvent("Suction Press Roll LOAD (90 kN/m) baskıya girdi.");
  } else if (node.id === "scr_group_auto") {
    if (state.nodes.dil_screen.state === "fault") {
      return showInterlockError("Dilution screen üzerinde FAULT (Kırmızı X) var! Önce arızayı/enerjiyi resetleyin.");
    }
    node.active = true;
    state.nodes.hw_prim_screen.mode = "Auto";
    state.nodes.hw_prim_screen.state = "auto-stop";
    logEvent("Approach Screens Auto moduna alındı.");
  } else if (node.id === "scr_group_start") {
    if (!state.nodes.scr_group_auto.active) {
      return showInterlockError("Önce sol üstteki 'Approach Auto' butonuna basmalısınız!");
    }
    if (!state.nodes.hp_sealing_pump.state.endsWith("run")) {
      return showInterlockError("Yüksek Basınçlı (HP) Salmastra Suyu kapalı! 10.3 Fresh Water sayfasında LP hattının üstündeki HP Sealing Water'ı açmadan elekler start almaz.");
    }
    node.active = true;
    state.screensRunning = true;
    state.nodes.sw_prim_screen.state = "auto-run";
    state.nodes.hw_prim_screen.state = "auto-run";
    state.nodes.dil_screen.state = "auto-run";
    logEvent("SW Prim.screen, HW Prim.screen ve Dilution screen devreye girdi.");
  } else if (node.id === "dil_ctrl_start") {
    if (!state.screensRunning) {
      return showInterlockError("11.5 Approach Screens çalışmadan Dilution Control başlatılamaz!");
    }
    node.active = true;
    state.dilutionRunning = true;
    state.nodes.dil_motor.state = "auto-run";
    state.nodes.hbx_fill_btn.indicator = "white";
    logEvent("Dilution Control çalıştı! Headbox FILL kutucuğu beyaza döndü.");
  } else if (node.id === "hbx_fill_btn") {
    if (!state.dilutionRunning) {
      return showInterlockError("Önce Dilution Control motoruna Start vermelisiniz! (Fill kutucuğu kırmızı/kilitli)");
    }
    node.active = true;
    node.indicator = "green";
    state.headboxFilled = true;
    state.nodes.fan_pump_y.state = "auto-run";
    state.nodes.fan_pump_h.state = "auto-run";
    state.headboxPress = 140;
    state.jwRatio = 0.420;
    state.nodes.hbx_auto_btn.indicator = "white";
    logEvent("Headbox FILL aktif: Kısa ve uzun fan pompaları %20 doluma ulaştı. Auto kilidi beyaza döndü.");
  } else if (node.id === "hbx_auto_btn") {
    if (!state.headboxFilled) {
      return showInterlockError("Önce 'Headbox FILL' yapıp fan pompalarını %20 doldurmalısınız! (Auto kutucuğu kırmızı)");
    }
    if (state.yankeeSpeed < 1100) {
      return showInterlockError("Makine hızı 1100 m/dk olmadan Headbox Auto basınca geçilemez!");
    }
    node.active = true;
    node.indicator = "green";
    state.headboxAuto = true;
    state.headboxPress = 514;
    state.jwRatio = 0.970;
    state.nodes.qcs_shortcuts_stock.indicator = "white";
    logEvent("Headbox AUTO aktif: Fan pompaları devirlendi, 514 kPa basınç ve 0.970 Jet/Wire oranı yakalandı!");
  } else if (node.id === "qcs_utm_start") {
    node.active = true;
    state.utmRunning = true;
    logEvent("UTM Start verildi ve devreye girdi.");
  } else if (node.id === "qcs_shortcuts_stock") {
    if (!state.headboxAuto || state.jwRatio < 0.770) {
      return showInterlockError("Jet/Wire oranı hedef toleransına (0.770+) ulaşmadan hamur almaya izin verilmez!");
    }
    if (!state.utmRunning) {
      return showInterlockError("UTM Start verilmeden makine hamur almaya izin vermez!");
    }
    node.active = true;
    node.indicator = "green";
    state.stockOn = true;
    state.stockFlow = 1000;
    logEvent("Shortcuts -> Stock ON aktif! Hamur pompaları devrede (1000 l/min). Şimdi 70.3 Fresh Water (Tail Cutter Suyu) pompasını başlatabilirsiniz.");
  } else if (node.id === "hood_wet_close") {
    if (state.stockFlow < 1200) {
      return showInterlockError("Önce Stock Flow debisini 1200–1400 l/min aralığına çıkarıp Yankee'de kağıt oluşumunu görün!");
    }
    node.active = true;
    logEvent("Yaş kısım (Wet End) Hood kapatıldı.");
  } else if (node.id === "hood_dry_close") {
    if (!state.nodes.hood_wet_close.active) {
      return showInterlockError("Önce Yaş Kısım (Wet End) Hood kapatılmalıdır!");
    }
    node.active = true;
    logEvent("Kuru kısım (Dry End) Hood kapatıldı.");
  } else if (node.id === "hood_damper_temp") {
    if (!state.nodes.hood_wet_close.active || !state.nodes.hood_dry_close.active) {
      return showInterlockError("Her iki Hood kapanmadan sıcak hava damperi açılamaz!");
    }
    node.active = true;
    logEvent("L/A Sıcak Hava Damperi (%100) açıldı, başlangıç kurutma sıcaklığı 275°C ayarlandı.");
  } else if (node.id === "qcs_tail_cutter") {
    if (!state.nodes.sw_fresh.state.endsWith("run")) {
      return showInterlockError("70.3 Shower Water sayfasındaki Fresh Water (Tail Cutter Suyu) pompası çalıştırılmadan Tek Katır devreye alınamaz!");
    }
    if (!state.reelReady) {
      return showInterlockError("Reel Drum (Run) ve Spool Starter hazır olmadan Tek Katır devreye alınamaz!");
    }
    node.active = true;
    state.tailCutterActive = true;
    logEvent("Tek Katır (Tail Cutter) devreye alındı, kağıt şeridi kesildi.");
  } else if (node.id === "qcs_thread_paper") {
    if (!state.tailCutterActive) {
      return showInterlockError("Önce Tek Katırı (Tail Cutter) devreye almalısınız!");
    }
    node.active = true;
    state.paperThreaded = true;
    logEvent("BAŞARILI! Kağıt bobine bağlandı ve makine RUN konumuna geçti.");
  }

  closeFaceplate();
  evaluateProgress();
}

// İnterlock Matrisi Modalı
function openInterlockModal() {
  const list = document.getElementById("il-checklist");
  list.innerHTML = "";

  const rules = [
    { ok: state.nodes.scww_350.state.endsWith("run"), text: "1. Press Sita Yağlama Suyu (SCWW 350 kPa) çalışıyor" },
    { ok: state.wireSpeed >= 120, text: "2. Keçe/Elek grubu Crawl sonrası 120 m/dk senkron hızda" },
    { ok: state.vacuumRunning, text: "3. Turbo Vakum sistemi devrede (-40 kPa)" },
    { ok: state.showersReady, text: "4. Osilasyonlar (1407/1408/2410) çalışıyor -> Ana duşlar devrede" },
    { ok: state.coatingRunning, text: "5. Coating kimyasal pompaları aktif" },
    { ok: state.pressLoaded, text: "6. En az 2 raspa basılı ve Suction Press Roll LOAD konumunda" },
    { ok: state.nodes.hp_sealing_pump.state.endsWith("run"), text: "7. HP Sealing Water (10.3 Fresh Water üst hat) açık" },
    { ok: state.screensRunning && state.dilutionRunning, text: "8. Approach Screens ve Dilution Control çalışıyor" },
    { ok: state.headboxAuto && state.jwRatio >= 0.770, text: "9. Headbox FILL (%20) -> AUTO tamamlandı, Jet/Wire >= 0.770" },
    { ok: state.utmRunning && state.stockOn && state.nodes.sw_fresh.state.endsWith("run"), text: "10. UTM Start + Stock ON + Tail Cutter Suyu (70.3 Fresh W.) açık" },
    { ok: state.stockFlow >= 1200 && state.hoodReady && state.reelReady, text: "11. Debi >= 1200 l/min + Hood'lar kapalı (275°C) + Reel Drum & Spool hazır" }
  ];

  rules.forEach(r => {
    const li = document.createElement("li");
    li.className = r.ok ? "ok" : "fail";
    li.textContent = (r.ok ? "✅ " : "⛔ ") + r.text;
    list.appendChild(li);
  });

  document.getElementById("interlock-modal").classList.remove("hidden");
}

// Event Listener'lar
document.getElementById("fp-close").onclick = closeFaceplate;
document.getElementById("btn-close-alert").onclick = hideInterlockError;
document.getElementById("btn-check-interlock").onclick = openInterlockModal;
document.getElementById("il-close").onclick = () => document.getElementById("interlock-modal").classList.add("hidden");
document.getElementById("chk-coach-mode").onchange = () => { renderMissionPanel(); renderHotspots(); };
document.getElementById("btn-reset-sim").onclick = () => { initState(); evaluateProgress(); };

function toggleEditor() {
  editorMode = !editorMode;
  document.getElementById("editor-banner").classList.toggle("hidden", !editorMode);
  logEvent(editorMode ? "Koordinat düzenleme modu açıldı." : "Koordinat düzenleme modu kapatıldı.");
}

document.getElementById("btn-toggle-editor").onclick = toggleEditor;
window.addEventListener("keydown", (e) => {
  if (e.altKey && (e.key === "e" || e.key === "E")) toggleEditor();
});

document.getElementById("btn-export-coords").onclick = () => {
  const coords = Object.values(state.nodes).map(n => ({ id: n.id, screen: n.screen, x: n.x, y: n.y }));
  navigator.clipboard.writeText(JSON.stringify(coords, null, 2));
  alert("Güncel ikon koordinatları panoya kopyalandı! scenarios.js içindeki INITIAL_NODES listesine yapıştırabilirsiniz.");
};

// Başlat
initState();
evaluateProgress();
