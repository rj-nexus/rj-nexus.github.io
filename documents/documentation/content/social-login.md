# Social Login

Social Login lets your visitors sign in or register with an account they already have, such as Google or GitHub, instead of creating a new password.

RJ Nexus supports **19 providers**, grouped by region so you can enable only the ones your audience actually uses.

You manage everything in one place:

**Admin → Settings → Social Login**

---

## How it works

For each provider you do two things:

1. Create an app (sometimes called a client, project or channel) in the provider's developer console.
2. Copy the keys the provider gives you into the matching fields on the Social Login page.

Each provider card on the page lists exactly the fields it needs and links to the provider's developer console, so you always know where to go.

> **Tip:** Start with one provider, test it, and only then add more. Most websites only need two or three.

---

## Supported providers

### Global

- **Google**: Client ID and Client Secret.
- **Facebook**: App ID and App Secret.
- **Apple**: Service ID, Team ID, Key ID and Private Key (`.p8` file contents).
- **Microsoft**: Application ID, Client Secret and Tenant (use `common` to allow any Microsoft account).
- **GitHub**: Client ID and Client Secret.
- **LinkedIn**: Client ID and Client Secret.
- **X (Twitter)**: Client ID and Client Secret.
- **Discord**: Client ID and Client Secret.

### Russia and CIS

- **Yandex ID**: Client ID and Client Secret.
- **VK ID**: Client ID and Client Secret.

### China

- **WeChat**: App ID and App Secret.
- **Huawei ID**: App ID and App Secret.
- **Alipay**: App ID and Private Key.

### South Korea

- **Kakao**: REST API Key and Client Secret.
- **Naver**: Client ID and Client Secret.

### Japan

- **LINE**: Channel ID and Channel Secret.
- **Yahoo! Japan**: Client ID and Client Secret.

### Iran

- **Shad**: Client ID and Client Secret.
- **Donbaler**: Client ID and Client Secret.

---

## Where to create your keys

Each provider has its own developer console:

- Google: [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
- Facebook: [developers.facebook.com/apps](https://developers.facebook.com/apps)
- Apple: [developer.apple.com/account/resources/identifiers](https://developer.apple.com/account/resources/identifiers)
- Microsoft: [portal.azure.com](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps)
- GitHub: [github.com/settings/developers](https://github.com/settings/developers)
- LinkedIn: [linkedin.com/developers/apps](https://www.linkedin.com/developers/apps)
- X (Twitter): [developer.x.com/en/portal/dashboard](https://developer.x.com/en/portal/dashboard)
- Discord: [discord.com/developers/applications](https://discord.com/developers/applications)
- Yandex ID: [oauth.yandex.com/client/new](https://oauth.yandex.com/client/new)
- VK ID: [id.vk.com/about/business/go](https://id.vk.com/about/business/go)
- WeChat: [open.weixin.qq.com](https://open.weixin.qq.com)
- Huawei ID: [developer.huawei.com/consumer/en/console](https://developer.huawei.com/consumer/en/console)
- Alipay: [open.alipay.com](https://open.alipay.com)
- Kakao: [developers.kakao.com/console/app](https://developers.kakao.com/console/app)
- Naver: [developers.naver.com/apps](https://developers.naver.com/apps)
- LINE: [developers.line.biz/console](https://developers.line.biz/console)
- Yahoo! Japan: [developer.yahoo.co.jp](https://developer.yahoo.co.jp)
- Shad: [shad.ir](https://shad.ir)
- Donbaler: [donbaler.ir](https://donbaler.ir)

---

## Step by step

### 1. Open Social Login

In the admin sidebar, open **Settings** and click **Social Login**.

### 2. Choose a region

Providers are grouped by region (Global, Russia and CIS, China, South Korea, Japan, Iran). Open the group that matches your audience.

### 3. Create the app at the provider

Click the console link on the provider card. Create a new app and follow the provider's instructions. When the provider asks for a redirect (callback) URL, use the URL for your own website's domain.

### 4. Paste the keys

Copy the keys from the provider's console and paste each one into its matching field on the card.

- Secrets and private keys are hidden fields. Paste them exactly as shown, without extra spaces or line changes.
- For **Apple**, paste the full contents of the `.p8` private key file, including the first and last lines.
- For **Microsoft**, leave Tenant as `common` unless you want to limit sign-in to one organization.

### 5. Save and test

Save the page, then open your login page in a private browser window and try the new provider. Fix any error before adding the next provider.

---

## Tips

- **Use HTTPS.** Most providers refuse sign-in on websites without a valid SSL certificate.
- **Keep secrets private.** Client secrets and private keys give full access to your app. Never share them in screenshots or public repositories.
- **Choose by audience.** Google and Facebook cover most global visitors. Add regional providers only if your visitors use them.
- **Start in test mode.** Some providers keep new apps in test or development mode. Complete their review or publishing step before real visitors use the login.

---

## Troubleshooting

- **The provider button does not appear on the login page.**
  Check that the keys are saved. A provider without keys is not shown.

- **"Redirect URI mismatch" or similar error.**
  The redirect URL in the provider's console does not match the one your site uses. Update it so both are identical, including `https` and any trailing slash.

- **"Invalid client" or "Invalid secret".**
  A key was copied wrongly or has a space at the start or end. Paste it again. If the secret was regenerated, use the newest one.

- **Apple sign-in fails.**
  Check that the Service ID, Team ID, Key ID and the full `.p8` key all belong to the same Apple developer account.

- **Sign-in works for you but not for others.**
  The app is probably still in test mode at the provider. Publish it or add the testers.
