# Plugin Development

RJ Nexus features a fully isolated, modular architecture. You can extend the CMS by creating your own plugins **without modifying the core codebase**. Each plugin brings its own routes, views, migrations, and assets, so it can be installed, updated, or removed without touching anything else.

This guide walks you through building a basic "Hello World" plugin, then shows how to add a database, assets, translations, and hooks.

## What You Will Learn

- How a plugin is structured and discovered
- How to write `plugin.json`, a service provider, routes, a controller, and a view
- How to activate and debug your plugin
- How to extend it with migrations, assets, translations, and hooks
- How to package and publish it

## Prerequisites

- A working RJ Nexus installation (see the [Installation Guide](#installation))
- PHP 8.2+ and basic knowledge of **Laravel** (service providers, routes, controllers, Blade)
- Access to the `rj-content/plugins/` folder through FTP, File Manager, or your code editor

> **Tip:** RJ Nexus includes a built-in **Plugin IDE** with a code editor and AI code review, so you can write and review plugin code right inside the admin panel.

---

## How Plugins Work

When the CMS boots, it scans `rj-content/plugins/` for folders that contain a `plugin.json` file. For every **active** plugin, RJ Nexus registers the plugin's autoloader (using the `namespace` value) and runs its **service provider**. The provider then loads the plugin's routes, views, and any hooks.

```text
plugin.json  →  Autoloader  →  Service Provider  →  Routes / Views / Hooks
```

Because the core is never modified, a broken or removed plugin cannot damage your site's core files.

---

## Plugin Directory Structure

All plugins must be placed in the following directory:

```text
rj-content/plugins/
```

Each plugin has its own folder, named after its **slug**. A typical structure looks like this:

```text
rj-content/plugins/
└── my-awesome-plugin/
    ├── plugin.json                     # Plugin metadata (name, author, version)
    ├── src/
    │   ├── MyPluginServiceProvider.php # Entry point of the plugin
    │   └── Http/Controllers/
    │       └── MyPluginController.php
    ├── routes/
    │   └── web.php                     # Plugin routes
    └── views/
        └── index.blade.php             # Plugin views (UI)
```

### Naming Rules

| Item | Rule | Example |
| --- | --- | --- |
| **Folder / slug** | Lowercase letters, numbers, and hyphens only | `my-awesome-plugin` |
| **Namespace** | PascalCase, no spaces or hyphens | `MyAwesomePlugin` |
| **View namespace** | Same as the slug | `my-awesome-plugin::index` |
| **Route names** | Prefixed with the slug | `my-awesome-plugin.index` |

> **Important:** The folder name, the `slug` in `plugin.json`, and the view namespace should all match. A mismatch is the most common reason a plugin does not load.

---

## Step 1: Create the Metadata File

Every plugin requires a `plugin.json` file. It tells RJ Nexus that the folder is a plugin and provides its essential details.

Create `plugin.json` inside your plugin folder:

```json
{
    "name": "My Awesome Plugin",
    "slug": "my-awesome-plugin",
    "version": "1.0.0",
    "author": "Your Name",
    "description": "A simple plugin that says hello.",
    "namespace": "MyAwesomePlugin",
    "provider": "MyAwesomePlugin\\MyPluginServiceProvider"
}
```

### Field Reference

| Field | Required | Description |
| --- | --- | --- |
| `name` | Yes | The display name shown in **Plugins → Manage** |
| `slug` | Yes | Unique identifier. Must match the folder name |
| `version` | Yes | Version number using [semantic versioning](https://semver.org) (`1.0.0`) |
| `author` | Yes | Your name or company |
| `description` | Yes | A short sentence describing what the plugin does |
| `namespace` | Yes | Root PHP namespace that maps to the `src/` folder |
| `provider` | Yes | Fully qualified class name of the service provider |

> **Note:** In JSON, the backslash must be escaped, so write `\\` between namespace parts.

---

## Step 2: Create the Service Provider

The Service Provider is the **entry point** of your plugin. It loads your views and routes and registers any hooks.

Create `src/MyPluginServiceProvider.php`:

```php
<?php

namespace MyAwesomePlugin;

use Illuminate\Support\ServiceProvider;

class MyPluginServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Bind services or merge config here (runs before boot)
    }

    public function boot(): void
    {
        // Register views
        $this->loadViewsFrom(__DIR__ . '/../views', 'my-awesome-plugin');

        // Register routes
        $this->loadRoutesFrom(__DIR__ . '/../routes/web.php');

        // You can also add hooks here using rj_add_filter or rj_add_action
    }
}
```

**`register()` vs `boot()`:** use `register()` only to bind things into the container. Use `boot()` for everything that depends on other services, such as views, routes, and hooks.

---

## Step 3: Define Routes

Create `routes/web.php` to define where your plugin's pages will be accessible.

```php
<?php

use Illuminate\Support\Facades\Route;
use MyAwesomePlugin\Http\Controllers\MyPluginController;

// Routes are automatically prefixed with /admin/plugins/my-awesome-plugin or /my-awesome-plugin
Route::get('/my-awesome-plugin', [MyPluginController::class, 'index'])
    ->name('my-awesome-plugin.index');
```

Always give your routes a **name** and prefix it with your plugin slug. This prevents clashes with other plugins and lets you generate links safely:

```php
route('my-awesome-plugin.index');
```

---

## Step 4: Create the Controller

Create `src/Http/Controllers/MyPluginController.php`:

```php
<?php

namespace MyAwesomePlugin\Http\Controllers;

use App\Http\Controllers\Controller;

class MyPluginController extends Controller
{
    public function index()
    {
        $message = "Hello from my awesome plugin!";

        return view('my-awesome-plugin::index', compact('message'));
    }
}
```

Notice the double-colon syntax in `my-awesome-plugin::index`. The part before `::` is the **view namespace** you registered in the service provider, and the part after it is the Blade file name.

---

## Step 5: Create the View (Blade)

Finally, create the UI for your plugin in `views/index.blade.php`. RJ Nexus automatically makes your plugin compatible with the theme.

```blade
<x-admin-layout>
    <div class="p-6">
        <h1 class="text-2xl font-bold">My Awesome Plugin</h1>
        <p class="mt-4">{{ $message }}</p>
    </div>
</x-admin-layout>
```

The admin panel uses **Tailwind CSS**, so you can style your page with the same utility classes used in the rest of the dashboard.

---

## Step 6: Activate the Plugin

1. Log in to your RJ Nexus Admin Panel.
2. Go to **Plugins → Manage**.
3. You will see **My Awesome Plugin** in the list.
4. Click **Activate**.

Once activated, the plugin's Service Provider runs, its routes are registered, and you can open your new plugin page.

> **Tip:** If you make changes to your plugin's routes or service providers during development, you may need to run `php artisan optimize:clear` to see the changes immediately.

---

## Going Further

The steps above give you a working plugin. The sections below show how to build something real.

### Add a Database Table (Migrations)

Plugins can ship their own migrations. Create a `database/migrations` folder inside your plugin:

```text
my-awesome-plugin/
└── database/
    └── migrations/
        └── 2026_01_01_000000_create_greetings_table.php
```

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('myplugin_greetings', function (Blueprint $table) {
            $table->id();
            $table->string('message');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('myplugin_greetings');
    }
};
```

Register the migrations in your service provider's `boot()` method:

```php
$this->loadMigrationsFrom(__DIR__ . '/../database/migrations');
```

Then run them:

```bash
php artisan migrate
```

> **Best practice:** Always **prefix your table names** (for example `myplugin_`) so they never collide with core tables or other plugins. Implement `down()` properly so the table can be removed cleanly.

### Add a Model

```php
<?php

namespace MyAwesomePlugin\Models;

use Illuminate\Database\Eloquent\Model;

class Greeting extends Model
{
    protected $table = 'myplugin_greetings';

    protected $fillable = ['message'];
}
```

Place it at `src/Models/Greeting.php`, and use it in your controller:

```php
use MyAwesomePlugin\Models\Greeting;

$greetings = Greeting::latest()->get();
```

### Add Styles and Scripts

Keep your plugin's assets inside the plugin folder:

```text
my-awesome-plugin/
└── assets/
    ├── css/style.css
    └── js/app.js
```

Publish them to a public location from your service provider:

```php
$this->publishes([
    __DIR__ . '/../assets' => public_path('plugins/my-awesome-plugin'),
], 'my-awesome-plugin-assets');
```

```bash
php artisan vendor:publish --tag=my-awesome-plugin-assets
```

Then reference them in Blade:

```blade
<link rel="stylesheet" href="{{ asset('plugins/my-awesome-plugin/css/style.css') }}">
```

### Add Translations

RJ Nexus supports multiple languages, so make your plugin translatable from day one.

```text
my-awesome-plugin/
└── lang/
    ├── en/messages.php
    └── az/messages.php
```

```php
// lang/en/messages.php
return [
    'hello' => 'Hello from my awesome plugin!',
];
```

```php
// In the service provider's boot()
$this->loadTranslationsFrom(__DIR__ . '/../lang', 'my-awesome-plugin');
```

```blade
{{ __('my-awesome-plugin::messages.hello') }}
```

### Use Hooks (Filters and Actions)

Hooks let your plugin change or react to core behavior **without editing core files**. Register them in the service provider's `boot()` method using `rj_add_filter` and `rj_add_action`.

| Hook type | Function | Purpose |
| --- | --- | --- |
| **Action** | `rj_add_action` | Run your code when something happens |
| **Filter** | `rj_add_filter` | Receive a value, modify it, and return it |

```php
public function boot(): void
{
    // ...views and routes...

    // A filter must always return the (modified) value
    rj_add_filter('example_hook_name', function ($value) {
        return $value . ' (modified by my plugin)';
    });

    // An action just runs your code
    rj_add_action('example_event_name', function () {
        // do something
    });
}
```

> **Note:** `example_hook_name` and `example_event_name` are placeholders. Check the list of available hooks in the core code or in the Plugin IDE for the real names.

### Protect Your Routes

Plugin pages in the admin area should only be visible to authorized users. Wrap your routes in the appropriate middleware:

```php
Route::middleware(['web', 'auth'])->group(function () {
    Route::get('/my-awesome-plugin', [MyPluginController::class, 'index'])
        ->name('my-awesome-plugin.index');
});
```

Always validate user input in your controllers:

```php
$validated = $request->validate([
    'message' => ['required', 'string', 'max:255'],
]);
```

---

## Debugging and Troubleshooting

| Problem | Likely cause | Solution |
| --- | --- | --- |
| Plugin does not appear in **Plugins → Manage** | Missing or invalid `plugin.json` | Check the file name, valid JSON syntax (no trailing commas), and the folder location |
| "Class not found" error | Namespace does not match the folder structure | Make sure `namespace` in `plugin.json` matches the PHP `namespace` and that files live under `src/` |
| `View [my-awesome-plugin::index] not found` | View namespace mismatch | Use the same name in `loadViewsFrom()` and in `view()` |
| Route returns 404 | Routes are cached or not loaded | Run `php artisan optimize:clear` and check `php artisan route:list` |
| Changes are not visible | Cached views, config, or routes | Run `php artisan optimize:clear` |
| White screen or HTTP 500 | PHP error in your code | Check `storage/logs/laravel.log` |
| Plugin breaks the site after activation | Fatal error in the provider | Rename the plugin folder (for example add `-disabled`) via FTP to deactivate it, then fix the error |

**Useful commands during development:**

```bash
php artisan optimize:clear   # clear all caches
php artisan route:list       # show every registered route
php artisan migrate:status   # show which migrations have run
```

---

## Best Practices

- **Keep it isolated.** Never edit core files. Use hooks, routes, and views to extend the CMS.
- **Use a unique prefix** for table names, route names, config keys, and CSS classes.
- **Follow PSR-12** coding standards and use type hints.
- **Validate and escape.** Validate every input and use `{{ }}` (escaped output) in Blade. Use `{!! !!}` only for trusted HTML.
- **Protect admin routes** with authentication and permission checks.
- **Make it translatable.** Use translation keys instead of hard-coded text.
- **Clean up after yourself.** Provide `down()` methods in migrations.
- **Version carefully.** Follow semantic versioning and keep a changelog.
- **Do not commit secrets.** Keep API keys and passwords out of your code and repository.

---

## Packaging and Publishing

When your plugin is ready:

1. **Update the version** in `plugin.json` (for example `1.0.0` → `1.1.0`).
2. **Test** activation, deactivation, and a fresh install on a clean site.
3. **Create a ZIP** of the plugin folder, with `plugin.json` at the top level of the plugin folder.
4. **Publish it on GitHub.** RJ Nexus delivers plugin updates through GitHub, so tag a release for each new version.

```bash
git tag v1.1.0
git push origin v1.1.0
```

Users can then install your plugin by placing it in `rj-content/plugins/` and activating it under **Plugins → Manage**.

---

## Plugin Checklist

Before you release, confirm that:

- [ ] `plugin.json` is valid and every required field is filled in
- [ ] The folder name, `slug`, and view namespace match
- [ ] The plugin activates and deactivates without errors
- [ ] Routes are named, prefixed, and protected
- [ ] Inputs are validated and output is escaped
- [ ] Migrations run cleanly and have a working `down()`
- [ ] Text is translatable
- [ ] A README explains installation and usage

---

## Next Steps

- Study the **Form Builder** plugin as a real-world example of a larger plugin
- Learn how **themes** and **RJBuilder widgets** work
- Use the built-in **Plugin IDE** for editing and AI code review
- Report bugs or request features on the [GitHub issue tracker](https://github.com/rj-nexus/rj-nexus/issues)
