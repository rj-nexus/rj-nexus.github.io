# Text Widget

The Text widget adds a paragraph of text to a page in RJ Builder. It understands links and a small set of formatting tags, so you can link to other pages without leaving the text field.

## Add links

Write links in the **Text** field in any of these three ways.

| Style | Example |
|---|---|
| **Markdown** | `Read the [documentation](https://rjnexus.org).` |
| **HTML** | `Visit <a href="/en/blog">our blog</a>.` |
| **Plain URL** | `https://github.com/rj-nexus/rj-nexus` |

Plain URLs are turned into links automatically. A URL that starts with `www.` gets `https://` added. Punctuation at the end of a sentence (such as a final dot or comma) is not included in the link.

### Link types

| Link | Example |
|---|---|
| Web page | `https://example.com` |
| Page on your own site | `/en/about` or `about/team` |
| Anchor on the same page | `#pricing` |
| Email | `mailto:hello@example.com` |
| Phone | `tel:+123456789` |

> [!IMPORTANT]
> For safety, only `http`, `https`, `mailto`, `tel`, anchors and relative links work. Links such as `javascript:` or `data:` are removed, and their text stays on the page.

## Formatting tags

These HTML tags work inside the text:

`<strong>` `<b>` `<em>` `<i>` `<u>` `<br>` `<code>` `<mark>` `<small>` `<sub>` `<sup>`

Line breaks in the text field are kept. Any other tag, such as `<script>` or `<img>`, is shown as plain text and is never run.

> [!NOTE]
> Tags without attributes only. For example, `<strong class="x">` is shown as text, while `<strong>` works.

## Settings

### Content tab

| Setting | Description |
|---|---|
| **Text** | The paragraph. Supports the link and tag syntax above. |
| **Link Color** | Color of links. Default `#2563eb`. |
| **Open Links** | `Auto`: links to other websites open in a new tab, links on your own site open in the same tab. `Always in new tab`. `Same tab`. |

Links that open in a new tab get `rel="noopener noreferrer"` automatically. Email, phone and anchor links never open in a new tab.

### Style tab

Size, Alignment, Text Color, Font Size, Font Weight, Line Height, Letter Spacing, Text Transform, Padding and Margin.

> [!TIP]
> If **Font Size** is filled in (for example `18px`), it is used instead of **Size**.

## Why links have their own color

Many sites reset link styles, which makes links look like normal text. The widget therefore sets the link color and underline itself, so links are always visible. Change the color with **Link Color**.
