# BookNook

> A small online library. Add a book, borrow a book, return a book.

- **Live site:** https://your-booknook.vercel.app *(replace with your deployed URL)*
- **Server API:** https://your-booknook-api.vercel.app *(replace with your deployed API URL)*
- **Server repository:** https://github.com/your-username/booknook-server

## Features

- **Animated home page.** A three-slide Swiper hero (every slide has a "Browse Books" button), a live **New Arrivals** section (the newest 6 books, sorted and limited in MongoDB), plus *How Borrowing Works*, *Top Categories* and *Reader Reviews* sections.
- **Real authentication.** BetterAuth with the MongoDB adapter: email and password plus Google sign-in. Registration enforces an uppercase letter, a lowercase letter and at least 6 characters, both in the form and on the server.
- **Private routes that survive a reload.** Add Book, My Books, My Borrows, Book Details and Profile wait for the session before deciding anything, so a logged-in user is never bounced to Login, and a logged-out visitor is sent back to the page they wanted after logging in.
- **Full CRUD on books.** Add a book (image uploaded to imgbb, live preview card), edit it in a pre-filled modal, delete it behind a confirmation modal.
- **Borrow system with real stock.** Choose a loan length, borrow with one click, and the copy count drops with `$inc`. A reader can't borrow the same book twice, and a sold-out book shows a disabled **Not Available** button. Returning a book gives the copy back.
- **JWT-protected API.** The Express server verifies a signed JWT on every protected route and checks ownership before any edit or delete.
- **Light and dark themes**, Framer Motion animation (respecting reduced-motion settings), Sonner toasts instead of `alert()`, custom 404 page, loading spinners and a page title for every route.
- **Responsive** from small phones to wide desktops.

## Tech stack

Next.js (App Router), React, TypeScript, Tailwind CSS 4, daisyUI 5, Framer Motion, Swiper, Sonner, BetterAuth + MongoDB adapter, jose (JWT signing), lucide-react and react-icons.

## Run it locally

You need Node.js 20.9 or newer, a MongoDB database (MongoDB Atlas is fine) and the [server](../booknook-server) running.

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev                  # DNS preload runs automatically
```

The client start/build scripts preload `dns-fix.cjs`, which sets Cloudflare and Google DNS resolvers before Next.js starts. This can help on networks that fail MongoDB Atlas SRV lookups; it does not replace a valid Atlas connection string or correct Atlas network-access settings.

### Environment variables

| Variable | What it is |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | URL of the Express server, e.g. `http://localhost:5000` |
| `NEXT_PUBLIC_IMGBB_API_KEY` | Free key from <https://api.imgbb.com/> for cover uploads |
| `BETTER_AUTH_URL` | The exact public URL this app runs on, e.g. `http://localhost:3000` locally or `https://your-app.vercel.app` on Vercel |
| `NEXT_PUBLIC_APP_URL` | Fallback app URL; keep it identical to `BETTER_AUTH_URL` |
| `BETTER_AUTH_SECRET` | Random secret: `openssl rand -base64 32` |
| `MONGODB_URI`, `MONGODB_DB` | Your MongoDB connection string and database name (use the same ones as the server) |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Optional. From Google Cloud Console. Add `<BETTER_AUTH_URL>/api/auth/callback/google` as an authorized redirect URI |
| `JWT_SECRET` | Any long random string. **Must be identical to `JWT_SECRET` on the server** |

## How login and the JWT fit together

1. BetterAuth handles sign-up, login, Google OAuth and the session cookie (`/api/auth/*`).
2. When the app needs the Express API, it calls its own `GET /api/token`. That route checks the BetterAuth session and returns a one-hour JWT (HS256) signed with `JWT_SECRET`.
3. The browser sends it as `Authorization: Bearer <token>`. The server verifies the signature, issuer, audience and expiry, then uses the email inside the token as the identity for ownership checks.
4. `proxy.ts` does a quick cookie check for private pages; the `PrivateRoute` component confirms the real session in the browser.

## Pages

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | public | Hero slider, new arrivals, extra sections |
| `/books` | public | All books (3 per row on desktop), search and category filter |
| `/books/[id]` | private | Book details and the Borrow modal |
| `/add-book` | private | Add a book |
| `/my-books` | private | Edit and delete your own books |
| `/my-borrows` | private | Borrowed books and the Return button |
| `/profile` | private | Your details and stats |
| `/login`, `/register` | public | Authentication |

## Deploy on Vercel

1. Push this folder to its own GitHub repository and import it in Vercel.
2. Add every required variable from the table above. Set both `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to your exact final Vercel URL (including `https://`), and set `NEXT_PUBLIC_API_URL` to your deployed server URL. Use the same MongoDB URI/database in client and server, and the same `JWT_SECRET` in both. Do not use `localhost` for production.
3. Add the Vercel URL to the server's `CLIENT_URL`, and add `https://<your-domain>/api/auth/callback/google` in Google Cloud Console.
4. Redeploy, then replace the live URL at the top of this file.

> Password reset and email verification are intentionally left out, as the brief asks.
