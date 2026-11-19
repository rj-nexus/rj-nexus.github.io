# RJ Builder

RJ Builder is the visual page builder built into RJ Nexus. If you have used **Elementor** or the **BeTheme (Muffin) Builder**, you already know how it works: you drag elements onto a canvas, edit them in place, style them from a side panel, and see the result instantly. No code required.

You can build full pages, headers, footers, popups and reusable blocks, all from one editor.

---

## Why RJ Builder?

### 🌍 Multilingual by design

This is the biggest advantage of RJ Builder. **Every page you build can be edited in several languages at the same time**, directly inside the builder.

- Switch between languages in the editor without leaving the page.
- Translate each text, button, image and link for every language.
- Keep one layout and one design. Only the content changes per language.
- Publish all languages together with a single **Save**.

In many other systems (for example WordPress) multilingual editing requires extra plugins, duplicated pages or separate translation workflows. In RJ Nexus it is part of the core builder.

### Everything else you expect from a modern builder

| Feature | What it does |
|---------|--------------|
| **Drag & Drop** | Add, move and rearrange elements visually on the canvas |
| **Live Editing** | Click any text or element and edit it right on the page |
| **Responsive Controls** | Set spacing, typography and visibility separately for Desktop, Tablet and Mobile |
| **Dynamic Tags** | Bind live data (site title, user info, post data) to any text or image field |
| **Global Widgets** | Save a section once and reuse it across many pages. Edit it once, update it everywhere |
| **Template Library** | Create, export and import reusable sections and full templates |
| **AI Assistant** | Generate text, improve your copy and get layout suggestions |
| **Dark Mode Editor** | A clean, distraction-free interface |

---

## Getting Started

1. Open your admin panel and go to **RJ Builder** (`/admin/rjbuilder`).
2. Create a new template. Choose the type: **Page**, **Header**, **Footer**, **Popup** or **Block**.
3. Use the **Add Element** panel on the left to insert widgets onto the canvas.
4. Click any element and customize it from the right panel (see below).
5. Click **Save** to publish your changes.

---

## The Editor at a Glance

| Area | Purpose |
|------|---------|
| **Left panel** | Add Element: all available widgets, ready to drag onto the canvas |
| **Canvas (center)** | Your live page. Drag, drop, reorder and edit directly |
| **Right panel** | Settings of the selected element |
| **Top bar** | Language switcher, device preview (Desktop / Tablet / Mobile), Save |

### Settings tabs (right panel)

- **Content:** texts, images, links, icons, repeater items and dynamic tags.
- **Style:** colors, typography, spacing, borders, shadows and backgrounds.
- **Motion:** entrance effects and animations.

---

## Working with Drag & Drop

1. Find a widget in the **Add Element** panel.
2. Drag it onto the canvas and drop it where you want it.
3. Drag the element again to move it, or drop it into another section or column.
4. Select an element to edit its content and style.

Complex layouts are built the same way: add a section, place columns inside it, and fill the columns with widgets.

---

## Editing in Multiple Languages

1. Open any template in RJ Builder.
2. Choose the language from the language switcher.
3. Edit the texts, buttons, images and links for that language.
4. Switch to the next language and repeat.
5. Click **Save**. All languages are saved together.

> **Tip:** Build the design once in your main language first. Then switch to the other languages and only translate the content. The layout, spacing and styles stay identical everywhere.

The languages available on your site's frontend are managed from the admin panel's language settings.

---

## Responsive Design

Every element can look different on each device.

- Switch the preview to **Desktop**, **Tablet** or **Mobile**.
- Change spacing, font sizes and alignment for that device only.
- Hide or show elements on specific devices.

Changes made on a smaller device do not affect the larger ones.

---

## Dynamic Tags

Dynamic tags let you connect a field to live data instead of typing a fixed value. Use them for things like:

- Site title
- User information
- Post data

Click the dynamic tag icon next to a text or image field and choose the data source.

---

## Global Widgets and Templates

- **Global Widgets:** save any section as a global widget. When you edit it, every page using it updates automatically. Great for call-to-action bars, contact blocks and footers.
- **Templates:** save sections or complete pages as templates, then **export** them as a file and **import** them on another site.

---

## AI Assistant

The built-in AI assistant helps you work faster:

- Generate text for a section
- Improve or rewrite existing copy
- Suggest layout sections for your page

---

## For Developers: Core Structure

| Path | Description |
|------|-------------|
| `edit.blade.php` | Main editor interface (HTML structure) |
| `layout.blade.php` | Base layout wrapper for the editor |
| `partials/` | UI partials: styles, field types (repeater, color, media, etc.) and core JavaScript logic |
| `widgets/builtin/` | Blade views of all core widgets |

---

## Documentation and Updates

This page explains how RJ Builder works in general. For the full list of widgets, new features, improvements and bug fixes, see the **`CHANGELOG.md`** file in the project root.

New widgets and improvements are documented only in the changelog, so this guide stays clean and stable.

## License

RJ Builder is a proprietary component of RJ NEXUS.
