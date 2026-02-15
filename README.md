<p align="center">
  <img src="public/favicon.svg" alt="PodDashboard logo" width="84" />
</p>

<p align="center">
  Lean Laravel + Livewire app for OTP sign-in, pod management, and upcoming events.
</p>

# PodDashboard

PodDashboard is a trimmed TALL-stack app for organizing tabletop pods and events.
It currently ships with:

- Passwordless email OTP sign-in (`/login`, `/verify`)
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
- `GET /login` -> OTP request page (guest)
- `GET /verify` -> OTP verify page (guest)
- `GET /dashboard` -> dashboard (auth)
- `POST /logout` -> session logout (auth)
- `GET /up` -> health endpoint

### API (session-authenticated)

- `GET /api/pods`
- `POST /api/pods`
- `GET /api/events`

Unauthenticated API requests return `401`.

## Requirements

- PHP 8.4+
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
- `http://localhost:8000/verify`
- `http://localhost:8000/dashboard`
- `http://localhost:8000/up`

If frontend changes are not reflected, run `npm run dev` (or `npm run build`).

## Local Data and OTP Notes

Optional seed user:

```bash
php artisan db:seed
```

Seeder creates `test@example.com`.

OTP delivery uses your configured mail transport. For local development, use a mailbox catcher (Mailpit/Mailhog) or set a log driver.

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
  Http/Controllers/Api/      API endpoints
  Http/Requests/             API request validation
  Livewire/                  OTP and dashboard components
  Mail/                      OTP mail class
  Models/                    User, Pod, PodMember, Event, OtpCode
  Services/OtpAuthService.php
resources/views/
  layouts/pod.blade.php
  livewire/                  Livewire page templates
  emails/                    OTP email templates
routes/web.php               Web + API route definitions
tests/Feature/               OTP, dashboard, API coverage
```

## Security Notes

- OTP codes are hashed (`sha256`) before storage.
- OTP codes expire and are single-use.
- OTP send and verify actions are rate-limited by email + IP.
- Dashboard and API data are scoped to the authenticated session user.

## Documentation

- `AGENTS.md` - repository-specific engineering instructions for coding agents
- `routes/web.php` - source of truth for app routes
- `app/Services/OtpAuthService.php` - OTP issue/verify/login flow
- `tests/Feature/OtpAuthenticationTest.php` - OTP and throttling behavior
- `tests/Feature/ApiEndpointsTest.php` - API authorization and responses

## License

MIT (`LICENSE`)
