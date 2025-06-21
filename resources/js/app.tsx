import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import * as Sentry from '@sentry/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import './instrument';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el, {
            // Callback called when an error is thrown and not caught by an ErrorBoundary.
            onUncaughtError: Sentry.reactErrorHandler((error, errorInfo) => {
                console.warn('Uncaught error', error, errorInfo.componentStack);
            }),
            // Callback called when React catches an error in an ErrorBoundary.
            onCaughtError: Sentry.reactErrorHandler(),
            // Callback called when React automatically recovers from errors.
            onRecoverableError: Sentry.reactErrorHandler(),
        });

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
