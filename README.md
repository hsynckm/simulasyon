# TM2 Valmet DNA — Operatör Devreye Alma Simülatörü

Bu proje, Crescent Former tissue kağıt makinesinin (TM2) Valmet DNA kontrol ekranları üzerinden adım adım devreye alınmasını (start-up) öğreten tarayıcı tabanlı interaktif eğitim simülatörüdür.

## Kurulum ve GitHub / Netlify Yayınlama

1. Bu klasördeki tüm dosyaları (`index.html`, `style.css`, `app.js`, `scenarios.js`, `README.md` ve `images/` klasörünü) GitHub deponuza yükleyin.
2. Elimizdeki 11 gerçek DCS ekran görüntüsünü `images/` klasörünün içine aşağıdaki dosya adlarıyla yerleştirin:
   - `fresh water.jpg` (10.3)
   - `shower water.jpg` (70.3)
   - `wire_pres section.jpg` (70.9.4)
   - `turbo blower.jpg` (10.5.1)
   - `coating.jpg` (10.9)
   - `press and strechers.jpg` (70.2)
   - `screenler.jpg` (11.5)
   - `headbox.jpg` (70.1)
   - `we hood.jpg` (62.1)
   - `reel section.jpg` (70.9.3)
   - `qsc.jpg` (90)
3. GitHub Pages veya Netlify üzerinden yayına aldığınızda tüm vardiya ekibi hiçbir kurulum yapmadan link üzerinden erişebilir.

## İkon Koordinatlarını İnce Ayarlama (`Alt + E`)

Kendi ekran görüntülerinizi `images/` klasörüne koyduktan sonra simülatörde **`Alt + E`** tuşlarına basarak **Koordinat Düzenleme Modu**nu açabilirsiniz. Ekrandaki motor/buton ikonlarını farenizle sürükleyip fotoğraf üzerindeki tam yerlerine bıraktıktan sonra **"Koordinatları Kopyala (JSON)"** butonuna basarak güncel `x, y` konumlarını `scenarios.js` dosyasına aktarabilirsiniz.
