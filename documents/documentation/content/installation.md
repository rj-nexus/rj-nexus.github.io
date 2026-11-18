# Installation Guide

This guide will walk you through the process of installing RJ Nexus CMS on your server. RJ Nexus is designed to be lightweight and can be installed on almost any shared hosting or VPS without requiring SSH access or complex terminal commands.

## Requirements

Before you begin, ensure your server meets the following minimum requirements:

- **PHP** >= 8.2
- **Database**: MySQL 5.7+ or MariaDB 10.3+
- **Web Server**: Apache or Nginx
- **PHP Extensions**: `PDO`, `mbstring`, `openssl`, `fileinfo`, `gd`, `zip`, `curl`, `json`, `tokenizer`, `xml`, `ctype`

> **Note:** RJ Nexus no longer requires the `exec()` or `proc_open()` functions to be enabled. This makes it fully compatible with highly restrictive shared hosting environments. You do not need to ask your hosting provider to change PHP settings.

## Step 1: Download the ZIP

1. Go to the [RJ Nexus GitHub Releases](https://github.com/rj-nexus/rj-nexus/releases) page.
2. Download the latest `.zip` file for the stable release.

## Step 2: Upload to Your Server

1. Log in to your hosting control panel (cPanel, Plesk, or your VPS file manager).
2. Navigate to your website's root directory (usually `public_html` or `www`).
3. Upload the `.zip` file you downloaded.
4. **Extract** the ZIP file directly in the `public_html` folder.

*Make sure the extracted files are in the root folder, not inside another subfolder.*

## Step 3: Run the Installer

1. Open your web browser and navigate to your domain:
