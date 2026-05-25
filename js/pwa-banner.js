(function () {
  const BASE_PATH = location.pathname.includes('/pwa-cheatsheet/')
    ? '/pwa-cheatsheet'
    : '';

  const withBase = (path) => `${BASE_PATH}${path}`;

  const BANNER_DISMISSED_KEY = 'pwaBannerDismissedAt';
  const DISMISS_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

  document.body.insertAdjacentHTML(
    'beforeend',
    `<aside class="pwa" id="pwa-banner">
      <div class="pwa__content">
        <p class="pwa__title font-m">Установите приложение</p>
        <p class="pwa__subtitle font-s">
          И&nbsp;добавьте на&nbsp;главный экран, чтобы было под рукой
        </p>
      </div>
      <div class="pwa__icon-wrapper">
        <img src="${withBase('/icons/pwa__download-icon.svg')}" />
      </div>
      <button type="button" class="pwa__close">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0001 13.4142L17.793 19.2071L19.2072 17.7928L13.4143 12L19.2072 6.20706L17.793 4.79285L12.0001 10.5857L6.20718 4.79285L4.79297 6.20706L10.5859 12L4.79297 17.7928L6.20718 19.2071L12.0001 13.4142Z" fill="white" />
        </svg>
      </button>
    </aside>

    <div class="pwa-popup" id="pwa-popup" hidden>
      <div class="pwa-popup__overlay" id="pwa-popup-overlay"></div>
      <div class="pwa-popup__content">
        <button type="button" class="pwa-popup__close" id="pwa-popup-close">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0001 13.4142L17.793 19.2071L19.2072 17.7928L13.4143 12L19.2072 6.20706L17.793 4.79285L12.0001 10.5857L6.20718 4.79285L4.79297 6.20706L10.5859 12L4.79297 17.7928L6.20718 19.2071L12.0001 13.4142Z" fill="black" />
          </svg>
        </button>
        <p class="pwa-popup__title font-xl">Создайте приложение</p>
        <p class="pwa-popup__subtitle font-s">
          Сохраните этот сайт на главный экран, чтобы не искать его в браузере
        </p>
        <div class="pwa-popup__os-toggle">
          <button type="button" class="os-toggle__ios font-s" id="os-toggle-ios">iOS</button>
          <button type="button" class="os-toggle__android font-s" id="os-toggle-android">Android</button>
        </div>
        <section class="pwa-popup__guide">
          <div class="guide__content guide__content--android">
            <ol class="guide__content-list">
              <li>Откройте эту ссылку в Chrome</li>
              <li>
                <span class="--vertical-align --gap8">
                  Нажмите на панели сверху
                  <svg xmlns="http://www.w3.org/2000/svg" width="4" height="15" viewBox="0 0 4 15" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M-6.87009e-08 1.66667C-3.07584e-08 0.746192 0.746192 3.26171e-08 1.66667 7.28523e-08C2.58714 1.13088e-07 3.33333 0.746192 3.33333 1.66667C3.33333 2.58714 2.58714 3.33333 1.66667 3.33333C0.746192 3.33333 -1.06643e-07 2.58714 -6.87009e-08 1.66667ZM-3.07078e-07 7.5C-2.69136e-07 6.57952 0.746192 5.83333 1.66667 5.83333C2.58714 5.83333 3.33333 6.57952 3.33333 7.5C3.33333 8.42047 2.58714 9.16667 1.66667 9.16667C0.746192 9.16667 -3.45021e-07 8.42047 -3.07078e-07 7.5ZM1.66667 11.6667C0.746192 11.6667 -5.07513e-07 12.4129 -5.45456e-07 13.3333C-5.83398e-07 14.2538 0.746192 15 1.66667 15C2.58714 15 3.33333 14.2538 3.33333 13.3333C3.33333 12.4129 2.58714 11.6667 1.66667 11.6667Z" fill="black" />
                  </svg>
                </span>
              </li>
              <li>Выберите «Добавить на главный экран»</li>
            </ol>
          </div>
          <div class="guide__content guide__content--ios">
            <ol class="guide__content-list">
              <li>Откройте эту ссылку в Safari</li>
              <li>
                <span class="--vertical-align --gap8">
                  Нажмите на панели внизу
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M6.23587 18C5.49058 18 4.93043 17.8149 4.55541 17.4446C4.18514 17.0791 4 16.5284 4 15.7926V8.76458C4 8.02878 4.18514 7.47812 4.55541 7.11259C4.93043 6.74232 5.49058 6.55719 6.23587 6.55719H8.41478V7.7036H6.25011C5.89408 7.7036 5.62112 7.79855 5.43124 7.98843C5.24136 8.17356 5.14642 8.45127 5.14642 8.82154V15.7356C5.14642 16.1059 5.24136 16.3836 5.43124 16.5688C5.62112 16.7586 5.89408 16.8536 6.25011 16.8536H14.3818C14.7331 16.8536 15.0061 16.7586 15.2007 16.5688C15.3953 16.3836 15.4927 16.1059 15.4927 15.7356V8.82154C15.4927 8.45127 15.3953 8.17356 15.2007 7.98843C15.0061 7.79855 14.7331 7.7036 14.3818 7.7036H12.2172V6.55719H14.4032C15.1485 6.55719 15.7063 6.74232 16.0765 7.11259C16.4516 7.47812 16.6391 8.02878 16.6391 8.76458V15.7926C16.6391 16.5284 16.4516 17.0791 16.0765 17.4446C15.7063 17.8149 15.1485 18 14.4032 18H6.23587ZM10.316 12.4174C10.1641 12.4174 10.0312 12.3629 9.91722 12.2537C9.80804 12.1445 9.75345 12.0163 9.75345 11.8692V4.62038L9.79617 3.55941L9.39742 3.97953L8.29373 5.15443C8.19404 5.26836 8.06349 5.32532 7.90209 5.32532C7.75493 5.32532 7.63151 5.27785 7.53182 5.18291C7.43688 5.08797 7.38941 4.96929 7.38941 4.82688C7.38941 4.68922 7.44637 4.56342 7.5603 4.44949L9.90298 2.18514C9.97893 2.11393 10.0478 2.06646 10.1095 2.04272C10.1759 2.01424 10.2448 2 10.316 2C10.3919 2 10.4608 2.01424 10.5225 2.04272C10.5889 2.06646 10.6578 2.11393 10.729 2.18514L13.0788 4.44949C13.188 4.56342 13.2425 4.68922 13.2425 4.82688C13.2425 4.96929 13.1927 5.08797 13.093 5.18291C12.9933 5.27785 12.8699 5.32532 12.7227 5.32532C12.5661 5.32532 12.4379 5.26836 12.3382 5.15443L11.2417 3.97953L10.8429 3.55941L10.8856 4.62038V11.8692C10.8856 12.0163 10.8287 12.1445 10.7147 12.2537C10.6055 12.3629 10.4726 12.4174 10.316 12.4174Z" fill="black" />
                  </svg>
                </span>
              </li>
              <li>Выберите пункт «На экран "Домой"»</li>
            </ol>
          </div>
        </section>
      </div>
    </div>`
  );

  const pwaBanner = document.getElementById('pwa-banner');
  const pwaPopup = document.getElementById('pwa-popup');
  const pwaPopupClose = document.getElementById('pwa-popup-close');
  const pwaPopupOverlay = document.getElementById('pwa-popup-overlay');
  const pwaBannerClose = pwaBanner.querySelector('.pwa__close');

  const dismissedAt = localStorage.getItem(BANNER_DISMISSED_KEY);
  if (dismissedAt && Date.now() - Number(dismissedAt) < DISMISS_DURATION_MS) {
    pwaBanner.hidden = true;
  }

  pwaBannerClose.addEventListener('click', (e) => {
    e.stopPropagation();
    localStorage.setItem(BANNER_DISMISSED_KEY, Date.now());
    pwaBanner.hidden = true;
  });

  pwaBanner.addEventListener('click', () => {
    pwaPopup.hidden = false;
  });

  pwaPopupClose.addEventListener('click', () => {
    pwaPopup.hidden = true;
  });

  pwaPopupOverlay.addEventListener('click', () => {
    pwaPopup.hidden = true;
  });

  const osToggleIos = document.getElementById('os-toggle-ios');
  const osToggleAndroid = document.getElementById('os-toggle-android');
  const guideAndroid = document.querySelector('.guide__content--android');
  const guideIos = document.querySelector('.guide__content--ios');

  function setActiveOs(os) {
    const isIos = os === 'ios';
    osToggleIos.classList.toggle('active', isIos);
    osToggleAndroid.classList.toggle('active', !isIos);
    guideIos.hidden = !isIos;
    guideAndroid.hidden = isIos;
  }

  osToggleIos.addEventListener('click', () => setActiveOs('ios'));
  osToggleAndroid.addEventListener('click', () => setActiveOs('android'));

  setActiveOs('ios');
})();