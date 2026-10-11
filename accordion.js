document.querySelectorAll('.accordion-header').forEach(function (btn) {
  btn.addEventListener('click', function () {
    btn.classList.toggle('active');
    btn.nextElementSibling.classList.toggle('open');
  });
});
