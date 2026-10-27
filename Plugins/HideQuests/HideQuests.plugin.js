/**
 * @name HideQuests
 * @author MonkeyPr0grammer
 * @authorLink https://github.com/M0nkeyPr0grammer
 * @version 1.0.0
 * @version 1.0.1
 * @description Hide Discord Quest navigation, promotions, notifications and other Quest UI with customizable settings.
 * @source https://github.com/M0nkeyPr0grammer/M0nkeyPr0grammers-BetterDiscordAddons
 * @donate https://buymeacoffee.com/m0nkeypr0grammer
 */

/**
 * HideQuests - A lightweight BetterDiscord plugin.
 * No external dependencies. All changes are visual and reversible.
 */
module.exports = class HideQuests {
    constructor() {
        this.pluginName = "HideQuests";
        this.styleId = "HideQuests-Styles";

        this.defaults = {
            navigation: true,
            questBar: true,
            promotions: true,
            banners: true,
            cards: true,
            progress: true,
            rewards: true,
            notifications: true,
            buttons: true,
            activity: true,
            customSelectors: ""
        };

        this.groups = [
            {
                title: "Navigation & discovery",
                items: [
                    ["navigation", "Quest navigation", "Hide links and entry points to Quest pages."],
                    ["questBar", "Quest bar", "Hide the entire Quest promotion bar above your user controls."],
                    ["promotions", "Quest promotions", "Hide Quest promotions and featured placements."],
                    ["banners", "Quest banners", "Hide Quest-related promotional banners."]
                ]
            },
            {
                title: "Quest content",
                items: [
                    ["cards", "Quest cards", "Hide Quest cards throughout Discord."],
                    ["progress", "Quest progress", "Hide Quest progress indicators."],
                    ["rewards", "Quest rewards", "Hide Quest reward indicators."],
                    ["buttons", "Quest buttons", "Hide buttons explicitly labeled as Quest controls."]
                ]
            },
            {
                title: "Activity & alerts",
                items: [
                    ["notifications", "Quest notifications", "Hide Quest notices and notifications."],
                    ["activity", "Quest activity", "Hide Quest-related activity elements."]
                ]
            }
        ];

        this.selectors = {
            navigation: [
                'a[href="/quest-home"]',
                'a[href^="/quests"]',
                '[class*="questsEntryPoint"]',
                '[class*="questEntryPoint"]'
            ],

            questBar: [
                '[data-testid="quest-bar-container"]'
            ],

            promotions: [
                '[class*="questPromo"]',
                '[class*="QuestPromo"]',
                '[class*="questPromotion"]',
                '[class*="QuestPromotion"]'
            ],

            banners: [
                '[class*="questBanner"]',
                '[class*="QuestBanner"]'
            ],

            cards: [
                '[class*="questCard"]',
                '[class*="QuestCard"]'
            ],

            progress: [
                '[class*="questProgress"]',
                '[class*="QuestProgress"]',
                '[class*="questIndicator"]',
                '[class*="QuestIndicator"]'
            ],

            rewards: [
                '[class*="questReward"]',
                '[class*="QuestReward"]'
            ],

            notifications: [
                '[class*="questNotice"]',
                '[class*="QuestNotice"]',
                '[class*="questNotification"]',
                '[class*="QuestNotification"]'
            ],

            buttons: [
                'button[aria-label*="Quest"]',
                'button[aria-label*="quest"]',
                'a[aria-label*="Quest"]',
                'a[aria-label*="quest"]'
            ],

            activity: [
                '[class*="questActivity"]',
                '[class*="QuestActivity"]'
            ]
        };

        this.settings = {...this.defaults};
    }

    getName() {
        return this.pluginName;
    }

    getAuthor() {
        return "MonkeyPr0grammer";
    }

    getVersion() {
        return "1.0.1";
    }

    getDescription() {
        return "Hide Discord Quest UI with customizable settings.";
    }

    load() {}

    start() {
        this.loadSettings();
        this.applyStyles();
        console.log("[HideQuests] v1.0.1 started.");
    }

    stop() {
        this.removeStyles();
        console.log("[HideQuests] Stopped.");
    }

    loadSettings() {
        try {
            const saved = BdApi.Data.load(
                this.pluginName,
                "settings"
            ) || {};

            const options =
                saved.all?.general ||
                saved.general ||
                saved;

            this.settings = {
                ...this.defaults,
                ...options
            };
        } catch (error) {
            console.error(
                "[HideQuests] Failed to load settings:",
                error
            );

            this.settings = {...this.defaults};
        }
    }

    saveSettings() {
        try {
            BdApi.Data.save(
                this.pluginName,
                "settings",
                {
                    all: {
                        general: {...this.settings}
                    }
                }
            );
        } catch (error) {
            console.error(
                "[HideQuests] Failed to save settings:",
                error
            );
        }

        this.applyStyles();
    }

    removeStyles() {
        BdApi.DOM.removeStyle(this.styleId);
    }

    getCustomSelectors() {
        const input = String(
            this.settings.customSelectors || ""
        );

        const selectors = [];

        for (const line of input.split(/\r?\n/)) {
            const selector = line.trim();

            if (
                !selector ||
                selector.startsWith("//") ||
                selector.startsWith("/*")
            ) {
                continue;
            }

            try {
                document.querySelector(selector);
                selectors.push(selector);
            } catch (error) {
                console.warn(
                    "[HideQuests] Invalid CSS selector:",
                    selector,
                    error
                );
            }
        }

        return selectors;
    }

    applyStyles() {
        this.removeStyles();

        const enabled = [];

        for (const [key, selectors] of Object.entries(
            this.selectors
        )) {
            if (this.settings[key]) {
                enabled.push(...selectors);
            }
        }

        enabled.push(...this.getCustomSelectors());

        const unique = [...new Set(enabled)];

        if (!unique.length) {
            return;
        }

        const css = unique
            .map(selector =>
                `${selector} { display: none !important; }`
            )
            .join("\n");

        BdApi.DOM.addStyle(this.styleId, css);
    }

    createElement(tag, styles = {}) {
        const element = document.createElement(tag);
        Object.assign(element.style, styles);
        return element;
    }

    getSettingsPanel() {
        const panel = this.createElement("div", {
            padding: "20px",
            color: "var(--text-normal)"
        });

        const title = this.createElement("h2", {
            fontSize: "22px",
            fontWeight: "700",
            marginBottom: "8px"
        });

        title.textContent = "HideQuests";

        const subtitle = this.createElement("p", {
            fontSize: "13px",
            color: "var(--text-muted)",
            marginBottom: "24px"
        });

        subtitle.textContent =
            "Customize which Discord Quest elements are hidden.";

        panel.append(title, subtitle);

        for (const group of this.groups) {
            const heading = this.createElement("h3", {
                fontSize: "15px",
                fontWeight: "600",
                marginTop: "20px",
                marginBottom: "12px"
            });

            heading.textContent = group.title;
            panel.appendChild(heading);

            for (const [key, label, description] of group.items) {
                const row = this.createElement("label", {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 0",
                    gap: "16px",
                    cursor: "pointer",
                    borderBottom:
                        "1px solid var(--background-modifier-accent)"
                });

                const text = this.createElement("div", {
                    flex: "1"
                });

                const name = this.createElement("div", {
                    fontWeight: "600",
                    marginBottom: "4px"
                });

                name.textContent = label;

                const details = this.createElement("div", {
                    fontSize: "12px",
                    color: "var(--text-muted)"
                });

                details.textContent = description;

                text.append(name, details);

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = Boolean(this.settings[key]);

                Object.assign(checkbox.style, {
                    width: "18px",
                    height: "18px",
                    cursor: "pointer",
                    accentColor: "var(--brand-500)"
                });

                checkbox.addEventListener("change", () => {
                    this.settings[key] = checkbox.checked;
                    this.saveSettings();
                });

                row.append(text, checkbox);
                panel.appendChild(row);
            }
        }

        const advanced = this.createElement("h3", {
            fontSize: "15px",
            fontWeight: "600",
            marginTop: "28px",
            marginBottom: "8px"
        });

        advanced.textContent = "Advanced customization";
        panel.appendChild(advanced);

        const hint = this.createElement("p", {
            fontSize: "12px",
            color: "var(--text-muted)",
            marginBottom: "12px"
        });

        hint.textContent =
            "Add CSS selectors, one per line, to hide additional Discord elements.";

        panel.appendChild(hint);

        const textarea = this.createElement("textarea", {
            boxSizing: "border-box",
            width: "100%",
            minHeight: "110px",
            padding: "12px",
            resize: "vertical",
            borderRadius: "6px",
            border: "1px solid var(--input-border)",
            background: "var(--input-background)",
            color: "var(--text-normal)",
            fontFamily: "monospace",
            fontSize: "12px"
        });

        textarea.placeholder =
            '[data-testid="example-container"]';

        textarea.value =
            this.settings.customSelectors || "";

        textarea.addEventListener("change", () => {
            this.settings.customSelectors = textarea.value;
            this.saveSettings();
        });

        panel.appendChild(textarea);

        const actions = this.createElement("div", {
            display: "flex",
            gap: "12px",
            marginTop: "20px"
        });

        const reset = this.createElement("button", {
            padding: "10px 16px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            background: "var(--button-secondary-background)",
            color: "var(--text-normal)"
        });

        reset.textContent = "Reset to defaults";

        reset.addEventListener("click", () => {
            this.settings = {...this.defaults};
            this.saveSettings();
            panel.replaceWith(this.getSettingsPanel());
        });

        const apply = this.createElement("button", {
            padding: "10px 16px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            background: "var(--button-positive-background)",
            color: "white"
        });

        apply.textContent = "Apply settings";

        apply.addEventListener("click", () => {
            this.settings.customSelectors = textarea.value;
            this.saveSettings();

            BdApi.UI.showToast(
                "HideQuests settings applied.",
                {type: "success"}
            );
        });

        actions.append(reset, apply);
        panel.appendChild(actions);

        const footer = this.createElement("p", {
            fontSize: "11px",
            color: "var(--text-muted)",
            marginTop: "24px",
            textAlign: "center"
        });

        footer.textContent =
            "HideQuests v1.0.1 • Developed by MonkeyPr0grammer";

        panel.appendChild(footer);

        return panel;
    }
};
