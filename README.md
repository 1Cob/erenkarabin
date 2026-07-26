# Eren Karabin — Fizik Özel Ders Web Sitesi

Antalya'da fizik özel dersi veren Eren Karabin için hazırlanmış tek sayfalık tanıtım sitesi.
Framework yok — saf HTML, CSS ve JavaScript.

## Çalıştırma

Dosyayı doğrudan tarayıcıda açabilirsiniz:

```bash
open index.html
```

Ya da yerel sunucuyla (önerilir):

```bash
python3 -m http.server 5173
# → http://localhost:5173
```

## Dosya yapısı

```
erenkarabin/
├── index.html      # Tüm bölümler
├── css/style.css   # Tasarım
├── js/main.js      # Menü, sekmeler, animasyon, form
├── robots.txt      # Arama motoru izinleri
├── sitemap.xml     # Site haritası (Search Console'a bildirilecek)
└── README.md
```

## İletişim bilgileri (siteye işlendi)

- **Telefon / WhatsApp:** 0554 645 92 01 (`tel:+905546459201`, `wa.me/905546459201`)
- **E-posta:** erenkarabin@hotmail.com
- **Konum:** Konyaaltı / Antalya
- **Alan adı:** https://www.erenkarabin.com
- **Ders saatleri:** Hafta içi 17:00–21:00 · Hafta sonu 10:00–18:00

Numara şu noktalarda geçiyor: üst bardaki telefon butonu, hero butonları, hero kartı,
S.S.S., iletişim bölümü, footer, yüzen WhatsApp butonu, form gönderimi ve `js/main.js`
içindeki `WHATSAPP_NUMBER` sabiti.

E-posta şu noktalarda geçiyor: iletişim listesi, "E-posta Gönder" butonu, footer,
form altındaki not, formun "E-posta ile Gönder" butonu, JSON-LD ve `js/main.js`
içindeki `EMAIL_ADDRESS` sabiti.

> **Not:** Verilen adres `erenkarabin@.hotmail.com` şeklindeydi; `@` işaretinden sonraki
> nokta geçersiz bir e-posta adresi oluşturduğu için `erenkarabin@hotmail.com` olarak
> yazıldı. Adres farklıysa yukarıdaki yerlerde güncellenmeli.

## Yayın altyapısı

Site **GitHub Pages** üzerinde yayında. Netlify, Vercel gibi başka bir servis
kullanılmıyor — hiçbir yere dosya yüklemeye gerek yok.

```
Yerel klasör  ──git push──▶  github.com/1Cob/erenkarabin  ──▶  www.erenkarabin.com
```

| Bileşen | Değer |
|---|---|
| Depo | https://github.com/1Cob/erenkarabin (public) |
| Yayın | GitHub Pages · `main` dalı · kök dizin |
| Alan adı | www.erenkarabin.com (`CNAME` dosyasıyla tanımlı) |
| DNS | Squarespace'te barındırılıyor, GitHub IP'lerini gösteriyor |

### Güncelleme nasıl yapılır?

Dosyaları düzenleyip commit'leyip push'lamak yeterli — 1-2 dakika içinde canlıya yansır:

```bash
git add -A
git commit -m "açıklama"
git push
```

### DNS kayıtları (Squarespace · Özel kayıtlar)

| Ad | Tür | Veri |
|---|---|---|
| `www` | CNAME | `1cob.github.io` |
| `@` | A | `185.199.108.153` |
| `@` | A | `185.199.109.153` |
| `@` | A | `185.199.110.153` |
| `@` | A | `185.199.111.153` |

`erenkarabin.com` otomatik olarak `www.erenkarabin.com` adresine yönlenir.

### Yayın sonrası yapılacaklar

- Google Search Console'a siteyi ekleyip `sitemap.xml` bildirin
- Google Business profili oluşturun (yerel aramalarda haritada çıkmak için)

## Yayına almadan önce kalan eksikler

| Yer | Ne değişecek |
|---|---|
| `index.html` → Yorumlar bölümü | **Örnek metinler var.** Gerçek öğrenci/veli yorumlarıyla değiştirin |
| `index.html` → `.socials` (yorum satırında) | Instagram / YouTube hesapları geldiğinde açın |
| `index.html` → Hero `.mini-stats` | Deneyim yılı (şimdilik "10+ yıl") teyit edilmeli |
| `.avatar` (EK baş harfleri) | İstenirse gerçek fotoğrafla değiştirilebilir |

## Bölümler

1. **Hero** — isim, kısa tanıtım, WhatsApp + arama butonları, özet kart
2. **Hakkımda** — yaklaşım metni, 4 öne çıkan özellik, "Derste uyduğum üç kural" bandı
3. **Dersler** — 6 program kartı + ders formatları karşılaştırma tablosu
4. **Maarif Model** — eski/yeni karşılaştırması + "ne değişti → ne yapıyoruz" 4 kart
5. **Nasıl İşliyor?** — 4 adımlı süreç
6. **Konular** — sekmeli müfredat (9, 10, 11, 12, TYT, AYT); her başlıkta alt konu açıklaması
7. **Yorumlar** — 3 yer tutucu yorum + "referans iste" kutusu
8. **S.S.S.** — 14 soru, akordeon (aynı anda tek soru açık)
9. **İletişim** — "ilk görüşmede ne konuşuyoruz" kutusu, iletişim bilgileri, WhatsApp formu

## Düzeltilen hata (önemli)

`js/main.js` içinde `onScroll()`, kendisinden sonra `const` ile tanımlanan `sections`
dizisini okuyan `setActiveNav()` fonksiyonunu çağırıyordu. Bu, JavaScript'in
*temporal dead zone* kuralı gereği `ReferenceError` fırlatıyor ve `DOMContentLoaded`
işleyicisinin geri kalanı hiç çalışmıyordu. Sonuç: `IntersectionObserver` kurulmadığı
için `opacity: 0` ile başlayan tüm `.reveal` blokları görünmez kalıyor, bölümler
**boş görünüyordu**. Ayrıca sekmeler, mobil menü ve form da çalışmıyordu.

Alınan önlemler:

- Değişken tanımları çağrılardan önceye alındı
- `initSite()` bir `try/catch` içine alındı; hata olursa içerik yine gösteriliyor
- `.reveal` gizlemesi yalnızca `html.js` sınıfı varken uygulanıyor — JS yüklenmezse içerik gizlenmez
- 2,5 saniyelik güvenlik zamanlayıcısı her koşulda içeriği görünür kılıyor

## Teknik notlar

- Duyarlı tasarım (mobil, tablet, masaüstü)
- Klavye erişilebilirliği: sekme okları, `Esc` ile menü kapatma, `skip-link`, `:focus-visible`
- `prefers-reduced-motion` desteği
- Yazdırma stili (`@media print`)
- Yazı tipleri Google Fonts'tan çekilir; internet yoksa sistem fontlarına düşer
- Form arka uç gerektirmez; girilen bilgileri hazır WhatsApp mesajına çevirir

## Sonraki adımlar (isteğe bağlı)

- Eren hocanın fotoğrafı ve kurum bilgisi
- Blog / konu anlatım notları bölümü
- Google Analytics veya benzeri ölçümleme
- Eren hocanın fotoğrafı (şu an "EK" baş harfleri duruyor)
- `sitemap.xml`, `robots.txt` ve Google Business kaydı (yerel SEO için)
