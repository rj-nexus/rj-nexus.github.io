# Chinese Festivals Widget

**中国节日** shows upcoming Chinese festivals with a live countdown, today's date in the Chinese lunar calendar, the day's auspicious and avoid activities, and the current Chinese hour. Everything is calculated on your server. No external API is used.

## What it shows

| Block | Description |
|---|---|
| **Clock** | The current time in the timezone you choose. Supports 24-hour and 12-hour formats. |
| **Today** | Lunar date, year in the Chinese sexagenary cycle (干支) with its zodiac animal, and the next solar term. |
| **宜 / 忌 (Yi / Ji)** | Activities that are auspicious (宜) and activities to avoid (忌) today. Up to 8 of each. |
| **Shi Chen (时辰)** | The current traditional Chinese double-hour and its time range. |
| **Countdown** | A live countdown to the next festival, in days, hours, minutes and seconds. |
| **Festival list** | The next 3 to 10 festivals with their dates and days remaining. |

### Festivals included

Spring Festival (春节), Chinese New Year's Eve (除夕), Lantern Festival (元宵节), Dragon Head Raising (龙抬头), Qingming (清明节), Dragon Boat Festival (端午节), Qixi (七夕), Hungry Ghost Festival (中元节), Mid-Autumn Festival (中秋节), Double Ninth Festival (重阳节), Winter Solstice (冬至), Laba (腊八节) and Little New Year (小年).

Names are also shown in English, and in pinyin if you enable it.

## Settings

### Content tab

| Setting | Description |
|---|---|
| **Title** | Heading of the widget. Default `中国节日`. |
| **Timezone** | An IANA timezone such as `Asia/Baku`, `Asia/Shanghai` or `Europe/London`. An invalid value falls back to `Asia/Baku`. |
| **Number of Festivals** | 3, 4, 5, 6, 8 or 10. |
| **Time Format** | 24-hour or 12-hour (AM/PM). |
| **Show Countdown** | Shows the countdown to the next festival. |
| **Show Today's Lunar Date** | Shows the lunar date block. |
| **Show Yi / Ji** | Shows auspicious and avoid activities. |
| **Show Shi Chen Hour** | Shows the current Chinese hour. |
| **Show Pinyin** | Shows pinyin next to festival names. |

### Style tab

| Setting | Description |
|---|---|
| **Animations** | Turns the lantern and glow animations on or off. They also stop automatically for visitors who prefer reduced motion. |
| **Style** | `Red & Gold` or `Dark`. |
| **Accent Color** | Highlight color. Default `#facc15`. |

## Requirements

The widget uses the `6tail/lunar-php` package for lunar calendar calculations. Install it from the project root:

```bash
composer require 6tail/lunar-php
php artisan optimize:clear
```

> [!IMPORTANT]
> Sites installed from a ZIP release do not run Composer. The release package must already include the library in its `vendor/` folder.

## Caching

The calculated data is cached for 6 hours, separately for each date, timezone, number of festivals and interface language. The countdown itself runs in the visitor's browser, so it stays live between cache refreshes.

## Troubleshooting

| Message | Cause and fix |
|---|---|
| **Calendar library is not installed.** | The `6tail/lunar-php` package is missing. Install it as shown above. |
| **Calendar data is temporarily unavailable.** | The calculation failed. Check the application log for the reported error. |

## For developers

The library's namespace is `com\nlf\calendar`:

```php
use com\nlf\calendar\Lunar;
use com\nlf\calendar\Solar;
```
