<p align="center">
  <img src="public/favicon.svg" alt="PodDashboard logo" width="84" />
</p>

<p align="center">
  Lean Laravel + Livewire app for built-in auth, pod management, and upcoming events.
</p>

# PodDashboard

PodDashboard is a trimmed TALL-stack app for organizing tabletop pods and events.
It currently ships with:

- Laravel Fortify authentication (`/login`, `/register`, password reset)
- Authenticated dashboard (`/dashboard`) for pod creation and event visibility
- Session-authenticated JSON API (`/api/pods`, `/api/events`)

The repository was intentionally cleaned to remove unused starter-kit auth/settings surfaces so the codebase stays small and maintainable.

## Tech Stack

- Laravel 12
- Livewire 4
- Alpine.js (via Livewire)
- Flux UI Free
- Tailwind CSS 4 + Vite 7
- Pest 4 + PHPUnit 12

## Active HTTP Surface

### Web

- `GET /` -> redirects to `/dashboard`
- `GET /login` -> login page (guest)
- `POST /login` -> authenticate session (guest)
- `POST /logout` -> sign out (auth)
- `GET /register` -> registration page (guest)
- `POST /register` -> create account (guest)
- `GET /forgot-password` -> request reset link (guest)
- `POST /forgot-password` -> send reset link (guest)
- `GET /reset-password/{token}` -> reset form (guest)
- `POST /reset-password` -> apply new password (guest)
- `GET /dashboard` -> dashboard (auth)
- `GET /up` -> health endpoint

### API (session-authenticated)

- `GET /api/pods`
- `POST /api/pods`
- `GET /api/events`

Unauthenticated API requests return `401`.

## Requirements

- PHP 8.2+ (tested on 8.4.1)
- Composer 2+
- Node.js 22+ (CI target; Node 24 also works locally)
- npm 10+
- PostgreSQL 14+ (default `.env.example`) or another Laravel-supported database

## Quick Start

```bash
git clone <your-repo-url> poddashboard
cd poddashboard
cp .env.example .env
composer install
npm install
php artisan key:generate
php artisan migrate
composer dev
```

App URLs after startup:

- `http://localhost:8000/login`
- `http://localhost:8000/register`
- `http://localhost:8000/forgot-password`
- `http://localhost:8000/dashboard`
- `http://localhost:8000/up`

If frontend changes are not reflected, run `npm run dev` (or `npm run build`).

## Local Data and Auth Notes

Optional seed user:

```bash
php artisan db:seed
```

Seeder creates:

- Email: `test@example.com`
- Password: `password`

Password reset links use your configured mail transport. For local development, use a mailbox catcher (Mailpit/Mailhog) or set a log driver.

## API Behavior

### Create Pod

`POST /api/pods` (JSON):

```json
{
  "name": "Friday Pod",
  "description": "Casual commander table"
}
```

Returns `201` with:

```json
{
  "pod": {
    "id": 1,
    "name": "Friday Pod",
    "description": "Casual commander table",
    "role": "owner"
  }
}
```

Malformed JSON returns `400` with an `error` field.

## Development Commands

### Setup helper

```bash
composer setup
```

### Run app stack

```bash
composer dev
```

### Tests

```bash
php artisan test --compact
php artisan test --compact tests/Feature/OtpAuthenticationTest.php
```

### Lint / format

```bash
composer lint
vendor/bin/pint --dirty --format agent
```

### Build assets

```bash
npm run build
```

## Project Structure

```text
app/
  Actions/Fortify/            Fortify user/password action classes
  Http/Controllers/Api/      API endpoints
  Http/Requests/             API request validation
  Livewire/                  Dashboard component
  Models/                    User, Pod, PodMember, Event
  Providers/FortifyServiceProvider.php
resources/views/
  auth/                      Fortify auth pages (Flux UI)
  layouts/pod.blade.php
  livewire/                  Livewire dashboard template
routes/web.php               App routes + API routes
tests/Feature/               Auth, dashboard, API coverage
```

## Security Notes

- Authentication is handled through Laravel Fortify's built-in login pipeline.
- Login attempts are rate-limited by email + IP (`fortify.limiters.login`).
- Passwords are hashed by Laravel (`password` cast on `User`).
- Dashboard and API data are scoped to the authenticated session user.

## Documentation

- `AGENTS.md` - repository-specific engineering instructions for coding agents
- `routes/web.php` - source of truth for app routes
- `app/Providers/FortifyServiceProvider.php` - Fortify view/action bindings and login throttling
- `tests/Feature/OtpAuthenticationTest.php` - authentication flow coverage (legacy filename)
- `tests/Feature/ApiEndpointsTest.php` - API authorization and responses

## License

MIT (`LICENSE`)
