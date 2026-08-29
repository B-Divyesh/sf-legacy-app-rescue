const home = document.querySelector('[data-home-handoff]');

home?.addEventListener('click', () => {
  sessionStorage.setItem('legacy-app-rescue:focus-home', 'true');
});
