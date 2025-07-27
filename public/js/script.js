document.addEventListener('DOMContentLoaded', function () {
  const toggleButton = document.querySelector('.navbar-toggler');
  const navbarCollapse = document.getElementById('navbarNavAltMarkup');
  const dropdownToggle = document.querySelector('#navbarDropdown');
  const darkToggle = document.getElementById('dark-mode-toggle');

  // Initialize Bootstrap dropdown explicitly
  if (dropdownToggle) {
    new bootstrap.Dropdown(dropdownToggle);
  }

  // Dark Mode Logic
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let theme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
  if (theme === 'light') {
    document.body.classList.add('light-mode');
  } else {
    document.body.classList.remove('light-mode');
  }

  darkToggle.addEventListener('click', function () {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
    darkToggle.textContent = document.body.classList.contains('light-mode') ? 'Dark Mode' : 'Light Mode';
  });

  // Close navbar when clicking outside, but exclude dropdown
  document.addEventListener('click', function (event) {
    const isNavbarOpen = navbarCollapse.classList.contains('show');
    const isClickInsideNavbar = navbarCollapse.contains(event.target) || toggleButton.contains(event.target);
    const isClickInsideDropdown = dropdownToggle && (dropdownToggle.contains(event.target) || dropdownToggle.nextElementSibling.contains(event.target));

    if (isNavbarOpen && !isClickInsideNavbar && !isClickInsideDropdown) {
      const collapseInstance = bootstrap.Collapse.getInstance(navbarCollapse);
      if (collapseInstance) {
        collapseInstance.hide();
      } else {
        new bootstrap.Collapse(navbarCollapse, { toggle: false }).hide();
      }
    }
  });
});
