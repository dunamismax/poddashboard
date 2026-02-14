# AGENTS.md

This file gives fast context for AI agents working in this repo.

## Project summary

Magic Pod Dashboard is a web app for Magic: The Gathering pods and other tabletop groups.
It focuses on pod management, event planning, attendance and arrival tracking, invites, and real-time notifications.

## Repo layout

- `pod-app/`
  - Laravel 12 + Livewire 4 application
  - `app/` domain logic, models, Livewire classes, services
  - `resources/views/livewire/` full-page Livewire views
  - `routes/web.php` web routes and `/api/*` session-auth API routes
  - `database/migrations/` schema source of truth

## Environment

- Work from `pod-app/.env` (copy from `pod-app/.env.example`).
- Required keys:
  - `DATABASE_URL`
  - `SMTP_HOST`
  - `SMTP_PORT`
  - `SMTP_SECURE`
  - `SMTP_FROM`

## Commands

- Install PHP deps: `cd pod-app && composer install`
- Install frontend deps: `cd pod-app && npm install`
- Run app: `cd pod-app && php artisan serve`
- Run tests: `cd pod-app && php artisan test`
- Run migrations: `cd pod-app && php artisan migrate`

## Conventions

- Keep domain logic in `pod-app/app/Services`.
- Keep Livewire page behavior in class-based components under `pod-app/app/Livewire`.
- Keep schema changes in Laravel migrations under `pod-app/database/migrations`.

## License

MIT. See `LICENSE`.
