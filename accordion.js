/*
  accordion.js — click a header row, its content expands below it.
  Click the same header again, it collapses back. Each item works
  independently — opening one doesn't close the others.

  HOW TO USE IT ON A PAGE:

  1. Include this file: <script src="accordion.js"></script>

  2. Add HTML like this, one block per item:

     <div class="accordion-item">
       <button class="accordion-header">Draft 1 →</button>
       <div class="accordion-content">
         <img src="images/draft1.jpg" alt="Draft 1">
       </div>
     </div>

  Add as many .accordion-item blocks as you want — each one works
  on its own automatically, no changes needed to this file.
*/

document.querySelectorAll('.accordion-header').forEach(function (header) {
  header.addEventListener('click', function () {
    header.closest('.accordion-item').classList.toggle('open');
  });
});
