# Developer Guide

This guide is for developers who want to work on RJ Nexus itself, or who want to build plugins, themes, and widgets on top of it. It explains how to set up a development environment, how the project is organized, which standards apply, and how to submit changes.

**Tested on:** v1.12.2

## 1. Before you start

Read these pages first if you have not already:

| Page | Why it matters |
|------|----------------|
| [Getting Started](https://rjnexus.org/en/docs/getting-started) | Core concepts and the admin panel |
| [Installation](https://rjnexus.org/en/docs/installation) | How the browser-based installer works |
| [Widget Development](https://rjnexus.org/en/docs/widget-development) | Building RJBuilder widgets |
| [Plugins](https://rjnexus.org/en/docs/plugins) | Building plugins |
| [Theme Development](https://rjnexus.org/en/docs/theme-development) | Building themes |
| [Helper Functions](https://rjnexus.org/en/docs/helper-functions) | Functions available to themes and plugins |

## 2. Technology stack

| Layer | Technology |
|-------|------------|
| Backend | Laravel 12, PHP 8.2 |
| Database | MySQL |
| Frontend | Blade, Tailwind CSS v3, Alpine.js |
| Build tool | Vite |
| Page caching | `spatie/laravel-responsecache`, `litespeed/lscache-laravel` |
| AI | Free AI Proxy and OpenRouter |

## 3. Requirements

- PHP 8.2 or later with the extensions required by Laravel 12
- Composer
- Node.js (current LTS) and npm
- MySQL
- Git
- A local web server (for example Laragon, XAMPP, Valet, or the built-in PHP server)

## 4. Setting up a development environment

1. **Fork and clone** the repository.

   ```bash
   git clone https://github.com/<your-username>/rj-nexus.git
   cd rj-nexus
   ```

2. **Install dependencies.**

   ```bash
   composer install
   npm install
   ```

3. **Create the environment file and application key.**

   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Create an empty database** and configure the connection in `.env`.

5. **Run the installer.** Serve the project locally, open `/install.php` in your browser, and follow the steps. The installer creates the tables, your administrator account, and the demo data. See [Installation](https://rjnexus.org/en/docs/installation).

6. **Compile assets.**

   ```bash
   npm run dev
   ```

   Use `npm run build` to produce production assets.

7. **Sign in** at `/admin` with the account you created.

Do not commit your `.env` file, database dumps, or uploaded media.

## 5. Project structure

The most relevant locations for contributors:

| Path | Purpose |
|------|---------|
| `app/Widgets/Builtin/` | Built-in RJBuilder widget classes |
| `resources/views/rjbuilder/widgets/builtin/` | Blade views for the built-in widgets |
| `resources/views/rjbuilder/CHANGELOG.md` | Changelog of the page builder |
| `app/Helpers/rj.php` | Global helper functions (`rj_*`) |
| `lang/` | Interface translations (`en.json`, `az.json`, and so on) |
| `installer/` | Browser-based installer |
| `installer/lang/` | Installer translations |
| `installer/helpers.php` | Registered installer languages and search aliases |
| `public/images/flags/` | Language flag images |
| `CHANGELOG.md` | Release history of the core |
| `SUPPORTERS.md` | List of contributors and supporters |

Plugins and themes are fully isolated from the core and have their own routes, views, and migrations. Never modify core files from a plugin or theme. Use the extension points described in [Plugins](https://rjnexus.org/en/docs/plugins) and [Theme Development](https://rjnexus.org/en/docs/theme-development).

## 6. Architecture principles

**Modularity.** The core provides the platform. Features that are not essential belong in plugins. Plugins and themes must be installable, updatable, and removable without touching the core.

**Widget-first themes.** Themes are built from RJBuilder widgets. Prefer a new widget over custom markup in a theme when the result can be reused.

**Admin views.** Admin pages extend the shared layout and fill the `title` and `content` sections:

```blade
@extends('admin.layouts.app')

@section('title', __('Page Title'))

@section('content')
    <div class="space-y-6">
        {{-- page content --}}
    </div>
@endsection
```

Admin routes are named under the `admin.` prefix (for example `admin.posts.index`). Use named routes in views and never hard-code URLs.

**Multilingual by design.** Every piece of translatable content (title, slug, excerpt, content) can exist per language. Features that touch content must be tested with more than one language.

## 7. Coding standards

### PHP

- Follow PSR-12.
- Use strict, explicit types where practical.
- Validate all input and sanitize settings before use. Whitelist select values, validate colors and numbers, and cap list sizes.
- Authorize every admin action through the roles and permissions system.
- Never trust request data. Never build queries from raw input.

### Blade and HTML

- Escape all output with `{{ }}`. Use `{!! !!}` only for content that has already been escaped or encoded, and document why.
- Use named routes and the `asset()` helper.
- Use semantic HTML and keep pages accessible: real buttons and links, labels for inputs, visible focus states, and sufficient contrast.

### CSS and JavaScript

- Use Tailwind CSS v3 utility classes in admin views.
- Scope custom CSS and JavaScript to the component. In widgets, use a unique instance ID so several copies can exist on one page.
- Wrap scripts in an immediately invoked function and guard against running twice.
- Do not add external dependencies, CDN scripts, remote fonts, or tracking. RJ Nexus must work on shared hosting and without outbound requests.
- Respect `prefers-reduced-motion` for animations.

### Translations in code

- Wrap every visible string in `__()`. Do not hard-code interface text.
- The English text is the translation key. Add new strings to `lang/en.json`.
- Keep placeholders such as `:name` and `:count` intact in all languages.

## 8. Working with multiple languages

- Translated fields such as `translations[az][slug]` must be included in validation rules. Validated data contains only the fields that were validated, so missing rules cause translated content to be dropped silently on save.
- Slugs are unique per language. Never assume that a post has a single slug.
- Right-to-left languages are registered at the language level. Test new layouts in an RTL language.
- To add a language, follow the steps on the [Language Settings and Translation](https://rjnexus.org/en/docs/translations) page.

## 9. Caching considerations

RJ Nexus uses two page-cache layers: Response Cache (application level) and LiteSpeed LSCache (web server level). See [Caching](https://rjnexus.org/en/docs/caching).

When you add dynamic or user-specific output:

- Confirm that the page is not cached for the wrong audience.
- Test the page with the caches enabled, not only in development.
- Clear the cache after changing settings that affect frontend output.

## 10. Branches, commits, and pull requests

1. Open an issue before starting work on a large change.
2. Create a branch from the latest `main`. Use a descriptive prefix:

   | Prefix | Use |
   |--------|-----|
   | `feat/` | New features |
   | `fix/` | Bug fixes |
   | `docs/` | Documentation |
   | `lang/` | Translations |
   | `widget/` | New widgets |

3. Write clear commit messages in the conventional format:

   ```
   type(scope): short summary

   - optional detail
   ```

   Common types: `feat`, `fix`, `docs`, `refactor`, `perf`, `chore`.

4. Keep pull requests focused on a single change.
5. Describe what changed, why, and how you tested it. Add screenshots for interface changes.
6. Update the relevant changelog (see section 12).

## 11. Testing

Before opening a pull request, verify the following manually:

- The feature works in the admin panel and on the frontend.
- The feature works with at least two languages, including one right-to-left language if the change affects layout.
- RJBuilder changes work on the builder canvas and on the saved frontend page.
- Output is correct with page caching enabled.
- The interface is usable on mobile, tablet, and desktop widths.
- No PHP errors or notices appear in the logs.
- No JavaScript errors appear in the browser console.

If the project includes automated tests, run them and add tests for new behavior where practical:

```bash
php artisan test
```

## 12. Changelog and versioning

RJ Nexus uses versions in the form `vMAJOR.MINOR.PATCH`.

- Record changes in `CHANGELOG.md` under the version they ship in, grouped as **Added**, **Improved**, **Fixed**, and **Cleanup**.
- Record page builder changes in `resources/views/rjbuilder/CHANGELOG.md`.
- Describe the user-visible effect of a change, not only the code that changed.

Maintainers decide the version number when a release is prepared. Contributors do not need to change version numbers.

## 13. Security

- Do not include secrets, API keys, passwords, or private data in code, commits, issues, or screenshots.
- Report vulnerabilities privately to the maintainers. Do not disclose them in public issues.
- Apply CSRF protection to every form that changes data.
- Check permissions on the server. Hiding a button is not access control.

## 14. Recognition

Every merged contribution is credited by name in `SUPPORTERS.md` and on [rjnexus.org](https://rjnexus.org). Supporter titles are awarded according to the number and scale of contributions.

## 15. Getting help

- Questions and ideas: [GitHub Discussions](https://github.com/orgs/rj-nexus/discussions)
- Bugs and tasks: [GitHub Issues](https://github.com/rj-nexus/rj-nexus/issues)
- Source code: [github.com/rj-nexus/rj-nexus](https://github.com/rj-nexus/rj-nexus)
