(function () {
  'use strict';

  const DEFAULT_CONFIG = {
    selector: '.pronounceable',
    activeClass: 'pronounceable--speaking',

  
    lang: 'en-GB',

    rate: 1,
    pitch: 1,
    volume: 1,

    voiceName: '',
  };

  const config = Object.assign(
    {},
    DEFAULT_CONFIG,
    window.PronounceableConfig || {}
  );

  if (!('speechSynthesis' in window) || !window.SpeechSynthesisUtterance) {
    document.documentElement.classList.add('speech-synthesis-not-supported');
    console.warn('Speech synthesis is not supported in this browser.');
    return;
  }

  const synth = window.speechSynthesis;

  let voices = [];
  let currentElement = null;

  function loadVoices() {
    voices = synth.getVoices();
  }

  loadVoices();

  if (typeof synth.addEventListener === 'function') {
    synth.addEventListener('voiceschanged', loadVoices);
  } else {
    synth.onvoiceschanged = loadVoices;
  }

  function normalizeText(value) {
    return String(value || '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function toNumber(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function getText(element) {
    return normalizeText(
      element.dataset.pronounce ||
        element.dataset.pronounceText ||
        element.textContent
    );
  }

  function getLang(element) {
    return element.dataset.pronounceLang || config.lang;
  }

  function getVoice(lang, preferredVoiceName) {
    const list = voices.length ? voices : synth.getVoices();

    const cleanLang = String(lang || '').toLowerCase();
    const baseLang = cleanLang.split('-')[0];
    const cleanVoiceName = String(
      preferredVoiceName || config.voiceName || ''
    ).toLowerCase();

    if (cleanVoiceName) {
      const voiceByName = list.find((voice) =>
        voice.name.toLowerCase().includes(cleanVoiceName)
      );

      if (voiceByName) {
        return voiceByName;
      }
    }

    return (
      list.find((voice) => voice.lang.toLowerCase() === cleanLang) ||
      list.find((voice) => voice.lang.toLowerCase().startsWith(baseLang)) ||
      null
    );
  }

  function clearActiveElement() {
    if (currentElement) {
      currentElement.classList.remove(config.activeClass);
    }

    currentElement = null;
  }

  function stopSpeaking() {
    synth.cancel();
    clearActiveElement();
  }

  function speakElement(element) {
    const text = getText(element);

    if (!text) {
      return;
    }

    if (synth.speaking && currentElement === element) {
      stopSpeaking();
      return;
    }

    stopSpeaking();

    const lang = getLang(element);

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = lang;
    utterance.rate = toNumber(element.dataset.pronounceRate, config.rate);
    utterance.pitch = toNumber(element.dataset.pronouncePitch, config.pitch);
    utterance.volume = toNumber(element.dataset.pronounceVolume, config.volume);

    const voice = getVoice(lang, element.dataset.pronounceVoice);

    if (voice) {
      utterance.voice = voice;
    }

    utterance.onend = clearActiveElement;
    utterance.onerror = clearActiveElement;

    currentElement = element;
    element.classList.add(config.activeClass);

    setTimeout(function () {
      synth.speak(utterance);
    }, 0);
  }

  function isNativeInteractiveElement(element) {
    return element.matches(
      'a[href], button, input, textarea, select, summary, [role], [tabindex]'
    );
  }

  function prepareElement(element) {
    if (element.dataset.pronounceReady === 'true') {
      return;
    }

    element.dataset.pronounceReady = 'true';

    if (!isNativeInteractiveElement(element)) {
      element.setAttribute('role', 'button');
      element.setAttribute('tabindex', '0');
    }

    if (!element.hasAttribute('aria-label')) {
      const text = getText(element);

      if (text) {
        element.setAttribute('aria-label', 'Произнести: ' + text);
      }
    }
  }

  function refresh(root) {
    const container = root || document;

    container.querySelectorAll(config.selector).forEach(prepareElement);
  }

  document.addEventListener('click', function (event) {
    if (!(event.target instanceof Element)) {
      return;
    }

    const element = event.target.closest(config.selector);

    if (!element) {
      return;
    }

    speakElement(element);
  });

  document.addEventListener('keydown', function (event) {
    if (!(event.target instanceof Element)) {
      return;
    }

    const element = event.target.closest(config.selector);

    if (!element) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      speakElement(element);
    }
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      stopSpeaking();
    }
  });

  window.addEventListener('beforeunload', stopSpeaking);

  refresh();

  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (!(node instanceof Element)) {
          return;
        }

        if (node.matches(config.selector)) {
          prepareElement(node);
        }

        refresh(node);
      });
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  window.PronounceableSpeech = {
    speak: speakElement,
    stop: stopSpeaking,
    refresh: refresh,
  };
})();