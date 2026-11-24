/** @format */

// The site map reads `eleventyNavigation`; build it from the sitePage record.
export default {
  eleventyComputed: {
    eleventyNavigation: (data) => {
      const page = data.sitePage;
      if (!page) return undefined;
      const entry = { key: page.url, title: page.navTitle };
      if (page.navParent) entry.parent = page.navParent;
      return entry;
    },
  },
};
