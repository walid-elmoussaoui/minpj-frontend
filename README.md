
# Todo App - Laravel Backend

REST API built with Laravel for the Todo List application.

## Requirements

- PHP
- Composer
- MySQL
- Laravel

## Installation

1. Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL
```

2. Install dependencies:

```bash
composer install
```

3. Create your environment file:

```bash
copy .env.example .env
```

4. Generate application key:

```bash
php artisan key:generate
```

5. Configure your database in `.env`.

6. Run migrations:

```bash
php artisan migrate
```

7. Start Laravel:

```bash
php artisan serve
```

## API

Base URL:

```text
http://127.0.0.1:8000/api
```

## Deployment

Prepared for production deployment using Docker and Render.

## Security

Never commit `.env` or database credentials.
