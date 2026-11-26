# Caching

RJ Nexus has a built-in, two-layer page cache. Repeat visits are served without booting the full application, so your site stays fast under real traffic, even on modest shared hosting.

The cache was introduced in **v1.10.0**.

## The two layers

| | Response Cache | LiteSpeed LSCache |
|---|---|---|
| **Package** | `laravel-responsecache` | `litespeed/lscache-laravel` |
| **Cache level** | Application (Laravel) | Web server (LiteSpeed) |
| **Hosting requirement** | Any PHP hosting | LiteSpeed or OpenLiteSpeed |
| **Best for** | A universal baseline speed-up | Maximum speed on LiteSpeed hosts |

### Response Cache

Stores complete application responses and serves them directly on repeat requests, which skips most of the framework work. It works on any hosting and needs no special server.

### LiteSpeed Cache (LSCache)

On LiteSpeed and OpenLiteSpeed hosting, pages are cached at the web server level and delivered before PHP even starts.

> [!NOTE]
> You do not have to choose one layer. Response Cache gives every site a baseline speed-up, and LSCache adds the maximum speed when your host runs LiteSpeed.

## Manage the cache

Cache behavior is managed from **Admin > Settings > Cache**.

## Related performance features

RJ Nexus also includes WebP image optimization, lazy loading and fast asset compilation with Vite.

## Troubleshooting

| Problem | What to check |
|---|---|
| A page shows an error after an update | Clear the cache in **Admin > Settings > Cache** and reload the page. |
| You do not know if your host runs LiteSpeed | Ask your hosting provider. Response Cache works either way. |
