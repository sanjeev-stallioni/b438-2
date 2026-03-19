class BlogPostsJSON {
  data() {
    return {
      permalink: "/blog/posts.json",
      eleventyExcludeFromCollections: true,
    };
  }

  render(data) {
    const posts = data.collections.posts.map((post) => ({
      title: post.data.title,
      url: post.url,
      image: post.data.image || null,
      excerpt: this.excerpt(post.templateContent),
    }));
    return JSON.stringify(posts);
  }

  excerpt(content) {
    if (!content) return "";
    const text = content.replace(/<[^>]+>/g, "").trim().split(/\s+/);
    return text.length > 35 ? text.slice(0, 35).join(" ") + "..." : text.join(" ");
  }
}

module.exports = BlogPostsJSON;
