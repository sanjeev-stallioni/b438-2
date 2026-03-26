(function () {
  var container = document.getElementById("blogPostsColumn");
  if (!container) return;

  var perPage = parseInt(container.getAttribute("data-per-page"), 10) || 5;
  var total = parseInt(container.getAttribute("data-total"), 10) || 0;
  var categorySlug = container.getAttribute("data-category") || null;
  var loadingText = document.getElementById("blogLoadingText");
  var loaded = perPage;
  var allPosts = null;
  var fetching = false;
  var isCategory = !!categorySlug;

  if (loaded >= total || !loadingText) return;

  // Determine JSON endpoint
  var jsonUrl = isCategory
    ? "/category/" + categorySlug + "/posts.json"
    : "/blog/posts.json";

  var linkSvg =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>';
  var searchSvg =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';

  var delay = 800;

  function createCard(post) {
    if (isCategory) {
      var wrapper = document.createElement("div");
      wrapper.className = "blog-card-category blog-card-fadein";

      var html = '<article class="blog-card">';
      if (post.image) {
        html +=
          '<div class="blog-card-image">' +
          '<img src="' + post.image + '" alt="' + escapeHtml(post.title) + '" loading="lazy">' +
          '<div class="blog-card-overlay">' +
          '<div class="blog-card-overlay-icons">' +
          '<a href="' + post.url + '" class="blog-card-overlay-icon flex-center" aria-label="View post">' + linkSvg + "</a>" +
          '<button class="blog-card-overlay-icon lightbox-trigger flex-center" data-image="' + post.image + '" aria-label="View image">' + searchSvg + "</button>" +
          "</div>" +
          '<p class="blog-card-overlay-title">' + escapeHtml(post.title) + "</p>" +
          "</div>" +
          "</div>";
      }
      html += '<div class="blog-card-body">';
      html += '<h2 class="blog-card-title"><a href="' + post.url + '" class="link-secondary">' + escapeHtml(post.title) + "</a></h2>";
      html += '<p class="blog-card-excerpt">' + escapeHtml(post.excerpt) + ' <a href="' + post.url + '" class="blog-card-link link-secondary">[...]</a></p>';
      html += "</div></article>";

      var catLinks = "";
      if (post.categoryLinks && post.categoryLinks.length) {
        catLinks = post.categoryLinks
          .map(function (c) { return '<a href="/category/' + c.slug + '/" class="link-secondary">' + escapeHtml(c.name) + "</a>"; })
          .join(", ");
      }
      html +=
        '<div class="blog-card-footer">' +
        '<span class="blog-card-date">' + escapeHtml(post.date) + " | " + catLinks + "</span>" +
        '<a href="' + post.url + '" class="blog-card-readmore link-secondary">Read More</a>' +
        "</div>";

      wrapper.innerHTML = html;
      return wrapper;
    }

    var article = document.createElement("article");
    article.className = "blog-card blog-card-fadein";

    var html = "";
    if (post.image) {
      html +=
        '<div class="blog-card-image">' +
        '<img src="' + post.image + '" alt="' + escapeHtml(post.title) + '" loading="lazy">' +
        '<div class="blog-card-overlay">' +
        '<div class="blog-card-overlay-icons">' +
        '<a href="' + post.url + '" class="blog-card-overlay-icon flex-center" aria-label="View post">' + linkSvg + "</a>" +
        '<button class="blog-card-overlay-icon lightbox-trigger flex-center" data-image="' + post.image + '" aria-label="View image">' + searchSvg + "</button>" +
        "</div>" +
        '<p class="blog-card-overlay-title">' + escapeHtml(post.title) + "</p>" +
        "</div>" +
        "</div>";
    }

    html += '<div class="blog-card-body">';
    html += '<h2 class="blog-card-title"><a href="' + post.url + '" class="link-secondary">' + escapeHtml(post.title) + "</a></h2>";
    html += '<p class="blog-card-excerpt">' + escapeHtml(post.excerpt) + ' <a href="' + post.url + '" class="blog-card-link link-secondary">[...]</a></p>';
    html += "</div>";

    article.innerHTML = html;
    return article;
  }

  function escapeHtml(str) {
    if (!str) return "";
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function appendBatch() {
    if (!allPosts || loaded >= allPosts.length) return;

    var end = Math.min(loaded + perPage, allPosts.length);
    for (var i = loaded; i < end; i++) {
      container.insertBefore(createCard(allPosts[i]), loadingText);
    }
    loaded = end;

    if (loaded >= allPosts.length) {
      loadingText.style.display = "none";
    }
  }

  function loadMore() {
    if (fetching) return;
    fetching = true;
    loadingText.classList.add("is-loading");

    if (allPosts) {
      setTimeout(function () {
        loadingText.classList.remove("is-loading");
        appendBatch();
        fetching = false;
      }, delay);
      return;
    }

    fetch(jsonUrl)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        allPosts = data;
        setTimeout(function () {
          loadingText.classList.remove("is-loading");
          appendBatch();
          fetching = false;
        }, delay);
      })
      .catch(function () {
        loadingText.classList.remove("is-loading");
        fetching = false;
      });
  }

  var observer = new IntersectionObserver(
    function (entries) {
      if (entries[0].isIntersecting && loaded < total) {
        loadMore();
      }
    },
    { rootMargin: "300px" }
  );

  observer.observe(loadingText);
})();
