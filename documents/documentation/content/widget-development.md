# Widget Development

Widgets are the building blocks of RJ Builder. A widget is a PHP class that describes its settings and renders its HTML. Themes and plugins are built from widgets too, which keeps pages light and easy to manage block by block.

This guide covers the structure of a widget, based on the built-in widgets.

## Anatomy of a widget

A built-in widget lives in `app/Widgets/Builtin/`, uses the `App\Widgets\Builtin` namespace and extends `App\Widgets\BaseWidget`.

Every widget implements seven methods:

| Method | Returns | Purpose |
|---|---|---|
| `id()` | `string` | A unique identifier, for example `text` or `chinese-festivals`. |
| `name()` | `string` | The name shown in the builder. Wrap it in `__()` so it can be translated. |
| `icon()` | `string` | An inline SVG shown next to the name. |
| `category()` | `string` | The group in the widget panel, for example `basic`, `header` or `content`. |
| `description()` | `string` | A short description. |
| `schema()` | `array` | The list of settings fields. |
| `render(array $settings)` | `string` | The final HTML. |

## A complete example

```php
<?php

namespace App\Widgets\Builtin;

use App\Widgets\BaseWidget;

class NoticeWidget extends BaseWidget
{
    public function id(): string
    {
        return 'notice';
    }

    public function name(): string
    {
        return __('Notice');
    }

    public function icon(): string
    {
        return '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
    }

    public function category(): string
    {
        return 'content';
    }

    public function description(): string
    {
        return __('A highlighted message box.');
    }

    public function schema(): array
    {
        return [
            [
                'name' => 'message',
                'type' => 'textarea',
                'label' => __('Message'),
                'default' => __('Important information.'),
                'tab' => 'content',
            ],
            [
                'name' => 'tone',
                'type' => 'select',
                'label' => __('Tone'),
                'default' => 'info',
                'tab' => 'style',
                'options' => ['info' => __('Info'), 'warning' => __('Warning')],
            ],
            [
                'name' => 'color',
                'type' => 'color',
                'label' => __('Background'),
                'default' => '#eff6ff',
                'tab' => 'style',
            ],
        ];
    }

    public function render(array $settings): string
    {
        $message = trim((string) ($settings['message'] ?? ''));

        if ($message === '') {
            return '';
        }

        $tone = in_array($settings['tone'] ?? '', ['info', 'warning'], true) ? $settings['tone'] : 'info';
        $color = $this->hex($settings['color'] ?? null, '#eff6ff');

        $html = '<div class="rj-notice rj-notice--' . $tone . '" style="background:' . $color . ';padding:16px;border-radius:12px">'
            . nl2br($this->escape($message))
            . '</div>';

        return $this->applyAnimation($html, $settings);
    }

    private function hex(mixed $value, string $default): string
    {
        $value = trim((string) $value);

        return preg_match('/^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i', $value) ? $value : $default;
    }
}
```

> [!IMPORTANT]
> A widget must be added to the widget list, otherwise it does not appear in the builder. This was the reason three built-in widgets were missing in an earlier release.

## The schema

`schema()` returns an array of fields. Each field is an array.

| Key | Description |
|---|---|
| `name` | The key under which the value arrives in `$settings`. |
| `type` | The field type (see below). |
| `label` | The label in the editor. |
| `default` | The starting value. |
| `tab` | Where the field appears: `content` or `style`. |
| `placeholder` | Optional hint text. |
| `help` | Optional help text under the field. |
| `options` | For `select`: a `value => label` array. |
| `min`, `max`, `step` | For `range`. |

### Field types used by built-in widgets

| Type | Value you receive |
|---|---|
| `text` | A string. |
| `textarea` | A string with line breaks. |
| `select` | One of the option keys, as a string. |
| `color` | A color string such as `#2563eb`. |
| `toggle` | A boolean (it can arrive as a string, so normalize it). |
| `range` | A number. |
| `media` | A string URL, or an array with a key such as `url`, `src` or `path`. |
| `dimensions` | An array with `top`, `right`, `bottom`, `left`, `unit` and `linked`. |

## Helpers from `BaseWidget`

Built-in widgets call these helpers on `$this`:

| Helper | Use |
|---|---|
| `escape($value)` | Escapes a value for safe HTML output. |
| `dimensionCss($settings, 'name')` | Turns a `dimensions` field into a CSS value. |
| `backgroundCss($settings)` | Builds background CSS from the common background settings. |
| `boxShadowCss($settings['box_shadow'] ?? null)` | Builds box-shadow CSS. |
| `cssId($settings)` and `cssClass($settings)` | Return the custom ID and class entered by the user. |
| `attr(array $attrs)` | Builds an HTML attribute string. |
| `applyAnimation($html, $settings)` | Wraps the HTML with the widget's motion settings. |

## Two ways to render

**1. Return HTML from PHP.** Good for small widgets. The Text widget builds a `<p>` tag and returns it.

**2. Render a Blade view.** Good for larger widgets. Put the view in `resources/views/rjbuilder/widgets/builtin/` and return it from `render()`:

```php
return view('rjbuilder.widgets.builtin.logo', [
    'o'   => $opts,
    'uid' => $uid,
])->render();
```

Create a unique ID for each instance, so the same widget can appear several times on a page without its CSS or JavaScript clashing:

```php
$uid = 'logo_' . substr(md5(uniqid('', true)), 0, 8);
```

In the view, scope all CSS to `#{{ $uid }}`.

## Security rules

Settings come from the editor, so never trust them. Built-in widgets follow these rules:

- **Allow-list choices.** If a value must be one of a few options, check it with `in_array()` and fall back to a default.
- **Validate colors.** Accept only a hex pattern before putting a color into CSS.
- **Clean text.** Use `strip_tags()` and a length limit for titles, or `escape()` for output.
- **Check URLs.** Allow only `http`, `https`, `mailto`, `tel`, anchors and relative links.
- **Escape in Blade.** Use `{{ }}`, not `{!! !!}`, for user values.
- **Safe JSON in pages.** When you pass data to JavaScript, encode it with `JSON_HEX_TAG`, `JSON_HEX_AMP`, `JSON_HEX_APOS` and `JSON_HEX_QUOT`.

## Good habits

- Translate every visible string with `__()`.
- Cache heavy calculations with `Cache::remember()`, and include the interface language in the cache key if the result contains translated text.
- Return an empty string when there is nothing to show.
- Show a clear message instead of failing when a dependency is missing.
- Respect reduced motion in CSS animations: `@media (prefers-reduced-motion: reduce)`.
