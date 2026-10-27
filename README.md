# HideQuests

**HideQuests** is a lightweight, configurable BetterDiscord plugin for hiding selected Discord Quest interface elements.

## Features

- Nine independently configurable hiding categories
- A grouped settings interface with instant application
- Optional custom CSS selectors (one per line)
- Persistent preferences via BetterDiscord's data API
- Automatic cleanup when disabled
- No external dependencies

## Installation

1. Download `HideQuests.plugin.js`.
2. Open Discord → User Settings → BetterDiscord → Plugins → Open Plugins Folder.
3. Place the file in that folder and enable **HideQuests**.
4. Open plugin settings to customize the categories.

## Settings

Navigation, promotions, banners, cards, progress, rewards, notifications, buttons, and activity can each be hidden independently. All categories are enabled by default.

## Custom selectors

Add one valid CSS selector per line in the advanced settings field. Custom selectors are applied when the field loses focus. Be careful: broad selectors may hide unrelated Discord UI.

## Compatibility and limitations

HideQuests visually hides matching UI elements; it does not disable Quests, block network requests, or modify your account. Discord frequently changes class names and layouts, so some Quest elements may not match the bundled selectors. The plugin has not yet been tested against all current Discord releases.

## Privacy

The plugin does not collect telemetry, send network requests, or access external services. Preferences are saved locally through BetterDiscord.

## Version

1.0.0 — Initial public release candidate.

## Author

MonkeyPr0grammer
