/** @format */
import groq from "groq";

export const navigationQuery = {
  id: "navigation",
  description: "Navigation singleton with header and footer reference items",
  cacheDuration: process.env.SANITY_CACHE_DURATION || "1d",
  query: groq`*[_type == "navigation"] | order(_updatedAt desc)[0...1]{
    _id,
    _updatedAt,
    "headerItems": header.items[]->{
      _id,
      _type,
      "label": select(
        _type == "home" => coalesce(pageTitle, "Home"),
        _type == "projects" => coalesce(pageTitle, "Projects"),
        _type == "contact" => coalesce(pageTitle, "Contact"),
        _type == "project" => coalesce(page.title, "Project"),
        _type == "post" => coalesce(page.title, "Post"),
        _type == "documentation" => coalesce(pageTitle, "Documentation"),
        "Untitled"
      ),
      "slug": select(
        _type == "project" => page.slug.current,
        _type == "post" => page.slug.current,
        null
      )
    },
    "footerItems": footer.items[]->{
      _id,
      _type,
      "label": select(
        _type == "home" => coalesce(pageTitle, "Home"),
        _type == "projects" => coalesce(pageTitle, "Projects"),
        _type == "contact" => coalesce(pageTitle, "Contact"),
        _type == "project" => coalesce(page.title, "Project"),
        _type == "post" => coalesce(page.title, "Post"),
        _type == "documentation" => coalesce(pageTitle, "Documentation"),
        "Untitled"
      ),
      "slug": select(
        _type == "project" => page.slug.current,
        _type == "post" => page.slug.current,
        null
      )
    }
  }`,
};
