/*
  gallery-switcher.js — click a number, show that project's own
  custom-built block of content below. Every other number's block
  stays hidden. No scrolling.

  TO ADD A NEW NUMBER LATER:
  - Add one new <a data-project="9">9</a> to the nav
  - Add one new <div class="gallery-panel" data-project="9">...</div>
    anywhere below, with whatever images you want inside it
*/

document.addEventListener('DOMContentLoaded', function () {
  const nav = document.querySelector('.gallery-nav');
  const panels = document.querySelectorAll('.gallery-panel');
  if (!nav || !panels.length) return;

  function showProject(number) {
    panels.forEach(function (panel) {
      panel.classList.toggle('active', panel.dataset.project === String(number));
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.classList.toggle('active', link.dataset.project === String(number));
    });
  }

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      showProject(link.dataset.project);
    });
  });

  const defaultPanel = document.querySelector('.gallery-panel[data-default]') || panels[0];
  showProject(defaultPanel.dataset.project);
});
