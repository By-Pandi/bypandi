/*
  pager.js — prev/next image viewer with a page counter.
  Works for any number of images listed in data-images.
*/

document.querySelectorAll('.pager').forEach(function (pager) {
  const images = pager.dataset.images.split(',').map(function (s) {
    return s.trim();
  });

  let index = 0;

  const imageEl = pager.querySelector('.pager-image');
  const counterWrap = pager.nextElementSibling;
  const currentEl = counterWrap ? counterWrap.querySelector('.pager-current') : null;
  const totalEl = counterWrap ? counterWrap.querySelector('.pager-total') : null;
  const prevBtn = pager.querySelector('.pager-prev') || (counterWrap && counterWrap.querySelector('.pager-prev'));
  const nextBtn = pager.querySelector('.pager-next') || (counterWrap && counterWrap.querySelector('.pager-next'));

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
