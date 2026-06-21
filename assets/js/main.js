const progress = document.querySelector(".page-progress");
const progressLinks = [...document.querySelectorAll("[data-progress-link]")];

const sections = progressLinks
    .map((link) => {
        const id = link.dataset.progressLink;
        return {
            id,
            link,
            section: document.getElementById(id),
        };
    })
    .filter((item) => item.section);

let activeId = "start";

function setProgressIndicator(link) {
    if (!progress || !link) {
        return;
    }

    const progressRect = progress.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();

    progress.style.setProperty("--indicator-top", `${linkRect.top - progressRect.top}px`);
    progress.style.setProperty("--indicator-height", `${linkRect.height}px`);
}

function setActiveProgress(id) {
    if (activeId === id) {
        setProgressIndicator(document.querySelector(`[data-progress-link="${id}"]`));
        return;
    }

    activeId = id;

    progressLinks.forEach((link) => {
        const isActive = link.dataset.progressLink === id;
        link.classList.toggle("page-progress__item--active", isActive);
        link.setAttribute("aria-current", isActive ? "true" : "false");
    });

    setProgressIndicator(document.querySelector(`[data-progress-link="${id}"]`));
}

function updateActiveProgress() {
    const anchor = window.scrollY + window.innerHeight * 0.42;
    let current = sections[0]?.id || "start";

    sections.forEach(({ id, section }) => {
        if (section.offsetTop <= anchor) {
            current = id;
        }
    });

    setActiveProgress(current);
}

progressLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        const id = link.dataset.progressLink;
        const section = document.getElementById(id);

        if (!section) {
            return;
        }

        event.preventDefault();
        section.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveProgress(id);
    });
});

window.addEventListener("scroll", updateActiveProgress, { passive: true });
window.addEventListener("resize", updateActiveProgress);
window.addEventListener("load", updateActiveProgress);
updateActiveProgress();
