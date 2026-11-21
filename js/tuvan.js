/* ==========================================================================
   SALONBOOK - LOGIC TRANG TƯ VẤN (BƯỚC 1 → BƯỚC 6)
   Bước 4–6 bổ sung: Nhật Phi
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // 1. DANH SÁCH 6 KIỂU TÓC MẪU (Khớp tên file trong thư mục images/)
  const HAIRSTYLES = [
    {
      id: "layer-bob",
      description: "Tóc ngắn ngang cằm, tỉa tầng nhẹ giúp tóc bồng và gọn gàng.",
      tips: ["Hợp tóc mỏng, muốn thêm độ phồng.", "Cắt tỉa lại sau 6–8 tuần để giữ form.", "Sấy cụp nhẹ phần ngọn khi tạo kiểu."],
      serviceValue: "cat-tao-kieu",
      name: "Layer Bob",
      image: "images/style-layer-bob.png"
    },
    {
      id: "curtain-bangs",
      description: "Mái thưa rẽ hai bên, ôm nhẹ gương mặt và che bớt phần trán.",
      tips: ["Hợp trán cao hoặc muốn mặt trông mềm hơn.", "Mái cần tỉa lại sau 3–4 tuần.", "Dùng lược tròn sấy mái sang hai bên."],
      serviceValue: "cat-tao-kieu",
      name: "Curtain Bangs",
      image: "images/style-curtain-bangs.png"
    },
    {
      id: "wavy-lob",
      description: "Tóc dài chấm vai với sóng lơi tự nhiên, dễ phối nhiều phong cách.",
      tips: ["Hợp người muốn thay đổi nhưng chưa cắt quá ngắn.", "Có thể tạo sóng bằng máy kẹp thay vì uốn.", "Dùng xịt dưỡng chống xơ khi tạo sóng nhiệt."],
      serviceValue: "cat-tao-kieu",
      name: "Wavy Lob",
      image: "images/style-wavy-lob.png"
    },
    {
      id: "soft-layer",
      description: "Giữ độ dài, tỉa tầng mềm từ ngang cằm xuống để tóc nhẹ và có chuyển động.",
      tips: ["Hợp tóc dày, nặng.", "Ít phải chăm sóc, cắt tỉa sau 8–10 tuần.", "Sấy hướng ra ngoài để các tầng rõ hơn."],
      serviceValue: "cat-tao-kieu",
      name: "Soft Layer",
      image: "images/style-soft-layer.png"
    },
    {
      id: "french-bob",
      description: "Bob ngắn kiểu Pháp kết hợp mái ngố, phong cách cổ điển và cá tính.",
      tips: ["Hợp gương mặt thon, cổ cao.", "Cần tỉa định kỳ 4–6 tuần.", "Nên trao đổi kỹ với stylist về độ dày mái."],
      serviceValue: "cat-tao-kieu",
      name: "French Bob",
      image: "images/style-french-bob.png"
    },
    {
      id: "beach-waves",
      description: "Sóng biển to, bồng bềnh, tạo cảm giác tự nhiên và trẻ trung.",
      tips: ["Hợp tóc dài từ ngang vai trở xuống.", "Có thể tạo sóng tại salon hoặc bằng máy uốn tại nhà.", "Dùng dầu dưỡng để sóng giữ nếp, không bị xơ."],
      serviceValue: "cat-tao-kieu",
      name: "Beach Waves",
      image: "images/style-beach-waves.png"
    }
  ];

  // 2. TRẠNG THÁI (STATE)
  const state = {
    imageDataUrl: null,
    fileName: "",
    fileSize: "",
    consentChecked: false,
    selectedStyle: null,
    showAllStyles: false,
    cameraStream: null
  };

  // Quy định định dạng và dung lượng tối đa (5MB)
  const ALLOWED_TYPES = ["image/jpeg", "image/png"];
  const ALLOWED_EXT_REGEX = /\.(jpe?g|png)$/i;
  const MAX_SIZE_BYTES = 5 * 1024 * 1024;

  // 3. DOM ELEMENTS
  const fileInput = document.getElementById("photo-file-input");
  const cameraInput = document.getElementById("photo-camera-input");
  const uploadArea = document.getElementById("upload-area");
  const btnChooseFile = document.getElementById("btn-choose-file");
  const btnOpenCamera = document.getElementById("btn-open-camera");

  const cameraArea = document.getElementById("camera-area");
  const cameraVideo = document.getElementById("camera-video");
  const cameraCanvas = document.getElementById("camera-canvas");
  const btnCapturePhoto = document.getElementById("btn-capture-photo");
  const btnCancelCamera = document.getElementById("btn-cancel-camera");

  const previewArea = document.getElementById("preview-area");
  const previewImage = document.getElementById("preview-image");
  const previewFileName = document.getElementById("preview-file-name");
  const previewFileSize = document.getElementById("preview-file-size");
  const btnChangePhoto = document.getElementById("btn-change-photo");
  const btnRemovePhoto = document.getElementById("btn-remove-photo");

  const photoStatusBadge = document.getElementById("photo-status-badge");
  const uploadError = document.getElementById("upload-error");
  const consentCheckbox = document.getElementById("consent-checkbox");

  const hairstyleGrid = document.getElementById("hairstyle-grid");
  const selectedStyleLabel = document.getElementById("selected-style-label");
  const btnStartConsult = document.getElementById("btn-start-consult");
  const btnViewAllStyles = document.getElementById("btn-view-all-styles");

  // ========================================================================
  // BƯỚC 2: UPLOAD ẢNH JPG/PNG, FILEREADER XEM TRƯỚC, CAMERA & XÓA/ĐỔI ẢNH
  // ========================================================================

  function showError(msg) {
    uploadError.textContent = msg;
    uploadError.hidden = false;
  }

  function clearError() {
    uploadError.textContent = "";
    uploadError.hidden = true;
  }

  function formatBytes(bytes) {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }

  function processImageFile(file) {
    clearError();
    if (!file) return;

    // 1. Kiểm tra định dạng JPG / PNG (cả MIME type lẫn đuôi file)
    const isValidType =
      ALLOWED_TYPES.includes(file.type) || ALLOWED_EXT_REGEX.test(file.name);
    if (!isValidType) {
      showError("Định dạng không hợp lệ. Chỉ chấp nhận ảnh JPG hoặc PNG.");
      fileInput.value = "";
      cameraInput.value = "";
      return;
    }

    // 2. Kiểm tra kích thước <= 5MB
    if (file.size > MAX_SIZE_BYTES) {
      showError(
        `Ảnh quá lớn (${formatBytes(file.size)}). Vui lòng chọn ảnh dưới 5MB.`
      );
      fileInput.value = "";
      cameraInput.value = "";
      return;
    }

    // 3. Dùng FileReader để đọc và hiển thị ảnh xem trước
    const reader = new FileReader();
    reader.onload = (e) => {
      state.imageDataUrl = e.target.result;
      state.fileName = file.name;
      state.fileSize = formatBytes(file.size);

      updatePhotoUI();
      updateConsultButton();
    };
    reader.onerror = () => {
      showError("Lỗi khi đọc tệp ảnh. Vui lòng thử lại.");
    };
    reader.readAsDataURL(file);
  }

  function updatePhotoUI() {
    if (state.imageDataUrl) {
      previewImage.src = state.imageDataUrl;
      previewFileName.textContent = state.fileName;
      previewFileSize.textContent = state.fileSize;

      uploadArea.hidden = true;
      cameraArea.hidden = true;
      previewArea.hidden = false;

      photoStatusBadge.hidden = false;
      photoStatusBadge.classList.add("is-active");
    } else {
      previewImage.removeAttribute("src");
      previewArea.hidden = true;
      cameraArea.hidden = true;
      uploadArea.hidden = false;

      photoStatusBadge.hidden = true;
      photoStatusBadge.classList.remove("is-active");
    }
  }

  function removePhoto() {
    state.imageDataUrl = null;
    state.fileName = "";
    state.fileSize = "";
    fileInput.value = "";
    cameraInput.value = "";
    clearError();
    updatePhotoUI();
    updateConsultButton();
  }

  // Sự kiện chọn ảnh / đổi ảnh / xóa ảnh
  btnChooseFile.addEventListener("click", () => fileInput.click());
  btnChangePhoto.addEventListener("click", () => fileInput.click());
  btnRemovePhoto.addEventListener("click", removePhoto);

  fileInput.addEventListener("change", (e) => processImageFile(e.target.files[0]));
  cameraInput.addEventListener("change", (e) => processImageFile(e.target.files[0]));

  // Kéo thả ảnh vào khung upload
  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadArea.classList.add("is-dragover");
  });

  uploadArea.addEventListener("dragleave", () => {
    uploadArea.classList.remove("is-dragover");
  });

  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadArea.classList.remove("is-dragover");
    processImageFile(e.dataTransfer.files[0]);
  });

  // Mở camera chụp ảnh
  function stopCamera() {
    if (state.cameraStream) {
      state.cameraStream.getTracks().forEach((t) => t.stop());
      state.cameraStream = null;
    }
  }

  btnOpenCamera.addEventListener("click", async () => {
    clearError();
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      cameraInput.click();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false
      });
      state.cameraStream = stream;
      cameraVideo.srcObject = stream;
      uploadArea.hidden = true;
      previewArea.hidden = true;
      cameraArea.hidden = false;
    } catch (err) {
      cameraInput.click();
    }
  });

  btnCapturePhoto.addEventListener("click", () => {
    const w = cameraVideo.videoWidth || 640;
    const h = cameraVideo.videoHeight || 640;
    cameraCanvas.width = w;
    cameraCanvas.height = h;

    const ctx = cameraCanvas.getContext("2d");
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(cameraVideo, 0, 0, w, h);

    state.imageDataUrl = cameraCanvas.toDataURL("image/jpeg", 0.9);
    state.fileName = "anh-chup-camera.jpg";
    state.fileSize = "Ảnh từ camera";

    stopCamera();
    updatePhotoUI();
    updateConsultButton();
  });

  btnCancelCamera.addEventListener("click", () => {
    stopCamera();
    updatePhotoUI();
  });

  // ========================================================================
  // BƯỚC 3: DANH SÁCH KIỂU TÓC, HIGHLIGHT & ĐIỀU KIỆN BẬT NÚT TƯ VẤN
  // ========================================================================

  function renderHairstyles() {
    hairstyleGrid.innerHTML = "";
    const visibleList = state.showAllStyles ? HAIRSTYLES : HAIRSTYLES.slice(0, 3);

    visibleList.forEach((style) => {
      const isSelected = state.selectedStyle && state.selectedStyle.id === style.id;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `preset-card${isSelected ? " is-selected" : ""}`;
      btn.setAttribute("role", "radio");
      btn.setAttribute("aria-checked", String(Boolean(isSelected)));

      btn.innerHTML = `
        <div class="preset-frame">
          <img src="${style.image}" alt="Kiểu tóc ${style.name}" loading="lazy" onerror="this.closest('.preset-frame').classList.add('is-broken')">
          <span class="preset-check" aria-hidden="true">✓</span>
        </div>
        <span class="preset-name">${style.name}</span>
      `;

      btn.addEventListener("click", () => {
        state.selectedStyle = style;
        selectedStyleLabel.textContent = style.name;
        selectedStyleLabel.classList.add("is-active");
        renderHairstyles();
        updateConsultButton();
      });

      hairstyleGrid.appendChild(btn);
    });
  }

  btnViewAllStyles.addEventListener("click", () => {
    state.showAllStyles = !state.showAllStyles;
    btnViewAllStyles.textContent = state.showAllStyles
      ? "Thu gọn kiểu tóc"
      : "Xem tất cả kiểu tóc";
    renderHairstyles();
  });

  consentCheckbox.addEventListener("change", () => {
    state.consentChecked = consentCheckbox.checked;
    updateConsultButton();
  });

  // Chỉ bật nút "Bắt đầu tư vấn với AI" khi đã có ảnh + đồng ý điều khoản + chọn kiểu tóc
  function updateConsultButton() {
    const canSubmit =
      Boolean(state.imageDataUrl) &&
      state.consentChecked &&
      Boolean(state.selectedStyle);

    btnStartConsult.disabled = !canSubmit || isConsulting;

    // Bước 6: đánh dấu điều kiện đã đạt / còn thiếu
    if (requirementsList) {
      const done = {
        photo: Boolean(state.imageDataUrl),
        consent: state.consentChecked,
        style: Boolean(state.selectedStyle)
      };
      requirementsList.querySelectorAll("li[data-req]").forEach((li) => {
        li.classList.toggle("is-done", done[li.dataset.req]);
      });
      requirementsList.hidden = canSubmit;
    }
  }

  // ========================================================================
  // BƯỚC 4: LOADING + KẾT QUẢ AI MÔ PHỎNG (ghi rõ không phải AI thật)
  // ========================================================================
  const resultSection = document.getElementById("consult-result");
  const loadingBox = document.getElementById("consult-loading");
  const loadingText = document.getElementById("loading-text");
  const loadingFill = document.getElementById("loading-bar-fill");
  const outputBox = document.getElementById("consult-output");
  const requirementsList = document.getElementById("consult-requirements");

  const LOADING_STEPS = [
    "Đang phân tích ảnh chân dung…",
    "Đang so khớp với kiểu tóc đã chọn…",
    "Đang tạo gợi ý salon phù hợp…"
  ];
  const STEP_MS = 700; // tổng ~2,1 giây, đủ để thấy loading nhưng không quá lâu
  let isConsulting = false;

  // Điểm "phù hợp" giả lập nhưng ỔN ĐỊNH: cùng ảnh + cùng kiểu luôn ra cùng điểm
  function simulatedScore(seedText) {
    let hash = 0;
    for (let i = 0; i < seedText.length; i++) {
      hash = (hash * 31 + seedText.charCodeAt(i)) >>> 0;
    }
    return 72 + (hash % 24); // khoảng 72–95%
  }

  // Salon có dịch vụ phù hợp, ưu tiên điểm đánh giá cao rồi giá thấp
  function suggestSalons(serviceValue, limit = 3) {
    if (typeof products === "undefined" || !Array.isArray(products)) return [];
    return products
      .map((salon) => {
        const service = (salon.servicesList || []).find((sv) => sv.value === serviceValue);
        return service ? { salon, service } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.salon.rating - a.salon.rating || a.service.price - b.service.price)
      .slice(0, limit);
  }

  const formatVND = (n) => n.toLocaleString("vi-VN") + " ₫";

  function renderResult(result) {
    document.getElementById("result-user-photo").src = state.imageDataUrl;
    const styleImg = document.getElementById("result-style-photo");
    styleImg.src = result.style.image;
    styleImg.alt = `Kiểu tóc ${result.style.name}`;
    document.getElementById("result-style-caption").textContent = result.style.name;
    document.getElementById("result-score").textContent = result.score;
    document.getElementById("score-bar-fill").style.width = result.score + "%";
    document.getElementById("result-style-name").textContent = result.style.name;
    document.getElementById("result-style-desc").textContent = result.style.description;

    const tipsEl = document.getElementById("result-tips");
    tipsEl.replaceChildren(
      ...result.style.tips.map((tip) => {
        const li = document.createElement("li");
        li.textContent = tip;
        return li;
      })
    );

    // BƯỚC 5: nút chuyển sang Booking (trang chi tiết salon theo id)
    const suggestEl = document.getElementById("salon-suggest");
    if (!result.salons.length) {
      suggestEl.innerHTML = '<p class="suggest-empty">Chưa tải được danh sách salon. Bạn có thể vào trang Đặt lịch để chọn salon.</p>';
    } else {
      suggestEl.innerHTML = result.salons
        .map(({ salon, service }) => `
          <article class="salon-suggest-card">
            <img src="${salon.image}" alt="" loading="lazy">
            <div class="salon-suggest-body">
              <h4>${salon.name}</h4>
              <p>${salon.districtName} · ★ ${salon.rating}</p>
              <p class="salon-suggest-price">${service.name}: ${formatVND(service.price)}</p>
              <a class="btn btn-yellow" href="product-detail.html?id=${salon.id}&from=tuvan&style=${encodeURIComponent(result.style.id)}">Đặt lịch tại đây</a>
            </div>
          </article>`)
        .join("");
    }
  }

  async function runConsultation() {
    if (isConsulting || btnStartConsult.disabled) return;
    isConsulting = true;
    btnStartConsult.disabled = true;
    btnStartConsult.textContent = "Đang tư vấn…";
    resultSection.setAttribute("aria-busy", "true");

    resultSection.hidden = false;
    outputBox.hidden = true;
    loadingBox.hidden = false;
    resultSection.scrollIntoView({ behavior: "smooth", block: "start" });

    try {
      for (let i = 0; i < LOADING_STEPS.length; i++) {
        loadingText.textContent = LOADING_STEPS[i];
        loadingFill.style.width = `${((i + 1) / LOADING_STEPS.length) * 100}%`;
        await new Promise((r) => setTimeout(r, STEP_MS));
      }

      const style = state.selectedStyle;
      const result = {
        style,
        score: simulatedScore(`${state.fileName}|${state.fileSize}|${style.id}`),
        salons: suggestSalons(style.serviceValue)
      };

      renderResult(result);
      loadingBox.hidden = true;
      outputBox.hidden = false;
      resultSection.focus({ preventScroll: true });

      saveHistory(result);
      renderHistory();
    } catch (err) {
      console.error("Lỗi khi tạo kết quả tư vấn:", err);
      loadingBox.hidden = true;
      outputBox.hidden = true;
      resultSection.hidden = true;
      showError("Không tạo được kết quả tư vấn. Vui lòng thử lại.");
    } finally {
      isConsulting = false;
      resultSection.removeAttribute("aria-busy");
      btnStartConsult.textContent = "Bắt đầu tư vấn với AI";
      loadingFill.style.width = "0";
      updateConsultButton();
    }
  }

  btnStartConsult.addEventListener("click", runConsultation);

  document.getElementById("btn-consult-again").addEventListener("click", () => {
    resultSection.hidden = true;
    hairstyleGrid.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  // ========================================================================
  // BƯỚC 5: LƯU LỊCH SỬ TƯ VẤN MÔ PHỎNG (localStorage, KHÔNG lưu ảnh)
  // ========================================================================
  const HISTORY_KEY = "salonbook_consult_history";
  const HISTORY_LIMIT = 5;
  const historySection = document.getElementById("consult-history");
  const historyList = document.getElementById("history-list");

  // Lịch sử gắn theo tài khoản đang đăng nhập; chưa đăng nhập thì là "guest"
  function ownerId() {
    const user = window.SalonBookAuth && window.SalonBookAuth.currentUser
      ? window.SalonBookAuth.currentUser()
      : null;
    return user ? user.userId : "guest";
  }

  function readHistory() {
    try {
      const list = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
      return Array.isArray(list) ? list.filter((h) => h && h.styleId && h.createdAt) : [];
    } catch {
      return []; // dữ liệu hỏng -> coi như chưa có lịch sử
    }
  }

  function writeHistory(list) {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
    } catch {
      /* localStorage bị chặn: bỏ qua, không ảnh hưởng kết quả đang hiển thị */
    }
  }

  function saveHistory(result) {
    const owner = ownerId();
    const all = readHistory();
    const mine = all.filter((h) => h.owner === owner);
    const others = all.filter((h) => h.owner !== owner);
    mine.unshift({
      owner,
      styleId: result.style.id,
      styleName: result.style.name,
      score: result.score,
      salonIds: result.salons.map((s) => s.salon.id),
      createdAt: new Date().toISOString()
    });
    writeHistory([...mine.slice(0, HISTORY_LIMIT), ...others]);
  }

  function renderHistory() {
    const mine = readHistory().filter((h) => h.owner === ownerId());
    historySection.hidden = mine.length === 0;
    historyList.replaceChildren(
      ...mine.map((h) => {
        const style = HAIRSTYLES.find((s) => s.id === h.styleId);
        const li = document.createElement("li");
        const time = new Date(h.createdAt).toLocaleString("vi-VN", {
          hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric"
        });
        li.className = "history-item";
        li.innerHTML = `
          ${style ? `<img src="${style.image}" alt="">` : ""}
          <div>
            <strong>${style ? style.name : h.styleName}</strong>
            <span>Phù hợp ${h.score}% (mô phỏng) · ${time}</span>
          </div>
          <button type="button" class="btn btn-outline-forest history-reselect" data-style="${h.styleId}">Chọn lại</button>`;
        return li;
      })
    );
  }

  historyList.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-style]");
    if (!btn) return;
    const style = HAIRSTYLES.find((s) => s.id === btn.dataset.style);
    if (!style) return;
    state.selectedStyle = style;
    // Nếu kiểu nằm ngoài 3 kiểu đầu thì mở rộng danh sách để thấy được highlight
    if (HAIRSTYLES.indexOf(style) >= 3 && !state.showAllStyles) btnViewAllStyles.click();
    selectedStyleLabel.textContent = style.name;
    selectedStyleLabel.classList.add("is-active");
    renderHairstyles();
    updateConsultButton();
    hairstyleGrid.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  document.getElementById("btn-clear-history").addEventListener("click", () => {
    if (!window.confirm("Xóa toàn bộ lịch sử tư vấn trên trình duyệt này?")) return;
    const owner = ownerId();
    writeHistory(readHistory().filter((h) => h.owner !== owner));
    renderHistory();
  });

  document.addEventListener("salonbook:auth-changed", renderHistory);

  // Khởi tạo giao diện ban đầu
  renderHairstyles();
  updateConsultButton();
  renderHistory();
});