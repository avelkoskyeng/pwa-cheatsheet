document.addEventListener('DOMContentLoaded', function() {
  // return btn
  const returnBtn = document.querySelector('.header__return-btn');
  if (returnBtn && window.BASE_PATH) {
    returnBtn.href = window.BASE_PATH + '/';
  }

  if (!window.location.pathname.includes('/offline.html')) {
    const existingScrollBtn = document.getElementById('scroll-to-top');
    if (!existingScrollBtn) {
      const scrollContainer = document.createElement('div');
      scrollContainer.className = 'scroll-up__container';
      scrollContainer.setAttribute('aria-hidden', 'true');

      const scrollButton = document.createElement('button');
      scrollButton.className = 'scroll-up__button';
      scrollButton.id = 'scroll-to-top';
      scrollButton.type = 'button';
      scrollButton.title = 'Наверх';

      const scrollIcon = document.createElement('img');
      scrollIcon.src = '../icons/scroll-up__btn.svg';
      scrollIcon.alt = 'Наверх';

      scrollButton.appendChild(scrollIcon);
      scrollButton.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      scrollContainer.appendChild(scrollButton);
      document.body.appendChild(scrollContainer);
    }
  }
});
