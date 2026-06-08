/** @format */

/**
 * ContactForm
 *
 * Progressive-enhancement controller for the site-global contact form. Reads
 * Sanity config from the form's data attributes and writes a `contactSubmission`
 * document directly to the Sanity Content Lake mutations API from the browser.
 *
 * SECURITY BOUNDARY:
 * - The write token is present in the page markup (accepted tradeoff, spec §4).
 *   Never log the token or full message content to the console.
 * - Client-side validation is the ONLY validation layer (spec §12); treat it as
 *   spam/abuse mitigation, not a trust boundary.
 *
 * @see specs/contact-form-11ty-sanity-serverless-email-spec.md
 */

const MESSAGES = {
  success: "Thanks. Your message has been sent.",
  error: "Something went wrong. Please try again later.",
};

const LIMITS = {
  emailMax: 254,
  messageMin: 20,
  messageMax: 5000,
  sourcePageMax: 500,
};

/** Trim, normalize line endings, strip null bytes, collapse blank-line runs. */
function sanitize(value, { collapseBlankLines = false } = {}) {
  let out = String(value ?? "")
    .replace(/\0/g, "")
    .replace(/\r\n?/g, "\n")
    .trim();
  if (collapseBlankLines) out = out.replace(/\n{3,}/g, "\n\n");
  return out;
}

export class ContactForm {
  constructor(el) {
    this.el = el;
    this.config = {
      projectId: el.dataset.sanityProject,
      dataset: el.dataset.sanityDataset,
      apiVersion: el.dataset.sanityApiVersion,
      writeToken: el.dataset.sanityWriteToken,
    };
    this.statusEl = el.querySelector("[data-contact-form-status]");
    this.submitEl = el.querySelector('[type="submit"]');
    el.addEventListener("submit", (e) => this.handleSubmit(e));
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.clearErrors();

    const raw = Object.fromEntries(new FormData(this.el));

    // Honeypot: a filled bot field means spam. Silent success, no write.
    if (raw.botField) return this.showSuccess();

    const data = {
      email: sanitize(raw.email).toLowerCase(),
      message: sanitize(raw.message, { collapseBlankLines: true }),
      sourcePage: sanitize(raw.sourcePage).slice(0, LIMITS.sourcePageMax),
    };

    const errors = this.validate(data);
    if (Object.keys(errors).length) return this.showErrors(errors);

    this.setSubmitting(true);
    try {
      await this.writeToSanity(this.buildDocument(data));
      this.el.reset();
      this.showSuccess();
    } catch {
      // Swallow the underlying error — never surface token/transport details.
      this.showStatus(MESSAGES.error, "error");
    } finally {
      this.setSubmitting(false);
    }
  }

  validate({ email, message }) {
    const errors = {};
    if (!email) {
      errors.email = "Please enter your email address.";
    } else if (email.length > LIMITS.emailMax || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!message) {
      errors.message = "Please enter a message.";
    } else if (message.length < LIMITS.messageMin) {
      errors.message = `Please use at least ${LIMITS.messageMin} characters.`;
    } else if (message.length > LIMITS.messageMax) {
      errors.message = `Please keep your message under ${LIMITS.messageMax} characters.`;
    }
    return errors;
  }

  buildDocument({ email, message, sourcePage }) {
    return {
      _type: "contactSubmission",
      status: "new",
      email,
      message,
      sourcePage,
      submittedAt: new Date().toISOString(),
      spamStatus: "passed",
      metadata: {
        userAgent: navigator.userAgent,
        referer: document.referrer,
      },
    };
  }

  async writeToSanity(doc) {
    const { projectId, dataset, apiVersion, writeToken } = this.config;
    const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${writeToken}`,
      },
      body: JSON.stringify({ mutations: [{ create: doc }] }),
    });
    if (!res.ok) throw new Error(`Sanity write failed: ${res.status}`);
  }

  // --- UI state -------------------------------------------------------------

  setSubmitting(isSubmitting) {
    if (!this.submitEl) return;
    this.submitEl.disabled = isSubmitting;
    this.submitEl.setAttribute("aria-busy", String(isSubmitting));
  }

  showErrors(errors) {
    let firstField = null;
    for (const [field, msg] of Object.entries(errors)) {
      const errorEl = this.el.querySelector(`[data-field-error="${field}"]`);
      const input = this.el.querySelector(`[name="${field}"]`);
      if (errorEl) {
        errorEl.textContent = msg;
        errorEl.hidden = false;
      }
      if (input) {
        input.setAttribute("aria-invalid", "true");
        firstField ??= input;
      }
    }
    if (firstField) firstField.focus();
  }

  clearErrors() {
    this.el.querySelectorAll("[data-field-error]").forEach((el) => {
      el.textContent = "";
      el.hidden = true;
    });
    this.el
      .querySelectorAll('[aria-invalid="true"]')
      .forEach((el) => el.removeAttribute("aria-invalid"));
    this.showStatus("", null);
  }

  showStatus(message, kind) {
    if (!this.statusEl) return;
    this.statusEl.textContent = message;
    this.statusEl.dataset.statusKind = kind || "";
    // Color is advisory only; the aria-live region carries the real signal.
    this.statusEl.classList.toggle("text-green-400", kind === "success");
    this.statusEl.classList.toggle("text-red-400", kind === "error");
  }

  showSuccess() {
    this.showStatus(MESSAGES.success, "success");
  }
}

export function initContactForms(root = document) {
  root
    .querySelectorAll("[data-contact-form]")
    .forEach((el) => new ContactForm(el));
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initContactForms(), {
      once: true,
    });
  } else {
    initContactForms();
  }
}
