# Building an RJ Nexus Theme: A Widget-First Approach, Using Spotlight as the Example

*A hands-on tutorial for developers*

A classic CMS theme is usually hundreds of PHP templates plus a pile of CSS and JS. RJ Nexus works differently: **a theme is a collection of widgets for building a site.** The main design of each page comes from the Builder in the admin panel. The theme only handles special cases: `layout`, `home`, `archive`, `single-page` and `single-post`.

In this guide we'll use the Spotlight theme as a reference and walk through building a working theme from scratch.

## Table of Contents

1. [Why widget-first?](#1-why-widget-first)
2. [Folder structure](#2-folder-structure)
3. [`theme.json`: the theme's passport](#3-themejson-the-themes-passport)
4. [The ServiceProvider: your theme's entry point](#4-the-serviceprovider-your-themes-entry-point)
5. [Your first widget, step by step](#5-your-first-widget-step-by-step)
6. [`BaseWidget` helpers](#6-basewidget-helpers)
7. [The Customizer and `layout.blade.php`](#7-the-customizer-and-layoutbladephp)
8. [Custom page templates](#8-custom-page-templates)
9. [The hook system](#9-the-hook-system)
10. [The starter content mechanism](#10-the-starter-content-mechanism)
11. [Publishing your theme](#11-publishing-your-theme)
12. [Best practices and traps from the real project](#12-best-practices-and-traps-from-the-real-project)

---

## 1. Why widget-first?

- **Lightweight.** Only the widgets used on a page are rendered. The CSS and JS of the 20 unused widgets never load.
- **Isolated.** Each widget scopes its own `<style>` and `<script>` with a unique `#uid`, so widgets can't break each other's styles.
- **Reusable.** The same widget works on any page, in the header, in the footer and in popups.

A theme ends up being three things: **widgets**, **layout templates** and **Customizer settings**.

## 2. Folder structure

```text
rj-content/themes/spotlight/
├── theme.json                  # theme manifest
├── screenshot.png              # theme preview image
├── README.md / CHANGELOG.md / LICENSE
├── assets/                     # static files
├── demo/                       # data for starter content
├── src/
│   ├── SpotlightServiceProvider.php
│   ├── Services/SpotlightStarterContent.php
│   └── Widgets/                # one PHP class per widget
└── views/
    ├── layout.blade.php
    ├── home.blade.php
    ├── archive.blade.php
    ├── single-page.blade.php
    ├── single-post.blade.php
    ├── errors/404.blade.php
    ├── partials/               # loop-card, popup
    ├── templates/              # contact, landing, full-width
    └── widgets/                # widget Blade files
```

The rule of thumb: **logic lives in `src/`, markup lives in `views/`.**

## 3. `theme.json`: the theme's passport

```json
{
  "name": "Spotlight",
  "slug": "spotlight",
  "version": "1.1.4",
  "namespace": "Spotlight",
  "provider": "Spotlight\\SpotlightServiceProvider",
  "requires": { "rj_cms": ">=1.8.6", "php": ">=8.2" },
  "views": {
    "layout": "views/layout.blade.php",
    "single_post": "views/single-post.blade.php",
    "single_page": "views/single-page.blade.php",
    "archive": "views/archive.blade.php"
  }
}
```

Key fields:

- **`namespace` + `provider`**: this is how the CMS knows which class to boot.
- **`requires`**: blocks installation on an incompatible CMS or PHP version.
- **`views`**: templates for the special page types.
- **`custom_templates`**: templates an editor can pick when creating a page (`contact`, `landing`, `full-width`).
- **`customizer`**: settings for colors, fonts, layout and so on. Each control has a `type`, a `label` and a `default`.

`assets.css` and `assets.js` can stay empty, since widgets ship their own styles inline. If you do need a global file, `layout.blade.php` picks it up automatically through `$activeTheme->metadata()['assets']`.

## 4. The ServiceProvider: your theme's entry point

Where WordPress has `functions.php`, RJ Nexus has a Laravel `ServiceProvider`:

```php
namespace Spotlight;

use Illuminate\Support\ServiceProvider;
use Spotlight\Widgets\SpotlightVideoShowcaseWidget;

class SpotlightServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Tell Laravel where the spotlight:: view namespace lives
        $this->loadViewsFrom(__DIR__ . '/../views', 'spotlight');

        $this->registerWidgets();
        $this->maybeSetupStarterContent();
    }

    protected function registerWidgets(): void
    {
        if (!function_exists('rj_add_filter')) return;

        rj_add_filter('builder.widgets', function ($existing) {
            return array_merge($existing, [
                new SpotlightVideoShowcaseWidget(),
                // more widgets...
            ]);
        });
    }
}
```

Two things matter here:

1. `loadViewsFrom(..., 'spotlight')` is what makes `view('spotlight::widgets.video-showcase')` work.
2. Widgets aren't registered directly. They're appended to the list through the `builder.widgets` filter, which keeps the theme and the Builder loosely coupled.

## 5. Your first widget, step by step

Every widget extends `BaseWidget`. It gives you `defaults()`, the shared style fields (`bg_type`, `box_shadow`, and so on), animation fields and a set of helper methods.

### 5.1. The PHP class

```php
namespace Spotlight\Widgets;

use App\Widgets\BaseWidget;

class SpotlightVideoShowcaseWidget extends BaseWidget
{
    public function id(): string       { return 'spotlight-video-showcase'; }
    public function name(): string     { return __('Spotlight Video Showcase'); }
    public function category(): string { return 'spotlight'; }
    public function description(): string
    {
        return __('Display a video inside a sleek browser mockup with a lightbox play button.');
    }
    public function contexts(): array  { return ['page', 'block']; }

    public function schema(): array
    {
        return [
            ['name' => 'title',       'type' => 'text',  'label' => __('Title'),
             'default' => __('See it in action'), 'tab' => 'content'],
            ['name' => 'video_url',   'type' => 'text',  'label' => __('Video URL (YouTube, Vimeo, or MP4)'),
             'default' => '', 'tab' => 'content'],
            ['name' => 'cover_image', 'type' => 'image', 'label' => __('Cover Image'),
             'default' => '', 'tab' => 'content'],
        ];
    }

    public function render(array $settings): string
    {
        $uid = 'vs_' . substr(md5(uniqid('', true)), 0, 8);

        return view('spotlight::widgets.video-showcase', compact('settings', 'uid'))->render();
    }
}
```

What each method does:

| Method | Purpose |
|---|---|
| `id()` | Unique identifier. Builder blocks are stored with it |
| `category()` | Grouping in the widget panel |
| `contexts()` | Where the widget can be used (`page`, `block`) |
| `schema()` | The fields shown in the admin panel |
| `render()` | Returns the final HTML |

Field types seen in `BaseWidget` and the Spotlight widgets: `text`, `textarea`, `image`, `color`, `select`, `number`, `media`. Tab values: `content`, `style`, `advanced`.

### 5.2. The Blade view

The core rules of `views/widgets/video-showcase.blade.php`:

```blade
@php
    $uid      = $uid ?? ('vs_' . substr(md5(uniqid('', true)), 0, 8));
    $title    = $settings['title'] ?? '';
    $videoUrl = $settings['video_url'] ?? '';
@endphp

<section class="rj-vs" id="{{ $uid }}">
    ...
    <style>
        #{{ $uid }}.rj-vs { /* every rule starts with the uid */ }
    </style>
    <script>
        (function () {
            var root = document.getElementById(@js($uid));
            if (!root) return;
            // logic for this widget only
        })();
    </script>
</section>
```

Four rules to follow:

1. **Every CSS rule starts with `#uid`.** A second instance of the widget on the same page keeps working.
2. **JS lives inside an IIFE.** No globals leak out.
3. **Use `$settings['key'] ?? ''`.** The editor may not have filled in a field yet, or the field may have been added after the block was saved.
4. **`{{ }}` escapes automatically.** When passing a value into JS, use `@js(...)`.

### 5.3. Three technical lessons from the real project

**Move the lightbox to `<body>`.** A `position: fixed` element doesn't cover the viewport when it sits inside a transformed ancestor. The fix:

```js
document.body.appendChild(lightbox);
```

**Pause infinite animations when off-screen.**

```js
new IntersectionObserver(function (e) {
    root.classList.toggle('rj-idle', !e[0].isIntersecting);
}, { threshold: 0.08 }).observe(root);
```

```css
#uid.rj-idle *, #uid.rj-idle *::before { animation-play-state: paused !important; }
```

**Validate the video URL.** To block schemes like `javascript:`, only allow addresses starting with `http(s)://` or `/`. Build the embed URL with a regex for YouTube and Vimeo, and use a `<video>` element for `.mp4/.webm/.ogg`.

Support `prefers-reduced-motion` too, with `animation: none`.

## 6. `BaseWidget` helpers

Don't rewrite the same code every time:

| Helper | What it does |
|---|---|
| `defaults()` / `fullDefaults()` | Collects default values from the schema |
| `commonStyleSchema()` | Background, shadow, `align_self`, `order` fields |
| `advancedSchema()` | Animation, hover, CSS ID/class |
| `applyAnimation($html, $settings)` | Wraps the HTML in an `rj-animate-*` class |
| `backgroundCss($settings)` | Returns CSS for `classic` and `gradient` backgrounds |
| `boxShadowCss($shadow)` | Maps `sm/md/lg/xl` to CSS |
| `linkAttrs($settings, 'link')` | `href`, `target`, `rel="noopener nofollow"` |
| `iconSvg('arrow-right', 20)` | Built-in SVG icon set |
| `repeaterItems($settings, 'items')` | Safely turns repeater fields into an array |
| `escape()` / `attr()` | `htmlspecialchars` and an attribute builder |
| `dimensionCss()` / `spacingStyle()` | Turns padding/margin values into CSS |

If you build HTML in PHP instead of Blade, **run every user-supplied value through `escape()`.**

## 7. The Customizer and `layout.blade.php`

Theme settings are declared in `theme.json` and read in templates like this:

```php
$cPrimary = rj_theme_mod('primary_color', null, 'colors');
```

Three parameters: **key**, **default**, **section name**.

The main principle: **never write a user-controlled value straight into CSS. Validate it first.** Spotlight does it like this:

```php
$sanitizeColor = function ($value, $default) {
    $value = is_string($value) ? trim($value) : '';
    return preg_match('/^#[0-9a-fA-F]{3,8}$/', $value) ? $value : $default;
};

$allowedFonts = ['Inter', 'Figtree', 'Roboto', 'Open Sans', 'Lato', 'Poppins', 'system-ui'];
if (!in_array($fontBody, $allowedFonts, true)) $fontBody = 'Inter';

$fontSizeBase = max(12, min(24, (int) rj_theme_mod('font_size_base', 16, 'typography')));
```

The validated values then become CSS variables:

```css
:root {
    --rj-primary: {{ $cPrimary }};
    --rj-bg: {{ $cBg }};
    --rj-container: {{ $containerWidth }}px;
}
```

If your widgets use `var(--rj-primary)`, they all follow along when someone changes the color in the Customizer.

## 8. Custom page templates

`single-page.blade.php` is simple at its core:

```blade
@extends('theme::layout')

@section('content')
<header class="rj-frontend-header">
    @if($header) {!! rj_render_template($header) !!} @endif
</header>

<main class="rj-frontend-main">
    @if($page)
        @if($page->isBuilderMode() && $page->hasBlocks())
            {!! rj_render_blocks($page->blocks['blocks'] ?? []) !!}
        @elseif(!empty($page->content))
            <div class="rj-classic-content">{!! $page->content !!}</div>
        @endif
    @endif
</main>

<footer class="rj-frontend-footer">
    @if($footer) {!! rj_render_template($footer) !!} @endif
</footer>
@endsection
```

Three helpers do the work:

- `rj_render_blocks($blocks)` turns Builder blocks into HTML. Each block is looked up in `WidgetRegistry`, dynamic values are resolved (`rj_resolve_dynamics`), then `render()` is called.
- `rj_render_template($template)` renders header and footer templates.
- `rj_theme_mod()` reads a Customizer value.

There's no wrapper in this template, so the Builder's design shows up exactly as built. The theme only adds shared "atmosphere" layers such as the background video and the starfield.

`archive` and `single-post` are different. There the theme designs the page itself (sidebar, categories, comments), because those parts aren't built with the Builder.

## 9. The hook system

`rj_add_filter` and `rj_add_action` follow WordPress logic:

```php
// Filter: modifies a value and returns it
rj_add_filter('builder.widgets', function ($widgets) {
    $widgets[] = new MyWidget();
    return $widgets;
}, 10, 1);

// Action: does something, returns nothing
rj_add_action('some.event', function ($arg1, $arg2) {
    // ...
}, 10, 2);
```

- **Priority**: lower numbers run first (default 10).
- **`acceptedArgs`**: how many arguments are passed to the callback.
- **Safety**: if a callback throws, `HookRegistry` catches it and logs it, and the site keeps running. For filters, the value stays unchanged.
- Use `rj_remove_filter` to remove a callback and `rj_has_filter` to check for one.

Two limitations are worth knowing about. `didAction()` currently never increments its counter, and there's no theme activation hook. Both are worth adding to the CMS core.

## 10. The starter content mechanism

So that a freshly activated theme doesn't leave the site looking empty, demo content (pages, menus, posts) can be created automatically. Spotlight does it like this:

```php
protected function maybeSetupStarterContent(): void
{
    if (!function_exists('rj_get_option') || !function_exists('rj_set_option')) return;

    try {
        $activeTheme = rj_get_option('active_theme', '');

        if ($activeTheme === 'spotlight' && !rj_get_option('spotlight_starter_content_imported')) {
            SpotlightStarterContent::run();
            rj_set_option('spotlight_starter_content_imported', true);
        }
    } catch (\Throwable $e) {
        logger()->error('Spotlight Starter Content Error: ' . $e->getMessage());
    }
}
```

**The logic:**

1. If the active theme is `spotlight` and the `spotlight_starter_content_imported` flag is missing, `run()` executes.
2. After a successful run the flag is set to `true`, so it never runs again.
3. If you switch to another theme, nothing is imported. If you switch back, the flag is still set, so it doesn't import a second time either.

**Things to watch:**

- **Make it idempotent.** If `run()` throws halfway, the flag isn't set and it retries on every request. Inside `run()`, check things like "does a page with this slug already exist?"
- **Don't do heavy work inside a request.** The first visitor shouldn't have to wait. Ideally this runs from an activation hook or a queue.
- **To re-import**, delete the `spotlight_starter_content_imported` option.
- **Keep demo images and data** in the `demo/` folder, not in code.

## 11. Publishing your theme

### Pre-release checklist

- [ ] `version`, `requires`, `author` and `repo` in `theme.json` are correct.
- [ ] `screenshot.png` (plus `screenshot-1.png` and `screenshot-2.png` for the gallery) is in the repo.
- [ ] `README.md`, `CHANGELOG.md` and `LICENSE` exist.
- [ ] A GitHub **Release** is created with the ZIP attached.

### Registration: `rj-registration`

Themes are added to `themes.json` in the `rj-nexus/rj-registration` repo through a pull request:

```json
{
  "repo": "rj-nexus/spotlight",
  "name": "Spotlight",
  "author": "rj-nexus",
  "version": "1.1.4",
  "verified": true,
  "category": "general",
  "tags": ["dark", "glassmorphism", "ai", "saas", "premium"],
  "logo": "https://raw.githubusercontent.com/rj-nexus/spotlight/main/screenshot.png",
  "details": {
    "description": "A dark, modern, builder-first theme...",
    "features": ["20+ custom premium widgets", "Auto-import starter content on activation"]
  },
  "installation": {
    "steps": [
      "Download the ZIP from the releases page",
      "Go to Admin → Appearance → Themes",
      "Upload the ZIP file",
      "Click Activate"
    ]
  },
  "development": { "requires": "RJ Nexus >= 1.8.6" }
}
```

> **Note:** the version in `theme.json` (`1.1.4`) should match the one in `themes.json`. Update both on every release.

For users, installation is: **Admin → Appearance → Themes → upload ZIP → Activate.**

## 12. Best practices and traps from the real project

### Do

- Scope all widget CSS with `#uid`.
- Always validate user-supplied values (colors, fonts, URLs).
- Support `prefers-reduced-motion` and `:focus-visible`.
- Control heavy animations with `IntersectionObserver`.

### Watch out for

- **Schema and view must match.** The video widget's view reads `badge_text`, `play_label` and `accent_color`, but `schema()` doesn't define them, so editors can't fill them in. Every key your view reads should exist in the schema.
- **Validate colors inside widgets too.** `--ac: {{ $accent }}` is escaped, but its format isn't checked. Apply the same `sanitizeColor` logic from the layout.
- **Don't mix up Customizer sections.** `single-post.blade.php` reads `background_video` from the `blog_list` section, while `theme.json` defines a separate control under `blog_single`. If the sharing is intentional, document it. If not, fix it.
- **Don't send API keys in URLs.** For widgets that use internal AI services (for example Gemini's `?key=`), the key can end up in logs. Send it in a header (`x-goog-api-key`) instead.
- **Don't forget provider registration.** If you write a new widget class but don't add it to the `builder.widgets` list, the Builder will never see it.
- **Clean up duplicated code.** In `layout.blade.php`, `$themeAssets` is assigned twice. Harmless, but worth tidying.

---

## Summary

Put simply, Spotlight's architecture is that the theme doesn't draw the design itself. It hands you the tools to draw it. That keeps the site light, lets you test each widget on its own, and limits template work to the places that need it: layout, archive and single.

Write a widget, register it in `builder.widgets`, hook your colors into the Customizer, prepare starter content, and send a PR to `rj-registration`.
