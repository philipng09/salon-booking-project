/**
 * SALONBOOK - XEM 1 THREAD (blog-detail.html?id=...)
 * Đọc id từ URL bằng URLSearchParams → hiển thị bài, danh sách trả lời,
 * ô trả lời (chỉ người đã đăng nhập), bài cùng chủ đề; xử lý id sai/thiếu.
 * Phụ trách: Nhật Phi
 */
document.addEventListener("DOMContentLoaded", () => {
  "use strict";
  const S = window.BlogStore;
  const UI = window.ThreadUI;
  const esc = S.escapeHTML;

  const id = new URLSearchParams(location.search).get("id");
  const rootEl = document.getElementById("thread-root");
  const replyBox = document.getElementById("reply");
  const repliesSection = document.getElementById("replies-section");
  const replyList = document.getElementById("reply-list");
  const form = document.getElementById("reply-form");
  const input = document.getElementById("reply-content");
  const errEl = document.getElementById("err-reply");

  function render() {
    const post = S.findPost(id);

    if (!post) {
      document.title = "Không tìm thấy bài viết | SalonBook";
      rootEl.innerHTML = `
        <div class="post-notfound">
          <h1>Không tìm thấy bài viết</h1>
          <p>${id ? `Bài viết có mã <strong>${esc(id)}</strong> không tồn tại hoặc đã bị xóa.` : "Đường dẫn thiếu mã bài viết."}</p>
          <a class="btn btn-yellow" href="blog.html">← Quay lại bảng tin</a>
        </div>`;
      replyBox.hidden = true;
      repliesSection.hidden = true;
      renderRelated(null);
      return;
    }

    document.title = `${post.title || post.author.name + ": " + post.content.slice(0, 40)} | SalonBook`;
    rootEl.innerHTML = UI.postCardHTML(post, { detail: true });

    // Ô trả lời
    const user = S.currentUser();
    replyBox.hidden = false;
    form.hidden = !user;
    document.getElementById("reply-guest").hidden = Boolean(user);
    document.getElementById("reply-login").href = "auth.html?returnTo=" + encodeURIComponent(`blog-detail.html?id=${post.id}`);
    document.getElementById("reply-avatar").innerHTML = user ? S.avatarHTML({ name: user.fullName }, "sm") : "";

    // Danh sách trả lời
    repliesSection.hidden = false;
    document.getElementById("reply-count").textContent = `(${post.replyCount})`;
    replyList.innerHTML = post.replies.length
      ? post.replies.map((r) => UI.replyHTML(r, post.id)).join("")
      : '<p class="th-no-reply">Chưa có trả lời nào. Hãy là người đầu tiên!</p>';

    renderRelated(post);
  }

  function renderRelated(current) {
    const all = S.getAllPosts().filter((p) => !current || String(p.id) !== String(current.id));
    const same = current ? all.filter((p) => p.topic === current.topic) : [];
    const list = [...same, ...all.filter((p) => !same.includes(p))].slice(0, 4);
    document.getElementById("related-list").innerHTML = list
      .map((p) => `<li><a class="side-post th-side-post" href="${UI.detailUrl(p.id)}">
        ${S.avatarHTML(p.author, "sm")}
        <span><strong>${esc(p.title || p.content.slice(0, 70) + (p.content.length > 70 ? "…" : ""))}</strong>
        <small>@${esc(p.author.handle)} · ♥ ${p.likeCount} · 💬 ${p.replyCount}</small></span></a></li>`)
      .join("");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!S.currentUser()) return S.requireLogin();
    const text = input.value.trim();
    if (text.length < 2) {
      errEl.textContent = "Trả lời cần ít nhất 2 ký tự.";
      input.setAttribute("aria-invalid", "true");
      input.focus();
      return;
    }
    const reply = S.addReply(id, text);
    if (!reply) return UI.toast("Không gửi được trả lời.", true);
    input.value = "";
    errEl.textContent = "";
    input.removeAttribute("aria-invalid");
    render();
    document.getElementById(`reply-${reply.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    UI.toast("Đã gửi trả lời.");
  });

  // Ctrl/Cmd + Enter để gửi nhanh
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) form.requestSubmit();
  });

  UI.bindActions(document.querySelector(".th-feed-col"), (action) => {
    if (action === "delete-post") location.href = "blog.html";
    else render();
  });
  document.addEventListener("salonbook:auth-changed", render);

  render();
  if (location.hash === "#reply" && S.currentUser()) setTimeout(() => input.focus(), 200);
});
