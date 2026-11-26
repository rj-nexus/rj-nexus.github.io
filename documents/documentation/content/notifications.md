# Notifications

RJ Nexus keeps you informed about what happens on your site: new comments, form submissions, backups, updates, security events and more. Notifications reach you in three ways:

| Channel | What it does |
|---|---|
| **In-app** | Shows the notification in the admin panel, under the bell icon in the header. |
| **Email** | Sends the notification to your email. |
| **Browser Push** | Shows a desktop alert on your device, even when the RJ Nexus tab is in the background. |

You choose which events use which channel, and you control the notification sound.

**On this page**

- [Open your notifications](#open-your-notifications)
- [Enable desktop alerts](#enable-desktop-alerts)
- [If you blocked alerts by mistake](#if-you-blocked-alerts-by-mistake)
- [Manage notifications](#manage-notifications)
- [Notification settings](#notification-settings)
- [System email alerts (admin)](#system-email-alerts-admin)
- [Troubleshooting](#troubleshooting)

---

## Open your notifications

Click the **bell icon** in the header to open the notifications panel.

![The bell icon in the admin header](assets/photo/notification/notification1.png)

---

## Enable desktop alerts

Desktop alerts (Browser Push) let you see new notifications on your device even when the RJ Nexus tab is in the background.

**1.** Click the bell icon. At the top of the panel you will see *"Get alerts on your device even when this tab is in the background."* Click **Enable**.

![The Enable button in the notifications panel](assets/photo/notification/notification2.png)

**2.** Your browser asks for permission. In Chrome, click **Allow**.

![The Chrome permission prompt](assets/photo/notification/notification3.png)

**3.** Once permission is granted, RJ Nexus shows a confirmation notification. Desktop alerts are now active.

![A successful desktop alert](assets/photo/notification/notification4.png)

> [!NOTE]
> Desktop alerts need a secure connection (HTTPS). For local testing, `localhost` and `127.0.0.1` also work.

> [!TIP]
> Allowing the browser permission is only the first step. For each event you also need the **Browser Push** option turned on. See [Notification settings](#notification-settings).

---

## If you blocked alerts by mistake

If you clicked **Block** or closed the prompt and the **Enable** button no longer works, the browser is remembering your choice. Change it in the browser's site settings, then reload RJ Nexus and click **Enable** again.

**Chrome and Edge**

1. Click the icon on the left side of the address bar (a lock or a settings icon).
2. Open **Site settings** (in Edge: **Permissions for this site**).
3. Set **Notifications** to **Allow**.
4. Reload the page.

You can also open `chrome://settings/content/notifications` (in Edge: `edge://settings/content/notifications`), find your site under the blocked list and change it to **Allow**.

**Firefox**

1. Click the permissions icon on the left side of the address bar.
2. Remove the **Blocked** entry next to *Receive Notifications*.
3. Reload the page and click **Enable** again.

**Safari (macOS)**

Open **Safari > Settings > Websites > Notifications**, find your site and set it to **Allow**.

> [!NOTE]
> If alerts are allowed but nothing appears, check that your operating system is not in a *Do Not Disturb* or *Focus* mode, which hides notifications.

**To turn desktop alerts off again**, set the site's **Notifications** permission back to **Block** or **Ask**, or untick **Browser Push** for your events in [Notification settings](#notification-settings).

---

## Manage notifications

### Open the notifications page

Click the bell icon in the header, then click **View All Notifications**.

![View All Notifications link](assets/photo/notification/notification5.png)

### Select and act on notifications

You can work on a single notification or on many at once.

**Several notifications at once**

1. Tick the checkboxes of the notifications you want to work with.
2. Use the highlighted action control to see the available actions.

![Selecting notifications](assets/photo/notification/notification6.png)

| Action | What it does |
|---|---|
| **Mark** | Marks all selected notifications as read. |
| **Delete** | Deletes all selected notifications. |

![Bulk actions: Mark and Delete](assets/photo/notification/notification7.png)

**One notification**

Click the **delete icon** next to a notification to delete just that one.

---

## Notification settings

### Open the settings

On the notifications page, click the **Settings** button.

![The Settings button on the notifications page](assets/photo/notification/notification8.png)

The **Notification Settings** page has two sections: **Sound Preferences** and **Events & Channels**.

![Notification Settings page](assets/photo/notification/notification9.png)

### Sound Preferences

Controls the sound played when a new notification arrives.

| Setting | Description |
|---|---|
| **On / Off switch** | Turns the notification sound on or off. When it is off, the other sound controls are dimmed. |
| **Notification Sound** | Pick a sound from the list. It plays a short preview as soon as you select it. |
| **Play / Stop button** | Plays or stops the preview of the selected sound. |
| **Volume** | Drag the slider from *Silent* (0%) to *Loud* (100%). The current value is shown next to the label. |

### Events & Channels

A table with one row per event and one column per channel (**In-app**, **Email**, **Browser Push**). Tick a box to receive that event on that channel, and untick it to turn it off.

| Event | You are notified when |
|---|---|
| **New comment** | A new comment is posted. |
| **Comment approved** | A comment is approved. |
| **Comment reply** | Someone replies to a comment. |
| **New submission** | A new form submission is received. |
| **New user** | A new user registers. |
| **User login** | A user logs in. |
| **Password changed** | A password is changed. |
| **Post published** | A post is published. |
| **Post scheduled** | A post is scheduled. |
| **Backup completed** | A backup finishes successfully. |
| **Backup failed** | An automated backup fails. |
| **Update available** | RJ Nexus, a theme or a plugin has an update. |
| **System error** | A critical system error occurs. |
| **Login failed** | A failed login attempt is detected. |

> [!NOTE]
> Until you save your own preferences, all channels are enabled for every event.

### Save your changes

Changes are applied only after you click **Save Preferences** at the bottom of the page. This includes the sound, the volume and the channel boxes.

![The Save Preferences button](assets/photo/notification/notification10.png)

> [!IMPORTANT]
> If you leave the page without clicking **Save Preferences**, your changes are lost.

---

## System email alerts (admin)

The page above holds your **personal** preferences. Separately, administrators can configure **global email alerts** under **Settings > System Notifications**. These emails go to one admin address and cover critical events only.

1. Enter the **Admin Email Address** that should receive the alerts.
2. Switch on the events you want:

| Event | Email is sent when |
|---|---|
| **Failed Login Attempt** | Someone fails to log in to the admin panel. |
| **System Error** | A critical system error occurs on your site. |
| **Backup Failed** | An automated backup fails. |
| **Update Available** | RJ Nexus, themes or plugins have updates available. |

3. Use **Enable all** or **Disable all** for a quick change. A counter shows how many events are on.
4. Click **Save Changes**. A bar at the bottom shows when you have unsaved changes, and **Reset** restores the last saved state.

> [!NOTE]
> These alerts are off until you enable them.

The page also links back to **Personal Settings**, where you manage your own sounds, in-app alerts and event preferences.

---

## Troubleshooting

| Problem | What to check |
|---|---|
| The **Enable** button does nothing | The browser blocked notifications. Follow [If you blocked alerts by mistake](#if-you-blocked-alerts-by-mistake). |
| Permission is allowed but no desktop alert appears | Make sure **Browser Push** is ticked for that event and saved. Check that your system is not in Do Not Disturb or Focus mode. |
| No sound | Check that the sound switch is on, the volume is above 0%, your device is not muted and the browser tab is not muted. |
| Settings are not remembered | Click **Save Preferences** after every change. |
| No emails arrive | Check the admin email address and that the event is enabled under **Settings > System Notifications**. Also check your spam folder. |
| Desktop alerts do not work on a live site | The site must run on HTTPS. |
