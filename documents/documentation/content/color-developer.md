# Developer: Custom Color Presets

This page is for developers. It explains how to add your own color preset to RJ Nexus.

If you only want to change colors from the admin panel (no code), see [Colors](colors.md) instead.

## Where Presets Live

All color presets are defined in one place:

`app/Helpers/rj.php` → `rj_color_presets()`

Each key in the returned array is a **preset ID**, and each value is an array with a `label` plus six RGB color values.

## Preset Structure

```php
'my-preset' => [
    'label'        => 'My Preset',
    'purple'       => 'R G B',
    'purple-light' => 'R G B',
    'pink'         => 'R G B',
    'dark-1'       => 'R G B',
    'dark-2'       => 'R G B',
    'dark-3'       => 'R G B',
],
```

### What each key controls

| Key | CSS Variable | Where it shows |
|-----|--------------|----------------|
| `purple` | `--rj-purple` | Primary buttons, active nav items, links |
| `purple-light` | `--rj-purple-light` | Hover states, lighter accents |
| `pink` | `--rj-pink` | Secondary accent, gradient end |
| `dark-1` | `--rj-dark-1` | Main dark background |
| `dark-2` | `--rj-dark-2` | Slightly lighter surface |
| `dark-3` | `--rj-dark-3` | Card / panel surface |

The `label` is the human-readable name that shows up in the picker UI. The preset key (for example `my-preset`) becomes the value stored in the `admin_color_preset` option.

### Color format

Colors must be **space-separated RGB integers (0–255)**. Not hex, not comma-separated, not `rgb()`.

```php
// Correct
'purple' => '124 58 237',

// Wrong - will not render
'purple' => '#7c3aed',
'purple' => '124,58,237',
'purple' => 'rgb(124,58,237)',
```

To convert hex to RGB, split each pair: `#7c3aed` → R=124, G=58, B=237 → `124 58 237`.

## Step-by-Step

### 1. Open `app/Helpers/rj.php`

Locate the `rj_color_presets()` function.

### 2. Add your preset

Insert a new entry inside the returned array, next to the existing presets:

```php
return [
    'purple' => [ /* ... */ ],

    // ... existing presets

    'forest' => [
        'label'        => 'Forest',
        'purple'       => '22 101 52',
        'purple-light' => '34 197 94',
        'pink'         => '132 204 22',
        'dark-1'       => '5 20 10',
        'dark-2'       => '10 35 18',
        'dark-3'       => '16 50 26',
    ],
];
```

### 3. Clear opcache

If PHP opcache is enabled, restart PHP-FPM or clear opcache so the new code is loaded. On shared hosting, saving the file is usually enough. On a VPS, run `systemctl reload php8.2-fpm` (adjust the version).

### 4. Select your preset

Open the admin panel → **Settings → Colors**. Your new preset now appears as a selectable option.

![Settings → Colors page with the preset picker](https://raw.githubusercontent.com/rj-nexus/rj-nexus.github.io/main/assets/image/screenshot-19-11/new-color-page.png)

Select it and save. Admin colors update immediately.

## Set the Preset From Code

To activate a preset without touching the UI:

```php
rj_set_option('admin_color_preset', 'forest');
rj_flush_options();
```

The admin panel will use the new colors on the next request.

## Important: Updates Will Overwrite

`app/Helpers/rj.php` is part of the core. When you update RJ Nexus, this file is replaced and your custom preset will be lost.

To keep it across updates:

- **Keep a snippet.** Store your preset code somewhere outside the project and re-add it after each update.
- **Use a branch.** Maintain your edits in a fork or a private branch.
- **Submit a pull request.** If the preset is generally useful, send it to [rj-nexus/rj-nexus](https://github.com/rj-nexus/rj-nexus) so it ships in the next release.

Theme and plugin folders (`rj-content/themes/`, `rj-content/plugins/`) are never touched by core updates, so a small plugin or a theme README is a safe place to keep your preset snippet for later re-application.

## Related

- [Colors](colors.md): end-user guide for changing admin, frontend, and theme colors from the UI
