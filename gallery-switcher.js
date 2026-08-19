/*
  gallery-switcher.js — click a number, show that project's own
  custom-built block of content below. Every other number's block
  stays hidden. No scrolling, no shared layout — each block can be
  arranged completely differently (one photo, a grid, a caption,
  whatever fits that project).

  HOW TO USE IT ON A PAGE:

  1. Nav links with a matching data-project number:

     <nav class="archive-nav">
       <a href="#" data-project="1">1</a>
       <a href="#" data-project="2">2</a>
     </nav>

  2. One panel per number, each with WHATEVER layout you want inside:

     <div class="gallery-panel" data-project="1">
       <img src="images/ceramic-1.jpg" alt="Coaster set">
     </div>

     <div class="gallery-panel" data-project="2">
       <div class="gallery-grid">
         <img src="images/ceramic-2a.jpg" alt="">
         <img src="images/ceramic-2b.jpg" alt="">
       </div>
     </div>

  That's the whole system. Arrange the INSIDE of each panel however
  you like — a single image, a grid, images with captions, text and
  photos mixed — it's just normal HTML, the same as any other part
  of the page.

  TO ADD A NEW NUMBER LATER:
  - Add one new <a data-project="9">9</a> to the nav
  - Add one new <div class="gallery-panel" data-project="9">...</div>
    anywhere below, with whatever layout you want inside it
*/

document.addEventListener('DOMContentLoaded', function () {
  const nav = document.querySelector('.archive-nav');
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

  // Show the default panel when the page loads. If one panel has
  // data-default, use that; otherwise fall back to the first one.
  const defaultPanel = document.querySelector('.gallery-panel[data-default]') || panels[0];
  showProject(defaultPanel.dataset.project);
});
