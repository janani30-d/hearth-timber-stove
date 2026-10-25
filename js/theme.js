
/* =========================================
   HEARTH & TIMBER — SHARED THEME.JS
   Dark Mode + RTL for all pages
========================================= */

(() => {
    "use strict";

    const THEME_KEY = "ht-dark-mode-global";
    const OLD_THEME_KEY = "ht-dark-mode";

    const RTL_KEY = "ht-rtl-mode";
    const OLD_RTL_KEY = "ht-direction";

    const html = document.documentElement;

    const THEME_SELECTORS = [
        ".ht-theme-toggle",
        "#htThemeToggle",
        "#htThemeToggleDesktop",
        "#htLoginDarkToggle",
        "#htRegisterDarkToggle",
        ".ht-login-dark-toggle",
        ".ht-register-dark-toggle"
    ].join(",");

    const RTL_SELECTORS = [
        ".ht-rtl-toggle",
        "#htRtlToggle",
        "#htRtlToggleDesktop",
        "#htLoginRtlToggle",
        "#htRegisterRtlToggle"
    ].join(",");

    function readTheme() {
        const shared = localStorage.getItem(THEME_KEY);

        if (shared !== null) {
            return shared === "true";
        }

        const old = localStorage.getItem(OLD_THEME_KEY);
        return old === "true" || old === "enabled";
    }

    function readRTL() {
        const shared = localStorage.getItem(RTL_KEY);

        if (shared !== null) {
            return shared === "true";
        }

        return localStorage.getItem(OLD_RTL_KEY) === "rtl";
    }

    function updateThemeButtons(isDark) {
        document.querySelectorAll(THEME_SELECTORS).forEach(button => {
            button.setAttribute("aria-pressed", String(isDark));
            button.setAttribute(
                "aria-label",
                isDark ? "Switch to light mode" : "Switch to dark mode"
            );
            button.setAttribute(
                "title",
                isDark ? "Switch to light mode" : "Switch to dark mode"
            );

            const icon = button.querySelector("i");

            if (icon) {
                icon.classList.toggle("fa-moon", !isDark);
                icon.classList.toggle("fa-sun", isDark);
            }
        });
    }

    function applyTheme(isDark) {
        html.classList.toggle("dark-mode", isDark);
        document.body?.classList.toggle("dark-mode", isDark);
        updateThemeButtons(isDark);
    }

    function saveTheme(isDark) {
        localStorage.setItem(THEME_KEY, String(isDark));
        localStorage.setItem(OLD_THEME_KEY, String(isDark));
        applyTheme(isDark);
    }

    function updateRTLButtons(isRTL) {
        document.querySelectorAll(RTL_SELECTORS).forEach(button => {
            button.setAttribute("aria-pressed", String(isRTL));
            button.setAttribute(
                "aria-label",
                isRTL ? "Switch to left-to-right" : "Switch to right-to-left"
            );
            button.setAttribute(
                "title",
                isRTL ? "Switch to left-to-right" : "Switch to right-to-left"
            );
        });
    }

    function applyRTL(isRTL) {
        html.setAttribute("dir", isRTL ? "rtl" : "ltr");
        html.classList.toggle("rtl-mode", isRTL);
        document.body?.classList.toggle("rtl-mode", isRTL);
        updateRTLButtons(isRTL);
    }

    function saveRTL(isRTL) {
        localStorage.setItem(RTL_KEY, String(isRTL));
        localStorage.setItem(OLD_RTL_KEY, isRTL ? "rtl" : "ltr");
        applyRTL(isRTL);
    }

    function initialize() {
        applyTheme(readTheme());
        applyRTL(readRTL());
    }

    /*
       Capture clicks before old script.js handlers.
       This prevents the same button from toggling twice.
    */
    document.addEventListener("click", event => {
        const themeButton = event.target.closest(THEME_SELECTORS);

        if (themeButton) {
            event.preventDefault();
            event.stopImmediatePropagation();

            saveTheme(!readTheme());
            return;
        }

        const rtlButton = event.target.closest(RTL_SELECTORS);

        if (rtlButton) {
            event.preventDefault();
            event.stopImmediatePropagation();

            saveRTL(!readRTL());
        }
    }, true);

    /*
       Sync preference changes from other tabs.
    */
    window.addEventListener("storage", event => {
        if (
            event.key === THEME_KEY ||
            event.key === OLD_THEME_KEY
        ) {
            applyTheme(readTheme());
        }

        if (
            event.key === RTL_KEY ||
            event.key === OLD_RTL_KEY
        ) {
            applyRTL(readRTL());
        }
    });

    /*
       Apply saved preferences as soon as possible.
    */
    initialize();

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize, {
            once: true
        });
    }
})();
const THEME_KEY = "ht-dark-mode-global";

function applyDarkMode(isDark) {
    document.documentElement.classList.toggle("dark-mode", isDark);
    document.body.classList.toggle("dark-mode", isDark);
}

function saveDarkMode(isDark) {
    localStorage.setItem(THEME_KEY, String(isDark));
    localStorage.setItem("ht-dark-mode", String(isDark));
    applyDarkMode(isDark);
}

function loadDarkMode() {
    const saved = localStorage.getItem(THEME_KEY);
    const oldSaved = localStorage.getItem("ht-dark-mode");

    const isDark = saved !== null
        ? saved === "true"
        : oldSaved === "true" || oldSaved === "enabled";

    applyDarkMode(isDark);
}

document.addEventListener("click", function (event) {
    const button = event.target.closest(
        ".ht-theme-toggle, #htThemeToggle, #htThemeToggleDesktop, #htLoginDarkToggle, #htRegisterDarkToggle"
    );

    if (!button) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const isDark = !document.documentElement.classList.contains("dark-mode");
    saveDarkMode(isDark);
}, true);

loadDarkMode();

document.addEventListener("DOMContentLoaded", loadDarkMode);

window.addEventListener("pageshow", loadDarkMode);

window.addEventListener("storage", function (event) {
    if (
        event.key === THEME_KEY ||
        event.key === "ht-dark-mode"
    ) {
        loadDarkMode();
    }
});