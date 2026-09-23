"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const navLinks = document.querySelectorAll(".nav-link");

// Toggle menu on click
function toggleMenu() {
    const isOpen = mainNav.classList.toggle("is-open");

    menuToggle.classList.toggle("is-active", isOpen);

    menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

    menuToggle.setAttribute(
        "aria-label",
        isOpen
            ? "Close navigation menu"
            : "Open navigation menu"
    );

    document.body.classList.toggle("menu-open", isOpen);
}

// Close menu when a navigation link is clicked
function closeMenu() {
    mainNav.classList.remove("is-open");
    menuToggle.classList.remove("is-active");

    menuToggle.setAttribute(
        "aria-expanded",
        "false"
    );

    menuToggle.setAttribute(
        "aria-label",
        "Open navigation menu"
    );

    document.body.classList.remove("menu-open");
}

menuToggle.addEventListener("click", toggleMenu);

// Close menu when a navigation link is clicked
navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        closeMenu();
    });
});

// Close menu when the Escape key is pressed
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mainNav.classList.contains("is-open")) {
        closeMenu();
    }
});

// Set the current year in the footer
document.getElementById("year").textContent = new Date().getFullYear();