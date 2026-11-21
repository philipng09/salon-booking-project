/**
 * SALONBOOK - THÀNH PHẦN GIAO DIỆN THREAD DÙNG CHUNG
 * Dùng cho blog.html và blog-detail.html: thẻ bài viết, trả lời,
 * xử lý thích / chia sẻ / xóa, thông báo nhanh (toast).
 * Phụ trách: Nhật Phi
 */
(() => {
  "use strict";
  const S = window.BlogStore;
  const esc = S.escapeHTML;

  const ICON = {
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3.1 4.5 6.8 4.5c2.1 0 3.6 1.1 4.4 2.5.8-1.4 2.3-2.5 4.4-2.5 3.7 0 5.9 3.7 4.4 7.2C19.5 16.4 12 21 12 21z"/></svg>',
    reply: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.1A8.5 8.5 0 1 1 21 12z"/></svg>',
    share: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13"/></svg>'
  };

  const detailUrl = (id) => `blog-detail.html?id=${encodeURIComponent(id)}`;

  function salonChip(salonId) {
    if (!salonId || typeof products === "undefined") return "";
    const salon = products.find((s) => s.id === Number(salonId));
    if (!salon) return "";
    return `<a class="th-salon-chip" href="product-detail.html?id=${salon.id}" data-stop>
      <img src="${esc(salon.image)}" alt=""><span><strong>${esc(salon.name)}</strong><small>${esc(salon.districtName)} · ★ ${salon.rating} · Đặt lịch</small></span></a>`;
  }

  // Thẻ 1 bài viết. opts.detail = true → hiện toàn bộ nội dung, không làm cả thẻ là link
  function postCardHTML(post, opts = {}) {
    const long = !opts.detail && String(post.content).length > 280;
    return `
    <article class="th-post${opts.detail ? " is-detail" : ""}${post.isUserPost ? " is-user" : ""}" data-post-id="${esc(post.id)}" ${opts.detail ? "" : 'data-open="1"'}>
      ${S.avatarHTML(post.author)}
      <div class="th-main">
        <header class="th-head">
          <span class="th-name">${esc(post.author.name)}</span>${S.badgeHTML(post.author)}
          <span class="th-handle">@${esc(post.author.handle)}</span>
          <time class="th-time" datetime="${esc(post.createdAt)}" title="${esc(S.fullDate(post.createdAt))}">${S.timeAgo(post.createdAt)}</time>
          ${post.isMine ? `<button type="button" class="th-more" data-action="delete-post" data-id="${esc(post.id)}" aria-label="Xóa bài viết">Xóa</button>` : ""}
        </header>
        <a class="th-topic" href="blog.html?topic=${encodeURIComponent(post.topic)}" data-stop>${esc(post.topic)}</a>
        ${post.title ? (opts.detail ? `<h1 class="th-title">${esc(post.title)}</h1>` : `<h3 class="th-title"><a href="${detailUrl(post.id)}">${esc(post.title)}</a></h3>`) : ""}
        <div class="th-content${long ? " is-clamped" : ""}">${S.formatContent(post.content)}</div>
        ${long ? `<a class="th-readmore" href="${detailUrl(post.id)}">Xem thêm</a>` : ""}
        ${post.image ? `<img class="th-image" src="${esc(post.image)}" alt="Ảnh đính kèm bài viết" loading="lazy">` : ""}
        ${salonChip(post.salonId)}
        <footer class="th-actions">
          <button type="button" class="th-act th-like${post.liked ? " is-on" : ""}" data-action="like-post" data-id="${esc(post.id)}" aria-pressed="${post.liked}" aria-label="Thích (${post.likeCount})">${ICON.heart}<span>${post.likeCount}</span></button>
          <a class="th-act" href="${detailUrl(post.id)}#reply" aria-label="Trả lời (${post.replyCount})" data-stop>${ICON.reply}<span>${post.replyCount}</span></a>
          <button type="button" class="th-act" data-action="share" data-id="${esc(post.id)}" aria-label="Chia sẻ">${ICON.share}</button>
        </footer>
        ${!opts.detail && post.replies.length ? previewReply(post) : ""}
      </div>
    </article>`;
  }

  // Bảng tin: hiện trả lời mới nhất ngay dưới bài, giống Threads
  function previewReply(post) {
    const last = post.replies[post.replies.length - 1];
    return `<a class="th-reply-preview" href="${detailUrl(post.id)}" data-stop>
      ${S.avatarHTML(last.author, "xs")}<span><strong>${esc(last.author.name)}</strong> ${esc(String(last.content).slice(0, 90))}${String(last.content).length > 90 ? "…" : ""}</span>
      ${post.replyCount > 1 ? `<em>Xem ${post.replyCount} trả lời</em>` : ""}</a>`;
  }

  function replyHTML(reply, postId) {
    return `
    <article class="th-reply" id="reply-${esc(reply.id)}">
      ${S.avatarHTML(reply.author, "sm")}
      <div class="th-main">
        <header class="th-head">
          <span class="th-name">${esc(reply.author.name)}</span>${S.badgeHTML(reply.author)}
          <span class="th-handle">@${esc(reply.author.handle)}</span>
          <time class="th-time" datetime="${esc(reply.createdAt)}" title="${esc(S.fullDate(reply.createdAt))}">${S.timeAgo(reply.createdAt)}</time>
          ${reply.isMine ? `<button type="button" class="th-more" data-action="delete-reply" data-post="${esc(postId)}" data-id="${esc(reply.id)}" aria-label="Xóa trả lời">Xóa</button>` : ""}
        </header>
        <div class="th-content">${S.formatContent(reply.content)}</div>
        <footer class="th-actions">
          <button type="button" class="th-act th-like${reply.liked ? " is-on" : ""}" data-action="like-reply" data-id="${esc(reply.id)}" aria-pressed="${reply.liked}" aria-label="Thích (${reply.likeCount})">${ICON.heart}<span>${reply.likeCount}</span></button>
        </footer>
      </div>
    </article>`;
  }

  // ---------- Toast ----------
  let toastEl, toastTimer;
  function toast(msg, isError = false) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "th-toast";
      toastEl.setAttribute("role", "status");
      toastEl.setAttribute("aria-live", "polite");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.toggle("is-error", isError);
    toastEl.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-show"), 2600);
  }

  // ---------- Xử lý thao tác (event delegation, gắn 1 lần cho mỗi vùng chứa) ----------
  function bindActions(container, onChange) {
    container.addEventListener("click", async (e) => {
      const btn = e.target.closest("[data-action]");
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        const { action, id } = btn.dataset;

        if (action === "share") {
          const result = await S.sharePost({ id, title: "" });
          if (result === "copied") toast("Đã sao chép liên kết bài viết.");
          else if (result === "failed") toast("Không chia sẻ được, hãy sao chép địa chỉ trang.", true);
          return;
        }

        // Thích / xóa đều cần đăng nhập
        if (!S.currentUser()) {
          toast("Đăng nhập để thích và trả lời bài viết.");
          setTimeout(S.requireLogin, 900);
          return;
        }

        if (action === "like-post" || action === "like-reply") {
          const liked = S.toggleLike(action === "like-post" ? "p" : "r", id);
          if (liked === null) return toast("Không lưu được lượt thích.", true);
          // Cập nhật ngay trên nút, không render lại cả danh sách
          const countEl = btn.querySelector("span");
          const n = Number(countEl.textContent) + (liked ? 1 : -1);
          countEl.textContent = n;
          btn.classList.toggle("is-on", liked);
          btn.setAttribute("aria-pressed", String(liked));
          btn.setAttribute("aria-label", `Thích (${n})`);
          if (liked) { btn.classList.remove("pop"); void btn.offsetWidth; btn.classList.add("pop"); }
          return;
        }

        if (action === "delete-post") {
          if (!confirm("Xóa bài viết này? Thao tác không thể hoàn tác.")) return;
          if (S.deletePost(id)) { toast("Đã xóa bài viết."); onChange && onChange("delete-post", id); }
          else toast("Không xóa được bài viết.", true);
          return;
        }

        if (action === "delete-reply") {
          if (!confirm("Xóa trả lời này?")) return;
          if (S.deleteReply(btn.dataset.post, id)) { toast("Đã xóa trả lời."); onChange && onChange("delete-reply", id); }
          else toast("Không xóa được trả lời.", true);
        }
        return;
      }

      // Bấm vào vùng trống của thẻ → mở chi tiết (trừ link, nút, ảnh salon...)
      if (e.target.closest("a, button, [data-stop], input, textarea")) return;
      const card = e.target.closest("[data-open]");
      if (card && !window.getSelection().toString()) {
        window.location.href = detailUrl(card.dataset.postId);
      }
    });
  }

  window.ThreadUI = { postCardHTML, replyHTML, bindActions, toast, detailUrl };
})();
