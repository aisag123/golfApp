(() => {
  const DEFAULT_API_BASE_URL = "https://golfapp-1-o233.onrender.com";

  // Optional override for testing: localStorage.setItem('apiBaseUrl', 'http://localhost:8000')
  const storedApiBaseUrl = localStorage.getItem("apiBaseUrl");

  window.APP_CONFIG = {
    API_BASE_URL: storedApiBaseUrl || DEFAULT_API_BASE_URL,
  };
})();
