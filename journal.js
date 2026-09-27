/*
  journal.js — builds the Journal feed from the journalPosts list
  (defined in journal.html, right before this file is loaded), then
  powers all the interactions: expand/collapse with a full-box
  loading screen, search, topic filtering, and the custom scroll rail.

  TO ADD A NEW POST: open journal.html, find the journalPosts array,
  copy one entry, and fill in your own topic/date/location/title/
  body. Nothing in THIS file needs to change.

  Clicking a post: the whole feed box flashes that post's topic
  color with the logo for 1.5s, then that post takes over the whole
  box (other posts hide) — scrolling inside it if it's long. Clicking
  - or x does the same in reverse (white flash, black logo) back to
  the list.
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
      '</div>';

    feed.appendChild(el);
  });

  // ---- Shared full-box loading overlay ----
  const loading = document.getElementById('feed-loading');
  const loadingLogo = loading.querySelector('.loading-logo');

  function runLoading(bgColor, logoColor, then) {
    loading.hidden = false;
    loading.style.background = bgColor;
    loadingLogo.style.color = logoColor;

    setTimeout(function () {
      loading.hidden = true;
      then();
    }, 1000);
  }

  // ---- Expand takes over the whole feed box; collapse returns to the list ----
  const posts = feed.querySelectorAll('.journal-post');

  posts.forEach(function (post) {
    const content = post.querySelector('.post-content');
    const topicColor = post.style.getPropertyValue('--topic-color');

    content.addEventListener('click', function () {
      if (post.classList.contains('is-expanded')) return;
      runLoading(topicColor, '#ffffff', function () {
        feed.classList.add('has-expanded');
        post.classList.add('is-expanded');
        feed.scrollTop = 0;
      });
    });

    post.querySelectorAll('.post-minimize, .post-close').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        runLoading('#ffffff', '#111111', function () {
          feed.classList.remove('has-expanded');
          post.classList.remove('is-expanded');
        });
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
