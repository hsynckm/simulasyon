// TM2 Valmet DNA Operatör Devreye Alma Senaryo, Boru Akışı & Ekran Yapılandırması

const SCREENS = [
  { id: "fresh_water", code: "10.3", name: "Fresh Water", image: "images/fresh water.jpg" },
  { id: "shower_water", code: "70.3", name: "Shower Water", image: "images/shower water.jpg" },
  { id: "wire_press", code: "70.9.4", name: "Wire/Press Sec.", image: "images/wire_pres section.jpg" },
  { id: "turbo_vacuum", code: "10.5.1", name: "Turbo Vacuum", image: "images/turbo blower.jpg" },
  { id: "coating", code: "10.9", name: "Coating", image: "images/coating.jpg" },
  { id: "press_stretchers", code: "70.2", name: "Press & Stretch.", image: "images/press and strechers.jpg" },
  { id: "approach_screens", code: "11.5", name: "Approach Screens", image: "images/screenler.jpg" },
  { id: "headbox", code: "70.1", name: "Headbox", image: "images/headbox.jpg" },
  { id: "we_hood", code: "62.1", name: "WE AirCap / Hood", image: "images/we hood.jpg" },
  { id: "reel_section", code: "70.9.3", name: "Reel Section", image: "images/reel section.jpg" },
  { id: "qcs_overview", code: "90", name: "QCS Overview", image: "images/qsc.jpg" }
];

// Resim Üzeri Canlı Boru Hattı Akış Çizgileri
const PIPE_LINES = [
  { id: "pipe_lp_sealing", screen: "fresh_water", points: "27,82 40,82 92,82", kind: "water", activeWhen: (s) => s.nodes.lp_sealing_pump.state.endsWith("run") },
  { id: "pipe_hp_sealing", screen: "fresh_water", points: "27,75 38,75 76,75 92,75", kind: "hp-water", activeWhen: (s) => s.nodes.hp_sealing_pump.state.endsWith("run") },

  { id: "pipe_sw_3500", screen: "shower_water", points: "17,65 28,65 28,32", kind: "water", activeWhen: (s) => s.nodes.sw_3500.state.endsWith("run") },
  { id: "pipe_cww_200", screen: "shower_water", points: "17,71 79,71 79,53", kind: "water", activeWhen: (s) => s.nodes.cww_200.state.endsWith("run") },
  { id: "pipe_cww_2800", screen: "shower_water", points: "17,77 36,77 36,41", kind: "water", activeWhen: (s) => s.nodes.cww_2800.state.endsWith("run") },
  { id: "pipe_tail_fresh", screen: "shower_water", points: "17,83 48,83 48,39", kind: "hp-water", activeWhen: (s) => s.nodes.sw_fresh.state.endsWith("run") },
  { id: "pipe_scww_350", screen: "shower_water", points: "17,89 70,89 70,53", kind: "water", activeWhen: (s) => s.nodes.scww_350.state.endsWith("run") },
  { id: "pipe_scww_2000", screen: "shower_water", points: "17,95 54,95 54,36", kind: "water", activeWhen: (s) => s.nodes.scww_2000.state.endsWith("run") },

  { id: "pipe_vac_main", screen: "turbo_vacuum", points: "11,31 11,66 34,66 44,66 44,46 66,46 66,60 85,60", kind: "vacuum", activeWhen: (s) => s.vacuumRunning },

  { id: "pipe_coat_1", screen: "coating", points: "25,24 68,24 68,72", kind: "chemical", activeWhen: (s) => s.coatingRunning },
  { id: "pipe_coat_2", screen: "coating", points: "25,38 66,38 66,72", kind: "chemical", activeWhen: (s) => s.coatingRunning },
  { id: "pipe_coat_3", screen: "coating", points: "25,52 64,52 64,72", kind: "chemical", activeWhen: (s) => s.coatingRunning },

  { id: "pipe_scr_sw", screen: "approach_screens", points: "67,44 85,44", kind: "pulp", activeWhen: (s) => s.screensRunning },
  { id: "pipe_scr_hw", screen: "approach_screens", points: "67,69 85,69", kind: "pulp", activeWhen: (s) => s.screensRunning },
  { id: "pipe_scr_dil", screen: "approach_screens", points: "38,83 85,83", kind: "pulp", activeWhen: (s) => s.screensRunning },

  { id: "pipe_hbx_dil", screen: "headbox", points: "51,27 56,27 56,52", kind: "water", activeWhen: (s) => s.dilutionRunning },
  { id: "pipe_hbx_fan_y", screen: "headbox", points: "49,88 49,52 63,52", kind: "pulp", activeWhen: (s) => s.headboxFilled },
  { id: "pipe_hbx_fan_h", screen: "headbox", points: "55,88 55,56 63,56", kind: "pulp", activeWhen: (s) => s.headboxFilled },

  { id: "pipe_hood_air", screen: "we_hood", points: "47,56 38,56 38,74 22,74", kind: "hot-air", activeWhen: (s) => s.hoodReady }
];

// Başlangıç Ekipman Durumları
const INITIAL_NODES = [
  // 10.3 Fresh Water
  { id: "lp_sealing_pump", screen: "fresh_water", type: "motor", label: "LP Sealing Water (4.0 Bar)", x: 27, y: 82, state: "auto-run", mode: "Auto" },
  { id: "hp_sealing_pump", screen: "fresh_water", type: "motor", label: "HP Sealing Water (Üst Hat)", x: 76, y: 75, state: "auto-stop", mode: "Auto" },

  // 70.3 Shower Water (sw_fresh Auto'da ise Stock ON anında otomatik çalışır; Manual'e alınırsa Stock ON sonrası elle start ister)
  { id: "sw_3500", screen: "shower_water", type: "motor", label: "SCWW 3500 kPa (Elek İğneli)", x: 17, y: 65, state: "man-stop", mode: "Manual" },
  { id: "cww_200", screen: "shower_water", type: "motor", label: "CWW 200 kPa (Raspa Yağlama)", x: 17, y: 71, state: "man-stop", mode: "Manual" },
  { id: "cww_2800", screen: "shower_water", type: "motor", label: "CWW 2800 kPa (Elek Dökücü)", x: 17, y: 77, state: "man-stop", mode: "Manual" },
  { id: "sw_fresh", screen: "shower_water", type: "motor", label: "Fresh Water (Tail Cutter Suyu)", x: 17, y: 83, state: "auto-stop", mode: "Auto" },
  { id: "scww_350", screen: "shower_water", type: "motor", label: "SCWW 350 kPa (Press Sita)", x: 17, y: 89, state: "man-stop", mode: "Manual" },
  { id: "scww_2000", screen: "shower_water", type: "motor", label: "SCWW 2000 kPa (Keçe İğneli)", x: 17, y: 95, state: "man-stop", mode: "Manual" },
  { id: "osc_wire_needle", screen: "shower_water", type: "motor", label: "Wire Needle Osilasyon (1407)", x: 94, y: 49, state: "man-stop", mode: "Manual" },
  { id: "osc_wire_fan", screen: "shower_water", type: "motor", label: "Wire Fan Osilasyon (1408)", x: 94, y: 63, state: "man-stop", mode: "Manual" },
  { id: "osc_felt_needle", screen: "shower_water", type: "motor", label: "Felt Needle Osilasyon (2410)", x: 94, y: 77, state: "man-stop", mode: "Manual" },
  { id: "osc_coating", screen: "shower_water", type: "motor", label: "Coating İstasyon (2431)", x: 94, y: 91, state: "man-stop", mode: "Manual" },

  // 70.9.4 Wire/Press Section
  { id: "yankee_m5", screen: "wire_press", type: "motor", label: "Yankee 2 (M5)", x: 37, y: 68, state: "auto-run", mode: "Auto" },
  { id: "yankee_m4", screen: "wire_press", type: "motor", label: "Yankee 1 (M4)", x: 51, y: 68, state: "auto-run", mode: "Auto" },
  { id: "suction_press_m3", screen: "wire_press", type: "motor", label: "Suction Press Roll (M3)", x: 64, y: 68, state: "auto-stop", mode: "Auto", speedMode: "Stop" },
  { id: "lead_roll_m2", screen: "wire_press", type: "motor", label: "Lead Roll (M2)", x: 78, y: 68, state: "auto-stop", mode: "Auto" },
  { id: "forming_roll_m1", screen: "wire_press", type: "motor", label: "Forming Roll (M1)", x: 92, y: 68, state: "auto-stop", mode: "Auto" },

  // 10.5.1 Turbo Vacuum System
  { id: "vac_group_auto", screen: "turbo_vacuum", type: "button", label: "Vacuum Group Auto", x: 65, y: 15, active: false },
  { id: "vac_group_start", screen: "turbo_vacuum", type: "motor", label: "Group Control (G)", x: 66, y: 20, state: "auto-stop", mode: "Auto" },
  { id: "turbo_blower_m", screen: "turbo_vacuum", type: "motor", label: "Turbo Blower Motor", x: 90, y: 60, state: "man-stop", mode: "Manual" },
  { id: "sep_pump_1", screen: "turbo_vacuum", type: "motor", label: "Separator Pump 1", x: 35, y: 87, state: "auto-stop", mode: "Auto" },
  { id: "sep_pump_2", screen: "turbo_vacuum", type: "motor", label: "Separator Pump 2", x: 51, y: 80, state: "auto-stop", mode: "Auto" },

  // 10.9 Coating
  { id: "coating_start", screen: "coating", type: "button", label: "COATING START", x: 11, y: 63, active: false },
  { id: "mod_pump", screen: "coating", type: "motor", label: "Modifier Agent", x: 25, y: 24, state: "auto-stop", mode: "Auto" },
  { id: "coat_pump", screen: "coating", type: "motor", label: "Coating Agent", x: 25, y: 38, state: "auto-stop", mode: "Auto" },
  { id: "rel_pump", screen: "coating", type: "motor", label: "Release Agent", x: 25, y: 52, state: "auto-stop", mode: "Auto" },

  // 70.2 Press and Stretchers
  { id: "doc_cutoff", screen: "press_stretchers", type: "button", label: "Cut off doctor (Load)", x: 15, y: 42, active: false },
  { id: "doc_creping", screen: "press_stretchers", type: "button", label: "Creping doctor (Load)", x: 15, y: 53, active: false },
  { id: "doc_cleaning", screen: "press_stretchers", type: "button", label: "Cleaning doctor (Load)", x: 15, y: 65, active: true },
  { id: "press_close", screen: "press_stretchers", type: "button", label: "Suction Press: CLOSE", x: 38, y: 82, active: false },
  { id: "press_load", screen: "press_stretchers", type: "button", label: "Suction Press: LOAD", x: 38, y: 78, active: false },

  // 11.5 Approach Screens
  { id: "scr_group_auto", screen: "approach_screens", type: "button", label: "Approach Auto", x: 6, y: 19, active: false },
  { id: "scr_group_start", screen: "approach_screens", type: "button", label: "Group Start", x: 6, y: 23, active: false },
  { id: "sw_prim_screen", screen: "approach_screens", type: "motor", label: "SW Prim.screen", x: 67, y: 44, state: "auto-stop", mode: "Auto" },
  { id: "hw_prim_screen", screen: "approach_screens", type: "motor", label: "HW Prim.screen", x: 67, y: 69, state: "man-stop", mode: "Manual" },
  { id: "dil_screen", screen: "approach_screens", type: "motor", label: "Dilution screen", x: 38, y: 83, state: "fault", mode: "Fault" },

  // 70.1 Headbox
  { id: "dil_ctrl_start", screen: "headbox", type: "button", label: "Dilution Start", x: 51, y: 15, active: false },
  { id: "dil_motor", screen: "headbox", type: "motor", label: "Dilution Pump", x: 51, y: 27, state: "auto-stop", mode: "Auto" },
  { id: "hbx_fill_btn", screen: "headbox", type: "button", label: "Headbox FILL", x: 13, y: 24, active: false, indicator: "red" },
  { id: "hbx_auto_btn", screen: "headbox", type: "button", label: "Headbox AUTO", x: 13, y: 15, active: false, indicator: "red" },
  { id: "fan_pump_y", screen: "headbox", type: "motor", label: "Fan Pump (Kısa/Y)", x: 49, y: 63, state: "auto-stop", mode: "Auto" },
  { id: "fan_pump_h", screen: "headbox", type: "motor", label: "Fan Pump (Uzun/H)", x: 55, y: 63, state: "auto-stop", mode: "Auto" },

  // 62.1 WE AirCap / Hood
  { id: "hood_damper_temp", screen: "we_hood", type: "button", label: "Hood Sıcaklık Ayarı (275-300°C)", x: 28, y: 45, active: false },
  { id: "hood_wet_close", screen: "we_hood", type: "button", label: "Wet End Hood CLOSE", x: 35, y: 94, active: false },
  { id: "hood_dry_close", screen: "we_hood", type: "button", label: "Dry End Hood CLOSE", x: 21, y: 82, active: false },

  // 70.9.3 Reel Section
  { id: "reel_drum_m6", screen: "reel_section", type: "motor", label: "Reel Drum (M6)", x: 63, y: 68, state: "auto-stop", mode: "Auto", speedMode: "Stop" },
  { id: "reel_spool_m7", screen: "reel_section", type: "motor", label: "Reel Spool Starter (M7)", x: 49, y: 68, state: "auto-stop", mode: "Auto" },

  // 90 QCS Overview
  { id: "qcs_yankee_speed", screen: "qcs_overview", type: "button", label: "Yankee Speed Set", x: 52, y: 58, active: false },
  { id: "qcs_utm_start", screen: "qcs_overview", type: "button", label: "UTM Start", x: 18, y: 50, active: false },
  { id: "qcs_shortcuts_stock", screen: "qcs_overview", type: "button", label: "Shortcuts -> Stock ON", x: 10, y: 50, active: false, indicator: "red" },
  { id: "qcs_stock_flow", screen: "qcs_overview", type: "button", label: "SW/HW Stock Flow (L)", x: 33, y: 37, active: false },
  { id: "qcs_tail_cutter", screen: "qcs_overview", type: "button", label: "Tek Katır (Tail Cutter)", x: 64, y: 58, active: false },
  { id: "qcs_thread_paper", screen: "qcs_overview", type: "button", label: "Kağıdı Bağla (Run)", x: 75, y: 12, active: false }
];

const STEPS = [
  {
    id: 1,
    screen: "shower_water",
    title: "Press Sita Yağlama Suyunu Aç (SCWW 350 kPa)",
    desc: "Yankee Run'da, keçe grubu duruyor. Kuru keçeyi döndürmeden önce press sita yağlama suyuna start verilmelidir.",
    targetText: "70.3 Shower Water sayfasında sol alttan ikinci pompa olan 'SCWW 350 kPa' motoruna tıklayıp Start verin.",
    checkDone: (s) => s.nodes.scww_350.state.endsWith("run")
  },
  {
    id: 2,
    screen: "wire_press",
    title: "Keçe Grubunu Crawl Modunda Döndür",
    desc: "Press yağlama suyu açıldı. Şimdi Suction Press Roll motorundan keçe/elek grubunu sürünme (Crawl) hızında başlatın.",
    targetText: "70.9.4 Wire/Press sayfasında 'Suction Press Roll (M3)' motoruna tıklayıp 'Crawl' seçin.",
    checkDone: (s) => s.nodes.suction_press_m3.speedMode === "Crawl"
  },
  {
    id: 3,
    screen: "qcs_overview",
    title: "Yankee Hızını 120 m/dk Yap ve Keçe Grubunu Run'a Al",
    desc: "Elektrikçi kontrolü tamam. Yankee hızını 120 m/dk'ya çekip 70.9.4 sayfasından Suction Press Roll'u Run moduna alarak senkronlayın.",
    targetText: "90 QCS sayfasından Yankee hızını 120 m/dk yapın, ardından 70.9.4 sayfasında Suction Press Roll -> Run seçin.",
    checkDone: (s) => s.yankeeSpeed >= 120 && s.nodes.suction_press_m3.speedMode === "Run"
  },
  {
    id: 4,
    screen: "turbo_vacuum",
    title: "Turbo Vakum Sistemini Devreye Al",
    desc: "Makine 120 m/dk'da senkron dönüyor. Vakum sayfasında manueldeki motoru otomatiğe alıp Group Start verin.",
    targetText: "10.5.1 Turbo Vacuum sayfasında önce 'Vacuum Group Auto', ardından 'Group Control (G)' üzerinden Group Start verin.",
    checkDone: (s) => s.vacuumRunning
  },
  {
    id: 5,
    screen: "shower_water",
    title: "Hızı 700 m/dk Yap & Önce Osilasyonları, Sonra Duşları Aç",
    desc: "Elek iğneli (SCWW 3500), elek dökücü (CWW 2800) ve keçe iğneli (SCWW 2000) motorları sağdaki osilasyon motorları çalışmadan start almaz.",
    targetText: "Hızı 700 m/dk yapın; 70.3 sayfasında önce sağdaki osilasyonları, sonra CWW 200, SCWW 3500, CWW 2800 pompalarını başlatın.",
    checkDone: (s) => s.yankeeSpeed >= 700 && s.showersReady
  },
  {
    id: 6,
    screen: "coating",
    title: "Coating Kimyasallarını Devreye Al",
    desc: "Raspaları ve presi basmadan önce Yankee yüzeyini korumak için Coating pompalarını başlatmalısınız (osilasyon şartı aranmaz).",
    targetText: "10.9 Coating sayfasında sol alttaki 'COATING START' butonuna basıp kimyasal akışını başlatın.",
    checkDone: (s) => s.coatingRunning
  },
  {
    id: 7,
    screen: "press_stretchers",
    title: "En Az 2 Raspayı Bas ve Suction Press Roll'u Yükle",
    desc: "Presin basması için en az 2 raspa (Cut off + Cleaning) basılı olmalıdır. Ardından sahadaki usta presi önce Close sonra Load yapacaktır.",
    targetText: "70.2 Press & Stretchers sayfasında 'Cut off doctor'ı basın (Load), ardından Suction Press için önce 'CLOSE' sonra 'LOAD' yapın.",
    checkDone: (s) => s.pressLoaded
  },
  {
    id: 8,
    screen: "approach_screens",
    title: "Hızı 900 m/dk Yap & Approach Screen'leri Çalıştır",
    desc: "10.3 Fresh Water sayfasında LP hattının üstündeki HP Sealing Water açık olmalıdır. Ardından 11.5 sayfasında Fault'u resetleyip Auto + Group Start verin.",
    targetText: "10.3 sayfasından üst hattaki HP Sealing Water'ı açın; 11.5 sayfasında Dilution Fault'u resetleyin, Auto + Group Start basın.",
    checkDone: (s) => s.screensRunning && s.yankeeSpeed >= 900
  },
  {
    id: 9,
    screen: "headbox",
    title: "Dilution Control Start, Headbox FILL ve Headbox AUTO",
    desc: "Dilution Start sonrası Fill kutucuğu beyaza döner. Fill yapıp fan pompalarını %20 doldurduktan hemen sonra hız şartı olmaksızın Headbox AUTO'ya geçebilirsiniz.",
    targetText: "70.1 Headbox sayfasında sırasıyla 'Dilution Start' -> 'Headbox FILL' -> 'Headbox AUTO' butonlarına basın.",
    checkDone: (s) => s.headboxAuto
  },
  {
    id: 10,
    screen: "we_hood",
    title: "Hızı 1100 m/dk Yap & Hood Başlangıç Sıcaklığını Gir (275-300°C)",
    desc: "Hamur alıp hood'ları kapatmadan önce 62.1 WE AirCap sayfasından hood sıcaklığını 275°C veya 300°C olarak ayarlayın ve hızı 1100 m/dk yapın.",
    targetText: "62.1 WE AirCap sayfasında 'Hood Sıcaklık Ayarı'ndan 275°C veya 300°C girin ve hızı 1100 m/dk yapın.",
    checkDone: (s) => s.hoodTempSet && s.yankeeSpeed >= 1100
  },
  {
    id: 11,
    screen: "qcs_overview",
    title: "UTM Start Ver & Shortcuts -> Stock ON ile Hamur Al",
    desc: "UTM Start sonrası Stock ON dediğinizde Tail Cutter suyu (70.3 Fresh Water) Auto modundaysa otomatik başlar; Manuel modundaysa Stock ON sonrası manuel start verebilirsiniz.",
    targetText: "90 QCS sayfasında önce 'UTM Start', ardından 'Shortcuts -> Stock ON' butonuna basın.",
    checkDone: (s) => s.stockOn && s.nodes.sw_fresh.state.endsWith("run")
  },
  {
    id: 12,
    screen: "qcs_overview",
    title: "İlk Hamur Akışlarını Gir (1000 -> 1300 l/min)",
    desc: "SW ve HW Stock Flow 'L' modunda iken ilk hamur akışlarını (1000–1400 l/min) girin; akış girildikten sonra hood'lar kapatılabilir.",
    targetText: "90 QCS sayfasında 'SW/HW Stock Flow (L)' üzerinden ilk hamur akışını (en az 1000 l/min) girin.",
    checkDone: (s) => s.stockFlow >= 1000
  },
  {
    id: 13,
    screen: "we_hood",
    title: "Yaş (Wet End) ve Kuru (Dry End) Hood'ları Kapat",
    desc: "Hood sıcaklığı girildi ve ilk hamur akışları verildi. Şimdi önce Wet End, ardından Dry End Hood'u kapatarak sıcak hava akışını devreye alın.",
    targetText: "62.1 WE AirCap sayfasında önce 'Wet End Hood CLOSE', ardından 'Dry End Hood CLOSE' butonlarına basın.",
    checkDone: (s) => s.hoodReady
  },
  {
    id: 14,
    screen: "reel_section",
    title: "Reel Drum (Crawl -> Run) ve Spool Starter Hazırla",
    desc: "Kağıt kuruluğu dengelenirken 70.9.3 Reel Section sayfasından mal sarıcıyı önce Crawl sonra Run yapın ve Spool Starter'ı başlatın.",
    targetText: "70.9.3 sayfasında 'Reel Drum (M6)' -> Crawl -> Run yapın ve 'Reel Spool Starter (M7)' motorunu başlatın.",
    checkDone: (s) => s.reelReady
  },
  {
    id: 15,
    screen: "qcs_overview",
    title: "Tek Katırı Devreye Al, Kağıdı Bağla ve Üretime Geç",
    desc: "Tüm şartlar hazır! Tek katırı devreye alıp kağıdı bobine bağlayın ve üretimi başlatın.",
    targetText: "90 QCS sayfasında önce 'Tek Katır (Tail Cutter)', ardından 'Kağıdı Bağla (Run)' butonuna basın.",
    checkDone: (s) => s.paperThreaded
  }
];
