/*
  journal.js — builds the Journal feed from the journalPosts list
  (defined in journal.html, right before this file is loaded), then
  powers all the interactions: expand/collapse with loading screens,
  search, topic filtering, and the custom scroll rail.

  TO ADD A NEW POST: open journal.html, find the journalPosts array,
  copy one entry, and fill in your own topic/date/location/title/
  body. Nothing in THIS file needs to change.

  Each post is written ONCE — there's no separate "preview" text to
  keep in sync. When collapsed, CSS clips the content to a peek and
  fades it out; clicking expands it to full height. Write "body" as
  paragraphs (<p>...</p>), and drop an image in anywhere with:
    <img src="images/yourphoto.jpg" alt="">
    <p class="post-image-caption">Optional caption</p>
*/

document.addEventListener('DOMContentLoaded', function () {
  const feed = document.getElementById('journal-feed');
  if (!feed || typeof journalPosts === 'undefined') return;

  const pandaLogoSVG = '<svg viewBox="0 0 1124 623" preserveAspectRatio="xMidYMid meet"><use href="#pandi-logo"></use></svg>';

  const topicColors = {
    reviews: 'var(--color-pink)',
    diary: 'var(--color-green)',
    exploration: 'var(--color-red)'
  };

  // ---- Build every post's DOM from the data list ----
  journalPosts.forEach(function (post) {
    const el = document.createElement('div');
    el.className = 'journal-post';
    el.dataset.topic = post.topic;
    el.style.setProperty('--topic-color', topicColors[post.topic] || 'var(--color-black)');

    el.innerHTML =
      '<div class="post-header">' +
        '<span class="post-logo">' + pandaLogoSVG + '</span>' +
        '<span class="post-controls">' +
          '<button class="post-btn post-minimize">─</button>' +
          '<button class="post-btn post-close">✕</button>' +
        '</span>' +
      '</div>' +
      '<div class="post-meta-row"><span>' + post.date + '</span><span>' + post.location + '</span></div>' +
      '<div class="post-content">' +
        '<h3 class="post-title">' + post.title + '</h3>' +
        post.body +
      '</div>' +
      '<div class="post-loading" hidden><div class="loading-logo">' + pandaLogoSVG + '</div></div>';

    feed.appendChild(el);
  });

  // ---- Expand / collapse, with the loading transition ----
  const posts = feed.querySelectorAll('.journal-post');

  posts.forEach(function (post) {
    const content = post.querySelector('.post-content');
    const loading = post.querySelector('.post-loading');
    const loadingLogo = loading.querySelector('.loading-logo');
    const topicColor = post.style.getPropertyValue('--topic-color');

    function runLoading(bgColor, logoColor, expand) {
      loading.hidden = false;
      loading.style.background = bgColor;
      loadingLogo.style.color = logoColor;

      setTimeout(function () {
        loading.hidden = true;
        post.classList.toggle('is-expanded', expand);
      }, 1500);
    }

    content.addEventListener('click', function () {
      if (post.classList.contains('is-expanded')) return; // already open, clicks on text don't collapse it
      runLoading(topicColor, '#ffffff', true);
    });

    post.querySelectorAll('.post-minimize, .post-close').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        runLoading('#ffffff', '#111111', false);
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
