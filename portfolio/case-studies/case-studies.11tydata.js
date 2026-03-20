module.exports = {
  tags: "caseStudies",
  layout: "layouts/case-study.njk",
  eleventyComputed: {
    resolvedRelatedProjects: (data) => {
      const allProjects = data.collections.caseStudies || [];
      const currentUrl = data.page.url;

      // Option 1: relatedProjects defined — resolve by title
      if (data.relatedProjects && data.relatedProjects.length > 0) {
        return data.relatedProjects
          .map((rp) => {
            if (rp.url && rp.image) return rp;
            const match = allProjects.find(
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

      // Option 2: get 3 projects from same category
      const cats = data.categories || [];
      if (cats.length === 0) {
        return allProjects
          .filter((p) => p.url !== currentUrl)
          .slice(0, 3)
          .map((p) => ({
            title: p.data.title,
            url: p.url,
            image: p.data.image || null,
          }));
      }

      const sameCat = allProjects.filter((p) => {
        if (p.url === currentUrl) return false;
        const pCats = p.data.categories || [];
        return pCats.some((c) => cats.includes(c));
      });

      const result = sameCat.slice(0, 3).map((p) => ({
        title: p.data.title,
        url: p.url,
        image: p.data.image || null,
      }));

      // Fill remaining slots with other projects if needed
      if (result.length < 3) {
        const remaining = allProjects
          .filter((p) => p.url !== currentUrl && !result.find((r) => r.url === p.url))
          .slice(0, 3 - result.length)
          .map((p) => ({
            title: p.data.title,
            url: p.url,
            image: p.data.image || null,
          }));
        result.push(...remaining);
      }

      return result;
    },
  },
};
