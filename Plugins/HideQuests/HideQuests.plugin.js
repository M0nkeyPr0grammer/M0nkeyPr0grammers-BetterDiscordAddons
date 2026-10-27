/**
 * @name HideQuests
 * @author MonkeyPr0grammer
 * @authorLink https://github.com/M0nkeyPr0grammer
 * @version 1.0.0
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
            {title: "Navigation & discovery", items: [
                ["navigation", "Quest navigation", "Hide links and entry points to Quest pages."],
                ["promotions", "Quest promotions", "Hide Quest promotions and featured placements."],
                ["banners", "Quest banners", "Hide Quest-related promotional banners."]
            ]},
            {title: "Quest content", items: [
                ["cards", "Quest cards", "Hide Quest cards matching supported selectors."],
                ["progress", "Progress indicators", "Hide Quest progress and status indicators."],
                ["rewards", "Reward indicators", "Hide Quest reward-related elements."]
            ]},
            {title: "Activity & alerts", items: [
                ["notifications", "Quest notifications", "Hide Quest notices and notifications."],
                ["buttons", "Quest buttons", "Hide buttons explicitly labeled as Quests."],
                ["activity", "Quest activity", "Hide Quest-related activity elements."]
            ]}
        ];
        this.selectors = {
            navigation: ['a[href="/quest-home"]', 'a[href^="/quests"]', '[class*="questsEntryPoint"]', '[class*="questEntryPoint"]'],
            promotions: ['[class*="questPromo"]', '[class*="QuestPromo"]', '[class*="questPromotion"]', '[class*="QuestPromotion"]'],
            banners: ['[class*="questBanner"]', '[class*="QuestBanner"]'],
            cards: ['[class*="questCard"]', '[class*="QuestCard"]'],
            progress: ['[class*="questProgress"]', '[class*="QuestProgress"]', '[class*="questIndicator"]', '[class*="QuestIndicator"]'],
            rewards: ['[class*="questReward"]', '[class*="QuestReward"]'],
            notifications: ['[class*="questNotice"]', '[class*="QuestNotice"]', '[class*="questNotification"]', '[class*="QuestNotification"]'],
            buttons: ['button[aria-label*="Quest"]', 'button[aria-label*="quest"]', 'a[aria-label*="Quest"]', 'a[aria-label*="quest"]'],
            activity: ['[class*="questActivity"]', '[class*="QuestActivity"]']
        };
        this.settings = {...this.defaults};
        this.started = false;
    }

    getName() { return this.pluginName; }
    getAuthor() { return "MonkeyPr0grammer"; }
    getVersion() { return "1.0.0"; }
    getDescription() { return "Hide Discord Quest UI with configurable settings."; }

    start() {
        this.started = true;
        try {
            const stored = BdApi.Data.load(this.pluginName, "settings") || {};
            const values = stored.all?.general || stored.general || stored;
            this.settings = {...this.defaults};
            for (const key of Object.keys(this.defaults)) {
                if (key === "customSelectors" && typeof values[key] === "string") this.settings[key] = values[key];
                else if (key !== "customSelectors" && typeof values[key] === "boolean") this.settings[key] = values[key];
            }
            this.applyStyles();
        } catch (error) {
            console.error("[HideQuests] Failed to initialize:", error);
        }
    }

    stop() {
        this.started = false;
        BdApi.DOM.removeStyle(this.styleId);
    }

    saveSettings() {
        try {
            BdApi.Data.save(this.pluginName, "settings", {all: {general: {...this.settings}}});
            if (this.started) this.applyStyles();
        } catch (error) {
            console.error("[HideQuests] Failed to save settings:", error);
        }
    }

    getCustomSelectors() {
        const valid = [];
        for (const raw of this.settings.customSelectors.split(/\r?\n/)) {
            const selector = raw.trim();
            if (!selector || selector.startsWith("//") || selector.startsWith("/*")) continue;
            try {
                document.querySelector(selector);
                valid.push(selector);
            } catch (error) {
                console.warn("[HideQuests] Ignoring invalid selector:", selector, error);
            }
        }
        return valid;
    }

    applyStyles() {
        BdApi.DOM.removeStyle(this.styleId);
        if (!this.started) return;
        const active = [];
        for (const [key, selectors] of Object.entries(this.selectors)) {
            if (this.settings[key]) active.push(...selectors);
        }
        active.push(...this.getCustomSelectors());
        if (!active.length) return;
        const css = [...new Set(active)].map(selector => `${selector} { display: none !important; }`).join("\n");
        BdApi.DOM.addStyle(this.styleId, css);
    }

    element(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    getSettingsPanel() {
        const panel = this.element("div", "hq-panel");
        const css = this.element("style");
        css.textContent = `
            .hq-panel {color: var(--text-normal); font-family: var(--font-primary, sans-serif); max-width: 740px; padding: 12px 4px 28px;}
            .hq-header {margin-bottom: 22px;}
            .hq-title {font-size: 22px; font-weight: 750; margin: 0 0 5px; color: var(--header-primary, var(--text-normal));}
            .hq-subtitle {font-size: 13px; color: var(--text-muted); line-height: 1.5; margin: 0;}
            .hq-section {border: 1px solid var(--background-modifier-accent, #5555); border-radius: 12px; margin-bottom: 15px; overflow: hidden;}
            .hq-section-title {padding: 14px 17px 10px; font-size: 12px; font-weight: 750; letter-spacing: .07em; text-transform: uppercase; color: var(--text-muted);}
            .hq-option {display: flex; justify-content: space-between; align-items: center; gap: 20px; padding: 12px 17px; cursor: pointer;}
            .hq-option + .hq-option {border-top: 1px solid var(--background-modifier-accent, #5553);}
            .hq-option-title {font-size: 14px; font-weight: 600; margin-bottom: 4px;}
            .hq-option-description {font-size: 12px; line-height: 1.5; color: var(--text-muted);}
            .hq-checkbox {width: 19px; height: 19px; accent-color: var(--brand-500, #5865f2); flex-shrink: 0; cursor: pointer;}
            .hq-custom {padding: 0 17px 16px;}
            .hq-textarea {box-sizing: border-box; width: 100%; min-height: 115px; resize: vertical; padding: 12px; border: 1px solid var(--background-modifier-accent, #5555); border-radius: 8px; background: var(--input-background, #222); color: var(--text-normal); font: 12px/1.5 monospace;}
            .hq-footer {display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-top: 17px;}
            .hq-note {font-size: 12px; color: var(--text-muted);}
            .hq-reset {border: 0; border-radius: 6px; padding: 9px 14px; font-weight: 600; cursor: pointer; background: var(--button-secondary-background, #4e5058); color: var(--text-normal);}
            .hq-reset:hover {filter: brightness(1.12);}
        `;
        panel.appendChild(css);

        const header = this.element("div", "hq-header");
        header.appendChild(this.element("h2", "hq-title", "HideQuests"));
        header.appendChild(this.element("p", "hq-subtitle", "Choose what to hide. Changes apply immediately and are restored when the plugin is disabled."));
        panel.appendChild(header);

        for (const group of this.groups) {
            const section = this.element("section", "hq-section");
            section.appendChild(this.element("div", "hq-section-title", group.title));
            for (const [key, label, description] of group.items) {
                const row = this.element("label", "hq-option");
                const info = this.element("div");
                info.appendChild(this.element("div", "hq-option-title", label));
                info.appendChild(this.element("div", "hq-option-description", description));
                const toggle = this.element("input", "hq-checkbox");
                toggle.type = "checkbox";
                toggle.checked = this.settings[key];
                toggle.addEventListener("change", () => {
                    this.settings[key] = toggle.checked;
                    this.saveSettings();
                });
                row.append(info, toggle);
                section.appendChild(row);
            }
            panel.appendChild(section);
        }

        const custom = this.element("section", "hq-section");
        custom.appendChild(this.element("div", "hq-section-title", "Advanced · Custom selectors"));
        const customBody = this.element("div", "hq-custom");
        customBody.appendChild(this.element("p", "hq-subtitle", "Optional: enter one CSS selector per line to hide additional elements. Invalid selectors are ignored."));
        const textarea = this.element("textarea", "hq-textarea");
        textarea.placeholder = '[class*="exampleQuestElement"]';
        textarea.value = this.settings.customSelectors;
        textarea.setAttribute("aria-label", "Custom CSS selectors");
        textarea.addEventListener("change", () => {
            this.settings.customSelectors = textarea.value;
            this.saveSettings();
        });
        customBody.appendChild(textarea);
        custom.appendChild(customBody);
        panel.appendChild(custom);

        const footer = this.element("div", "hq-footer");
        footer.appendChild(this.element("span", "hq-note", "HideQuests v1.0.0 · Visual changes only · No external dependencies"));
        const reset = this.element("button", "hq-reset", "Reset to defaults");
        reset.type = "button";
        reset.addEventListener("click", () => {
            this.settings = {...this.defaults};
            this.saveSettings();
            panel.replaceWith(this.getSettingsPanel());
        });
        footer.appendChild(reset);
        panel.appendChild(footer);
        return panel;
    }
};
