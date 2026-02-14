# Magic Pod Dashboard

Magic Pod Dashboard is now a Laravel 12 + Livewire 4 application located in `pod-app/`.

## App location

- `pod-app/` contains the complete rewritten application.

## Stack

- Backend/framework: Laravel 12 (PHP 8.2+)
- UI: Livewire 4
- Database: PostgreSQL
- Auth: Email OTP + Laravel session auth
- Mail: SMTP

## Quick start

```bash
cd pod-app
cp .env.example .env
composer install
npm install
php artisan key:generate
php artisan migrate
php artisan serve
```

## Core routes

- `GET /login`: request email OTP
- `GET /verify`: verify OTP
- `GET /dashboard`: authenticated pod/event dashboard
- `GET /api/pods`: list current user pods
- `POST /api/pods`: create pod
- `GET /api/events`: list upcoming events
