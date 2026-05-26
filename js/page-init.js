document.addEventListener('DOMContentLoaded', function() {
  // return btn
  const returnBtn = document.querySelector('.header__return-btn');
  if (returnBtn && window.BASE_PATH) {
    returnBtn.href = window.BASE_PATH + '/';
  }
});
