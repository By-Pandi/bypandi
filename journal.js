/*
  journal.js — powers the Journal page:
  - clicking a post expands it (with a 1.5s colored loading screen)
  - clicking - or x collapses it back (with a 1.5s white loading screen)
  - search filters posts live, and clears any active topic chip
  - clicking a topic chip filters posts, and clears the search box
  - the pink scroll rail scrolls the feed and shows a live thumb

  TO ADD A NEW POST LATER: copy one whole .journal-post block in
  journal.html, give it a new data-topic, and edit the text/images
  inside .post-collapsed and .post-expanded. Nothing here needs to
  change — this script works on however many posts exist.
*/

document.addEventListener('DOMContentLoaded', function () {
  const posts = document.querySelectorAll('.journal-post');

  // ---- Expand / collapse each post, with the loading transition ----
  posts.forEach(function (post) {
    const collapsed = post.querySelector('.post-collapsed');
    const expanded = post.querySelector('.post-expanded');
    const loading = post.querySelector('.post-loading');
    const loadingLogo = loading.querySelector('.loading-logo');
    const topicColor = post.style.getPropertyValue('--topic-color');

    function runLoading(bgColor, logoColor, thenShow) {
      collapsed.hidden = true;
      expanded.hidden = true;
      loading.hidden = false;
      loading.style.background = bgColor;
      loadingLogo.style.color = logoColor;

      setTimeout(function () {
        loading.hidden = true;
        thenShow.hidden = false;
      }, 1500);
    }

    collapsed.addEventListener('click', function () {
      runLoading(topicColor, '#ffffff', expanded);
    });

    post.querySelectorAll('.post-minimize, .post-close').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        runLoading('#ffffff', '#111111', collapsed);
      });
    });
  });

  // ---- Search + topic filter (mutually exclusive) ----
  const searchInput = document.querySelector('.search-box');
  const topicChips = document.querySelectorAll('.topic-chip');

  function applyFilter(topic, searchText) {
    posts.forEach(function (post) {
      const matchesTopic = !topic || post.dataset.topic === topic;
      const text = post.textContent.toLowerCase();
      const matchesSearch = !searchText || text.includes(searchText.toLowerCase());
      post.style.display = (matchesTopic && matchesSearch) ? '' : 'none';
    });
  }

  searchInput.addEventListener('input', function () {
    topicChips.forEach(function (c) { c.classList.remove('active'); });
    applyFilter(null, searchInput.value);
  });

  topicChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      const alreadyActive = chip.classList.contains('active');
      searchInput.value = '';
      topicChips.forEach(function (c) { c.classList.remove('active'); });

      if (alreadyActive) {
        applyFilter(null, '');
      } else {
        chip.classList.add('active');
        applyFilter(chip.dataset.topic, '');
      }
    });
  });

  // ---- Custom scroll rail ----
  const feed = document.getElementById('journal-feed');
  const track = document.querySelector('.scroll-track');
  const thumb = document.querySelector('.scroll-thumb');
  const upBtn = document.querySelector('.scroll-up');
  const downBtn = document.querySelector('.scroll-down');

  function updateThumb() {
    const trackHeight = track.clientHeight;
    const ratio = feed.clientHeight / feed.scrollHeight;
    const thumbHeight = Math.max(ratio * trackHeight, 20);
    const maxScroll = feed.scrollHeight - feed.clientHeight;
    const scrollRatio = maxScroll > 0 ? feed.scrollTop / maxScroll : 0;

    thumb.style.height = thumbHeight + 'px';
    thumb.style.top = (scrollRatio * (trackHeight - thumbHeight)) + 'px';
  }

  feed.addEventListener('scroll', updateThumb);
  window.addEventListener('resize', updateThumb);
  updateThumb();

  upBtn.addEventListener('click', function () {
    feed.scrollBy({ top: -120, behavior: 'smooth' });
  });

  downBtn.addEventListener('click', function () {
    feed.scrollBy({ top: 120, behavior: 'smooth' });
  });
});
