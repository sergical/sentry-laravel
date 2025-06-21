# Laravel + Sentry Todo Application

A modern Laravel application with React/TypeScript frontend, featuring comprehensive Sentry error tracking, session replay, and a todo management system for testing error monitoring capabilities.

## Features

### 🔧 Core Application

- **Laravel 12** with Inertia.js for seamless SPA experience
- **React 19** with TypeScript for type-safe frontend development
- **Tailwind CSS** with shadcn/ui components for modern UI
- **SQLite** database for simple setup and portability
- **Authentication system** with Laravel Breeze

### 📝 Todo Management System

- Create, update, and delete todos
- Mark todos as completed/incomplete
- User-specific todo lists with proper authorization
- Real-time UI updates with optimistic updates

### 🐛 Sentry Integration

- **Full-stack error tracking** (Laravel + React)
- **Session replay** for debugging user interactions
- **Performance monitoring** with tracing
- **User context** automatically attached to errors
- **Breadcrumb tracking** for detailed error context
- **Custom error boundaries** for React error handling

### 🧪 Sentry Testing Features

- **"Ooopsie Mode"** toggle for triggering test errors
- Server-side error generation with user context
- Frontend error handling with graceful degradation
- Comprehensive error capture with additional metadata
- Test different error scenarios (create, update, delete operations)

## Installation

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- npm or yarn

### Setup Steps

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd sentry-laravel
    ```

2. **Install PHP dependencies**

    ```bash
    composer install
    ```

3. **Install JavaScript dependencies**

    ```bash
    npm install
    ```

4. **Environment setup**

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

5. **Database setup**

    ```bash
    php artisan migrate
    ```

6. **Configure Sentry**

    - Create a Sentry account at [sentry.io](https://sentry.io)
    - Create a new Laravel project in Sentry
    - Add your Sentry DSN to `.env`:

        ```env
        SENTRY_LARAVEL_DSN=your_sentry_dsn_here
        ```

    - Update `resources/js/instrument.ts` with your React Sentry DSN

7. **Build assets**

    ```bash
    npm run build
    # or for development
    npm run dev
    ```

8. **Start the application**

    ```bash
    php artisan serve
    ```

## Usage

### Basic Todo Operations

1. Register/login to access the dashboard
2. Use the "Add Todo" button to create new todos
3. Click checkboxes to mark todos as complete
4. Use "Delete" buttons to remove todos

### Testing Sentry Integration

1. **Enable Ooopsie Mode**: Toggle the "Ooopsie Mode" switch in the dashboard
2. **Trigger Test Errors**: With ooopsie mode enabled, try to:
    - Create a new todo
    - Toggle a todo's completion status
    - Delete a todo
3. **View Errors**: Check your Sentry dashboard to see captured errors with:
    - Full stack traces
    - User context (ID, name, email)
    - Session replay footage
    - Breadcrumb trails
    - Custom error metadata

### Frontend Error Testing

Visit the welcome page and click "Break the world" to test frontend error capture.

### Server Error Testing

Visit `/debug-sentry` to test basic server error capture.

## Architecture

### Backend (Laravel)

- **Models**: `User`, `Todo` with proper relationships
- **Controllers**: `TodoController` with CRUD operations and error testing
- **Middleware**: Sentry integration with user context
- **Database**: SQLite with migrations for users and todos

### Frontend (React/TypeScript)

- **Pages**: Dashboard, authentication, settings
- **Components**: Reusable UI components with shadcn/ui
- **Hooks**: Custom hooks for appearance, mobile detection
- **Layouts**: Flexible layout system with sidebar navigation
- **Error Handling**: Comprehensive error boundaries and Sentry integration

### Sentry Configuration

- **Laravel SDK**: Configured in `bootstrap/app.php` and `config/sentry.php`
- **React SDK**: Configured in `resources/js/instrument.ts`
- **User Context**: Automatic user identification on authentication
- **Performance Monitoring**: Enabled for both frontend and backend
- **Session Replay**: Configured for error debugging

## Development

### Running in Development Mode

```bash
# Terminal 1: Laravel development server
php artisan serve

# Terminal 2: Vite development server
npm run dev
```

### Code Quality

```bash
# PHP formatting and linting
composer format
composer lint

# JavaScript/TypeScript formatting and linting
npm run format
npm run lint
npm run types
```

### Testing

```bash
# PHP tests
php artisan test

# JavaScript tests (if added)
npm run test
```

## Documentation

See the `docs/` folder for additional documentation:

- [`docs/laravel.md`](docs/laravel.md) - Laravel setup notes and observations
- [`docs/sentry.md`](docs/sentry.md) - Detailed Sentry configuration notes

## Database

The application uses SQLite by default for simplicity. The database includes:

- **users** table: User authentication and profile data
- **todos** table: Todo items with user relationships
- **Standard Laravel tables**: migrations, cache, jobs, etc.

For production, you can easily switch to MySQL, PostgreSQL, or other databases by updating the `.env` configuration.

## Security Features

- CSRF protection on all forms
- User authorization (users can only access their own todos)
- Input validation and sanitization
- Secure password hashing
- Rate limiting on authentication endpoints

## Browser Support

- Modern browsers with ES2020+ support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers supported via responsive design

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is open-sourced software licensed under the [MIT license](LICENSE).

## Support

For issues related to:

- **Laravel**: Check the [Laravel documentation](https://laravel.com/docs)
- **Sentry**: Check the [Sentry documentation](https://docs.sentry.io/)
- **This project**: Create an issue in the repository

---

**Note**: This application is designed for development and testing purposes. For production deployment, ensure you configure proper environment variables, database connections, and security settings.
