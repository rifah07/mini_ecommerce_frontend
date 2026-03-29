# Mini E-Commerce — Frontend

The frontend for my mini e-commerce project. Built with Next.js App Router and Tailwind. Connects to a separate NestJS backend via a proxy so auth cookies work cleanly without any CORS headaches.

## Tech stack

- **Next.js 15** (App Router) — file-based routing, server + client components
- **TypeScript** — strict mode throughout
- **Tailwind CSS** — utility-first styling, no component library needed
- **TanStack Query** — server state, caching, and mutations
- **Axios** — HTTP client with a shared interceptor for error handling

## Getting started

Make sure the backend is running first on port 3000.

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env

# 3. Start dev server
npm run dev
```

App runs at `http://localhost:3001`.
Live link: `https://mini-ecommerce-frontend-sandy.vercel.app/`

## Environment variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

That's the only one you need in development. The Next.js config proxies `/api/*` requests to the backend, so cookies stay on the same origin.

## Project structure

```
app/                  # Pages (Next.js App Router)
├── auth/             # Login and register
├── products/         # Product listing with search
├── cart/             # Cart management and checkout
├── orders/           # Order history
└── admin/            # Admin panel (products, orders, users)

components/
├── layout/           # Navbar
└── ui/               # Button, Input, Badge, Spinner, ErrorMessage

lib/
├── api/              # Axios calls, one file per domain
├── hooks/            # TanStack Query hooks, one file per domain
├── types/            # Shared TypeScript types
└── utils/            # formatPrice, formatDate, cn
```

The idea was to keep all server communication in `lib/api/`, all caching logic in `lib/hooks/`, and pages as thin as possible — just composing hooks and components.

## Features

**For customers**
- Browse and search products with pagination
- Add to cart, adjust quantities, remove items
- Checkout directly from cart
- View order history and cancel pending orders

**For admins**
- Create, edit, and delete products
- View all orders and advance their status (pending → shipped → delivered)
- View and delete user accounts

## How auth works

Login sets HTTP-only cookies on the backend. The frontend never stores tokens in localStorage or memory — TanStack Query just caches the user profile from `/auth/profile`. On logout, the backend clears the cookies and the query cache is wiped.

Route protection is currently handled by checking the user query result inside each page. If you're not logged in, you'll be redirected to `/auth`.

## Scripts

```bash
npm run dev      # Start dev server on port 3001
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Related

Backend repo: [mini-ecommerce-api](https://github.com/rifah07/mini_ecommerce_nestjs)