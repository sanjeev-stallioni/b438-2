class CategoryJSON {
  data() {
    return {
      pagination: {
        data: "collections.categoryMap",
        size: 1,
        alias: "cat",
      },
      permalink: (data) => `/category/${data.cat.slug}/posts.json`,
      eleventyExcludeFromCollections: true,
    };
  }

  render(data) {
    const posts = data.cat.posts.map((post) => ({
      title: post.data.title,
      url: post.url,
      image: post.data.image || null,
      excerpt: this.excerpt(post.templateContent),
      date: this.dateDisplay(post.date),
      category: post.data.category || null,
      categories: post.data.categories || null,
      categoryLinks: this.buildCategoryLinks(post.data),
    }));
    return JSON.stringify(posts);
  }

  excerpt(content) {
    if (!content) return "";
    const text = content.replace(/<[^>]+>/g, "").trim().split(/\s+/);
    return text.length > 35 ? text.slice(0, 35).join(" ") + "..." : text.join(" ");
  }

  dateDisplay(date) {
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
  }

  slugify(str) {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  buildCategoryLinks(postData) {
    const cats = [];
    if (postData.categories) {
      postData.categories.forEach((c) => {
        cats.push({ name: c, slug: this.slugify(c) });
      });
    } else if (postData.category) {
      cats.push({ name: postData.category, slug: this.slugify(postData.category) });
    }
    return cats;
  }
}

module.exports = CategoryJSON;
