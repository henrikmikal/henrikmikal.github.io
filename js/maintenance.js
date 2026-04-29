(function () {
  const maintenanceEnabled = Boolean(window.siteConfig && window.siteConfig.maintenanceMode);

  document.documentElement.classList.toggle('maintenance-mode', maintenanceEnabled);
})();
