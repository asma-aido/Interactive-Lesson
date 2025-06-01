console.log("JavaScript Loaded");

// ========== Slide Navigation State ==========
let currentSlide = 1;
const totalSlides = 7;
let slide3Correct = false;
let slide5Correct = false;
let slide3Attempts = 0;
let slide6Completed = false;

// ========== Slide Navigation Controls ==========
function startTraining() {
    fetch("/lesson1/log_click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slide: 1, action: "start_clicked" })
    }).then(() => {
        currentSlide = 2;
        showSlide(currentSlide);
    });
}

function nextSlide() {
    if (currentSlide === 3 && !slide3Correct) return alert("الرجاء إدخال الإجابة الصحيحة أولاً.");
    if (currentSlide === 5 && !slide5Correct) return alert("أجب على السؤال بشكل صحيح أولاً.");
    if (currentSlide === 6 && !slide6Completed) return alert("الرجاء الضغط على زر 'حفظ الملف' أولاً.");
    if (currentSlide < totalSlides) {
        currentSlide++;
        showSlide(currentSlide);
    }
}

function prevSlide() {
    if (currentSlide > 1) {
        currentSlide--;
        showSlide(currentSlide);
    }
}

function stopLesson() {
    if (confirm("هل تريد إيقاف التدريب؟")) window.location.href = "/";
}

function handleBack() {
    if (currentSlide === 1) {
        // Go to homepage if we're on the first slide
        window.location.href = "/";
    } else {
        // Otherwise, go to the previous slide
        prevSlide();
    }
}

function showSlide(index) {
    document.querySelectorAll("audio").forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
    for (let i = 1; i <= totalSlides; i++) {
        const slide = document.getElementById("slide" + i);
        if (slide) slide.style.display = (i === index ? "block" : "none");
    }
    const audio = document.querySelector(`#slide${index} audio`);
    if (audio) setTimeout(() => audio.play().catch(() => {}), 100);

    if (index === 6) showHighlightBox6();
    const nextBtn = document.getElementById("nextButton");
    if (nextBtn) nextBtn.style.display = (index === 7 ? "none" : "inline-block");
}

window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const targetSlide = parseInt(urlParams.get("slide"));
    if (!isNaN(targetSlide)) currentSlide = targetSlide;
    showSlide(currentSlide);
};

// ========== Slide 3 Logic ==========
function checkSlide3Answer() {
    const input = document.getElementById("slide3Input").value.trim();
    const result = document.getElementById("slide3Result");
    const nextBtn = document.getElementById("slide3Next");
    const attemptsDisplay = document.getElementById("slide3Attempts");

    slide3Attempts++;
    attemptsDisplay.textContent = `عدد المحاولات: ${slide3Attempts}`;
    const isCorrect = input === "الصيغ";
    result.textContent = isCorrect ? "✔️ إجابة صحيحة!" : "❌ إجابة غير صحيحة.";
    result.style.color = isCorrect ? "green" : "red";
    if (isCorrect) {
        nextBtn.style.display = "inline-block";
        slide3Correct = true;
    }
    fetch("/lesson1/save_attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slide: 3, attempts: slide3Attempts, success: isCorrect })
    });
}

// ========== Slide 5 Logic ==========
function checkSlide5Answer() {
    const input = parseInt(document.getElementById("slide5Input").value);
    const result = document.getElementById("slide5Result");
    const isCorrect = input === 100;
    slide5Correct = isCorrect;
    result.textContent = isCorrect ? "✔️ إجابة صحيحة!" : "❌ حاول مرة أخرى.";
    result.style.color = isCorrect ? "green" : "red";
    fetch("/lesson1/save_attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slide: 5, attempts: 1, success: isCorrect })
    });
}

// ========== Slide 6 Logic ==========
function handleClick6() {
    document.getElementById("fakeButton6").style.display = "none";
    document.getElementById("highlightBox6").style.display = "none";
    slide6Completed = true;
}

function showHighlightBox6() {
    slide6Completed = false;
    const fakeButton = document.getElementById("fakeButton6");
    const highlight = document.getElementById("highlightBox6");
    if (fakeButton && highlight) {
        fakeButton.style.display = "inline-block";
        highlight.style.display = "none";
        setTimeout(() => {
            const btnRect = fakeButton.getBoundingClientRect();
            const containerRect = fakeButton.offsetParent.getBoundingClientRect();
            highlight.style.top = (btnRect.top - containerRect.top - 6) + "px";
            highlight.style.left = (btnRect.left - containerRect.left) + "px";
            highlight.style.width = btnRect.width + "px";
            highlight.style.height = btnRect.height + "px";
            highlight.style.display = "block";
        }, 300);
    }
}

function restartScenario6() {
    slide6Completed = false;
    document.getElementById("fakeButton6").style.display = "inline-block";
    document.getElementById("highlightBox6").style.display = "none";
    setTimeout(showHighlightBox6, 300);
    const audio = document.getElementById("audio6");
    audio.pause();
    audio.currentTime = 0;
    audio.play().catch(() => {});
}

// ========== Slide 7 Simulation ==========
function startSimulation() {
    const simDiv = document.getElementById("excelSim");
    const fileArea = document.getElementById("fileArea");
    const startBtn = document.getElementById("startButton");
    const backBtn = document.getElementById("backButton");
    const audio = document.getElementById("scenario7Audio");
    simDiv.style.backgroundImage = "url('/static/images/sample7_2.png')";
    fileArea.style.display = "block";
    startBtn.style.display = "none";
    backBtn.style.display = "none";
    audio.play().catch(() => {});
}

function onFileClick() {
    const simDiv = document.getElementById("excelSim");
    const fileArea = document.getElementById("fileArea");
    const backBtn = document.getElementById("backButton");
    simDiv.style.backgroundImage = "url('/static/images/sample7_3.png')";
    fileArea.style.display = "none";
    backBtn.style.display = "inline-block";
    fetch("/scenario7/log_click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: "default_user", action: "clicked_file_area" })
    });
}

function goBack() {
    const simDiv = document.getElementById("excelSim");
    const fileArea = document.getElementById("fileArea");
    const backBtn = document.getElementById("backButton");
    simDiv.style.backgroundImage = "url('/static/images/sample7_2.png')";
    fileArea.style.display = "block";
    backBtn.style.display = "none";
}


// ========== Shared Utility ==========
function startAndRedirect() {
    fetch("/scenario1/log_click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: "default_user", action: "start_clicked" })
    }).then(() => {
        window.location.href = "/lesson1?slide=2";
    });
}

function skipVideo() {
    const video = document.getElementById("video4");
    video.pause();
    video.style.display = "none";
    fetch("/scenario4/skip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skipped: true, timestamp: new Date().toISOString() })
    });
}


