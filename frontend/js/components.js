// =========================================
// GenCampus Component Loader
// =========================================

async function loadComponent(id, file) {

    const container = document.getElementById(id);

    if (!container) return;

    try {

        const response = await fetch(`../components/${file}`);

        if (!response.ok)
            throw new Error("Component not found");

        container.innerHTML = await response.text();

    }

    catch (error) {

        console.error(error);

    }

}

// Load Components

document.addEventListener("DOMContentLoaded", () => {

    loadComponent("navbar", "navbar.html");

    loadComponent("footer", "footer.html");

});