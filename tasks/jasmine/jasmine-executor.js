var currentWindowOnload = window.onload;

window.onload = function() {
  if (currentWindowOnload) {
    currentWindowOnload();
  }
  executeJasmine();
};
