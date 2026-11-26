# Helper Functions (Developer)

RJ Nexus ships a set of global helper functions, all prefixed with `rj_`. You can use them in Blade views, controllers, themes, plugins and widgets without importing anything.

They live in the core helpers file:

`app/Helpers/rj.php`

> **Note:** This file is part of the core and is replaced on every update. Never edit it to add your own functions. Put custom helpers in your own theme or plugin instead. See [Custom Colors (Developer)](#color-developer) for the same warning about presets.

Every function is wrapped in `function_exists()`, so you can safely define your own override with the same name in a file that loads earlier.

---

## Options

Options are simple key-value settings stored in the database. Most admin settings are saved this way.

- **`rj_get_option(string $name, $default = null)`**
  Returns the value of an option, or `$default` if it does not exist.

- **`rj_set_option(string $name, $value, string $group = 'general', string $type = 'text', bool $autoload = true)`**
  Creates or updates an option. `$group` and `$type` are used for organizing it, and `$autoload` controls whether it loads with the rest of the options.

- **`rj_delete_option(string $name)`**
  Removes an option.

- **`rj_flush_options()`**
  Clears the option cache. Call it after saving options from code so the next request reads fresh values.

```php
rj_set_option('admin_color_preset', 'forest');
rj_flush_options();

$preset = rj_get_option('admin_color_preset', 'purple');
```

---

## Languages and locales

- **`rj_available_locales(): array`**
  Scans the `lang` folder and returns every locale it finds. Both folders (`lang/en/`) and JSON files (`lang/en.json`) count. Falls back to the app locale if nothing is found.

- **`rj_frontend_locales(): array`**
  Returns the locales enabled for the public website. These are stored in the `frontend_locales` option. Locales that no longer exist in the `lang` folder are removed automatically, and the app locale is the fallback.

- **`rj_set_frontend_locales(array $locales): void`**
  Saves the list of public locales. Unknown locales are ignored and duplicates are removed.

- **`rj_is_frontend_locale(string $locale): bool`**
  Tells you whether a locale is enabled on the frontend.

- **`rj_lang_name(string $locale): string`**
  Returns a readable language name. It checks a custom name in the `lang_name_{locale}` option first, then PHP's `Locale` class, and finally the uppercase code.

- **`rj_lang_flag_url(string $locale): ?string`**
  Returns the URL of the flag image, or `null` if none is found. It looks for a custom file from the `lang_flag_{locale}` option, then for `{locale}.svg`, `.png`, `.jpg`, `.jpeg` or `.webp` in `public/images/flags/`.

- **`rj_locale_url(string $path = ''): string`**
  Builds a URL with the current locale in front, for example `/en/about`. An empty path or `/` gives the locale home page.

```php
<a href="{{ rj_locale_url('about') }}">{{ __('About') }}</a>
```

### Right-to-left (RTL)

- **`rj_is_rtl(?string $locale = null): bool`**
  Returns `true` for right-to-left languages. It checks the first two letters of the locale against `ar`, `fa`, `he`, `ur` and `yi`.

- **`rj_dir(?string $locale = null): string`**
  Returns `'rtl'` or `'ltr'`. Use it on the `<html>` tag.

```php
<html lang="{{ app()->getLocale() }}" dir="{{ rj_dir() }}">
```

---

## Admin color presets

- **`rj_color_presets(): array`**
  Returns all color presets. See [Custom Colors (Developer)](#color-developer) to add your own.

- **`rj_active_preset(): array`**
  Returns the currently selected preset. Falls back to `purple`.

- **`rj_active_preset_key(): string`**
  Returns the key of the selected preset, for example `cyan`.

- **`rj_css_variables(): string`**
  Returns the preset as a ready-to-print string of CSS variables (`--rj-purple`, `--rj-purple-light`, `--rj-pink`, `--rj-dark-1`, `--rj-dark-2`, `--rj-dark-3`).

- **`rj_logo_mask_url(): ?string`**
  Returns the URL of `public/images/logo-white.svg` (or `.png`, `.webp`) if it exists.

---

## Global design settings

These settings power the global colors, fonts and spacing that you can use across the site.

- **`rj_global_colors(): array`**, **`rj_global_fonts(): array`**, **`rj_global_spacing(): array`**
  Return the saved lists. Each returns an empty array when nothing is saved.

- **`rj_global_color_css(): string`**
  Turns the global colors into CSS variables named `--rj-gc-{id}` inside a `:root` block. Print it inside a `<style>` tag.

- **`rj_default_global_colors(): array`**
  The built-in defaults: `primary`, `secondary`, `accent`, `text`, `muted`, `background`, `success`, `danger`, `warning` and `info`.

- **`rj_save_global_colors(array $colors): void`**
  Saves a list of colors. Each item needs an `id`, a `name` and a `color`. Items with a missing field are skipped, and the `id` is cleaned to letters, numbers, `_` and `-`.

- **`rj_reset_global_colors(): void`**
  Deletes the saved colors so the defaults apply again.

```php
rj_save_global_colors([
    ['id' => 'brand', 'name' => 'Brand', 'color' => '#06b6d4'],
]);
```

```css
.button { background: var(--rj-gc-brand); }
```

---

## Site options

A group of ready-made options for logos, favicon, custom code and tracking. Every key is stored with the `site_opt_` prefix.

Available keys: `logo_light`, `logo_dark`, `favicon`, `og_image`, `custom_css`, `custom_js`, `head_html`, `body_start_html`, `body_end_html`, `ga4_id`, `gtm_id`, `fb_pixel_id` and `tracking_script`.

- **`rj_site_option(string $key, $default = '')`**
  Reads one site option. Known keys fall back to an empty string.

- **`rj_set_site_option(string $key, $value): void`**
  Saves one site option.

- **`rj_site_options_all(): array`**
  Returns all known site options at once.

- **`rj_site_options_defaults(): array`**
  Returns the list of known keys with their default values.

- **`rj_flush_site_options(): void`**
  Clears the option cache.

---

## Breakpoints

- **`rj_breakpoints(): array`**
  Returns the saved breakpoint settings.

- **`rj_breakpoint_css(): string`**
  Returns `:root{--rj-bp-mobile:560;--rj-bp-tablet:860;}`. The defaults are `560` for mobile and `860` for tablet, and they change when you save your own values.

---

## Widgets

Widget settings let you turn widgets on or off, move them to another category and decide where they can be used.

- **`rj_widget_settings(): array`**
  Returns every saved widget setting.

- **`rj_widget_setting(string $id, string $key, $default = null)`**
  Reads one setting for one widget.

- **`rj_widget_save_settings(string $id, array $data): void`**
  Merges new settings into a widget's existing settings.

- **`rj_widget_reset_settings(string $id): void`**
  Removes all saved settings for a widget.

- **`rj_widget_enabled(string $id): bool`**
  `true` unless the widget has been disabled.

- **`rj_widget_category(string $id, string $fallback = 'custom'): string`**
  Returns the category override, or the fallback.

- **`rj_widget_contexts(string $id): array`**
  Returns where the widget may be used. By default that is every context.

- **`rj_widget_contexts_list(): array`**
  Returns all contexts: `page`, `header`, `footer`, `popup` and `block`.

- **`rj_widgets_for_context(string $context): array`**
  Returns every enabled widget that is allowed in the given context.

See [Widget Development](#widget-development) for building your own widgets.

---

## Menus

- **`rj_menu_options(): array`**
  Returns menus as `id => "Name — Location"`, sorted by name. Useful for select fields.

- **`rj_menu_tree(): array`**
  Returns every menu with its items and sub-items (two levels), including each item's label, resolved URL and target.

---

## Theme customizations

These read and write the options a visitor or admin sets for the **active theme**.

- **`rj_theme_mod(string $key, $default = null, ?string $section = null)`**
  Reads one customization. If you do not pass a section, the first section that has the key wins.

- **`rj_theme_mod_section(string $section): array`**
  Returns every value in one section.

- **`rj_set_theme_mod(string $section, string $key, $value): void`**
  Saves a customization for the active theme.

- **`rj_flush_theme_mods(): void`**
  Clears the customization cache.

---

## Environment and proxy

- **`rj_set_env(string $key, string $value): bool`**
  Updates or adds a line in the `.env` file and clears the config cache. The key must be uppercase letters, numbers and underscores, and the value must not contain line breaks. The file is written safely through a temporary file, and the function returns `false` if anything fails.

- **`rj_proxy_status(): array`**
  Reports whether your site is behind a proxy such as Cloudflare. It returns `behind_proxy`, `trusted`, `remote_addr`, `laravel_ip`, `cf_ip` and `forwarded_for`. If `behind_proxy` is `true` but `trusted` is `false`, visitors' real IPs are not being detected, which affects features like rate limiting and activity logs.
