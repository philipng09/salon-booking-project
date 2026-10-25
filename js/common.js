
async function loadComponent(elementId, filePath) {
    const response = await fetch(filePath);

    if (!response.ok) {
        throw new Error("Không tải được: " + filePath);
    }

    const html = await response.text();
    document.getElementById(elementId).innerHTML = html;
}

async function initializeSharedLayout() {
    try {
        await Promise.all([
            loadComponent("shared-header", "components/header.html"),
            loadComponent("shared-footer", "components/footer.html")
        ]);

        // Đánh dấu trang hiện tại trên menu
        const currentPage =
            window.location.pathname.split("/").pop() || "index.html";

        document.querySelectorAll(".main-nav a").forEach(link => {
            const linkPage = new URL(link.href).pathname.split("/").pop();

            if (linkPage === currentPage) {
                link.classList.add("active");
                link.setAttribute("aria-current", "page");
            }
        });

        // Bật/tắt menu điện thoại
        const toggle = document.querySelector(".nav-toggle");
        const nav = document.querySelector(".main-nav");

        if (toggle && nav) {
            toggle.addEventListener("click", () => {
                const isOpen = nav.classList.toggle("is-open");

                toggle.setAttribute("aria-expanded", String(isOpen));
                toggle.setAttribute(
                    "aria-label",
                    isOpen ? "Đóng menu" : "Mở menu"
                );
            });
        }

    } catch (error) {
        console.error("Lỗi tải giao diện chung:", error);
    }
}

document.addEventListener("DOMContentLoaded", initializeSharedLayout);
