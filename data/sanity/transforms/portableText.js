/** @format */

import { toHTML } from "@portabletext/to-html";

export function normalizeLinkHref(href) {
  if (!href || typeof href !== "string") {
    return "";
  }

  const trimmed = href.trim();
  if (!trimmed) {
    return "";
  }

  if (
    trimmed.startsWith("/") ||
    trimmed.startsWith("#") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:")
  ) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return trimmed;
    }
  } catch {
    return "";
  }

  return "";
}

export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function renderAsideResources(resources) {
  if (!Array.isArray(resources) || resources.length === 0) {
    return "";
  }

  const items = resources
    .map((resource) => {
      const href = normalizeLinkHref(resource?.href);
      if (!href) {
        return "";
      }

      const label = escapeHtml(resource?.label || href);
      const external =
        href.startsWith("http://") || href.startsWith("https://");
      const openInNewTab = Boolean(resource?.openInNewTab) || external;
      const rel = openInNewTab ? ' rel="noopener noreferrer"' : "";
      const target = openInNewTab ? ' target="_blank"' : "";

      return `<li><a href="${href}"${target}${rel}>${label}<span aria-hidden="true">↗</span></a></li>`;
    })
    .filter(Boolean)
    .join("");

  if (!items) {
    return "";
  }

  return `<aside><h3>Resources</h3><ul>${items}</ul></aside>`;
}

export function serializePortableTextToHtml(blocks) {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return "";
  }

  return toHTML(blocks, {
    components: {
      types: {
        image: ({ value }) => {
          const src = value?.asset?.url;
          if (!src) {
            return "";
          }

          const alt = escapeHtml(value?.alt || "");
          return `<img src="${src}" alt="${alt}" loading="lazy" decoding="async" data-bio-el="body" />`;
        },
        sub_section: ({ value }) => {
          const heading = escapeHtml(value?.heading || "");
          const bodyHtml = serializePortableTextToHtml(value?.body);

          if (!heading && !bodyHtml) {
            return "";
          }

          const headingHtml = heading
            ? `<h3 data-bio-el="sub-section-heading">${heading}</h3>`
            : "";
          const nestedBodyHtml = bodyHtml
            ? `<div data-bio-el="sub-section-body">${bodyHtml}</div>`
            : "";

          return `<section class="sub-section" data-bio-el="sub-section">${headingHtml}${nestedBodyHtml}</section>`;
        },
        project_aside: ({ value }) => {
          const heading = escapeHtml(value?.title || "");
          const bodyHtml = serializePortableTextToHtml(value?.body);
          const resourcesHtml = renderAsideResources(value?.resources);

          if (!heading && !bodyHtml && !resourcesHtml) {
            return "";
          }

          const headingHtml = heading
            ? `<h3 class="project-aside__heading" data-bio-el="project-aside-heading">${heading}</h3>`
            : "";
          const narrativeHtml = bodyHtml
            ? `<div class="project-aside__body" data-bio-el="project-aside-body">${bodyHtml}</div>`
            : "";

          return `<aside class="project-aside" data-bio-el="project-aside">${headingHtml}${narrativeHtml}${resourcesHtml}</aside>`;
        },
      },
      block: {
        normal: ({ children }) => `<p>${children}</p>`,
      },
      marks: {
        link: ({ children, value }) => {
          const href = normalizeLinkHref(value?.href);
          if (!href) {
            return children;
          }

          const external =
            href.startsWith("http://") || href.startsWith("https://");
          const rel = external ? ' rel="noopener noreferrer"' : "";
          const target = external ? ' target="_blank"' : "";
          return `<a href="${href}"${target}${rel}>${children}</a>`;
        },
      },
    },
  });
}
