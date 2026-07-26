/* =========================================================
   Eren Karabin — Fizik Özel Ders
   Etkileşimler: menü, sekmeler, scroll animasyonu, form
   ========================================================= */

/* WhatsApp numarası — ülke kodu + numara, boşluksuz ve "+" olmadan.
   0554 645 92 01 → 905546459201 */
const WHATSAPP_NUMBER = '905546459201';

/* İletişim e-postası */
const EMAIL_ADDRESS = 'erenkarabin@hotmail.com';

/* Bir hata olursa gizlenmiş içerik ekranda kalmasın diye acil kurtarma.
   .reveal öğeleri CSS'te opacity:0 ile başlıyor; bu fonksiyon hepsini görünür yapar. */
function revealAllContent() {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    initSite();
  } catch (err) {
    // Tek bir hata yüzünden sayfa boş görünmesin.
    console.error('Site betiği hatası:', err);
    revealAllContent();
  }
});

/* JS hiç çalışmazsa (dosya yüklenmediyse, eski tarayıcı vb.) yine de içerik görünsün. */
setTimeout(revealAllContent, 2500);


function initSite() {

  /* ---------- Elemanlar ---------- */
  const header = document.getElementById('siteHeader');
  const fab = document.getElementById('waFab');
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');

  /* Aktif bölüm takibi için gereken listeler — onScroll'dan ÖNCE tanımlanmalı,
     aksi halde ilk çağrıda "Cannot access before initialization" hatası alınır. */
  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...nav.querySelectorAll('a[href^="#"]')];

  function setActiveNav() {
    const pos = window.scrollY + 140;
    let current = '';
    for (const s of sections) {
      if (s.offsetTop <= pos) current = s.id;
    }
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
  }

  /* ---------- Scroll durumu (header gölgesi + yüzen buton) ---------- */
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 20);
    fab.classList.toggle('show', y > 500);
    setActiveNav();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobil menü ---------- */
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
  });

  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.focus();
    }
  });

  /* ---------- Scroll ile görünürlük animasyonu ---------- */
  const revealEls = [...document.querySelectorAll('.reveal')];

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        setTimeout(() => entry.target.classList.add('visible'), i * 70);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => io.observe(el));

    /* Ekranın üst kısmındaki öğeleri beklemeden göster. */
    revealEls.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('visible');
    });
  } else {
    revealAllContent();
  }

  /* ---------- Konu sekmeleri ---------- */
  const tabBtns = [...document.querySelectorAll('.tab-btn')];
  const tabPanels = [...document.querySelectorAll('.tab-panel')];

  function activateTab(btn) {
    tabBtns.forEach(b => {
      const on = b === btn;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    const targetId = btn.getAttribute('aria-controls');
    tabPanels.forEach(p => {
      const on = p.id === targetId;
      p.classList.toggle('is-active', on);
      p.hidden = !on;
    });
  }

  tabBtns.forEach((btn, idx) => {
    btn.tabIndex = btn.classList.contains('is-active') ? 0 : -1;
    btn.addEventListener('click', () => activateTab(btn));
    btn.addEventListener('keydown', e => {
      let next = null;
      if (e.key === 'ArrowRight') next = tabBtns[(idx + 1) % tabBtns.length];
      if (e.key === 'ArrowLeft') next = tabBtns[(idx - 1 + tabBtns.length) % tabBtns.length];
      if (e.key === 'Home') next = tabBtns[0];
      if (e.key === 'End') next = tabBtns[tabBtns.length - 1];
      if (next) { e.preventDefault(); activateTab(next); next.focus(); }
    });
  });

  /* ---------- SSS: aynı anda tek soru açık ---------- */
  const faqItems = [...document.querySelectorAll('.faq-item')];
  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) faqItems.filter(o => o !== item).forEach(o => (o.open = false));
    });
  });

  /* ---------- İletişim formu → WhatsApp ---------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  if (form) {
    const setError = (name, message) => {
      const field = form.elements[name];
      const slot = form.querySelector(`.err[data-for="${name}"]`);
      if (slot) slot.textContent = message || '';
      if (field) field.classList.toggle('invalid', Boolean(message));
    };

    /* Formu doğrular; geçerliyse mesaj metnini döndürür, değilse null. */
    function readForm() {
      status.textContent = '';

      const ad = form.ad.value.trim();
      const tel = form.tel.value.trim();
      const seviye = form.seviye.value;
      const format = form.format.value;
      const mesaj = form.mesaj.value.trim();

      let ok = true;

      if (ad.length < 3) { setError('ad', 'Lütfen ad soyad giriniz.'); ok = false; }
      else setError('ad', '');

      const digits = tel.replace(/\D/g, '');
      if (digits.length < 10) { setError('tel', 'Geçerli bir telefon numarası giriniz.'); ok = false; }
      else setError('tel', '');

      if (!seviye) { setError('seviye', 'Seviye seçiniz.'); ok = false; }
      else setError('seviye', '');

      if (!ok) {
        status.style.color = '#dc2626';
        status.textContent = 'Lütfen işaretli alanları kontrol edin.';
        const firstBad = form.querySelector('.invalid');
        if (firstBad) firstBad.focus();
        return null;
      }

      return [
        'Merhaba Eren Hocam, web sitenizden yazıyorum.',
        '',
        `Ad Soyad: ${ad}`,
        `Telefon: ${tel}`,
        `Seviye: ${seviye}`,
        `Ders formatı: ${format}`,
        mesaj ? `Hedefim: ${mesaj}` : null,
        '',
        'Ön görüşme için uygun olduğunuz bir zaman var mı?'
      ].filter(Boolean).join('\n');
    }

    const done = (text) => {
      status.style.color = '#10b981';
      status.textContent = text;
      form.reset();
    };

    /* WhatsApp ile gönder */
    form.addEventListener('submit', e => {
      e.preventDefault();
      const body = readForm();
      if (!body) return;

      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(body)}`,
        '_blank', 'noopener'
      );
      done('WhatsApp penceresi açıldı. Mesajı gönderdiğinizde size dönüş yapacağım.');
    });

    /* E-posta ile gönder */
    const mailBtn = document.getElementById('mailSubmit');
    if (mailBtn) {
      mailBtn.addEventListener('click', () => {
        const body = readForm();
        if (!body) return;

        const subject = encodeURIComponent('Fizik Özel Ders — Ön Görüşme Talebi');
        window.location.href =
          `mailto:${EMAIL_ADDRESS}?subject=${subject}&body=${encodeURIComponent(body)}`;
        done('E-posta uygulamanız hazır mesajla açılıyor. Göndermeyi unutmayın.');
      });
    }

    ['ad', 'tel', 'seviye'].forEach(name => {
      const field = form.elements[name];
      if (field) field.addEventListener('input', () => setError(name, ''));
    });
  }

  /* ---------- Yüzen WhatsApp butonu ---------- */
  fab.addEventListener('click', e => {
    e.preventDefault();
    const text = encodeURIComponent('Merhaba Eren Hocam, fizik özel ders hakkında bilgi almak istiyorum.');
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank', 'noopener');
  });

  /* ---------- Footer yılı ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
