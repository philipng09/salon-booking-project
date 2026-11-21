/**
 * SALONBOOK - BẢNG TIN CỘNG ĐỒNG kiểu Threads (blog.html)
 * - Render bảng tin động từ js/blogs.js + bài người dùng (BlogStore)
 * - Lọc theo chủ đề / #hashtag, sắp xếp "Dành cho bạn" | "Mới nhất", tải thêm
 * - Đăng bài (chỉ khi đã đăng nhập): nội dung, tiêu đề, ảnh, chủ đề, gắn salon
 * - Thích, chia sẻ, xóa bài của mình: xử lý chung trong js/thread-ui.js
 * Phụ trách: Nhật Phi
 */
document.addEventListener("DOMContentLoaded", () => {
  "use strict";
  const S = window.BlogStore;
  const UI = window.ThreadUI;
  const esc = S.escapeHTML;
  const PAGE_SIZE = 6;

  // Trạng thái đọc từ URL: ?topic=...&tag=...&sort=latest
  const params = new URLSearchParams(location.search);
  const state = {
    sort: params.get("sort") === "latest" ? "latest" : "for-you",
    topic: window.THREAD_TOPICS.includes(params.get("topic")) ? params.get("topic") : "",
    tag: (params.get("tag") || "").toLowerCase(),
    shown: PAGE_SIZE
  };

  const feedEl = document.getElementById("feed");
  const emptyEl = document.getElementById("feed-empty");
  const moreBtn = document.getElementById("load-more");
  const chipsEl = document.getElementById("topic-chips");
  const filterEl = document.getElementById("active-filter");

  function syncUrl() {
    const q = new URLSearchParams();
    if (state.sort === "latest") q.set("sort", "latest");
    if (state.topic) q.set("topic", state.topic);
    if (state.tag) q.set("tag", state.tag);
    history.replaceState(null, "", q.toString() ? `?${q}` : location.pathname);
  }

  // "Dành cho bạn": tương tác nhiều + còn mới được ưu tiên
  function score(p) {
    // Bài của chính mình trong 24 giờ luôn nằm trên cùng (giống Threads)
    if (p.isMine && Date.now() - new Date(p.createdAt).getTime() < 864e5) return Infinity;
    const hours = (Date.now() - new Date(p.createdAt).getTime()) / 3.6e6;
    return (p.likeCount + p.replyCount * 3 + 1) / Math.pow(hours + 2, 0.8);
  }

  function getVisible() {
    let list = S.getAllPosts();
    if (state.topic) list = list.filter((p) => p.topic === state.topic);
    if (state.tag) list = list.filter((p) => p.tags.includes(state.tag));
    if (state.sort === "for-you") list = [...list].sort((a, b) => score(b) - score(a));
    return list; // getAllPosts đã sắp mới nhất trước
  }

  // ---------- Render ----------
  function renderChips() {
    chipsEl.innerHTML = ["", ...window.THREAD_TOPICS]
      .map((t) => `<button type="button" data-topic="${esc(t)}" aria-pressed="${state.topic === t}" class="${state.topic === t ? "is-active" : ""}">${t ? esc(t) : "Tất cả"}</button>`)
      .join("");
    document.querySelectorAll(".th-feed-tabs [data-sort]").forEach((b) =>
      b.setAttribute("aria-selected", String(b.dataset.sort === state.sort)));
    filterEl.hidden = !state.tag;
    filterEl.innerHTML = state.tag
      ? `Đang lọc <strong>#${esc(state.tag)}</strong> <button type="button" id="clear-tag" aria-label="Bỏ lọc hashtag">✕</button>`
      : "";
  }

  function renderFeed() {
    const list = getVisible();
    const page = list.slice(0, state.shown);
    feedEl.innerHTML = page.map((p) => UI.postCardHTML(p)).join("");
    emptyEl.hidden = list.length > 0;
    moreBtn.hidden = list.length <= state.shown;
    moreBtn.textContent = `Xem thêm bài viết (${list.length - page.length})`;
  }

  function renderSide() {
    const all = S.getAllPosts();
    // Hashtag dùng nhiều nhất
    const counts = {};
    all.forEach((p) => p.tags.forEach((t) => (counts[t] = (counts[t] || 0) + 1)));
    document.getElementById("trending-tags").innerHTML = Object.entries(counts)
      .sort((a, b) => b[1] - a[1]).slice(0, 6)
      .map(([t, n]) => `<li><a href="?tag=${encodeURIComponent(t)}" data-tag="${esc(t)}">#${esc(t)}</a><span>${n} bài</span></li>`)
      .join("");
    // Salon có tài khoản đăng bài
    const salonAuthors = [...new Map(all.filter((p) => p.author.type === "salon" && p.salonId)
      .map((p) => [p.salonId, p])).values()].slice(0, 4);
    document.getElementById("active-salons").innerHTML = salonAuthors
      .map((p) => `<li><a href="product-detail.html?id=${p.salonId}">${S.avatarHTML(p.author, "sm")}<span><strong>${esc(p.author.name)}</strong><small>@${esc(p.author.handle)}</small></span></a></li>`)
      .join("");
  }

  function renderAll() {
    renderChips();
    renderFeed();
    renderSide();
  }

  // ---------- Bộ lọc ----------
  function update(changes) {
    Object.assign(state, changes, { shown: PAGE_SIZE });
    syncUrl();
    renderAll();
  }
  chipsEl.addEventListener("click", (e) => {
    const b = e.target.closest("[data-topic]");
    if (b) update({ topic: b.dataset.topic });
  });
  document.querySelector(".th-feed-tabs").addEventListener("click", (e) => {
    const b = e.target.closest("[data-sort]");
    if (b) update({ sort: b.dataset.sort });
  });
  filterEl.addEventListener("click", (e) => {
    if (e.target.id === "clear-tag") update({ tag: "" });
  });
  document.getElementById("trending-tags").addEventListener("click", (e) => {
    const a = e.target.closest("[data-tag]");
    if (!a) return;
    e.preventDefault();
    update({ tag: a.dataset.tag, topic: "" });
    feedEl.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  // Bấm #hashtag ngay trong bài → lọc tại chỗ, không tải lại trang
  feedEl.addEventListener("click", (e) => {
    const a = e.target.closest("a.th-tag, a.th-topic");
    if (!a) return;
    e.preventDefault();
    e.stopPropagation();
    const q = new URL(a.href).searchParams;
    if (q.get("tag")) update({ tag: q.get("tag"), topic: "" });
    else update({ topic: q.get("topic") || "", tag: "" });
    window.scrollTo({ top: chipsEl.offsetTop - 90, behavior: "smooth" });
  }, true);
  document.getElementById("feed-reset").addEventListener("click", () => update({ topic: "", tag: "" }));
  moreBtn.addEventListener("click", () => {
    state.shown += PAGE_SIZE;
    renderFeed();
  });

  // Thích / chia sẻ / xóa
  UI.bindActions(feedEl, () => renderAll());

  // =====================================================================
  // ĐĂNG BÀI (client-side, chỉ người đã đăng nhập)
  // =====================================================================
  const form = document.getElementById("composer-form");
  const trigger = document.getElementById("composer-trigger");
  const fTitle = document.getElementById("post-title");
  const fContent = document.getElementById("post-content");
  const fTopic = document.getElementById("post-topic");
  const fSalon = document.getElementById("post-salon");
  const fImage = document.getElementById("post-image");
  const countEl = document.getElementById("post-count");
  const previewBox = document.getElementById("image-preview");
  const previewImg = document.getElementById("image-preview-img");
  let imageData = "";
  let submitting = false;

  fTopic.innerHTML = '<option value="">Chọn chủ đề *</option>' +
    window.THREAD_TOPICS.map((t) => `<option>${esc(t)}</option>`).join("");
  fSalon.innerHTML = '<option value="">Gắn salon (tuỳ chọn)</option>' +
    (typeof products !== "undefined" ? products : []).map((s) => `<option value="${s.id}">${esc(s.name)}</option>`).join("");

  function renderComposerAvatar() {
    const user = S.currentUser();
    document.getElementById("composer-avatar").innerHTML =
      S.avatarHTML(user ? { name: user.fullName } : { name: "?" });
    trigger.textContent = user ? `${user.fullName} ơi, có gì mới về mái tóc của bạn?` : "Đăng nhập để chia sẻ với cộng đồng…";
  }

  function openComposer(open) {
    if (open && !S.currentUser()) {
      UI.toast("Bạn cần đăng nhập để đăng bài.");
      setTimeout(S.requireLogin, 900);
      return;
    }
    form.hidden = !open;
    trigger.setAttribute("aria-expanded", String(open));
    document.getElementById("composer-open").hidden = open;
    if (open) fContent.focus();
  }

  function resetComposer() {
    form.reset();
    imageData = "";
    previewBox.hidden = true;
    previewImg.removeAttribute("src");
    countEl.textContent = "0/500";
    ["err-content", "err-topic"].forEach((id) => (document.getElementById(id).textContent = ""));
    [fContent, fTopic].forEach((f) => f.removeAttribute("aria-invalid"));
  }

  trigger.addEventListener("click", () => openComposer(true));
  document.getElementById("composer-open").addEventListener("click", () => openComposer(true));
  document.getElementById("composer-cancel").addEventListener("click", () => {
    resetComposer();
    openComposer(false);
  });
  fContent.addEventListener("input", () => (countEl.textContent = `${fContent.value.length}/500`));

  fImage.addEventListener("change", async () => {
    const file = fImage.files[0];
    if (!file) return;
    try {
      imageData = await S.compressImage(file);
      previewImg.src = imageData;
      previewBox.hidden = false;
    } catch (err) {
      UI.toast(err.message, true);
      fImage.value = "";
    }
  });
  document.getElementById("image-remove").addEventListener("click", () => {
    imageData = "";
    fImage.value = "";
    previewBox.hidden = true;
  });

  function validate() {
    let ok = true;
    const content = fContent.value.trim();
    const errC = content.length < 10 ? "Nội dung cần ít nhất 10 ký tự." : "";
    const errT = window.THREAD_TOPICS.includes(fTopic.value) ? "" : "Vui lòng chọn chủ đề.";
    document.getElementById("err-content").textContent = errC;
    document.getElementById("err-topic").textContent = errT;
    fContent.toggleAttribute("aria-invalid", Boolean(errC));
    fTopic.toggleAttribute("aria-invalid", Boolean(errT));
    if (errC) { fContent.focus(); ok = false; } else if (errT) { fTopic.focus(); ok = false; }
    return ok;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!S.currentUser()) return openComposer(true);
    if (!validate()) return;
    submitting = true;
    const post = S.addPost({
      title: fTitle.value,
      content: fContent.value,
      topic: fTopic.value,
      image: imageData,
      salonId: fSalon.value
    });
    submitting = false;
    if (!post) return UI.toast("Không lưu được bài (bộ nhớ trình duyệt đầy). Thử bỏ ảnh rồi đăng lại.", true);
    resetComposer();
    openComposer(false);
    update({ sort: "latest", topic: "", tag: "" });
    UI.toast("Đã đăng bài!");
    feedEl.querySelector(".th-post")?.classList.add("is-new");
  });

  document.addEventListener("salonbook:auth-changed", () => {
    renderComposerAvatar();
    openComposer(false);
    renderFeed();
  });

  renderComposerAvatar();
  renderAll();
});
