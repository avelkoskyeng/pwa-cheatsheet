// Автоматически определяет базовый путь для работы локально и на GitHub Pages
(function() {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  

  if (hostname === '127.0.0.1' || hostname === 'localhost') {
    // local
    window.BASE_PATH = '';
  } else if (hostname === 'avelkoskyeng.github.io') {
    // GitHub Pages
    window.BASE_PATH = '/pwa-cheatsheet';
  } else {
    // other
    const pathParts = pathname.split('/').filter(Boolean);
    if (pathParts.length > 0 && pathParts[0] !== 'pages') {
      window.BASE_PATH = '/' + pathParts[0];
    } else {
      window.BASE_PATH = '';
    }
  }
  
  console.log('BASE_PATH set to:', window.BASE_PATH);
})();
