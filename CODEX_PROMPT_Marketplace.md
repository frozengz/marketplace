# CODEX TECHNICAL SPECIFICATION: Marketplace Platform

---

## 0. GROUND RULES (read before generating any file)

- **No comments anywhere in the code.** Not in TypeScript, not in C++.
- **No `any` in TypeScript.** Every value is fully typed.
- **No magic strings.** Use enums or const maps.
- **No placeholder or TODO stubs.** Every function must have a real implementation.
- **Strict null safety** — enable `strict: true` in `tsconfig.json`.
- **Scalable first.** Every module must be independently replaceable.
- **PostgreSQL only.** No ORM is required, but all SQL must use parameterized queries.
- Generate **all** files listed in the project structure. Do not skip any.

---

## 1. TECHNOLOGY STACK

| Layer      | Technology                                  |
|------------|---------------------------------------------|
| Frontend   | TypeScript 5, React 18, Vite 5, react-router-dom v6 |
| Styling    | CSS Modules (no CSS-in-JS)                  |
| i18n       | i18next + react-i18next                     |
| HTTP client| fetch (native, wrapped in a typed client)   |
| Server     | C++20, httplib (cpp-httplib), nlohmann/json |
| Database   | PostgreSQL 16 (libpqxx on server)           |
| Auth       | JWT (server-issued), bcrypt for passwords   |
| Email      | SMTP via libcurl (server-side)              |

---

## 2. PROJECT DIRECTORY STRUCTURE

```
marketplace/
├── client/                         # Frontend (TypeScript + React + Vite)
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── router/
│       │   └── index.tsx           # All routes defined here
│       ├── api/
│       │   ├── client.ts           # Typed fetch wrapper
│       │   ├── auth.ts
│       │   ├── listings.ts
│       │   ├── users.ts
│       │   └── roles.ts
│       ├── store/
│       │   ├── authStore.ts        # Zustand or React context + useReducer
│       │   └── themeStore.ts
│       ├── types/
│       │   ├── user.ts
│       │   ├── listing.ts
│       │   ├── role.ts
│       │   └── api.ts
│       ├── hooks/
│       │   ├── useAuth.ts
│       │   ├── useTheme.ts
│       │   └── useLang.ts
│       ├── i18n/
│       │   ├── index.ts
│       │   └── locales/
│       │       ├── ru.json
│       │       ├── en.json
│       │       └── fr.json
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Header.tsx
│       │   │   ├── Footer.tsx
│       │   │   └── ProtectedRoute.tsx
│       │   ├── ui/
│       │   │   ├── Button.tsx
│       │   │   ├── Input.tsx
│       │   │   ├── Checkbox.tsx
│       │   │   ├── Select.tsx
│       │   │   └── ImageUpload.tsx
│       │   ├── listings/
│       │   │   ├── ListingCard.tsx
│       │   │   ├── ListingGrid.tsx
│       │   │   └── ListingForm.tsx
│       │   └── roles/
│       │       └── RoleBadge.tsx
│       └── pages/
│           ├── HomePage.tsx
│           ├── LoginPage.tsx
│           ├── RegisterPage.tsx
│           ├── EmailVerifyPage.tsx
│           ├── ListingDetailPage.tsx
│           ├── ProfilePage.tsx
│           ├── seller/
│           │   └── SellerDashboardPage.tsx
│           ├── admin/
│           │   └── AdminDashboardPage.tsx
│           └── support/
│               └── SupportDashboardPage.tsx
├── server/                         # Backend (C++20)
│   ├── CMakeLists.txt
│   ├── main.cpp
│   ├── src/
│   │   ├── config/
│   │   │   └── Config.hpp
│   │   ├── db/
│   │   │   ├── Database.hpp
│   │   │   ├── Database.cpp
│   │   │   └── migrations/
│   │   │       └── 001_init.sql
│   │   ├── models/
│   │   │   ├── User.hpp
│   │   │   ├── Role.hpp
│   │   │   ├── Listing.hpp
│   │   │   ├── ListingImage.hpp
│   │   │   ├── Message.hpp
│   │   │   └── Chat.hpp
│   │   ├── middleware/
│   │   │   ├── AuthMiddleware.hpp
│   │   │   └── AuthMiddleware.cpp
│   │   ├── handlers/
│   │   │   ├── AuthHandler.hpp
│   │   │   ├── AuthHandler.cpp
│   │   │   ├── UserHandler.hpp
│   │   │   ├── UserHandler.cpp
│   │   │   ├── ListingHandler.hpp
│   │   │   ├── ListingHandler.cpp
│   │   │   ├── RoleHandler.hpp
│   │   │   └── RoleHandler.cpp
│   │   ├── services/
│   │   │   ├── JwtService.hpp
│   │   │   ├── JwtService.cpp
│   │   │   ├── EmailService.hpp
│   │   │   ├── EmailService.cpp
│   │   │   ├── PasswordService.hpp
│   │   │   └── PasswordService.cpp
│   │   └── utils/
│   │       ├── Json.hpp
│   │       └── Uuid.hpp
└── docker-compose.yml              # PostgreSQL + server + client
```

---

## 3. DATABASE SCHEMA (PostgreSQL 16)

Run this as `001_init.sql`. Every table uses `UUID` primary keys generated via `gen_random_uuid()`.

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE role_name AS ENUM (
  'user',
  'seller',
  'support_agent',
  'administrator',
  'manager'
);

CREATE TABLE accounts (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email                TEXT        NOT NULL UNIQUE,
  username             TEXT        NOT NULL UNIQUE,
  password_hash        TEXT        NOT NULL,
  avatar_url           TEXT,
  email_verified       BOOLEAN     NOT NULL DEFAULT FALSE,
  terms_accepted       BOOLEAN     NOT NULL DEFAULT FALSE,
  is_blocked           BOOLEAN     NOT NULL DEFAULT FALSE,
  chat_restricted_until TIMESTAMPTZ,
  chat_blocked_forever BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE account_roles (
  account_id  UUID        NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  role        role_name   NOT NULL,
  granted_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (account_id, role)
);

CREATE TABLE email_verifications (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id  UUID        NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  token       TEXT        NOT NULL UNIQUE,
  used        BOOLEAN     NOT NULL DEFAULT FALSE,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE listings (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id   UUID        NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  title       TEXT        NOT NULL,
  description TEXT        NOT NULL,
  price       NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE listing_images (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id  UUID        NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  url         TEXT        NOT NULL,
  position    SMALLINT    NOT NULL CHECK (position BETWEEN 1 AND 9),
  UNIQUE (listing_id, position)
);

CREATE TABLE chats (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE chat_participants (
  chat_id     UUID        NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  account_id  UUID        NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  PRIMARY KEY (chat_id, account_id)
);

CREATE TABLE messages (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id     UUID        NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  sender_id   UUID        NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  content     TEXT        NOT NULL,
  sent_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE refresh_tokens (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id  UUID        NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  token_hash  TEXT        NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ NOT NULL,
  revoked     BOOLEAN     NOT NULL DEFAULT FALSE
);
```

**Constraints to enforce in application logic (not in DB):**
- Every account must always have the `user` role. Insert it on registration; it cannot be deleted by any role.
- `manager` role cannot be granted via API. Only via direct SQL.
- Accounts with `administrator` or `manager` roles cannot be blocked by `administrator` handlers. Only `manager` handlers can block `administrator` accounts.
- `manager` accounts cannot be blocked via API at all.

---

## 4. SERVER — C++20

### 4.1 Config (`Config.hpp`)

```cpp
struct Config {
  std::string db_connection_string;
  std::string jwt_secret;
  std::string smtp_host;
  int         smtp_port;
  std::string smtp_user;
  std::string smtp_password;
  std::string base_url;
  int         server_port;
};

Config load_from_env();
```

Load all values from environment variables. No hard-coded secrets.

### 4.2 REST API Endpoints

All responses are `application/json`. All authenticated endpoints require `Authorization: Bearer <JWT>` header. The JWT payload contains `{ "sub": "<account_id>", "roles": ["user", ...] }`.

#### AUTH

| Method | Path                         | Auth | Description                                      |
|--------|------------------------------|------|--------------------------------------------------|
| POST   | /api/auth/register           | No   | Register new account                             |
| POST   | /api/auth/login              | No   | Login, returns access + refresh tokens           |
| POST   | /api/auth/refresh            | No   | Refresh access token                             |
| POST   | /api/auth/logout             | Yes  | Revoke refresh token                             |
| GET    | /api/auth/verify-email       | No   | Verify email via token query param `?token=`     |

**POST /api/auth/register — Request body:**
```json
{
  "email": "string",
  "password": "string (min 8 chars)",
  "username": "string (3–30 chars, alphanumeric + underscore)",
  "terms_accepted": true
}
```
- Validate all fields server-side. Return 400 with field-level errors on failure.
- Hash password with bcrypt (cost 12).
- Insert account with `email_verified = false`, `terms_accepted = true`.
- Insert `user` role into `account_roles`.
- Generate UUID token, store in `email_verifications` with 24h expiry.
- Send email with verification link: `{base_url}/verify-email?token={token}`.
- Return 201 with `{ "message": "verification_email_sent" }`.

**POST /api/auth/login — Request body:**
```json
{ "email": "string", "password": "string" }
```
- Return 403 if `email_verified = false`.
- Return 403 if `is_blocked = true`.
- On success: return `{ "access_token": "...", "refresh_token": "..." }`.
- Access token TTL: 15 minutes. Refresh token TTL: 30 days.

#### USERS

| Method | Path                          | Auth  | Roles        | Description                     |
|--------|-------------------------------|-------|--------------|---------------------------------|
| GET    | /api/users/:id                | Yes   | any          | Get public profile               |
| PATCH  | /api/users/:id/avatar         | Yes   | owner        | Upload avatar (multipart)        |
| GET    | /api/users/:id/roles          | Yes   | admin/mgr    | List roles of account            |
| PATCH  | /api/users/:id/roles          | Yes   | admin/mgr    | Grant or revoke roles            |
| POST   | /api/users/:id/block          | Yes   | admin/mgr    | Block account                    |
| POST   | /api/users/:id/unblock        | Yes   | admin/mgr    | Unblock account                  |
| PATCH  | /api/users/:id/chat-restrict  | Yes   | admin        | Restrict or lift chat access     |

**Role management rules (enforce in handler, not in DB):**
- `administrator` can grant/revoke roles only for accounts that have only `user` or `seller` roles.
- `administrator` cannot grant `administrator` or `manager` roles.
- `manager` can grant/revoke any role except `manager`.
- `user` role cannot be revoked by anyone via API.
- Neither `administrator` nor `manager` can block accounts with `manager` role.
- `administrator` cannot block accounts with `administrator` role.

#### LISTINGS

| Method | Path                       | Auth | Roles    | Description                          |
|--------|----------------------------|------|----------|--------------------------------------|
| GET    | /api/listings              | No   | —        | Get paginated active listings         |
| GET    | /api/listings/:id          | No   | —        | Get single listing with images        |
| POST   | /api/listings              | Yes  | seller   | Create listing                        |
| PATCH  | /api/listings/:id          | Yes  | seller/admin | Update listing                    |
| DELETE | /api/listings/:id          | Yes  | seller/admin | Soft-delete (set is_active=false) |
| GET    | /api/listings/my           | Yes  | seller   | Get seller's own listings             |
| POST   | /api/listings/:id/images   | Yes  | seller   | Upload image (multipart), max 9       |
| DELETE | /api/listings/:id/images/:pos | Yes | seller/admin | Remove image by position         |

**POST /api/listings — Request body:**
```json
{
  "title": "string (1–200 chars)",
  "description": "string (1–5000 chars)",
  "price": 0.00
}
```
Listing images are uploaded separately. Positions 1–9 must be unique per listing.

**GET /api/listings — Query params:** `page` (default 1), `limit` (default 20, max 100).

#### CHATS (minimal — stub with correct DB schema)

| Method | Path                       | Auth | Description                            |
|--------|----------------------------|------|----------------------------------------|
| GET    | /api/chats                 | Yes  | List chats the account participates in |
| POST   | /api/chats                 | Yes  | Create or find existing chat           |
| GET    | /api/chats/:id/messages    | Yes  | Get messages in chat (paginated)       |
| POST   | /api/chats/:id/messages    | Yes  | Send message                           |

Chat access checks:
- `administrator` and `manager` can read any chat via `GET /api/chats/:id/messages`.
- Before allowing a message send, check `chat_restricted_until` and `chat_blocked_forever` on the sender's account.

### 4.3 Error Response Format

Every error response must follow this shape:
```json
{
  "error": {
    "code": "SNAKE_CASE_CODE",
    "message": "human-readable string",
    "fields": { "field_name": "error description" }
  }
}
```
`fields` is omitted when there are no field-level errors (e.g., 401, 403, 404).

### 4.4 JWT

- Algorithm: HS256.
- Payload: `{ "sub": "<uuid>", "roles": ["user", "seller"], "exp": <unix>, "iat": <unix> }`.
- Verify signature and `exp` on every protected endpoint.
- If token is invalid or expired return 401.

---

## 5. FRONTEND — TypeScript + React + Vite

### 5.1 tsconfig.json (strict settings)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "react-jsx",
    "baseUrl": "src",
    "paths": { "@/*": ["./*"] }
  }
}
```

### 5.2 Types (`src/types/`)

**role.ts**
```typescript
export const ROLES = ['user', 'seller', 'support_agent', 'administrator', 'manager'] as const;
export type Role = typeof ROLES[number];
```

**user.ts**
```typescript
import { Role } from './role';

export interface User {
  id: string;
  email: string;
  username: string;
  avatarUrl: string | null;
  roles: Role[];
  emailVerified: boolean;
  isBlocked: boolean;
  chatBlockedForever: boolean;
  chatRestrictedUntil: string | null;
  createdAt: string;
}

export interface PublicUser {
  id: string;
  username: string;
  avatarUrl: string | null;
}
```

**listing.ts**
```typescript
export interface ListingImage {
  id: string;
  url: string;
  position: number;
}

export interface Listing {
  id: string;
  sellerId: string;
  sellerUsername: string;
  title: string;
  description: string;
  price: number;
  images: ListingImage[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedListings {
  items: Listing[];
  total: number;
  page: number;
  limit: number;
}
```

**api.ts**
```typescript
export interface ApiError {
  code: string;
  message: string;
  fields?: Record<string, string>;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}
```

### 5.3 API Client (`src/api/client.ts`)

Implement a typed `request<T>` function that:
- Reads the base URL from `import.meta.env.VITE_API_URL`.
- Attaches `Authorization: Bearer <token>` from localStorage when available.
- On 401, attempts one silent token refresh via `/api/auth/refresh` and retries the original request once.
- Returns `ApiResponse<T>`.

### 5.4 Routing (`src/router/index.tsx`)

Use `react-router-dom` v6 `createBrowserRouter`.

```
/                       → HomePage (public)
/login                  → LoginPage (redirect to / if already authed)
/register               → RegisterPage (redirect to / if already authed)
/verify-email           → EmailVerifyPage (reads ?token= from URL)
/listings/:id           → ListingDetailPage (public)
/profile/:id            → ProfilePage (public)
/seller/dashboard       → SellerDashboardPage (requires seller role)
/seller/listings/:id/edit → ListingEditPage (requires seller role + ownership)
/admin/dashboard        → AdminDashboardPage (requires administrator role)
/support/dashboard      → SupportDashboardPage (requires support_agent role)
```

`ProtectedRoute` component props:
```typescript
interface ProtectedRouteProps {
  requiredRoles: Role[];
  children: React.ReactNode;
}
```
Redirect to `/login` if not authenticated. Show 403 page if authenticated but missing required role.

### 5.5 Auth Store (`src/store/authStore.ts`)

State shape:
```typescript
interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
}
```

Actions: `login`, `logout`, `refreshToken`, `setUser`. Persist `accessToken` to localStorage. On app init, attempt silent refresh if a refresh token cookie exists.

### 5.6 Theme & Language

**Theme:**
- Two values: `'light' | 'dark'`. Stored in localStorage.
- Applied as `data-theme="light"` or `data-theme="dark"` on `<html>`.
- All colors defined as CSS variables on `:root[data-theme="light"]` and `:root[data-theme="dark"]`.

**Language (i18n):**
- Configure `i18next` with `ru`, `en`, `fr` namespaces.
- Default language: `en`. Stored in localStorage key `lang`.
- The `useLang` hook exposes `{ lang, setLang }`.
- The Header component renders a `<Select>` with three options.
- Adding a new language requires only: adding a JSON file under `src/i18n/locales/` and registering it in `src/i18n/index.ts`.

### 5.7 Pages — Behavior Specification

**RegisterPage:**
- Fields: email, password (min 8), username (3–30), terms checkbox.
- All fields required. Inline error display under each field using `ApiError.fields`.
- On success: show message "Check your email for a verification link." Do not redirect.

**LoginPage:**
- Fields: email, password.
- On `email_verified: false` error: show message "Please verify your email before logging in."
- On success: redirect to `/`.

**EmailVerifyPage:**
- On mount, send GET `/api/auth/verify-email?token=<token>`.
- Show success state or error state. No form.

**HomePage:**
- Fetch `GET /api/listings?page=1&limit=20`.
- Render `ListingGrid` with `ListingCard` components.
- Implement pagination controls.

**ListingDetailPage:**
- Fetch single listing.
- Show image carousel (1–9 images), title, description, price, seller username (linked to `/profile/:id`).

**ProfilePage:**
- Show username and avatar.

**SellerDashboardPage:**
- List seller's listings (title, price, active status).
- "Create listing" button opens `ListingForm`.
- Clicking a listing opens `ListingEditPage`.

**ListingForm / ListingEditPage:**
- Fields: title, description, price.
- Image uploader: drag-and-drop or click. Shows preview grid (max 9). Each image has a delete button. Position is assigned by upload order.

**AdminDashboardPage:**
- List all accounts (paginated).
- Per account: show username, roles, blocked status.
- Actions: block/unblock, grant/revoke roles (respecting the role hierarchy rules), moderate listings.

### 5.8 Header Component

Always rendered. Contains:
- Site logo (links to `/`).
- Navigation links conditional on auth state and roles.
- Language switcher (`<Select>` bound to i18n).
- Theme toggle button (sun/moon icon).
- If authenticated: avatar + username + logout button.
- If not authenticated: Login and Register buttons.

---

## 6. EMAIL VERIFICATION FLOW (end-to-end)

1. User submits registration form.
2. Server creates account, generates `email_verifications` row with 24h expiry.
3. Server sends email: subject = "Verify your Marketplace account", body contains link `{base_url}/verify-email?token={token}`.
4. User clicks link → frontend `EmailVerifyPage` reads `?token=` → calls `GET /api/auth/verify-email?token=`.
5. Server finds token, checks `used = false` and `expires_at > NOW()`.
6. Server sets `accounts.email_verified = true`, `email_verifications.used = true`.
7. Server returns `200 { "message": "email_verified" }`.
8. Frontend shows success message and link to login.

---

## 7. IMAGE UPLOAD

- Frontend sends `multipart/form-data` POST.
- Server saves file to disk under `uploads/avatars/:account_id` or `uploads/listings/:listing_id/`.
- Server returns absolute URL.
- Max file size: 5 MB. Accepted types: `image/jpeg`, `image/png`, `image/webp`.
- For listings: reject upload if the listing already has 9 images.

---

## 8. CODE STYLE REQUIREMENTS

- TypeScript: `camelCase` for variables and functions, `PascalCase` for types/interfaces/components, `SCREAMING_SNAKE_CASE` for constants.
- C++: `PascalCase` for classes and structs, `snake_case` for methods and variables, `SCREAMING_SNAKE_CASE` for macros (avoid macros).
- Each C++ class in its own `.hpp`/`.cpp` pair.
- Each React component in its own `.tsx` file.
- No default exports from non-component files (use named exports).
- React components use default export.
- All `async` functions must have explicit return types.

---

## 9. docker-compose.yml

```yaml
version: '3.9'
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: marketplace
      POSTGRES_USER: marketplace_user
      POSTGRES_PASSWORD: marketplace_pass
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./server/src/db/migrations:/docker-entrypoint-initdb.d

  server:
    build:
      context: ./server
    environment:
      DB_CONNECTION_STRING: "host=db port=5432 dbname=marketplace user=marketplace_user password=marketplace_pass"
      JWT_SECRET: "change_me_in_production"
      SMTP_HOST: ""
      SMTP_PORT: "587"
      SMTP_USER: ""
      SMTP_PASSWORD: ""
      BASE_URL: "http://localhost:5173"
      SERVER_PORT: "8080"
    ports:
      - "8080:8080"
    depends_on:
      - db

  client:
    build:
      context: ./client
    environment:
      VITE_API_URL: "http://localhost:8080"
    ports:
      - "5173:5173"
    depends_on:
      - server

volumes:
  pgdata:
```

---

## 10. GENERATION ORDER

Generate files in this exact sequence to avoid forward-reference issues:

1. `server/src/db/migrations/001_init.sql`
2. `server/src/config/Config.hpp`
3. `server/src/models/*.hpp` (all models)
4. `server/src/utils/*.hpp`
5. `server/src/services/*.hpp` + `.cpp`
6. `server/src/middleware/*.hpp` + `.cpp`
7. `server/src/handlers/*.hpp` + `.cpp`
8. `server/main.cpp`
9. `server/CMakeLists.txt`
10. `client/tsconfig.json`, `client/vite.config.ts`, `client/package.json`
11. `client/src/types/*.ts`
12. `client/src/api/*.ts`
13. `client/src/store/*.ts`
14. `client/src/hooks/*.ts`
15. `client/src/i18n/**`
16. `client/src/components/**/*.tsx`
17. `client/src/pages/**/*.tsx`
18. `client/src/router/index.tsx`
19. `client/src/App.tsx`
20. `client/src/main.tsx`
21. `client/index.html`
22. `docker-compose.yml`

---

*End of specification. Generate all files now, following every rule above without deviation.*
