/* ==========================================================================
   SALONBOOK - LOGIC TRANG TƯ VẤN (BƯỚC 1, BƯỚC 2, BƯỚC 3)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // 1. DANH SÁCH 6 KIỂU TÓC MẪU (Khớp tên file trong thư mục images/)
  const HAIRSTYLES = [
    {
      id: "layer-bob",
      name: "Layer Bob",
      image: "images/style-layer-bob.png"
    },
    {
      id: "curtain-bangs",
      name: "Curtain Bangs",
      image: "images/style-curtain-bangs.png"
    },
    {
      id: "wavy-lob",
      name: "Wavy Lob",
      image: "images/style-wavy-lob.png"
    },
    {
      id: "soft-layer",
      name: "Soft Layer",
      image: "images/style-soft-layer.png"
    },
    {
      id: "french-bob",
      name: "French Bob",
      image: "images/style-french-bob.png"
    },
    {
      id: "beach-waves",
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
      previewImage.src = "";
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
          <img src="${style.image}" alt="Kiểu tóc ${style.name}">
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

    btnStartConsult.disabled = !canSubmit;
  }

  btnStartConsult.addEventListener("click", () => {
    if (btnStartConsult.disabled) return;
    alert(
      `Đã đủ điều kiện tư vấn!\n- Ảnh: ${state.fileName}\n- Kiểu tóc đã chọn: ${state.selectedStyle.name}`
    );
  });

  // Khởi tạo giao diện ban đầu
  renderHairstyles();
  updateConsultButton();
});