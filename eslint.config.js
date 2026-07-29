// Flat ESLint config. Deliberately narrow: this is a no-build static site, so
// the goal is catching *runtime* mistakes (undeclared identifiers, unreachable
// code), not enforcing style on a decade of accumulated JS.
//
// This exists because of a real bug: KeyFunctions.js did `if (!Settings)` on an
// identifier that pages never declared, which throws a ReferenceError rather
// than short-circuiting - silently killing the rest of the handler. `no-undef`
// catches exactly that class of error.
import globals from 'globals';

export default [
    // Global ignores must be their own config entry - `ignores` alongside
    // `files` only narrows that one entry rather than excluding files outright.
    {
        ignores: [
            'node_modules/**',
            '.git/**',
            'eslint.config.js', // this file is an ES module; the site ships classic scripts
            '**/*.min.js',      // vendored third-party bundles
        ],
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'script',
            globals: {
                ...globals.browser,
                // Cross-file globals this site genuinely relies on.
                applyTheme: 'writable',
                getTheme: 'writable',
                renderProjects: 'writable',
                // Optional page-level debug flag, always typeof-guarded.
                debugging: 'readonly',
                // From the qrcode CDN bundle loaded via <script> on /app/projects/qr/.
                QRCode: 'readonly',
            },
        },
        rules: {
            'no-undef': 'error',
            'no-unreachable': 'error',
            'no-dupe-keys': 'error',
            'no-dupe-args': 'error',
            'no-func-assign': 'error',
            'no-cond-assign': 'error',
            'use-isnan': 'error',
            'valid-typeof': 'error',
        },
    },
];
