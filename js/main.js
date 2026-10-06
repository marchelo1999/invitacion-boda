/**
 * ==========================================================================
 * INVITACIÓN DE BODA DIGITAL - SAMUEL & JHOSSELIN
 * Archivo: js/main.js
 * Descripción: Lógica interactiva (Countdown, RSVP Nativo Web, Audio, Clipboard,
 *               Google Calendar e Intersection Observer).
 * ==========================================================================
 */

'use strict';

/**
 * CONFIGURACIÓN CENTRALIZADA (CONFIG)
 * Puedes personalizar todos los datos de la boda aquí en un solo lugar.
 */
const CONFIG = {
  // Nombres de los novios
  couple: {
    groom: 'Samuel',
    bride: 'Jhosselin',
    fullName: 'Samuel & Jhosselin',
    monogram: 'S & J'
  },

  // Fecha y hora del evento principal (Formato ISO: AAAA-MM-DDTHH:mm:ss)
  // 24 de Octubre de 2026 a las 17:00 hrs
  weddingDate: '2026-10-24T17:00:00',
  weddingEndDate: '2026-10-25T23:59:59',

  // Número de WhatsApp para felicitaciones personales opcionales
  whatsappNumber: '59164388424',

  // URL del Webhook de Google Sheets (Apps Script).
  googleScriptUrl: 'https://script.google.com/macros/s/AKfycbylIO_3pWSpNAYaBnsQgvBECE9p6jQXn78tA-cqGoynoa1btP8TTb_sZgscLZEYNSaJ/exec',

  // Ubicaciones de los eventos
  locations: {
    ceremony: {
      name: 'Parroquia “La Recoleta”',
      address: 'Av. Potosí, La Recoleta, Cochabamba, Bolivia',
      time: '17:00 hrs',
      mapUrl: 'https://www.google.com/maps/place/Parroquia+La+Recoleta/@-17.3779344,-66.1521093,17z/data=!4m6!3m5!1s0x93e3741aeab460b5:0x335b80ee9ba49ec4!8m2!3d-17.3779344!4d-66.1521093'
    },
    reception: {
      name: 'Salón de Eventos Deysi',
      address: 'Av. Villazón Km. 4, Cochabamba, Bolivia',
      time: '18:00 hrs',
      mapUrl: 'https://maps.google.com/?q=Salon+de+eventos+Deysi+Av+Villazon+km+4'
    }
  },

  // Datos para Mesa de Regalos / Transferencia Bancaria
  bankInfo: {
    bank: 'BCP (Banco de Crédito de Bolivia)',
    holder: 'Jhosselin Maria Molina Zurita',
    accountNumber: '301-51058249-3-71',
    accountType: 'Caja de Ahorros en Bolivianos (Bs)'
  }
};

/* ==========================================================================
   MÓDULO 1: CUENTA REGRESIVA EN TIEMPO REAL
   ========================================================================== */
function initCountdown() {
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const targetDate = new Date(CONFIG.weddingDate).getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';

      const subTitle = document.querySelector('.countdown-section .section-subtitle');
      if (subTitle) {
        subTitle.textContent = '¡Llegó el gran día! Gracias por celebrar nuestro amor con nosotros.';
      }
      return;
    }

    const d = Math.floor(difference / (1000 * 60 * 60 * 24));
    const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((difference % (1000 * 60)) / 1000);

    daysEl.textContent = String(d).padStart(2, '0');
    hoursEl.textContent = String(h).padStart(2, '0');
    minutesEl.textContent = String(m).padStart(2, '0');
    secondsEl.textContent = String(s).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
   MÓDULO 2: ENLACE A GOOGLE CALENDAR
   ========================================================================== */
function initCalendarLink() {
  const btnCalendar = document.getElementById('btnAddToCalendar');
  if (!btnCalendar) return;

  // Fecha 24 Octubre 2026: 17:00 a 23:59 (UTC aprox: Bolivia es UTC-4)
  // Formato ISO compacto para Google Calendar: YYYYMMDDTHHMMSS
  const startIso = '20261024T170000';
  const endIso = '20261024T235900';
  const title = encodeURIComponent(`Boda de ${CONFIG.couple.fullName}`);
  const details = encodeURIComponent(
    `Acompáñanos a celebrar nuestra boda.\n\n` +
    `Ceremonia: ${CONFIG.locations.ceremony.time} - ${CONFIG.locations.ceremony.name}\n` +
    `Recepción: ${CONFIG.locations.reception.time} - ${CONFIG.locations.reception.name}\n\n` +
    `¡Esperamos contar con tu presencia!`
  );
  const location = encodeURIComponent(`${CONFIG.locations.ceremony.name}, ${CONFIG.locations.ceremony.address}`);

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;

  btnCalendar.href = googleCalendarUrl;
}

/* ==========================================================================
/* ==========================================================================
   MÓDULO 3: CONTROL DE AUDIO & MÚSICA DE FONDO (EXCLUSIVAMENTE ARCHIVO REAL MP3)
   ========================================================================== */
function initAudioPlayer() {
  const audio = document.getElementById('wedding-audio');
  const toggleBtn = document.getElementById('audioToggleBtn');
  const container = document.getElementById('audioContainer');
  const tooltip = document.getElementById('audioTooltip');

  if (!audio || !toggleBtn || !container) return;

  let isPlaying = false;

  // Tooltip de bienvenida
  if (tooltip) {
    setTimeout(() => {
      tooltip.classList.add('show-init');
      setTimeout(() => tooltip.classList.remove('show-init'), 4500);
    }, 1200);
  }

  function playMusic() {
    audio.volume = 0.55;
    audio.play()
      .then(() => {
        isPlaying = true;
        container.classList.add('playing');
        if (tooltip) {
          tooltip.querySelector('.tooltip-text').textContent = 'Pausar música';
        }
      })
      .catch(() => {
        // En móviles, el navegador requiere un toque del usuario; esperamos silenciosamente
      });
  }

  function pauseMusic() {
    audio.pause();
    isPlaying = false;
    container.classList.remove('playing');
    if (tooltip) {
      tooltip.querySelector('.tooltip-text').textContent = 'Reproducir música';
    }
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  });

  // Integración con el Sobre de Bienvenida Nupcial
  const envelopeOverlay = document.getElementById('envelopeOverlay');
  const btnOpenInvitation = document.getElementById('btnOpenInvitation');

  if (btnOpenInvitation && envelopeOverlay) {
    function openEnvelope(e) {
      if (e) e.stopPropagation();
      playMusic();
      envelopeOverlay.classList.add('opened');
      setTimeout(() => {
        envelopeOverlay.style.display = 'none';
        checkWeddingDayCelebration();
      }, 1350);
    }

    btnOpenInvitation.addEventListener('click', openEnvelope);
    btnOpenInvitation.addEventListener('touchend', openEnvelope, { passive: true });
  }

  // Si por alguna razón el sobre no activó la música, se activa con el primer toque en pantalla
  const startOnFirstTouch = () => {
    if (!isPlaying) {
      playMusic();
    }
    ['click', 'touchstart'].forEach(evt => {
      document.removeEventListener(evt, startOnFirstTouch);
    });
  };

  ['click', 'touchstart'].forEach(evt => {
    document.addEventListener(evt, startOnFirstTouch, { once: true, passive: true });
  });
}

/* ==========================================================================
   MÓDULO 4: CÓDIGO DE VESTIMENTA INTERACTIVO (PALETA DE COLORES)
   ========================================================================== */
function initDressCodeSwatches() {
  const swatches = document.querySelectorAll('.color-swatch');
  const feedbackColor = document.getElementById('feedbackColor');
  const feedbackTip = document.getElementById('feedbackTip');

  if (!swatches.length || !feedbackColor || !feedbackTip) return;

  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      // Remover clase active de todos
      swatches.forEach(s => s.classList.remove('active'));
      // Activar el clickeado
      swatch.classList.add('active');

      const colorName = swatch.getAttribute('data-color') || '';
      const colorTip = swatch.getAttribute('data-tip') || '';

      feedbackColor.textContent = colorName;
      feedbackTip.textContent = colorTip;
    });
  });
}

/* ==========================================================================
   MÓDULO 5: REGALO INTERACTIVO 3D (REVELACIÓN DE QR & MENSAJE)
   ========================================================================== */
function initInteractiveGift() {
  const trigger = document.getElementById('giftBoxTrigger');
  const wrapper = document.getElementById('interactiveGift');
  const drawer = document.getElementById('giftDrawer');
  const ctaText = document.getElementById('giftCtaText');

  if (!trigger || !wrapper || !drawer) return;

  function toggleGift(e) {
    if (e) e.preventDefault();
    const isOpen = wrapper.classList.toggle('is-open');

    trigger.setAttribute('aria-expanded', String(isOpen));
    drawer.setAttribute('aria-hidden', String(!isOpen));

    if (ctaText) {
      ctaText.textContent = isOpen ? 'Ocultar detalle' : 'Toca para abrir el regalo';
    }

    if (isOpen) {
      // Pequeño desplazamiento suave si es necesario para enfocar el contenido revelado
      setTimeout(() => {
        const rect = drawer.getBoundingClientRect();
        if (rect.bottom > window.innerHeight) {
          drawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 350);
    }
  }

  trigger.addEventListener('click', toggleGift);
  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      toggleGift(e);
    }
  });
}

/* ==========================================================================
   MÓDULO 6: FORMULARIO RSVP NATIVO (REGISTRO EN REPORTE & BASE DE DATOS)
   ========================================================================== */
function initRSVPForm() {
  const form = document.getElementById('rsvpForm');
  const successCard = document.getElementById('rsvpSuccessCard');
  const nameInput = document.getElementById('guestName');
  const nameError = document.getElementById('nameError');
  const groupPasses = document.getElementById('groupPasses');
  const btnSubmit = document.getElementById('btnSubmitRSVP');
  const btnModify = document.getElementById('btnModifyRSVP');
  const successTitle = document.getElementById('successTitle');
  const successDesc = document.getElementById('successDesc');

  if (!form || !nameInput) return;

  // Recordar confirmación previa guardada en localStorage si el usuario vuelve a entrar
  try {
    const savedRSVP = localStorage.getItem('samuel_jhosselin_rsvp');
    if (savedRSVP) {
      const data = JSON.parse(savedRSVP);
      displaySuccessState(data);
    }
  } catch (e) { }

  // Ocultar selector de pases si la persona indica que NO podrá asistir
  const attendanceRadios = form.querySelectorAll('input[name="attendance"]');
  attendanceRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'no' && groupPasses) {
        groupPasses.style.display = 'none';
      } else if (groupPasses) {
        groupPasses.style.display = 'flex';
      }
    });
  });

  function displaySuccessState(data) {
    form.style.display = 'none';
    if (successCard) {
      successCard.style.display = 'flex';
      if (data.willAttend) {
        successTitle.textContent = `¡Muchas gracias, ${data.name}! ✨`;
        successDesc.innerHTML = `Tu confirmación para <strong>${data.passes} ${data.passes === 1 ? 'persona' : 'personas'}</strong> ha sido registrada con éxito en la lista oficial de los novios.<br>¡Nos vemos este <strong>24 de Octubre de 2026</strong> para celebrar juntos!`;
      } else {
        successTitle.textContent = `Gracias por avisarnos, ${data.name}`;
        successDesc.innerHTML = `Lamentamos mucho que no puedas acompañarnos físicamente, pero sabemos que estarás presente en corazón y oraciones. ¡Te mandamos un gran abrazo!`;
      }
    }
  }

  // Permitir modificar o corregir la respuesta
  if (btnModify) {
    btnModify.addEventListener('click', () => {
      if (successCard) successCard.style.display = 'none';
      form.style.display = 'block';
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    if (!name) {
      if (nameError) nameError.classList.add('active');
      nameInput.focus();
      return;
    } else {
      if (nameError) nameError.classList.remove('active');
    }

    const attendanceRadio = form.querySelector('input[name="attendance"]:checked');
    const willAttend = attendanceRadio ? attendanceRadio.value === 'si' : true;
    const passesSelect = document.getElementById('guestPasses');
    const passes = willAttend ? (passesSelect ? parseInt(passesSelect.value, 10) || 1 : 1) : 0;
    const messageInput = document.getElementById('guestMessage');
    const customMessage = messageInput ? messageInput.value.trim() : '';

    const payload = {
      name,
      willAttend,
      passes,
      customMessage
    };

    // Estado visual de carga en el botón
    if (btnSubmit) btnSubmit.classList.add('submitting');

    // 1. Guardar en localStorage inmediatamente
    try {
      localStorage.setItem('samuel_jhosselin_rsvp', JSON.stringify(payload));
    } catch (err) { }

    // 2. Enviar a la API local (/api/rsvp) si está disponible
    try {
      await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn('API local no disponible, guardado en cliente:', err);
    }

    // 3. Enviar a Google Sheets si CONFIG.googleScriptUrl está configurada
    if (CONFIG.googleScriptUrl) {
      try {
        await fetch(CONFIG.googleScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.warn('Error al enviar a Google Sheets:', err);
      }
    }

    // Quitar estado de carga y mostrar tarjeta de éxito
    if (btnSubmit) btnSubmit.classList.remove('submitting');
    showToast('¡Confirmación registrada con éxito!');
    displaySuccessState(payload);
  });
}

/* ==========================================================================
   MÓDULO 7: ANIMACIONES AL HACER SCROLL (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.10,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
  } else {
    // Fallback si el navegador no tiene soporte
    elements.forEach(el => el.classList.add('is-visible'));
  }
}

/* ==========================================================================
   MÓDULO 8: BARRA DE PROGRESO DE LECTURA SUPERIOR DORADA
   ========================================================================== */
function initScrollProgressBar() {
  const bar = document.getElementById('scrollProgressBar');
  if (!bar) return;

  let ticking = false;

  function updateProgress() {
    const winScroll = window.scrollY || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    if (height > 0) {
      const scrolled = Math.min(Math.max((winScroll / height) * 100, 0), 100);
      bar.style.width = scrolled + '%';
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });

  updateProgress();
}

/* ==========================================================================
   MÓDULO 9: BOTÓN DE AUDIO REACTIVO AL SCROLL RÁPIDO EN MÓVIL
   ========================================================================== */
function initScrollAudioReactive() {
  const audioContainer = document.getElementById('audioContainer');
  if (!audioContainer) return;

  let scrollTimer = null;
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;
    const delta = Math.abs(currentY - lastScrollY);
    lastScrollY = currentY;

    if (delta > 18) {
      audioContainer.classList.add('scrolling-fast');
    }

    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      audioContainer.classList.remove('scrolling-fast');
    }, 260);
  }, { passive: true });
}

/* ==========================================================================
   MÓDULO 10: NAVEGACIÓN Y TOAST FLOTANTE
   ========================================================================== */
function showToast(message) {
  const toast = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('active');

  setTimeout(() => {
    toast.classList.remove('active');
  }, 3200);
}

function initNavigation() {
  // Botón de Volver al Inicio
  const btnTop = document.getElementById('btnBackToTop');
  if (btnTop) {
    btnTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Indicador de Scroll en el Hero
  const scrollIndicator = document.getElementById('scrollIndicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const countdownSec = document.getElementById('countdown-section');
      if (countdownSec) {
        countdownSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/* ==========================================================================
   MÓDULO 10: CALENDARIO INTERACTIVO SAVE THE DATE (OCTUBRE 2026)
   ========================================================================== */
function initWeddingCalendar() {
  const grid = document.getElementById('weddingCalendarGrid');
  const legendToday = document.getElementById('legendToday');
  const legendTodayText = document.getElementById('legendTodayText');
  if (!grid) return;

  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth(); // 0-indexed: 9 = Octubre

  // Si estamos en el mes de Octubre:
  if (currentMonth === 9) {
    const todayCell = grid.querySelector(`.cal-day[data-day="${currentDay}"]`);
    if (todayCell && currentDay !== 24) {
      todayCell.classList.add('today-highlight');
      todayCell.setAttribute('title', `Hoy: ${currentDay} de Octubre`);

      const pill = document.createElement('span');
      pill.className = 'today-pill';
      pill.textContent = 'HOY';
      todayCell.appendChild(pill);

      if (legendToday && legendTodayText) {
        legendToday.style.display = 'inline-flex';
        legendTodayText.textContent = `Hoy (${currentDay} de Octubre)`;
      }
    } else if (currentDay === 24) {
      if (legendToday && legendTodayText) {
        legendToday.style.display = 'inline-flex';
        legendTodayText.textContent = `¡Hoy es Nuestra Boda! 🎉`;
      }
    }
  } else {
    // Si visita en otro mes:
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    if (legendToday && legendTodayText) {
      legendToday.style.display = 'inline-flex';
      legendTodayText.textContent = `Hoy: ${currentDay} de ${months[currentMonth]}`;
    }
  }
}

/* ==========================================================================
   MÓDULO 11: CELEBRACIÓN DEL GRAN DÍA (CONFETI DORADO VIRTUAL)
   ========================================================================== */
function triggerWeddingDayConfetti() {
  // Evitar duplicar canvas si ya hay una animación activa
  if (document.getElementById('weddingConfettiCanvas')) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'weddingConfettiCanvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const handleResize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', handleResize);

  // Paleta de confeti nupcial: Oro noble, champán, blanco perla y celeste tenue
  const colors = [
    '#C5A059', '#DFC17B', '#8C6D37', '#F6E6B4',
    '#FFFFFF', '#E8F3FA', '#7EAAC9'
  ];

  const pieceCount = 95;
  const particles = [];

  for (let i = 0; i < pieceCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * -height * 0.9,
      size: 6 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: 2 + Math.random() * 3.5,
      speedX: (Math.random() - 0.5) * 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 6,
      opacity: 1,
      shape: Math.random() > 0.4 ? 'rect' : 'circle'
    });
  }

  let animationFrameId;
  const startTime = Date.now();
  const duration = 6500; // 6.5 segundos de lluvia dorada

  function render() {
    const elapsed = Date.now() - startTime;
    ctx.clearRect(0, 0, width, height);

    let stillActive = false;

    particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(p.y * 0.015) * 0.8;
      p.rotation += p.rotationSpeed;

      // Desvanecer suavemente en los últimos 2 segundos
      if (elapsed > 4500) {
        p.opacity = Math.max(0, 1 - (elapsed - 4500) / 2000);
      }

      if (p.y < height && p.opacity > 0) {
        stillActive = true;
      }

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    if (elapsed < duration && stillActive) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
  }

  render();
}

function checkWeddingDayCelebration() {
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth(); // 9 = Octubre
  const currentYear = now.getFullYear();

  // Si es 24 o 25 de Octubre de 2026:
  const isWeddingDay = (currentYear === 2026 && currentMonth === 9 && (currentDay === 24 || currentDay === 25));

  if (isWeddingDay) {
    // Si el sobre ya está abierto o cuando se abra, lanzar confeti
    const envelopeOverlay = document.getElementById('envelopeOverlay');
    if (!envelopeOverlay || envelopeOverlay.style.display === 'none') {
      setTimeout(() => {
        triggerWeddingDayConfetti();
      }, 1200);
    }
  }
}

// Función accesible globalmente para probar el confeti en cualquier momento:
window.testWeddingDayConfetti = triggerWeddingDayConfetti;

/* ==========================================================================
   INICIALIZACIÓN AL CARGAR EL DOM
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initWeddingCalendar();
  initCalendarLink();
  initAudioPlayer();
  initDressCodeSwatches();
  initInteractiveGift();
  initRSVPForm();
  initScrollReveal();
  initScrollProgressBar();
  initScrollAudioReactive();
  initNavigation();
  checkWeddingDayCelebration();
});
