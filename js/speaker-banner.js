document.addEventListener("DOMContentLoaded", () => {
  const storageKey = "speakerPopupHidden";

  const popupPreviewSrc = "../imgs/speaker-popup__preview.svg";
  const bannerIconSrc = "../icons/speaker__icon.svg";

  const isPopupHiddenForever = localStorage.getItem(storageKey) === "true";

  const addSpeakerPopup = () => {
    if (document.getElementById("speaker-popup")) return;

    const popupHTML = `
      <div class="speaker-popup" id="speaker-popup" hidden>
        <div class="speaker-popup__overlay" id="speaker-popup-overlay"></div>

        <div class="speaker-popup__content">
          <button
            type="button"
            class="speaker-popup__close"
            id="speaker-popup-close"
            aria-label="Закрыть">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12.0001 13.4142L17.793 19.2071L19.2072 17.7928L13.4143 12L19.2072 6.20706L17.793 4.79285L12.0001 10.5857L6.20718 4.79285L4.79297 6.20706L10.5859 12L4.79297 17.7928L6.20718 19.2071L12.0001 13.4142Z"
                fill="black" />
            </svg>
          </button>

          <p class="speaker-popup__title font-xl">
            В разделе доступно прослушивание английского текста
          </p>

          <p class="speaker-popup__subtitle font-xs">
            Нажми на подчёркнутый текст, чтобы услышать, как он произносится
          </p>

          <img
            class="speaker-popup__preview"
            aria-hidden="true"
            src="${popupPreviewSrc}"
            alt="Пример прослушивания текста" />

          <label class="speaker-popup__checkbox font-xs">
            <input type="checkbox" id="speaker-popup-checkbox" />
            <span>Больше не показывать</span>
          </label>

          <button
            type="button"
            class="speaker-popup__button font-s"
            id="speaker-popup-button">
            Попробовать
          </button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", popupHTML);
  };

  const initSpeakerPopup = () => {
    const popup = document.getElementById("speaker-popup");
    const closeButton = document.getElementById("speaker-popup-close");
    const tryButton = document.getElementById("speaker-popup-button");
    const checkbox = document.getElementById("speaker-popup-checkbox");
    const overlay = document.getElementById("speaker-popup-overlay");

    if (!popup || !closeButton || !tryButton || !checkbox) return;

    if (!isPopupHiddenForever) {
      popup.hidden = false;
    }

    const closePopup = () => {
      if (checkbox.checked) {
        localStorage.setItem(storageKey, "true");
      }

      popup.hidden = true;
    };

    closeButton.addEventListener("click", closePopup);
    tryButton.addEventListener("click", closePopup);

    if (overlay) {
      overlay.addEventListener("click", closePopup);
    }
  };

 const addSpeakerBanners = () => {
  const cheatsItems = document.querySelectorAll(".cheats__item");

  cheatsItems.forEach((item) => {
  //  Для исключений:
  //  - CSS class: "no-speaker-banner"
  //  - data attribute: data-no-speaker-banner="true"
  if (item.classList.contains("no-speaker-banner") || item.dataset.noSpeakerBanner === "true") return;

  if (item.querySelector(".speaker-banner")) return;

    const bannerHTML = `
      <div class="speaker-banner">
        <div class="speaker-banner__text font-s">
          Нажми на подчёркнутый текст, чтобы услышать, как он произносится
        </div>
        <img src="${bannerIconSrc}" alt="" aria-hidden="true" />
      </div>
    `;

    const title = item.querySelector(":scope > .cheat__title");

    if (title) {
      title.insertAdjacentHTML("afterend", bannerHTML);
      return;
    }

    const firstElement = item.firstElementChild;

    if (firstElement) {
      firstElement.insertAdjacentHTML("afterend", bannerHTML);
    } else {
      item.insertAdjacentHTML("afterbegin", bannerHTML);
    }
  });
};

  addSpeakerBanners();

  if (!isPopupHiddenForever) {
    addSpeakerPopup();
    initSpeakerPopup();
  }
});