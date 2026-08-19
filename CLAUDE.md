# Code Standards — All Client Sites

## No inline CSS

Never use `style="..."` attributes in any client site's HTML (this repo's own site, and everything under `Client Websites/*/site/`). Every client site already ships a `style.css` — put the rule there as a class (reuse an existing one where the styling already matches; otherwise add a new class near the related rules) and reference the class from the HTML instead.

**Why:** Inline styles get flagged individually as `no-inline-styles` warnings by the Microsoft Edge Tools / webhint linter in VS Code, they can't be reused, and they drift out of sync with the rest of the design system. This has had to be cleaned up more than once on the Kalib Koons site — check for `style="` before considering a page finished, not just when a linter flags it.

**Exception:** none. If a value genuinely needs to be computed at runtime (e.g. JS setting an element's height dynamically), set it via JS (`element.style.x = ...`), not as a static attribute in the HTML source.
