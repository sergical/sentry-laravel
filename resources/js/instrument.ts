import * as Sentry from '@sentry/react';

Sentry.init({
    dsn: 'https://3b7625de6b9058e5a6f40f6740d1c262@o4505994951065600.ingest.us.sentry.io/4509537656766464',

    // Adds request headers and IP for users, for more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/react/configuration/options/#sendDefaultPii
    sendDefaultPii: true,

    integrations: [
        // If you're using react router, use the integration for your react router version instead.
        // Learn more at
        // https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
    ],

    // Enable logs to be sent to Sentry
    _experiments: { enableLogs: true },

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for tracing.
    // Learn more at
    // https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
    tracesSampleRate: 1.0,

    // Set `tracePropagationTargets` to control for which URLs trace propagation should be enabled
    tracePropagationTargets: [/^\//, /^https:\/\/yourserver\.io\/api/],

    // Capture Replay for 10% of all sessions,
    // plus for 100% of sessions with an error
    // Learn more at
    // https://docs.sentry.io/platforms/javascript/session-replay/configuration/#general-integration-configuration
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
});
