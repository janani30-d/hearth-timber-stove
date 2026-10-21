
/* =========================================
   HEARTH & TIMBER
   PART 4 — HEADER JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       1. SELECT ELEMENTS
    ===================================== */

    const html = document.documentElement;
    const body = document.body;

    const header = document.getElementById("htHeader");
    const navigation = document.getElementById("htNavigation");
    const menuToggle = document.getElementById("htMenuToggle");

    const rtlButtons = document.querySelectorAll(".ht-rtl-toggle");
    const themeButtons = document.querySelectorAll(".ht-theme-toggle");

    const homeDropdown = document.querySelector(".ht-home-dropdown");
    const homeDropdownLink = homeDropdown
        ? homeDropdown.querySelector(".ht-nav-link")
        : null;

    const dropdownLinks = homeDropdown
        ? homeDropdown.querySelectorAll(".ht-dropdown-menu a")
        : [];

    const mobileBreakpoint = window.matchMedia("(max-width: 1199px)");

    if (!header || !navigation || !menuToggle) {
        console.warn("Hearth & Timber header elements were not found.");
        return;
    }

    /* =====================================
       2. SAFE STORAGE HELPERS
    ===================================== */

    function getPreference(key, fallback) {
        try {
            const value = localStorage.getItem(key);
            return value === null ? fallback : value;
        } catch (error) {
            return fallback;
        }
    }

    function savePreference(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            // Continue without persistence if storage is unavailable.
        }
    }

    /* =====================================
       3. HAMBURGER MENU
    ===================================== */

    function setMenu(open) {
        const shouldOpen = Boolean(open) && mobileBreakpoint.matches;

        navigation.classList.toggle("is-open", shouldOpen);

        menuToggle.setAttribute("aria-expanded", String(shouldOpen));
        menuToggle.setAttribute(
            "aria-label",
            shouldOpen ? "Close navigation menu" : "Open navigation menu"
        );

        const icon = menuToggle.querySelector("i");

        if (icon) {
            icon.classList.toggle("fa-bars", !shouldOpen);
            icon.classList.toggle("fa-xmark", shouldOpen);
        }

        if (!shouldOpen) {
            closeHomeDropdown();
        }
    }

    menuToggle.addEventListener("click", function () {
        const isOpen = navigation.classList.contains("is-open");
        setMenu(!isOpen);
    });

    /* =====================================
       4. HOME DROPDOWN
    ===================================== */

    function closeHomeDropdown() {
        if (!homeDropdown) return;

        homeDropdown.classList.remove("dropdown-open");

        if (homeDropdownLink) {
            homeDropdownLink.setAttribute("aria-expanded", "false");
        }
    }

    function toggleHomeDropdown() {
        if (!homeDropdown) return;

        const isOpen = homeDropdown.classList.contains("dropdown-open");

        homeDropdown.classList.toggle("dropdown-open", !isOpen);

        if (homeDropdownLink) {
            homeDropdownLink.setAttribute("aria-expanded", String(!isOpen));
        }
    }

    if (homeDropdown && homeDropdownLink) {

        homeDropdownLink.setAttribute("aria-haspopup", "true");
        homeDropdownLink.setAttribute("aria-expanded", "false");

        homeDropdownLink.addEventListener("click", function (event) {

            if (mobileBreakpoint.matches) {
                // On tablet/mobile, use Home to expand the submenu.
                event.preventDefault();
                toggleHomeDropdown();
            }
        });

        // Desktop: support keyboard users.
        homeDropdownLink.addEventListener("keydown", function (event) {
            if (
                !mobileBreakpoint.matches &&
                (event.key === "ArrowDown" || event.key === "Enter")
            ) {
                if (event.key === "ArrowDown") {
                    event.preventDefault();
                    homeDropdown.classList.add("dropdown-open");
                    homeDropdownLink.setAttribute("aria-expanded", "true");

                    const firstLink = homeDropdown.querySelector(
                        ".ht-dropdown-menu a"
                    );

                    if (firstLink) firstLink.focus();
                }
            }
        });

        dropdownLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                closeHomeDropdown();
                setMenu(false);
            });
        });
    }

    /* =====================================
       5. CLOSE MENU AFTER NAVIGATION
    ===================================== */

    navigation.querySelectorAll("a").forEach(function (link) {

        link.addEventListener("click", function () {

            // Close after selecting a page link.
            if (!homeDropdown || !homeDropdown.contains(link)) {
                setMenu(false);
            }
        });
    });

    /* =====================================
       6. DARK MODE
    ===================================== */

    function updateThemeButtons(isDark) {

        themeButtons.forEach(function (button) {

            const icon = button.querySelector("i");

            button.setAttribute("aria-pressed", String(isDark));
            button.setAttribute(
                "aria-label",
                isDark ? "Switch to light mode" : "Switch to dark mode"
            );
            button.setAttribute(
                "title",
                isDark ? "Light Mode" : "Dark Mode"
            );

            if (icon) {
                icon.classList.toggle("fa-moon", !isDark);
                icon.classList.toggle("fa-sun", isDark);

                icon.classList.toggle("fa-regular", !isDark);
                icon.classList.toggle("fa-solid", isDark);
            }
        });
    }

    function applyTheme(isDark, persist = true) {

        html.classList.toggle("dark-mode", isDark);

        updateThemeButtons(isDark);

        if (persist) {
            savePreference("ht-dark-mode", isDark ? "true" : "false");
        }
    }

    // Restore theme when each page loads.
    applyTheme(getPreference("ht-dark-mode", "false") === "true", false);

    themeButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const isDark = !html.classList.contains("dark-mode");

            applyTheme(isDark);
        });
    });

    /* =====================================
       7. RIGHT-TO-LEFT MODE
    ===================================== */

    function updateRtlButtons(isRtl) {

        rtlButtons.forEach(function (button) {

            button.setAttribute("aria-pressed", String(isRtl));
            button.setAttribute(
                "aria-label",
                isRtl ? "Switch to left-to-right layout" :
                        "Switch to right-to-left layout"
            );
            button.setAttribute(
                "title",
                isRtl ? "Switch to LTR" : "Switch to RTL"
            );
        });
    }

    function applyDirection(isRtl, persist = true) {

        html.setAttribute("dir", isRtl ? "rtl" : "ltr");

        updateRtlButtons(isRtl);

        if (persist) {
            savePreference("ht-rtl-mode", isRtl ? "true" : "false");
        }
    }

    // Restore direction across pages.
    applyDirection(getPreference("ht-rtl-mode", "false") === "true", false);

    rtlButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const isRtl = html.getAttribute("dir") !== "rtl";

            applyDirection(isRtl);
        });
    });

    /* =====================================
       8. ESCAPE KEY
    ===================================== */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {
            setMenu(false);
            closeHomeDropdown();
            menuToggle.focus();
        }
    });

    /* =====================================
       9. CLICK OUTSIDE HEADER
    ===================================== */

    document.addEventListener("click", function (event) {

        if (!header.contains(event.target)) {
            setMenu(false);
            closeHomeDropdown();
        }
    });

    /* =====================================
       10. RESPONSIVE BREAKPOINT CHANGES
    ===================================== */

    function handleBreakpointChange() {

        setMenu(false);
        closeHomeDropdown();
    }

    if (mobileBreakpoint.addEventListener) {
        mobileBreakpoint.addEventListener(
            "change",
            handleBreakpointChange
        );
    } else {
        // Fallback for older browsers.
        mobileBreakpoint.addListener(handleBreakpointChange);
    }

    /* =====================================
       11. INITIALIZE ACCESSIBILITY
    ===================================== */

    menuToggle.setAttribute("aria-controls", "htNavigation");
    menuToggle.setAttribute("aria-expanded", "false");

    if (homeDropdownLink) {
        homeDropdownLink.setAttribute("aria-expanded", "false");
    }

    setMenu(false);

});







/* ========================================
   HOME 1 — AUTOMATIC HERO SLIDER
======================================== */

document.addEventListener("DOMContentLoaded", function () {
    const hero = document.querySelector("#htHome1Hero");

    if (!hero) return;

    const slides = hero.querySelectorAll(".ht-home1-slide");
    const dots = hero.querySelectorAll(".ht-home1-dot");

    if (slides.length < 2) return;

    let currentSlide = 0;
    let sliderInterval;

    function showSlide(index) {
        currentSlide = index;

        slides.forEach(function (slide, i) {
            slide.classList.toggle("active", i === index);
        });

        dots.forEach(function (dot, i) {
            dot.classList.toggle("active", i === index);
            dot.setAttribute(
                "aria-current",
                i === index ? "true" : "false"
            );
        });
    }

    function startSlider() {
        clearInterval(sliderInterval);

        sliderInterval = setInterval(function () {
            const nextSlide = (currentSlide + 1) % slides.length;
            showSlide(nextSlide);
        }, 5000);
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
            showSlide(index);
            startSlider();
        });
    });

    showSlide(0);
    startSlider();
});















/*******login********/

/* =========================================
   HEARTH & TIMBER — LOGIN PAGE JS
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const html = document.documentElement;

    // DARK MODE
    const darkToggle = document.getElementById("htLoginDarkToggle");

    function applyDarkMode(enabled) {
        html.classList.toggle("dark-mode", enabled);
        localStorage.setItem("ht-dark-mode", enabled ? "enabled" : "disabled");

        if (darkToggle) {
            darkToggle.setAttribute("aria-pressed", String(enabled));
            darkToggle.setAttribute(
                "aria-label",
                enabled ? "Switch to light mode" : "Switch to dark mode"
            );
        }
    }

    applyDarkMode(localStorage.getItem("ht-dark-mode") === "enabled");

    darkToggle?.addEventListener("click", () => {
        applyDarkMode(!html.classList.contains("dark-mode"));
    });

    // RTL / LTR
    const rtlToggle = document.getElementById("htLoginRtlToggle");

    function applyDirection(isRTL) {
        html.setAttribute("dir", isRTL ? "rtl" : "ltr");
        localStorage.setItem("ht-direction", isRTL ? "rtl" : "ltr");

        if (rtlToggle) {
            rtlToggle.setAttribute("aria-pressed", String(isRTL));
            rtlToggle.setAttribute(
                "aria-label",
                isRTL ? "Switch to left-to-right layout" : "Switch to right-to-left layout"
            );
        }
    }

    applyDirection(localStorage.getItem("ht-direction") === "rtl");

    rtlToggle?.addEventListener("click", () => {
        applyDirection(html.getAttribute("dir") !== "rtl");
    });

    // SHOW / HIDE PASSWORD
    document.querySelectorAll("[data-password-target]").forEach((button) => {
        button.addEventListener("click", () => {
            const targetId = button.dataset.passwordTarget;
            const passwordInput = document.getElementById(targetId);

            if (!passwordInput) return;

            const showPassword = passwordInput.type === "password";
            passwordInput.type = showPassword ? "text" : "password";

            button.setAttribute("aria-pressed", String(showPassword));
            button.setAttribute(
                "aria-label",
                showPassword ? "Hide password" : "Show password"
            );
        });
    });

    // LOGIN FORM
    const loginForm = document.querySelector(".ht-login-form");

    loginForm?.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!loginForm.checkValidity()) {
            loginForm.reportValidity();
            return;
        }

        /*
          Connect your authentication backend here.
          Do not treat client-side validation as authentication.
        */
        alert("Login form validated. Connect your authentication backend to sign in.");
    });

    // REMEMBER ME is handled by the browser form.
    // Do not store passwords in localStorage.

    // SOCIAL LOGIN BUTTONS
    document.querySelectorAll(".ht-login-social-btn").forEach((button) => {
        button.addEventListener("click", () => {
            /*
              Google, Facebook and Apple login require their respective
              OAuth / identity-provider integrations.
            */
            alert("Social login will work after provider authentication is configured.");
        });
    });
});










/***********REGISTER *********/

/* =========================================
   HEARTH & TIMBER — REGISTER PAGE JS
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const html = document.documentElement;

    // DARK MODE
    const darkToggle = document.getElementById("htRegisterDarkToggle");

    function applyDarkMode(enabled) {
        html.classList.toggle("dark-mode", enabled);
        localStorage.setItem("ht-dark-mode", enabled ? "enabled" : "disabled");

        if (darkToggle) {
            darkToggle.setAttribute("aria-pressed", String(enabled));
            darkToggle.setAttribute(
                "aria-label",
                enabled ? "Switch to light mode" : "Switch to dark mode"
            );
        }
    }

    applyDarkMode(localStorage.getItem("ht-dark-mode") === "enabled");

    darkToggle?.addEventListener("click", () => {
        applyDarkMode(!html.classList.contains("dark-mode"));
    });

    // RTL / LTR
    const rtlToggle = document.getElementById("htRegisterRtlToggle");

    function applyDirection(isRTL) {
        html.setAttribute("dir", isRTL ? "rtl" : "ltr");
        localStorage.setItem("ht-direction", isRTL ? "rtl" : "ltr");

        if (rtlToggle) {
            rtlToggle.setAttribute("aria-pressed", String(isRTL));
            rtlToggle.setAttribute(
                "aria-label",
                isRTL ? "Switch to left-to-right layout" : "Switch to right-to-left layout"
            );
        }
    }

    applyDirection(localStorage.getItem("ht-direction") === "rtl");

    rtlToggle?.addEventListener("click", () => {
        applyDirection(html.getAttribute("dir") !== "rtl");
    });

    // SHOW / HIDE PASSWORD
    document.querySelectorAll("[data-password-target]").forEach((button) => {
        button.addEventListener("click", () => {
            const targetId = button.dataset.passwordTarget;
            const passwordInput = document.getElementById(targetId);

            if (!passwordInput) return;

            const showPassword = passwordInput.type === "password";
            passwordInput.type = showPassword ? "text" : "password";

            button.setAttribute("aria-pressed", String(showPassword));
            button.setAttribute(
                "aria-label",
                showPassword ? "Hide password" : "Show password"
            );
        });
    });

    // REGISTER FORM
    const registerForm = document.getElementById("htRegisterForm");
    const password = document.getElementById("htRegisterPassword");
    const confirmPassword = document.getElementById("htRegisterConfirmPassword");
    const message = document.getElementById("htRegisterMessage");

    function showMessage(text, type = "error") {
        if (!message) {
            alert(text);
            return;
        }

        message.textContent = text;
        message.classList.remove("success", "error");
        message.classList.add(type);
        message.setAttribute("role", "status");
    }

    function clearMessage() {
        if (!message) return;

        message.textContent = "";
        message.classList.remove("success", "error");
    }

    confirmPassword?.addEventListener("input", clearMessage);
    password?.addEventListener("input", clearMessage);

    registerForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        clearMessage();

        if (!registerForm.checkValidity()) {
            registerForm.reportValidity();
            return;
        }

        if (password && password.value.length < 8) {
            showMessage("Password must contain at least 8 characters.");
            password.focus();
            return;
        }

        if (password && confirmPassword &&
            password.value !== confirmPassword.value) {
            showMessage("Passwords do not match. Please try again.");
            confirmPassword.focus();
            return;
        }

        const terms = registerForm.querySelector(
            'input[type="checkbox"][name="terms"], input[type="checkbox"][required]'
        );

        if (terms && !terms.checked) {
            showMessage("Please accept the terms and conditions.");
            terms.focus();
            return;
        }

        /*
          Connect your registration backend here.
          Never save passwords directly in localStorage.
        */
        showMessage(
            "Your details are valid. Connect the registration backend to create your account.",
            "success"
        );
    });
});