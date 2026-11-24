
"use strict";

(() => {

    const $ = id => document.getElementById(id);

    // ==========================================
    // 1. LOCAL STORAGE & PHÂN QUYỀN ADMIN
    // ==========================================

    function read(key, fallback) {
        try {
            const value = localStorage.getItem(key);

            return value === null
                ? fallback
                : JSON.parse(value);

        } catch {
            return fallback;
        }
    }

    const session = read("currentUser", null);

    // Chỉ cho phép tài khoản Admin truy cập


// Kiểm tra người dùng đã đăng nhập chưa
if (!session) {
    window.location.replace("./auth.html");
    return;
}

// Kiểm tra quyền quản trị viên
if (
    session.role !== "admin" ||
    session.status === "locked"
) {
    alert("Bạn không có quyền truy cập trang quản trị!");
    window.location.replace("./index.html");
    return;
}

    const today = () => new Date().toISOString().slice(0, 10);

    // ==========================================
    // 2. DỮ LIỆU MẪU
    // ==========================================

    const seed = {

        // DANH SÁCH TÀI KHOẢN

        users: [
            {
                userId: "U001",
                name: "Administrator",
                email: "admin@salonbook.test",
                role: "admin",
                status: "active"
            },
            {
                userId: "U002",
                name: "Nguyễn Văn Thông",
                email: "thong@example.test",
                role: "customer",
                status: "active"
            },
            {
                userId: "U003",
                name: "Trần Thị Liễu",
                email: "lieu@example.test",
                role: "customer",
                status: "active"
            },
            {
                userId: "U004",
                name: "Chủ The Hair Space",
                email: "owner@example.test",
                role: "salon_owner",
                status: "active"
            },
            {
                userId: "U005",
                name: "Chủ DOTH HAIR",
                email: "doth@example.test",
                role: "salon_owner",
                status: "active"
            },
            {
                userId: "U006",
                name: "Khách hàng mẫu",
                email: "customer@example.test",
                role: "customer",
                status: "locked"
            }
        ],

        // DANH SÁCH SALON

        salons: [
            {
                salonId: "S001",
                name: "The Hair Space",
                district: "Quận 1",
                type: "unisex",
                address: "34 Phó Đức Chính, TP.HCM",
                ownerId: "U004",
                status: "active"
            },
            {
                salonId: "S002",
                name: "DOTH HAIR",
                district: "Quận 1",
                type: "unisex",
                address: "150/40 Nguyễn Trãi, TP.HCM",
                ownerId: "U005",
                status: "active"
            },
            {
                salonId: "S003",
                name: "Salon mẫu Bình Thạnh",
                district: "Bình Thạnh",
                type: "female",
                address: "Bình Thạnh, TP.HCM",
                ownerId: null,
                status: "pending"
            },
            {
                salonId: "S004",
                name: "Barbershop mẫu",
                district: "Thủ Đức",
                type: "male",
                address: "Thủ Đức, TP.HCM",
                ownerId: null,
                status: "locked"
            }
        ],

        // DANH SÁCH BLOG

        blogs: [
            {
                blogId: "B001",
                title: "Xu hướng tóc Layer",
                category: "Kiểu tóc",
                authorId: "U001",
                content:
                    "Khám phá các kiểu tóc Layer phù hợp với phong cách của bạn.",
                status: "published",
                createdAt: "2026-11-01"
            },
            {
                blogId: "B002",
                title: "Bí quyết chăm sóc tóc nhuộm",
                category: "Chăm sóc tóc",
                authorId: "U001",
                content:
                    "Sử dụng sản phẩm phù hợp và hạn chế nhiệt độ cao.",
                status: "draft",
                createdAt: "2026-11-02"
            }
        ],

        // DANH SÁCH ĐÁNH GIÁ

        reviews: [
            {
                reviewId: "R001",
                userId: "U002",
                salonId: "S001",
                rating: 5,
                content:
                    "Thợ cắt rất có tâm, không gian quán đẹp chuẩn Hàn.",
                status: "visible",
                createdAt: "2026-10-15"
            },
            {
                reviewId: "R002",
                userId: "U003",
                salonId: "S001",
                rating: 4,
                content:
                    "Nhuộm màu đẹp nhưng chờ hơi lâu vào cuối tuần.",
                status: "visible",
                createdAt: "2026-10-20"
            },
            {
                reviewId: "R003",
                userId: "U002",
                salonId: "S002",
                rating: 1,
                content:
                    "Nội dung quảng cáo mẫu cần kiểm duyệt.",
                status: "pending",
                createdAt: "2026-11-01"
            }
        ]
    };

    // ==========================================
    // 3. KHỞI TẠO DỮ LIỆU
    // ==========================================

    const key = "salonbook.admin.v1";

    let data = read(key, seed);

    if (
        !data ||
        Object.keys(seed).some(
            k => !Array.isArray(data[k])
        )
    ) {
        data = seed;
    }

    // Kiểm tra tài khoản đang đăng nhập

    const self = user =>
        (
            Boolean(session.email) &&
            String(user.email || "").toLowerCase() ===
            String(session.email).toLowerCase()
        ) ||
        (
            session.userId != null &&
            String(user.userId) === String(session.userId)
        );

    const me = data.users.find(self);

    // Chặn tài khoản đã bị khóa hoặc thay đổi quyền

    if (
        session.status === "locked" ||
        (
            me &&
            (
                me.status === "locked" ||
                me.role !== "admin"
            )
        )
    ) {
        localStorage.removeItem("currentUser");
        window.location.replace("index.html");
        return;
    }

    // Chống chèn HTML từ dữ liệu nhập vào

    const esc = value =>
        String(value ?? "").replace(
            /[&<>"']/g,
            character => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            })[character]
        );

    // ==========================================
    // 4. KHAI BÁO TÊN VAI TRÒ & TRẠNG THÁI
    // ==========================================

    const labels = {
        active: "Đang hoạt động",
        pending: "Chờ duyệt",
        locked: "Đã khóa",

        customer: "Khách hàng",
        salon_owner: "Chủ salon",
        admin: "Quản trị viên",

        male: "Salon Nam / Barbershop",
        female: "Salon Nữ",
        unisex: "Salon Unisex",

        published: "Đã xuất bản",
        draft: "Bản nháp",

        visible: "Đang hiển thị",
        hidden: "Đã ẩn"
    };

    const names = {
        overview: [
            "Tổng quan hệ thống",
            "Theo dõi và quản lý hoạt động trên nền tảng SalonBook."
        ],

        users: [
            "Quản lý tài khoản",
            "Quản lý vai trò và trạng thái người dùng."
        ],

        salons: [
            "Quản lý Salon",
            "Theo dõi, phê duyệt và quản lý salon đối tác."
        ],

        blogs: [
            "Quản lý Blog",
            "Tạo và cập nhật nội dung dành cho khách hàng."
        ],

        reviews: [
            "Kiểm duyệt đánh giá",
            "Kiểm tra và xử lý nội dung đánh giá vi phạm."
        ]
    };

    const ids = {
        users: "userId",
        salons: "salonId",
        blogs: "blogId",
        reviews: "reviewId"
    };

    let tab = "overview";
    let editing = null;
    let timer;

    const filters = {};

    // ==========================================
    // 5. THÔNG BÁO
    // ==========================================

    function notify(message) {

        $("toast").textContent = message;

        $("toast").classList.add("show");

        clearTimeout(timer);

        timer = setTimeout(() => {
            $("toast").classList.remove("show");
        }, 3000);
    }

    // ==========================================
    // 6. LƯU, CẬP NHẬT & XÓA DỮ LIỆU
    // ==========================================

    function commit(next) {

        try {

            localStorage.setItem(
                key,
                JSON.stringify(next)
            );

            data = next;

            render();

            notify("Đã lưu thay đổi.");

            return true;

        } catch {

            notify(
                "Không thể lưu dữ liệu. Kiểm tra bộ nhớ trình duyệt."
            );

            return false;
        }
    }

    // Cập nhật dữ liệu

    function update(group, id, patch) {

        return commit({

            ...data,

            [group]: data[group].map(item =>

                String(item[ids[group]]) === String(id)

                    ? {
                        ...item,
                        ...patch
                    }

                    : item
            )
        });
    }

    // Xóa dữ liệu

    function remove(group, id) {

        const confirmed = confirm(
            "Bạn có chắc muốn xóa nội dung này?"
        );

        if (!confirmed) {
            return;
        }

        commit({

            ...data,

            [group]: data[group].filter(item =>
                String(item[ids[group]]) !== String(id)
            )
        });
    }

    // ==========================================
    // 7. COMPONENT GIAO DIỆN DÙNG CHUNG
    // ==========================================

    function status(value) {

        return `
            <span class="status ${esc(value)}">
                ${esc(labels[value] || value)}
            </span>
        `;
    }

    function btn(action, id, text, style = "outline") {

        return `
            <button
                type="button"
                class="${style}"
                data-action="${esc(action)}"
                data-id="${esc(id)}"
            >
                ${esc(text)}
            </button>
        `;
    }

    function opts(array, current = "") {

        return array.map(value => `

            <option
                value="${esc(value)}"
                ${value === current ? "selected" : ""}
            >
                ${esc(labels[value] || value)}
            </option>

        `).join("");
    }

    function select(field, values, placeholder) {

        return `

            <select
                data-filter="${field}"
                aria-label="${esc(placeholder)}"
            >

                <option value="">
                    ${esc(placeholder)}
                </option>

                ${opts(
                    values,
                    filters[tab]?.[field]
                )}

            </select>
        `;
    }

    function toolbar(extra = "") {

        return `

            <div class="toolbar">

                <input
                    data-filter="q"
                    type="search"
                    aria-label="Tìm kiếm"
                    placeholder="Tìm kiếm..."
                    value="${esc(filters[tab]?.q || "")}"
                >

                ${extra}

            </div>
        `;
    }

    function table(headers, rows) {

        return `

            <div class="table-wrap">

                <table>

                    <thead>
                        <tr>
                            ${headers.map(header => `
                                <th scope="col">
                                    ${esc(header)}
                                </th>
                            `).join("")}
                        </tr>
                    </thead>

                    <tbody>

                        ${rows.length

                            ? rows.map(row => `

                                <tr>
                                    ${row.map(cell => `
                                        <td>${cell}</td>
                                    `).join("")}
                                </tr>

                            `).join("")

                            : `
                                <tr>
                                    <td
                                        colspan="${headers.length}"
                                        class="empty"
                                    >
                                        Không tìm thấy dữ liệu phù hợp.
                                    </td>
                                </tr>
                            `
                        }

                    </tbody>

                </table>

            </div>
        `;
    }

    // ==========================================
    // 8. TÌM KIẾM VÀ LỌC DỮ LIỆU
    // ==========================================

    function matching() {

        const currentFilters = filters[tab] || {};

        return data[tab].filter(item =>

            Object.entries(currentFilters).every(
                ([key, value]) => {

                    if (!value) {
                        return true;
                    }

                    if (key === "q") {

                        return Object.values(item)
                            .join(" ")
                            .toLocaleLowerCase("vi")
                            .includes(
                                value.toLocaleLowerCase("vi")
                            );
                    }

                    return String(item[key]) === value;
                }
            )
        );
    }

    // ==========================================
    // 9. RENDER DANH SÁCH TÀI KHOẢN
    // ==========================================

    function renderUsers(list) {

        const headers = [
            "Mã",
            "Tài khoản",
            "Vai trò",
            "Trạng thái",
            "Thao tác"
        ];

        const rows = list.map(user => [

            esc(user.userId),

            `
                <b>${esc(user.name)}</b>
                <small>${esc(user.email)}</small>
            `,

            esc(labels[user.role] || user.role),

            status(user.status),

            self(user)

                ? "Tài khoản hiện tại"

                : `
                    <div class="actions">

                        ${btn(
                            "editUser",
                            user.userId,
                            "Đổi vai trò"
                        )}

                        ${btn(
                            "toggleUser",
                            user.userId,
                            user.status === "locked"
                                ? "Mở khóa"
                                : "Khóa",
                            user.status === "locked"
                                ? "outline"
                                : "danger"
                        )}

                    </div>
                `
        ]);

        return table(headers, rows);
    }

    // ==========================================
    // 10. RENDER DANH SÁCH SALON
    // ==========================================

    function renderSalons(list) {

        const headers = [
            "Mã",
            "Salon",
            "Khu vực",
            "Loại hình",
            "Trạng thái",
            "Thao tác"
        ];

        const rows = list.map(salon => [

            esc(salon.salonId),

            `
                <b>${esc(salon.name)}</b>
                <small>${esc(salon.address)}</small>
            `,

            esc(salon.district),

            esc(labels[salon.type] || salon.type),

            status(salon.status),

            `
                <div class="actions">

                    ${btn(
                        "viewSalon",
                        salon.salonId,
                        "Chi tiết"
                    )}

                    ${btn(
                        "toggleSalon",
                        salon.salonId,

                        salon.status === "pending"
                            ? "Phê duyệt"

                            : salon.status === "locked"
                                ? "Mở khóa"
                                : "Khóa",

                        salon.status === "active"
                            ? "danger"
                            : "primary"
                    )}

                </div>
            `
        ]);

        return table(headers, rows);
    }

    // ==========================================
    // 11. RENDER DANH SÁCH BLOG
    // ==========================================

    function renderBlogs(list) {

        const headers = [
            "Mã",
            "Bài viết",
            "Danh mục",
            "Ngày tạo",
            "Trạng thái",
            "Thao tác"
        ];

        const rows = list.map(blog => [

            esc(blog.blogId),

            `<b>${esc(blog.title)}</b>`,

            esc(blog.category),

            esc(blog.createdAt),

            status(blog.status),

            `
                <div class="actions">

                    ${btn(
                        "editBlog",
                        blog.blogId,
                        "Sửa"
                    )}

                    ${btn(
                        "deleteBlog",
                        blog.blogId,
                        "Xóa",
                        "danger"
                    )}

                </div>
            `
        ]);

        return table(headers, rows);
    }

    // ==========================================
    // 12. RENDER DANH SÁCH ĐÁNH GIÁ
    // ==========================================

    function renderReviews(list) {

        const headers = [
            "Mã",
            "Khách hàng / Salon",
            "Đánh giá",
            "Nội dung",
            "Trạng thái",
            "Thao tác"
        ];

        const rows = list.map(review => {

            const user = data.users.find(
                u => u.userId === review.userId
            );

            const salon = data.salons.find(
                s => s.salonId === review.salonId
            );

            return [

                esc(review.reviewId),

                `
                    <b>
                        ${esc(user?.name || review.userId)}
                    </b>

                    <small>
                        ${esc(salon?.name || review.salonId)}
                    </small>
                `,

                `${esc(review.rating)}/5 ★`,

                `
                    ${esc(review.content)}
                    <small>${esc(review.createdAt)}</small>
                `,

                status(review.status),

                `
                    <div class="actions">

                        ${btn(
                            "viewReview",
                            review.reviewId,
                            "Xem"
                        )}

                        ${btn(
                            "toggleReview",
                            review.reviewId,

                            review.status === "visible"
                                ? "Ẩn"

                                : review.status === "pending"
                                    ? "Duyệt"
                                    : "Khôi phục"
                        )}

                        ${btn(
                            "deleteReview",
                            review.reviewId,
                            "Xóa",
                            "danger"
                        )}

                    </div>
                `
            ];
        });

        return table(headers, rows);
    }

    // ==========================================
    // 13. RENDER BẢNG THEO TAB
    // ==========================================

    function renderRows() {

        const list = matching();

        let html = "";

        switch (tab) {

            case "users":
                html = renderUsers(list);
                break;

            case "salons":
                html = renderSalons(list);
                break;

            case "blogs":
                html = renderBlogs(list);
                break;

            case "reviews":
                html = renderReviews(list);
                break;
        }

        $("rows").innerHTML = html;

        $("count").textContent =
            `${list.length} / ${data[tab].length} kết quả`;
    }

    // ==========================================
    // 14. TỔNG QUAN HỆ THỐNG
    // ==========================================

    function renderOverview() {

        const items = [
            ["users", "Tài khoản"],
            ["salons", "Salon đối tác"],
            ["blogs", "Bài viết Blog"],
            ["reviews", "Đánh giá"]
        ];

        const pendingReviews = data.reviews.filter(
            review => review.status === "pending"
        ).length;

        const salonStatuses = [
            "active",
            "pending",
            "locked"
        ];

        $("content").innerHTML = `

            <!-- THỐNG KÊ -->

            <div class="stats">

                ${items.map(([key, title]) => `

                    <button
                        class="card"
                        data-go="${key}"
                    >
                        <small>${title} ↗</small>

                        <strong>
                            ${data[key].length}
                        </strong>
                    </button>

                `).join("")}

            </div>

            <!-- TỔNG QUAN SALON -->

            <div class="overview-grid">

                <div class="panel">

                    <h2>Trạng thái Salon</h2>

                    ${salonStatuses.map(value => {

                        const count = data.salons.filter(
                            salon => salon.status === value
                        ).length;

                        const percentage =
                            data.salons.length > 0

                            ? count / data.salons.length * 100

                            : 0;

                        return `

                            <div>
                                ${labels[value]} · ${count}
                            </div>

                            <div class="bar ${value}">

                                <i style="width: ${percentage}%"></i>

                            </div>
                        `;

                    }).join("")}

                </div>

                <!-- KIỂM DUYỆT NỘI DUNG -->

                <div class="panel feature">

                    <p
                        class="eyebrow"
                        style="color: #d3e5dd"
                    >
                        QUẢN TRỊ NỀN TẢNG
                    </p>

                    <h2>Kiểm duyệt nội dung</h2>

                    <p>
                        ${pendingReviews} đánh giá đang chờ kiểm duyệt.
                    </p>

                    <button
                        class="primary"
                        data-go="reviews"
                    >
                        Kiểm duyệt ngay ↗
                    </button>

                </div>

            </div>
        `;
    }

    // ==========================================
    // 15. RENDER GIAO DIỆN CHÍNH
    // ==========================================

    function render() {

        $("heading").textContent = names[tab][0];

        $("subtitle").textContent = names[tab][1];

        document.querySelectorAll("[data-tab]")
            .forEach(button => {

                const selected =
                    button.dataset.tab === tab;

                button.classList.toggle(
                    "selected",
                    selected
                );

                if (selected) {

                    button.setAttribute(
                        "aria-current",
                        "page"
                    );

                } else {

                    button.removeAttribute(
                        "aria-current"
                    );
                }
            });

        if (tab === "overview") {

            renderOverview();

            return;
        }

        let extra = "";

        // Bộ lọc tài khoản

        if (tab === "users") {

            extra =

                select(
                    "role",
                    [
                        "customer",
                        "salon_owner",
                        "admin"
                    ],
                    "Tất cả vai trò"
                )

                +

                select(
                    "status",
                    [
                        "active",
                        "locked"
                    ],
                    "Tất cả trạng thái"
                );
        }

        // Bộ lọc salon

        if (tab === "salons") {

            const districts = [
                ...new Set(
                    data.salons.map(
                        salon => salon.district
                    )
                )
            ];

            extra =

                select(
                    "district",
                    districts,
                    "Tất cả khu vực"
                )

                +

                select(
                    "type",
                    [
                        "male",
                        "female",
                        "unisex"
                    ],
                    "Tất cả loại hình"
                )

                +

                select(
                    "status",
                    [
                        "active",
                        "pending",
                        "locked"
                    ],
                    "Tất cả trạng thái"
                );
        }

        // Bộ lọc Blog

        if (tab === "blogs") {

            extra =

                select(
                    "status",
                    [
                        "draft",
                        "published"
                    ],
                    "Tất cả trạng thái"
                )

                +

                btn(
                    "addBlog",
                    "",
                    "+ Thêm bài viết",
                    "primary"
                );
        }

        // Bộ lọc đánh giá

        if (tab === "reviews") {

            extra = select(
                "status",
                [
                    "visible",
                    "pending",
                    "hidden"
                ],
                "Tất cả trạng thái"
            );
        }

        $("content").innerHTML = `

            <div class="panel">

                ${toolbar(extra)}

                <p id="count" class="muted"></p>

                <div id="rows"></div>

            </div>
        `;

        renderRows();
    }

    // ==========================================
    // 16. CHUYỂN TAB SIDEBAR
    // ==========================================

    function go(nextTab) {

        if (!Object.hasOwn(names, nextTab)) {
            return;
        }

        tab = nextTab;

        $("sidebar").classList.remove("open");

        $("menu").setAttribute(
            "aria-expanded",
            "false"
        );

        render();
    }

    // ==========================================
    // 17. MODAL & FORM
    // ==========================================

    function modal(title, fields, save = null) {

        $("modalTitle").textContent = title;

        $("fields").innerHTML = fields;

        $("saveModal").hidden = !save;

        editing = save;

        $("modal").showModal();
    }

    function field(
        label,
        name,
        value = "",
        type = "text"
    ) {

        return `

            <label>

                ${esc(label)}

                <input
                    name="${name}"
                    type="${type}"
                    value="${esc(value)}"
                    required
                >

            </label>
        `;
    }

    function choice(label, name, values, value) {

        return `

            <label>

                ${esc(label)}

                <select name="${name}">

                    ${opts(values, value)}

                </select>

            </label>
        `;
    }

    // ==========================================
    // 18. THÊM & CHỈNH SỬA BLOG
    // ==========================================

    function blogForm(blog) {

        const title = blog

            ? "Chỉnh sửa bài viết"

            : "Thêm bài viết";

        const fields =

            field(
                "Tiêu đề",
                "title",
                blog?.title
            )

            +

            field(
                "Danh mục",
                "category",
                blog?.category
            )

            +

            `

                <label>

                    Nội dung

                    <textarea
                        name="content"
                        required
                    >${esc(blog?.content)}</textarea>

                </label>
            `

            +

            choice(
                "Trạng thái",
                "status",
                ["draft", "published"],
                blog?.status || "draft"
            );

        modal(title, fields, values => {

            if (
                !values.title.trim() ||
                !values.category.trim() ||
                !values.content.trim()
            ) {

                notify("Vui lòng nhập đầy đủ nội dung.");

                return false;
            }

            const patch = {

                title: values.title.trim(),

                category: values.category.trim(),

                content: values.content.trim(),

                status: values.status,

                updatedAt: today()
            };

            // Cập nhật bài viết cũ

            if (blog) {

                return update(
                    "blogs",
                    blog.blogId,
                    patch
                );
            }

            // Tạo bài viết mới

            const newBlog = {

                blogId:
                    globalThis.crypto?.randomUUID?.()
                    || "B" + Date.now(),

                authorId:
                    me?.userId
                    || session.userId
                    || null,

                createdAt: today(),

                ...patch
            };

            return commit({

                ...data,

                blogs: [
                    ...data.blogs,
                    newBlog
                ]
            });
        });
    }

    // ==========================================
    // 19. SỰ KIỆN SUBMIT MODAL
    // ==========================================

    $("editor").addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const formData = Object.fromEntries(
                new FormData(event.target)
            );

            if (editing && editing(formData)) {

                $("modal").close();
            }
        }
    );

    ["closeModal", "cancelModal"].forEach(id => {

        $(id).onclick = () => {

            $("modal").close();
        };
    });

    // ==========================================
    // 20. SỰ KIỆN SIDEBAR
    // ==========================================

    $("nav").addEventListener(
        "click",
        event => {

            const button = event.target.closest(
                "[data-tab]"
            );

            if (button) {

                go(button.dataset.tab);
            }
        }
    );

    // ==========================================
    // 21. SỰ KIỆN TÌM KIẾM & LỌC
    // ==========================================

    function filter(event) {

        const key = event.target.dataset.filter;

        if (!key) {
            return;
        }

        filters[tab] ??= {};

        filters[tab][key] = event.target.value;

        renderRows();
    }

    $("content").addEventListener(
        "input",
        event => {

            if (
                event.target.matches(
                    "input[data-filter]"
                )
            ) {
                filter(event);
            }
        }
    );

    $("content").addEventListener(
        "change",
        event => {

            if (
                event.target.matches(
                    "select[data-filter]"
                )
            ) {
                filter(event);
            }
        }
    );

    // ==========================================
    // 22. XỬ LÝ CÁC THAO TÁC QUẢN TRỊ
    // ==========================================

    $("content").addEventListener(
        "click",
        event => {

            const button = event.target.closest(
                "button"
            );

            if (!button) {
                return;
            }

            // Chuyển tab từ card Tổng quan

            if (button.dataset.go) {

                go(button.dataset.go);

                return;
            }

            const {
                action,
                id
            } = button.dataset;

            if (!action) {
                return;
            }

            const item = data[tab]?.find(
                row =>
                    String(row[ids[tab]]) === id
            );

            switch (action) {

                // ==============================
                // ĐỔI VAI TRÒ TÀI KHOẢN
                // ==============================

                case "editUser":

                    if (item && !self(item)) {

                        modal(

                            "Đổi vai trò tài khoản",

                            choice(
                                "Vai trò",
                                "role",
                                [
                                    "customer",
                                    "salon_owner",
                                    "admin"
                                ],
                                item.role
                            ),

                            values => update(
                                "users",
                                id,
                                {
                                    role: values.role
                                }
                            )
                        );
                    }

                    break;

                // ==============================
                // KHÓA / MỞ KHÓA TÀI KHOẢN
                // ==============================

                case "toggleUser":

                    if (
                        item &&
                        !self(item) &&
                        confirm(
                            "Xác nhận thay đổi trạng thái tài khoản?"
                        )
                    ) {

                        update(
                            "users",
                            id,
                            {
                                status:
                                    item.status === "locked"

                                    ? "active"

                                    : "locked"
                            }
                        );
                    }

                    break;

                // ==============================
                // XEM CHI TIẾT SALON
                // ==============================

                case "viewSalon":

                    if (item) {

                        const owner = data.users.find(
                            user =>
                                user.userId === item.ownerId
                        );

                        modal(

                            "Chi tiết Salon",

                            `

                                <h3>
                                    ${esc(item.name)}
                                </h3>

                                <p>
                                    <b>Mã Salon:</b>
                                    ${esc(item.salonId)}
                                </p>

                                <p>
                                    <b>Địa chỉ:</b>
                                    ${esc(item.address)}
                                </p>

                                <p>
                                    <b>Khu vực:</b>
                                    ${esc(item.district)}
                                </p>

                                <p>
                                    <b>Loại hình:</b>
                                    ${esc(labels[item.type])}
                                </p>

                                <p>
                                    <b>Chủ salon:</b>
                                    ${esc(
                                        owner?.name
                                        || "Chưa cập nhật"
                                    )}
                                </p>

                                <p>
                                    <b>Trạng thái:</b>
                                    ${status(item.status)}
                                </p>
                            `
                        );
                    }

                    break;

                // ==============================
                // DUYỆT / KHÓA / MỞ KHÓA SALON
                // ==============================

                case "toggleSalon":

                    if (
                        item &&
                        confirm(
                            "Xác nhận thay đổi trạng thái salon?"
                        )
                    ) {

                        update(
                            "salons",
                            id,
                            {
                                status:
                                    item.status === "active"

                                    ? "locked"

                                    : "active"
                            }
                        );
                    }

                    break;

                // ==============================
                // THÊM BLOG
                // ==============================

                case "addBlog":

                    blogForm();

                    break;

                // ==============================
                // SỬA BLOG
                // ==============================

                case "editBlog":

                    if (item) {

                        blogForm(item);
                    }

                    break;

                // ==============================
                // XÓA BLOG
                // ==============================

                case "deleteBlog":

                    if (item) {

                        remove("blogs", id);
                    }

                    break;

                // ==============================
                // XEM CHI TIẾT ĐÁNH GIÁ
                // ==============================

                case "viewReview":

                    if (item) {

                        const user = data.users.find(
                            u => u.userId === item.userId
                        );

                        const salon = data.salons.find(
                            s => s.salonId === item.salonId
                        );

                        modal(

                            "Chi tiết đánh giá",

                            `

                                <p>
                                    <b>Khách hàng:</b>
                                    ${esc(
                                        user?.name
                                        || item.userId
                                    )}
                                </p>

                                <p>
                                    <b>Salon:</b>
                                    ${esc(
                                        salon?.name
                                        || item.salonId
                                    )}
                                </p>

                                <p>
                                    <b>Điểm đánh giá:</b>
                                    ${esc(item.rating)}/5 ★
                                </p>

                                <p>
                                    <b>Ngày đánh giá:</b>
                                    ${esc(item.createdAt)}
                                </p>

                                <p>
                                    <b>Nội dung:</b>
                                    ${esc(item.content)}
                                </p>

                                ${status(item.status)}

                            `
                        );
                    }

                    break;

                // ==============================
                // ẨN / DUYỆT / KHÔI PHỤC REVIEW
                // ==============================

                case "toggleReview":

                    if (item) {

                        update(

                            "reviews",

                            id,

                            {
                                status:
                                    item.status === "visible"

                                    ? "hidden"

                                    : "visible"
                            }
                        );
                    }

                    break;

                // ==============================
                // XÓA ĐÁNH GIÁ
                // ==============================

                case "deleteReview":

                    if (item) {

                        remove(
                            "reviews",
                            id
                        );
                    }

                    break;
            }
        }
    );

    // ==========================================
    // 23. MENU RESPONSIVE
    // ==========================================

    $("menu").onclick = () => {

        const opened =
            $("sidebar").classList.toggle("open");

        $("menu").setAttribute(
            "aria-expanded",
            String(opened)
        );
    };

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                $("sidebar").classList.remove("open");

                $("menu").setAttribute(
                    "aria-expanded",
                    "false"
                );
            }
        }
    );

    // ==========================================
    // 24. ĐĂNG XUẤT
    // ==========================================

    $("logout").onclick = () => {

        const confirmed = confirm(
            "Bạn có muốn đăng xuất khỏi hệ thống?"
        );

        if (confirmed) {

            localStorage.removeItem("currentUser");

            window.location.replace("index.html");
        }
    };

    // ==========================================
    // 25. KHỞI CHẠY ADMIN DASHBOARD
    // ==========================================

    $("adminName").textContent =

        session.name

        || session.fullName

        || session.email

        || "Administrator";

    render();

    document.body.hidden = false;

})();
