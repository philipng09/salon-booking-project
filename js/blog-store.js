/**
 * SALONBOOK - KHO DỮ LIỆU CỘNG ĐỒNG (kiểu Threads) DÙNG CHUNG
 * - Gộp bài mẫu (js/blogs.js) + bài người dùng đăng (localStorage)
 * - Lượt thích, trả lời của người dùng lưu localStorage, không sửa mảng blogs gốc
 * - Hàm hiển thị dùng chung: avatar, thời gian tương đối, nội dung có #hashtag
 * Phụ trách: Nhật Phi
 */
(() => {
  "use strict";

  const POSTS_KEY = "salonbook_threads_posts";          // bài người dùng tạo
  const INTER_KEY = "salonbook_threads_interactions";   // { likes: {}, replies: {} }
  const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

  // ---------- Tiện ích hiển thị ----------
  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  // "3 phút", "2 giờ", "4 ngày", quá 7 ngày thì hiện ngày/tháng
  function timeAgo(iso) {
    const t = new Date(iso).getTime();
    if (Number.isNaN(t)) return "";
    const diff = Math.max(0, (Date.now() - t) / 1000);
    if (diff < 60) return "vừa xong";
    if (diff < 3600) return `${Math.floor(diff / 60)} phút`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ`;
    if (diff < 7 * 86400) return `${Math.floor(diff / 86400)} ngày`;
    const d = new Date(t);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  }

  function fullDate(iso) {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? "" : d.toLocaleString("vi-VN", { dateStyle: "medium", timeStyle: "short" });
  }

  // Thoát HTML TRƯỚC, sau đó mới biến #hashtag thành liên kết và @handle thành chữ đậm
  function formatContent(text) {
    return String(text ?? "")
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const safe = escapeHTML(line)
          .replace(/#([\p{L}\p{N}_]+)/gu, (m, tag) => `<a class="th-tag" href="blog.html?tag=${encodeURIComponent(tag.toLowerCase())}">#${tag}</a>`)
          .replace(/(^|\s)@([a-z0-9._]+)/gi, '$1<span class="th-mention">@$2</span>');
        return `<p>${safe}</p>`;
      })
      .join("");
  }

  const AVATAR_COLORS = ["#0c513f", "#2f6f5e", "#7a5a00", "#8a3b2e", "#3b4f8a", "#6b3b8a"];
  function avatarHTML(author, size = "") {
    const cls = `th-avatar${size ? " th-avatar-" + size : ""}`;
    if (author && author.avatar) {
      return `<span class="${cls}"><img src="${escapeHTML(author.avatar)}" alt=""></span>`;
    }
    const name = (author && author.name) || "?";
    const initials = name.trim().split(/\s+/).slice(-2).map((w) => w[0]).join("").toUpperCase();
    let h = 0;
    for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return `<span class="${cls}" style="background:${AVATAR_COLORS[h % AVATAR_COLORS.length]}">${escapeHTML(initials)}</span>`;
  }

  function badgeHTML(author) {
    if (!author) return "";
    if (author.type === "official") return '<span class="th-badge" title="Tài khoản chính thức">✔</span>';
    if (author.type === "salon") return '<span class="th-badge th-badge-salon">Salon</span>';
    return "";
  }

  // ---------- Đọc / ghi localStorage an toàn ----------
  function readJSON(key, fallback) {
    try {
      const v = JSON.parse(localStorage.getItem(key));
      return v ?? fallback;
    } catch {
      return fallback; // dữ liệu hỏng → dùng mặc định, không làm lỗi trang
    }
  }
  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false; // bộ nhớ đầy hoặc bị chặn
    }
  }

  function getInteractions() {
    const data = readJSON(INTER_KEY, {});
    return {
      likes: data && typeof data.likes === "object" && data.likes ? data.likes : {},
      replies: data && typeof data.replies === "object" && data.replies ? data.replies : {}
    };
  }

  function getUserPosts() {
    const list = readJSON(POSTS_KEY, []);
    return Array.isArray(list) ? list.filter((p) => p && p.id && p.content && p.author) : [];
  }

  // ---------- Người dùng ----------
  function currentUser() {
    return window.SalonBookAuth && typeof window.SalonBookAuth.currentUser === "function"
      ? window.SalonBookAuth.currentUser()
      : null;
  }

  function authorFromUser(user) {
    const base = (user.email ? user.email.split("@")[0] : user.fullName)
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/gi, "d")
      .toLowerCase().replace(/[^a-z0-9._]/g, "");
    return { name: user.fullName, handle: base || "user", type: "user", userId: user.userId };
  }

  // Chưa đăng nhập → chuyển sang auth.html và quay lại trang hiện tại sau khi đăng nhập
  function requireLogin() {
    if (currentUser()) return true;
    if (window.SalonBookAuth && window.SalonBookAuth.requireLogin) return window.SalonBookAuth.requireLogin();
    window.location.href = "auth.html?returnTo=" + encodeURIComponent(location.pathname.split("/").pop() + location.search);
    return false;
  }

  // ---------- Ghép dữ liệu ----------
  // So sánh theo mốc thời gian thật (dữ liệu mẫu có múi giờ +07:00, bài mới dạng UTC "Z")
  const ts = (iso) => new Date(iso).getTime() || 0;

  const likeKey = (type, id) => `${type}:${id}`; // "p:3" cho bài, "r:r3-1" cho trả lời

  function decorateReply(reply, inter, user) {
    const key = likeKey("r", reply.id);
    const likedBy = Array.isArray(inter.likes[key]) ? inter.likes[key] : [];
    return {
      ...reply,
      likeCount: (reply.likes || 0) + likedBy.length,
      liked: Boolean(user && likedBy.includes(user.userId)),
      isMine: Boolean(user && reply.author && reply.author.userId === user.userId)
    };
  }

  function decoratePost(post, inter, user) {
    const key = likeKey("p", post.id);
    const likedBy = Array.isArray(inter.likes[key]) ? inter.likes[key] : [];
    const userReplies = Array.isArray(inter.replies[post.id]) ? inter.replies[post.id] : [];
    const replies = [...(post.replies || []), ...userReplies]
      .map((r) => decorateReply(r, inter, user))
      .sort((a, b) => ts(a.createdAt) - ts(b.createdAt));
    return {
      ...post,
      replies,
      replyCount: replies.length,
      likeCount: (post.likes || 0) + likedBy.length,
      liked: Boolean(user && likedBy.includes(user.userId)),
      isMine: Boolean(user && post.author && post.author.userId === user.userId),
      tags: (String(post.content).match(/#([\p{L}\p{N}_]+)/gu) || []).map((t) => t.slice(1).toLowerCase())
    };
  }

  // Tất cả bài (mới nhất trước). Không sửa mảng blogs gốc.
  function getAllPosts() {
    const inter = getInteractions();
    const user = currentUser();
    const base = Array.isArray(window.blogs) ? window.blogs : [];
    return [...getUserPosts(), ...base]
      .map((p) => decoratePost(p, inter, user))
      .sort((a, b) => ts(b.createdAt) - ts(a.createdAt));
  }

  function findPost(id) {
    if (id === null || id === undefined || id === "") return null;
    return getAllPosts().find((p) => String(p.id) === String(id)) || null;
  }

  // ---------- Thao tác ----------
  function toggleLike(type, id) {
    const user = currentUser();
    if (!user) return null;
    const inter = getInteractions();
    const key = likeKey(type, id);
    const list = Array.isArray(inter.likes[key]) ? inter.likes[key] : [];
    const liked = !list.includes(user.userId);
    inter.likes[key] = liked ? [...list, user.userId] : list.filter((u) => u !== user.userId);
    return writeJSON(INTER_KEY, inter) ? liked : null;
  }

  function addPost({ title, content, topic, image, salonId }) {
    const user = currentUser();
    if (!user) return null;
    const post = {
      id: "u" + Date.now(),          // tiền tố "u" để không trùng id bài mẫu
      author: authorFromUser(user),
      title: title ? title.trim() : "",
      content: content.trim(),
      image: image || "",
      topic,
      createdAt: new Date().toISOString(),
      likes: 0,
      salonId: salonId ? Number(salonId) : undefined,
      replies: [],
      isUserPost: true
    };
    const list = getUserPosts();
    list.unshift(post);
    return writeJSON(POSTS_KEY, list) ? post : null;
  }

  function deletePost(id) {
    const user = currentUser();
    if (!user) return false;
    const list = getUserPosts();
    const next = list.filter((p) => !(String(p.id) === String(id) && p.author.userId === user.userId));
    if (next.length === list.length) return false;
    // Dọn luôn lượt thích & trả lời của bài đã xóa
    const inter = getInteractions();
    delete inter.likes[likeKey("p", id)];
    delete inter.replies[id];
    writeJSON(INTER_KEY, inter);
    return writeJSON(POSTS_KEY, next);
  }

  function addReply(postId, content) {
    const user = currentUser();
    if (!user || !findPost(postId)) return null;
    const inter = getInteractions();
    const reply = {
      id: `ur${Date.now()}`,
      author: authorFromUser(user),
      content: content.trim(),
      createdAt: new Date().toISOString(),
      likes: 0
    };
    inter.replies[postId] = [...(inter.replies[postId] || []), reply];
    return writeJSON(INTER_KEY, inter) ? reply : null;
  }

  function deleteReply(postId, replyId) {
    const user = currentUser();
    if (!user) return false;
    const inter = getInteractions();
    const list = inter.replies[postId] || [];
    const next = list.filter((r) => !(r.id === replyId && r.author.userId === user.userId));
    if (next.length === list.length) return false;
    inter.replies[postId] = next;
    delete inter.likes[likeKey("r", replyId)];
    return writeJSON(INTER_KEY, inter);
  }

  // Nén ảnh trước khi lưu (tối đa 1080px, JPEG 0.75) để không làm đầy localStorage
  function compressImage(file) {
    return new Promise((resolve, reject) => {
      if (!file) return resolve("");
      if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return reject(new Error("Chỉ hỗ trợ ảnh JPG, PNG hoặc WEBP."));
      if (file.size > MAX_IMAGE_BYTES) return reject(new Error("Ảnh vượt quá 5MB."));
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Không đọc được ảnh."));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error("Tệp ảnh bị lỗi."));
        img.onload = () => {
          const scale = Math.min(1, 1080 / Math.max(img.width, img.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.75));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  async function sharePost(post) {
    const url = new URL(`blog-detail.html?id=${encodeURIComponent(post.id)}`, location.href).href;
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title || "Bài viết trên SalonBook", url });
        return "shared";
      }
      await navigator.clipboard.writeText(url);
      return "copied";
    } catch {
      return "failed";
    }
  }

  window.BlogStore = {
    escapeHTML, timeAgo, fullDate, formatContent, avatarHTML, badgeHTML,
    currentUser, requireLogin,
    getAllPosts, findPost,
    toggleLike, addPost, deletePost, addReply, deleteReply,
    compressImage, sharePost
  };
})();
