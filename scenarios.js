// TM2 Valmet DNA Operatör Devreye Alma Senaryo & Ekran Yapılandırması

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

// Başlangıç Ekipman Durumları (Valmet DNA Renk Kodu: auto-stop, man-stop, man-run, auto-run, fault)
const INITIAL_NODES = [
  // 10.3 Fresh Water
  { id: "lp_sealing_pump", screen: "fresh_water", type: "motor", label: "LP Sealing Water", x: 38, y: 84, state: "auto-run", mode: "Auto" },
  { id: "hp_sealing_pump", screen: "fresh_water", type: "motor", label: "HP Sealing Water", x: 38, y: 70, state: "auto-stop", mode: "Auto" },

  // 70.3 Shower Water
  { id: "sw_3500", screen: "shower_water", type: "motor", label: "SCWW 3500 kPa (Elek İğneli)", x: 17, y: 65, state: "man-stop", mode: "Manual" },
  { id: "cww_200", screen: "shower_water", type: "motor", label: "CWW 200 kPa (Raspa Yağlama)", x: 17, y: 71, state: "man-stop", mode: "Manual" },
  { id: "cww_2800", screen: "shower_water", type: "motor", label: "CWW 2800 kPa (Elek Dökücü)", x: 17, y: 77, state: "man-stop", mode: "Manual" },
  { id: "sw_fresh", screen: "shower_water", type: "motor", label: "Fresh Water (Dokunma)", x: 17, y: 83, state: "auto-stop", mode: "Auto" },
  { id: "scww_350", screen: "shower_water", type: "motor", label: "SCWW 350 kPa (Press Sita)", x: 17, y: 89, state: "man-stop", mode: "Manual" },
  { id: "scww_2000", screen: "shower_water", type: "motor", label: "SCWW 2000 kPa (Keçe İğneli)", x: 17, y: 95, state: "man-stop", mode: "Manual" },
  { id: "osc_wire_needle", screen: "shower_water", type: "motor", label: "Wire Needle İstasyon", x: 94, y: 49, state: "man-stop", mode: "Manual" },
  { id: "osc_wire_fan", screen: "shower_water", type: "motor", label: "Wire Fan İstasyon", x: 94, y: 63, state: "man-stop", mode: "Manual" },
  { id: "osc_felt_needle", screen: "shower_water", type: "motor", label: "Felt Needle İstasyon", x: 94, y: 77, state: "man-stop", mode: "Manual" },
  { id: "osc_coating", screen: "shower_water", type: "motor", label: "Coating İstasyon", x: 94, y: 91, state: "man-stop", mode: "Manual" },

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
  { id: "hood_wet_close", screen: "we_hood", type: "button", label: "Wet End Hood CLOSE", x: 35, y: 94, active: false },
  { id: "hood_dry_close", screen: "we_hood", type: "button", label: "Dry End Hood CLOSE", x: 21, y: 82, active: false },
  { id: "hood_damper_temp", screen: "we_hood", type: "button", label: "Sıcak Hava Damperi (275°C)", x: 28, y: 45, active: false },

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
    checkDone: (s) => s.nodes.scww_350.state === "man-run" || s.nodes.scww_350.state === "auto-run"
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
    title: "Hızı 600–700 m/dk Yap & Duş/Osilatörleri Aç",
    desc: "Vakum emişi (-40 kPa) görüldü. Hızı 700 m/dk'ya çıkarırken SCWW 3500, CWW 200, CWW 2800 duşlarını ve sağdaki osilatörleri çalıştırın (Fresh water'a dokunmayın).",
    targetText: "Hızı 700 m/dk yapın; 70.3 Shower Water sayfasında ilgili fıskiyeleri ve sağdaki 4 istasyon motorunu başlatın.",
    checkDone: (s) => s.yankeeSpeed >= 700 && s.showersReady
  },
  {
    id: 6,
    screen: "coating",
    title: "Coating Kimyasallarını Devreye Al",
    desc: "Raspaları ve presi basmadan önce Yankee yüzeyini korumak için Coating pompalarını başlatmalısınız.",
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
    desc: "Pres basılı. Hızı 900 m/dk'ya çekerken 11.5 Approach Screens sayfasında Fault'u resetleyin, Auto'ya alın ve Group Start verin (HP Sealing Water kilidine dikkat!).",
    targetText: "11.5 sayfasında Dilution screen Fault'unu resetleyin, Auto + Group Start basın (gerekirse 10.3'ten HP Sealing Water açın).",
    checkDone: (s) => s.screensRunning && s.yankeeSpeed >= 900
  },
  {
    id: 9,
    screen: "headbox",
    title: "Hızı 1100 m/dk Yap & Dilution Control Start Ver",
    desc: "Elekler devrede. Hızı 1100 m/dk'ya çıkarın ve 70.1 Headbox sayfasında önce Dilution Start'a basarak sol mod kilitlerini açın.",
    targetText: "Hızı 1100 m/dk yapın; 70.1 Headbox sayfasında 'Dilution Start' butonuna basın.",
    checkDone: (s) => s.yankeeSpeed >= 1100 && s.dilutionRunning
  },
  {
    id: 10,
    screen: "headbox",
    title: "Headbox FILL (%20) ve AUTO (Basınç Yakalama)",
    desc: "Dilution çalıştı ve Fill kutucuğu beyaza döndü. Önce Fill'e basıp fan pompalarını %20 doldurun, Auto kilidi kalkınca Auto'ya basıp Jet/Wire oranını yakalayın.",
    targetText: "70.1 Headbox sayfasında önce 'Headbox FILL', ardından 'Headbox AUTO' butonuna basın.",
    checkDone: (s) => s.headboxAuto && s.jwRatio >= 0.770
  },
  {
    id: 11,
    screen: "qcs_overview",
    title: "UTM Start Ver & Stock ON ile Hamur Al",
    desc: "Jet/Wire 0.770 sınırını geçti. Hamur almadan önce UTM'ye start verin, ardından Shortcuts -> Stock ON yapın.",
    targetText: "90 QCS sayfasında önce 'UTM Start', ardından 'Shortcuts -> Stock ON' butonuna basın.",
    checkDone: (s) => s.stockOn
  },
  {
    id: 12,
    screen: "qcs_overview",
    title: "SW / HW Stock Flow Debisini 1000 -> 1300 l/min Artır",
    desc: "SW ve HW Stock Flow 'L' modunda iken önce 1000 l/min, kağıt oluşumu başladıkça 1200–1400 l/min aralığına çıkarın.",
    targetText: "90 QCS sayfasında 'SW/HW Stock Flow (L)' üzerinden debiyi en az 1200 l/min seviyesine getirin.",
    checkDone: (s) => s.stockFlow >= 1200
  },
  {
    id: 13,
    screen: "we_hood",
    title: "Yaş ve Kuru Hood'ları Kapat & Sıcak Hava Damperini Aç",
    desc: "Yankee'de kağıt oluşuyor. Önce Wet End, sonra Dry End Hood'u kapatın ve ortadaki L/A damperinden 250–300°C sıcak hava verin.",
    targetText: "62.1 WE AirCap sayfasında Wet End ve Dry End Hood'ları kapatıp sıcak hava damperini (275°C) devreye alın.",
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
    desc: "Tüm şartlar hazır! Tek katırı (Tail Cutter) devreye alıp kağıdı bobine bağlayın ve üretimi başlatın.",
    targetText: "90 QCS sayfasında önce 'Tek Katır (Tail Cutter)', ardından 'Kağıdı Bağla (Run)' butonuna basın.",
    checkDone: (s) => s.paperThreaded
  }
];
