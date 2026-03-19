module.exports = {
  tags: "posts",
  eleventyComputed: {
    layout: (data) => {
      const templates = {
        "template-two": "layouts/post-two.njk",
      };
      return templates[data.template] || "layouts/post.njk";
    },

    resolvedRelatedPosts: (data) => {
      const allPosts = data.collections.posts || [];
      const currentUrl = data.page.url;

      // Option 1: relatedPosts defined — resolve by title
      if (data.relatedPosts && data.relatedPosts.length > 0) {
        return data.relatedPosts
          .map((rp) => {
            // If url and image already provided, use as-is
            if (rp.url && rp.image) return rp;

            // Find matching post by title
            const match = allPosts.find(
              (p) =>
                p.data.title &&
                p.data.title.trim().replace(/\.+$/, "") ===
                  rp.title.trim().replace(/\.+$/, "")
            );
            if (match) {
              return {
                title: match.data.title,
                url: match.url,
                image: match.data.image || null,
              };
            }
            return null;
          })
          .filter(Boolean)
          .slice(0, 3);
      }

      // Option 2: no relatedPosts — get 3 latest from same category
      const cats = [];
      if (data.category) cats.push(data.category);
      if (data.categories) cats.push(...data.categories);

      if (cats.length === 0) {
        // Fallback: 3 latest posts excluding current
        return allPosts
          .filter((p) => p.url !== currentUrl)
          .slice(0, 3)
          .map((p) => ({
            title: p.data.title,
            url: p.url,
            image: p.data.image || null,
          }));
      }

      const sameCat = allPosts.filter((p) => {
        if (p.url === currentUrl) return false;
        const pCats = [];
        if (p.data.category) pCats.push(p.data.category);
        if (p.data.categories) pCats.push(...p.data.categories);
        return pCats.some((c) => cats.includes(c));
      });

      return sameCat.slice(0, 3).map((p) => ({
        title: p.data.title,
        url: p.url,
        image: p.data.image || null,
      }));
    },
  },
};
