const header = document.querySelector(".header");
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
const bookingForm = document.getElementById("bookingForm");
const formMessage = document.getElementById("formMessage");
const serviceSelect = document.getElementById("serviceSelect");
const serviceButtons = document.querySelectorAll("[data-service]");
const toggleServicesBtn = document.getElementById("toggleServices");
const hiddenServiceCards = document.querySelectorAll(".service-card--extra");
const revealItems = document.querySelectorAll(".reveal");

function handleHeaderScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 20);
}

handleHeaderScroll();
window.addEventListener("scroll", handleHeaderScroll);

function closeMenu() {
    if (!burger || !nav) return;
    burger.classList.remove("is-active");
    burger.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    document.body.style.overflow = "";
}

function openMenu() {
    if (!burger || !nav) return;
    burger.classList.add("is-active");
    burger.setAttribute("aria-expanded", "true");
    nav.classList.add("is-open");
    document.body.style.overflow = "hidden";
}

if (burger && nav) {
    burger.addEventListener("click", () => {
        const isOpen = nav.classList.contains("is-open");
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 1180) {
            closeMenu();
        }
    });

    document.addEventListener("click", (event) => {
        const clickedInsideMenu = nav.contains(event.target);
        const clickedBurger = burger.contains(event.target);

        if (!clickedInsideMenu && !clickedBurger && nav.classList.contains("is-open")) {
            closeMenu();
        }
    });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (event) {
        const targetId = this.getAttribute("href");
        const target = document.querySelector(targetId);

        if (!target) return;

        event.preventDefault();

        const headerHeight = header ? header.offsetHeight : 0;
        const targetTop = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;

        window.scrollTo({
            top: targetTop,
            behavior: "smooth"
        });
    });
});

serviceButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const selectedService = button.dataset.service;

        if (serviceSelect && selectedService) {
            serviceSelect.value = selectedService;
        }
    });
});

if (toggleServicesBtn && hiddenServiceCards.length) {
    let isExpanded = false;

    toggleServicesBtn.addEventListener("click", () => {
        isExpanded = !isExpanded;

        hiddenServiceCards.forEach((card) => {
            card.classList.toggle("is-hidden", !isExpanded);
        });

        toggleServicesBtn.textContent = isExpanded ? "Згорнути" : "Завантажити ще";
    });
}

if (bookingForm && formMessage) {
    bookingForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const submitButton = bookingForm.querySelector(".booking-form__submit");
        const originalText = submitButton ? submitButton.textContent : "";

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Завантаження...";
        }

        formMessage.textContent = "";

        setTimeout(() => {
            formMessage.textContent = "Успішно надіслано";
            bookingForm.reset();

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        }, 700);
    });
}

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    obs.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15
        }
    );

    revealItems.forEach((item) => observer.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
}