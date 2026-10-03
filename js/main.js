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
  weddingEndDate: '2026-10-26T23:59:59',

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
      mapUrl: 'https://maps.google.com/?q=Parroquia+Santa+Ana+de+Cala+Cala+La+Recoleta+Cochabamba'
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
    bank: 'Banco Unión / BNB',
    holder: 'Samuel Martínez / Jhosselin Romero',
    accountNumber: '10000034892019',
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
      }, 950);
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
   MÓDULO 5: COPIAR NÚMERO DE CUENTA AL PORTAPAPELES
   ========================================================================== */
function initBankCardCopy() {
  const btnCopy = document.getElementById('btnCopyAccount');
  if (!btnCopy) return;

  btnCopy.addEventListener('click', async () => {
    const textToCopy = btnCopy.getAttribute('data-copy-target') || CONFIG.bankInfo.accountNumber;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback clásico
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      // Feedback visual en el botón
      btnCopy.classList.add('copied');
      const textSpan = btnCopy.querySelector('.copy-text');
      const originalText = textSpan ? textSpan.textContent : '';
      if (textSpan) textSpan.textContent = '¡Número Copiado!';

      showToast('¡Número de cuenta copiado al portapapeles!');

      setTimeout(() => {
        btnCopy.classList.remove('copied');
        if (textSpan) textSpan.textContent = originalText;
      }, 2500);

    } catch (err) {
      console.error('Error al copiar:', err);
      showToast('No se pudo copiar automáticamente. Número: ' + textToCopy);
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
  } catch (e) {}

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
    } catch (err) {}

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
   INICIALIZACIÓN AL CARGAR EL DOM
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initCalendarLink();
  initAudioPlayer();
  initDressCodeSwatches();
  initBankCardCopy();
  initRSVPForm();
  initScrollReveal();
  initScrollProgressBar();
  initScrollAudioReactive();
  initNavigation();
});
