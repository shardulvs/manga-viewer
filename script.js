document.addEventListener("DOMContentLoaded", () => {
    let images = ["./default.jpg"];
    let currentIndex = 0;
    let isMangaMode = false;
    let zoomLevel = 1;
    let isFullScreen = false;

    const fileInput = document.getElementById("file-input");
    const comicImage = document.getElementById("comic-image");
    const viewerContainer = document.getElementById("viewer-container");
    const loadingText = document.getElementById("loading-text");

    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const mangaModeBtn = document.getElementById("manga-mode-btn");
    const zoomInBtn = document.getElementById("zoom-in-btn");
    const zoomOutBtn = document.getElementById("zoom-out-btn");
    const fullscreenBtn = document.getElementById("fullscreen-btn");
    const themeToggleBtn = document.getElementById("theme-toggle-btn");

    // Load dark mode preference
    if (localStorage.getItem("dark-mode") === "enabled") {
        document.body.classList.add("dark-mode");
    }

    // File Upload Handler
    fileInput.addEventListener("change", (event) => {
        const files = Array.from(event.target.files);
        images = files.map(file => URL.createObjectURL(file));
        currentIndex = 0;
        displayImage();
    });

    // Display Image
    function displayImage() {
        if (images.length === 0) return;
        comicImage.src = images[currentIndex];
        if (isMangaMode) {
            swapPanels(images[currentIndex]);
        }
    }

    // Manga Mode (Panel Swapping)
    function swapPanels(imageSrc) {
        loadingText.style.display = "block";
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const width = img.width;
            const height = img.height;
            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(img, 0, 0);
            const leftHalf = ctx.getImageData(0, 0, width / 2, height);
            const rightHalf = ctx.getImageData(width / 2, 0, width / 2, height);

            ctx.putImageData(rightHalf, 0, 0);
            ctx.putImageData(leftHalf, width / 2, 0);

            comicImage.src = canvas.toDataURL();
            loadingText.style.display = "none";
        };
    }

    // Navigation Controls
    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            displayImage();
        }
    });

    nextBtn.addEventListener("click", () => {
        if (currentIndex < images.length - 1) {
            currentIndex++;
            displayImage();
        }
    });

    // Manga Mode Toggle
    mangaModeBtn.addEventListener("click", () => {
        isMangaMode = !isMangaMode;
        displayImage();
    });

    // Zoom Controls
    zoomInBtn.addEventListener("click", () => {
        zoomLevel = Math.min(zoomLevel + 0.2, 2);
        comicImage.style.transform = `scale(${zoomLevel})`;
    });

    zoomOutBtn.addEventListener("click", () => {
        zoomLevel = Math.max(zoomLevel - 0.2, 0.5);
        comicImage.style.transform = `scale(${zoomLevel})`;
    });

    // Fullscreen Toggle
    fullscreenBtn.addEventListener("click", toggleFullScreen);

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            isFullScreen = true;
        } else {
            document.exitFullscreen();
            isFullScreen = false;
        }
    }

    // Dark Mode Toggle
    themeToggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("dark-mode", "enabled");
        } else {
            localStorage.setItem("dark-mode", "disabled");
        }
    });

    // Keyboard Shortcuts
    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") nextBtn.click();
        else if (event.key === "ArrowLeft") prevBtn.click();
        else if (event.key.toLowerCase() === "m") mangaModeBtn.click();
        else if (event.key === "+") zoomInBtn.click();
        else if (event.key === "-") zoomOutBtn.click();
        else if (event.key.toLowerCase() === "f") toggleFullScreen();
    });

    displayImage();

});
