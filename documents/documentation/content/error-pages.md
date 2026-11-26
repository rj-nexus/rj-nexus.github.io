# Error Pages

RJ Nexus has a custom, branded design for every common HTTP error, so visitors never see a plain white browser error. Every page uses the RJ Nexus dark theme, supports translations and works on mobile.

---

## Included error pages

- **400 Bad Request:** the request could not be understood.
- **401 Authentication Required:** the visitor must log in first.
- **403 Forbidden:** the visitor does not have permission.
- **404 Not Found:** the page does not exist.
- **405 Invalid Request Method:** the request used a method that is not allowed.
- **429 Rate Limit Exceeded:** too many requests in a short time.
- **500 Server Error:** something went wrong on the server. With debug mode on, the detailed debug screen is shown instead, which is meant for developers only.
- **504 Gateway Timeout:** the server took too long to answer.

---

## The 504 page

The 504 page has its own animated design built around the timeout itself.

- A ticking clock replaces the zero in "504".
- A live request path shows **You → Gateway → Server**. Packets travel from you to the gateway, but the ones going on to the server get lost on the way.
- A 30 second stopwatch counts up, flashes at the limit, and starts again.
- An automatic retry countdown reloads the page after 20 seconds. Visitors can also click **Try again now** or go to the homepage.
- Animations are turned off automatically for visitors who prefer reduced motion.

---

## Where the files live

Laravel looks for an error page named after the status code. RJ Nexus keeps them here:

`resources/views/errors/`

For example:

- `resources/views/errors/404.blade.php`
- `resources/views/errors/504.blade.php`

> **Note:** Core views are replaced when you update RJ Nexus. If you change an error page, keep a copy of your version and re-apply it after each update. See [Manual Update](#manual-update).

---

## Preview an error page

To see an error page without causing a real error, add a temporary route to `routes/web.php`:

```php
Route::get('/test-504', fn () => abort(504));
```

Open `/test-504` in your browser. Remove the route when you are finished.

You can use any status code the same way, for example `abort(404)` or `abort(429)`.

> **Note:** With `APP_DEBUG=true`, a 500 error shows the detailed debug page instead of the branded one. Set `APP_DEBUG=false` in `.env` to test the 500 design.

---

## Translating the text

All visible text uses Laravel's `__()` function, so it follows the website language. For example:

```blade
<h1>{{ __('Gateway Timeout') }}</h1>
```

To translate a message, add the same English text as a key in your language file, for example `lang/az.json`:

```json
{
    "Gateway Timeout": "Şlüz vaxt aşımı"
}
```

---

## Customizing the design

Each error page is a single Blade file with its own CSS and JavaScript, so you can change it without touching anything else.

**Change colors.** The colors are defined as CSS variables at the top of the `<style>` block:

```css
:root {
    --bg: #0f0a18;
    --v3: #d8b4fe;
    --v5: #a855f7;
    --v7: #6d28d9;
    --p3: #f9a8d4;
    --p6: #db2777;
}
```

Change these values and the whole page follows.

**Change the retry time.** In the script at the bottom of the 504 page, change the number in this line:

```js
var total = 20, left = total;
```

**Change the branding.** The corner badge at the top of the page contains the product name and the "Powered by" text. Edit it in the same file.

---

## Tips

- Keep error pages **self-contained**. They should not depend on a database or other services, because the error might be caused by exactly that.
- Keep the text short and friendly. Tell the visitor what happened and what they can do next.
- Always give the visitor a way out, such as a homepage link or a retry button.
