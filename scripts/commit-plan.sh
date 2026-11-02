#!/usr/bin/env bash
# Turns the project into a readable history, one feature per commit.
# Usage:  git init -b main  &&  bash scripts/commit-plan.sh
set -e
c() { msg="$1"; shift; git add -- "$@" 2>/dev/null || true; if git diff --cached --quiet; then echo "skipped: $msg"; else git commit -q -m "$msg"; echo "committed: $msg"; fi; }

c "chore: set up Next.js, Tailwind CSS and daisyUI" package.json package-lock.json tsconfig.json next.config.ts postcss.config.mjs .gitignore .env.example
c "style: add the BookNook design tokens with light and dark themes" app/globals.css app/icon.svg
c "feat: add the root layout, providers and theme switching" app/layout.tsx components/providers.tsx components/theme.tsx components/theme-toggle.tsx components/logo.tsx
c "feat: build the navbar with auth-aware links and a user dropdown" components/navbar.tsx components/avatar.tsx
c "feat: build the footer with contact info and social links" components/footer.tsx components/footer-links.tsx
c "feat: configure BetterAuth with the MongoDB adapter" lib/mongo.ts lib/auth.ts lib/auth-client.ts ":(literal)app/api/auth/[...all]/route.ts"
c "feat: issue short-lived JWTs and add the API client" app/api/token/route.ts lib/api.ts lib/use-fetch.ts lib/utils.ts types.ts
c "feat: add the login page with Google sign-in" components/auth-shell.tsx components/field.tsx components/views/login-view.tsx app/login
c "feat: add the register page with password validation" components/views/register-view.tsx app/register
c "feat: protect private routes with the proxy and PrivateRoute" proxy.ts components/private-route.tsx components/spinner.tsx components/states.tsx
c "feat: add the Swiper hero slider and category ticker" components/shelf.tsx components/home/hero-slider.tsx components/home/marquee.tsx
c "feat: add New Arrivals and the extra home sections" components/reveal.tsx components/home app/page.tsx
c "feat: add book cards and the All Books page with filters" components/book-cover.tsx components/book-object.tsx components/book-card.tsx components/page-header.tsx components/views/books-view.tsx app/books/page.tsx
c "feat: add the Add Book form with imgbb upload and live preview" lib/upload.ts components/book-form.tsx components/views/add-book-view.tsx app/add-book
c "feat: add book details with a copy meter and the borrow modal" components/modal.tsx components/views/book-details-view.tsx ":(literal)app/books/[id]"
c "feat: add My Books with edit and delete modals" components/views/my-books-view.tsx app/my-books
c "feat: add My Borrows with the return flow" components/views/my-borrows-view.tsx app/my-borrows
c "feat: add the profile page, custom 404, loading and error pages" components/views/profile-view.tsx app/profile app/not-found.tsx app/loading.tsx app/error.tsx
c "docs: write the README and commit helper" README.md scripts
if [ -n "$(git status --porcelain)" ]; then git add -A && git commit -q -m "chore: final touches" && echo "committed: final touches"; fi
echo; git log --oneline | cat; echo; echo "$(git rev-list --count HEAD) commits"
