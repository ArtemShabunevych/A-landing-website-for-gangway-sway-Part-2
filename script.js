const header = document.querySelector(".header");
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
const bookingForm = document.getElementById("bookingForm");
const formMessage = document.getElementById("formMessage");
const revealItems = document.querySelectorAll(".reveal");
const serviceItems = document.querySelectorAll(".service-item");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const serviceButtons = document.querySelectorAll(".service-btn");
const bookingSection = document.getElementById("booking");
const serviceSelect = document.getElementById("serviceSelect");
const submitBtn = document.getElementById("submitBtn");
const requiredInputs = bookingForm?.querySelectorAll("[required]");

let visibleServices = 3;

// ── Header scroll ──
window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
        header?.classList.add("scrolled");
    } else {
        header?.classList.remove("scrolled");
    }
});

// ── Burger ──
burger?.addEventListener("click", () => {
    nav?.classList.toggle("open");
});

nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        nav?.classList.remove("open");
    });
});

// ── Services load more ──
function renderServices() {
    serviceItems.forEach((item, index) => {
        if (index < visibleServices) {
            item.classList.remove("hidden");
        } else {
            item.classList.add("hidden");
        }
    });
    if (visibleServices >= serviceItems.length && loadMoreBtn) {
        loadMoreBtn.style.display = "none";
    }
}

loadMoreBtn?.addEventListener("click", () => {
    visibleServices += 3;
    renderServices();
});

// ── Reveal on scroll ──
function initRevealAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.14 });
    revealItems.forEach((item) => observer.observe(item));
}

// ── Service buttons → form ──
serviceButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const selectedService = button.dataset.service;
        if (serviceSelect) {
            serviceSelect.value = selectedService;
        }
        updateSubmitButtonState();
        bookingSection?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});

// ── Submit button state ──
function setButtonState(state) {
    if (!submitBtn) return;
    submitBtn.classList.remove("is-loading", "is-success");
    if (state === "loading") {
        submitBtn.classList.add("is-loading");
        submitBtn.disabled = true;
    } else if (state === "success") {
        submitBtn.classList.add("is-success");
        submitBtn.disabled = true;
    } else if (state === "disabled") {
        submitBtn.disabled = true;
    } else {
        submitBtn.disabled = false;
    }
}

function updateSubmitButtonState() {
    if (!bookingForm || !submitBtn) return;
    const formData = new FormData(bookingForm);
    const name = formData.get("name")?.toString().trim();
    const phone = formData.get("phone")?.toString().trim();
    const service = formData.get("service")?.toString().trim();
    const isValid = Boolean(name && phone && service);
    if (submitBtn.classList.contains("is-loading") || submitBtn.classList.contains("is-success")) return;
    setButtonState(isValid ? "default" : "disabled");
}

requiredInputs?.forEach((input) => {
    input.addEventListener("input", updateSubmitButtonState);
    input.addEventListener("change", updateSubmitButtonState);
});

bookingForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(bookingForm);
    const name = formData.get("name")?.toString().trim();
    const phone = formData.get("phone")?.toString().trim();
    const service = formData.get("service")?.toString().trim();
    if (!name || !phone || !service) {
        formMessage.textContent = "Будь ласка, заповніть обов'язкові поля.";
        formMessage.style.color = "#d11f1f";
        setButtonState("disabled");
        return;
    }
    formMessage.textContent = "";
    setButtonState("loading");
    await new Promise((resolve) => setTimeout(resolve, 1800));
    formMessage.textContent = "Заявку збережено. Дякую!";
    formMessage.style.color = "#198754";
    setButtonState("success");
    setTimeout(() => {
        bookingForm.reset();
        submitBtn.classList.remove("is-success");
        updateSubmitButtonState();
    }, 2200);
});

renderServices();
initRevealAnimation();
updateSubmitButtonState();