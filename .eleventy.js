module.exports = function (eleventyConfig) {
  // Pass through static assets and existing HTML pages
  eleventyConfig.addPassthroughCopy("assets");

  // Date formatting filter (Italian style: "Febbraio 17th, 2026")
  eleventyConfig.addFilter("dateDisplay", function (date) {
    const d = new Date(date);
    const months = [
      "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
      "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
    ];
    const day = d.getDate();
    const suffix =
      day === 1 || day === 21 || day === 31 ? "st"
      : day === 2 || day === 22 ? "nd"
      : day === 3 || day === 23 ? "rd"
      : "th";
    return `${months[d.getMonth()]} ${day}${suffix}, ${d.getFullYear()}`;
  });

  // Excerpt filter — first 35 words of content
  eleventyConfig.addFilter("excerpt", function (content) {
    if (!content) return "";
    const words = content.replace(/<[^>]+>/g, "").trim().split(/\s+/);
    return words.length > 35 ? words.slice(0, 35).join(" ") + "..." : words.join(" ");
  });

  // Split filter — split content at <!-- split --> marker
  eleventyConfig.addFilter("split", function (content, separator) {
    if (!content) return [""];
    return content.split(separator);
  });

  // Collection: blog posts sorted by date (newest first)
  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("blog/posts/*.md").sort((a, b) => {
      return b.date - a.date;
    });
  });

  // Slugify filter for category URLs
  eleventyConfig.addFilter("slugify", function (str) {
    return str
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  });

  // Collection: categories extracted from posts, sorted alphabetically
  eleventyConfig.addCollection("categories", function (collectionApi) {
    const cats = new Set();
    collectionApi.getFilteredByGlob("blog/posts/*.md").forEach((post) => {
      if (post.data.category) {
        cats.add(post.data.category);
      }
      if (post.data.categories) {
        post.data.categories.forEach((cat) => cats.add(cat));
      }
    });
    return [...cats].sort();
  });

  // Collection: categoryMap — { slug, name, posts[] } for each category
  eleventyConfig.addCollection("categoryMap", function (collectionApi) {
    const map = {};
    const posts = collectionApi.getFilteredByGlob("blog/posts/*.md").sort((a, b) => b.date - a.date);
    function slugify(str) {
      return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    posts.forEach((post) => {
      const cats = [];
      if (post.data.category) cats.push(post.data.category);
      if (post.data.categories) cats.push(...post.data.categories);
      cats.forEach((cat) => {
        const slug = slugify(cat);
        if (!map[slug]) map[slug] = { slug, name: cat, posts: [] };
        map[slug].posts.push(post);
      });
    });
    return Object.values(map).sort((a, b) => a.name.localeCompare(b.name));
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    templateFormats: ["njk", "md", "html", "11ty.js"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
