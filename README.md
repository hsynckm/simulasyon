# TM2 Valmet DNA — Operatör Devreye Alma Simülatörü (V2)

Bu sürümde gerçek DCS ekran görüntüleri üzerine:
1. **Canlı Boru Hattı Akış Animasyonları (`PIPE_LINES`)**: Pompalara ve vanalara start verildiğinde önlerindeki hatlarda renkli akış animasyonları çalışır.
2. **Osilasyon Kilitleri (`70.3 Shower Water`)**: Elek iğneli (`SCWW 3500 kPa`), elek dökücü (`CWW 2800 kPa`) ve keçe iğneli (`SCWW 2000 kPa`) pompaları sağdaki osilasyon motorları çalışmadan start almaz.
3. **Doğru HP Sealing Water Konumu (`10.3 Fresh Water`)**: `HP Sealing Water` pompası alttaki `LP Sealing Water` hattının hemen üstündeki hat üzerine taşınmıştır.
4. **Tail Cutter Suyu (`70.3 Fresh Water`)**: `Stock ON` ile hamur alındıktan sonra `70.3 Shower Water` sayfasındaki `Fresh Water` pompasına start verilmesi zorunludur; bu su açılmadan `Tek Katır (Tail Cutter)` devreye girmez.
5. **Tıklanabilir Rehber Adımları**: Sol listedeki herhangi bir adıma tıklayarak doğrudan o aşamaya ve ekranına geçebilirsiniz.
