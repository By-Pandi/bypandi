/*
  pager.js — reusable prev/next image viewer with a page counter.

  HOW TO USE IT ON ANY PAGE:
  1. Include this file with: <script src="pager.js"></script>
  2. Add HTML like this wherever you want a viewer:

     <div class="pager" data-images="images/one.jpg,images/two.jpg,images/three.jpg">
       <button class="pager-prev" aria-label="Previous">←</button>
       <img class="pager-image" src="images/one.jpg" alt="">
       <button class="pager-next" aria-label="Next">→</button>
     </div>
     <p class="pager-counter"><span class="pager-current">1</span> / <span class="pager-total">3</span></p>

  You can list any number of images, comma-separated, in data-images.
  You can also have MULTIPLE pagers on the same page (e.g. one per
  ceramic piece) — each one works independently, with its own count.
*/

document.querySelectorAll('.pager').forEach(function (pager) {
  const images = pager.dataset.images.split(',').map(function (s) {
    return s.trim();
  });

  let index = 0;

  const imageEl = pager.querySelector('.pager-image');
  const prevBtn = pager.querySelector('.pager-prev');
  const nextBtn = pager.querySelector('.pager-next');

  // The counter paragraph is expected right after the pager div
  const counterWrap = pager.nextElementSibling;
  const currentEl = counterWrap ? counterWrap.querySelector('.pager-current') : null;
  const totalEl = counterWrap ? counterWrap.querySelector('.pager-total') : null;

  function update() {
    imageEl.src = images[index];
    if (currentEl) currentEl.textContent = index + 1;
    if (totalEl) totalEl.textContent = images.length;
  }

  prevBtn.addEventListener('click', function () {
    index = (index - 1 + images.length) % images.length;
    update();
  });

  nextBtn.addEventListener('click', function () {
    index = (index + 1) % images.length;
    update();
  });

  update();
});
