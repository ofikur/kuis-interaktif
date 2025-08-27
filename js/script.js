// --- Elemen DOM ---
const mainContentWrapper = document.getElementById('main-content-wrapper');
const startScreen = document.getElementById('start-screen');
const quizContainer = document.getElementById('quiz-container');
const scoreScreen = document.getElementById('score-screen');

const startButton = document.getElementById('start-button');
const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('options');
const progressElement = document.getElementById('progress');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const submitButton = document.getElementById('submit-button');

const scoreElement = document.getElementById('score');
const correctAnswersElement = document.getElementById('correct-answers');
const totalQuestionsElement = document.getElementById('total-questions');
const reviewContainer = document.getElementById('review-container');
const restartButton = document.getElementById('restart-button');
const progressBar = document.getElementById('progress-bar');
const backButton = document.getElementById('back-button');
const timeLeftElement = document.getElementById('time-left');
const timerElement = document.getElementById('timer');

document.addEventListener('contextmenu', event => event.preventDefault());

// --- Variabel Status Kuis ---
let currentQuestionIndex = 0;
let userAnswers = new Array(quizData.length).fill(null);
let timeUpAnswers = new Array(quizData.length).fill(false);
let questionTimer;
let timeLeft = 30;

// --- Fungsi Helper ---
function shuffleArray(array) {
    // Mengacak urutan elemen dalam sebuah array.
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function updateContinueButtonsState() {
    // Menonaktifkan tombol 'Selanjutnya' & 'Kirim' jika belum ada jawaban,
    // Kecuali jika waktu untuk soal ini sudah habis.
    const isAnswered = userAnswers[currentQuestionIndex] !== null;
    const isTimeUp = timeUpAnswers[currentQuestionIndex];

    nextButton.disabled = !isAnswered && !isTimeUp;
    submitButton.disabled = !isAnswered && !isTimeUp;
}

function goHome() {
    // Kembali ke halaman awal dari halaman skor.
    clearInterval(questionTimer);
    scoreScreen.classList.add('fade-out');
    setTimeout(() => {
        scoreScreen.style.display = 'none';
        mainContentWrapper.style.display = 'block';
        mainContentWrapper.classList.remove('fade-out');
    }, 400);
}

// --- Fungsi Timer ---
function startTimer() {
    // Memulai timer hitung mundur untuk setiap pertanyaan.
    clearInterval(questionTimer);
    timeLeft = 30;
    timeLeftElement.textContent = timeLeft;
    timerElement.classList.remove('time-warning');

    questionTimer = setInterval(() => {
        timeLeft--;
        timeLeftElement.textContent = timeLeft;
        if (timeLeft <= 10) {
            timerElement.classList.add('time-warning');
        }
        if (timeLeft <= 0) {
            clearInterval(questionTimer);
            handleTimeUp();
        }
    }, 1000);
}

function handleTimeUp() {
    // Aksi yang dijalankan saat waktu habis.
    timeUpAnswers[currentQuestionIndex] = true;
    if (currentQuestionIndex === quizData.length - 1) {
        submitQuiz();
    } else {
        nextQuestion();
    }
}

// --- Fungsi-fungsi Kuis ---
function startQuiz() {
    // Memulai kuis, mereset status, dan menampilkan pertanyaan pertama.
    mainContentWrapper.classList.add('fade-out');
    scoreScreen.classList.add('fade-out');
    setTimeout(() => {
        mainContentWrapper.style.display = 'none';
        scoreScreen.style.display = 'none';
        quizContainer.style.display = 'block';
        quizContainer.classList.remove('fade-out');
        currentQuestionIndex = 0;
        userAnswers.fill(null);
        timeUpAnswers.fill(false);
        displayQuestion();
    }, 400);
}

function displayQuestion() {
    // Menampilkan pertanyaan, pilihan jawaban, dan progress bar saat ini.
    const currentQuestion = quizData[currentQuestionIndex];
    const isTimeUp = timeUpAnswers[currentQuestionIndex];

    questionElement.textContent = currentQuestion.question;
    progressElement.textContent = `Pertanyaan ${currentQuestionIndex + 1} dari ${quizData.length}`;
    const progressPercentage = ((currentQuestionIndex + 1) / quizData.length) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    optionsContainer.innerHTML = '';
    const shuffledOptions = shuffleArray(currentQuestion.options);
    
    shuffledOptions.forEach(optionText => {
        const optionElement = document.createElement('div');
        optionElement.textContent = optionText;
        optionElement.classList.add('option');
        
        // Logika untuk menonaktifkan pilihan jika waktu habis
        if (isTimeUp) {
            optionElement.classList.add('disabled');
        } else {
            if (userAnswers[currentQuestionIndex] === optionText) {
                optionElement.classList.add('selected');
            }
            optionElement.addEventListener('click', () => selectOption(optionElement, optionText));
        }
        
        optionsContainer.appendChild(optionElement);
    });

    updateNavigationButtons();
    updateContinueButtonsState();
    
    // Hanya mulai timer jika soal belum pernah kehabisan waktu
    if (!isTimeUp) {
        startTimer();
    } else {
        timeLeftElement.textContent = '0';
        timerElement.classList.add('time-warning');
    }
}

function selectOption(optionElement, optionText) {
    // Mengatur logika saat pengguna memilih atau membatalkan pilihan jawaban.
    const allOptions = document.querySelectorAll('.option');
    allOptions.forEach(opt => opt.classList.remove('selected'));
    if (userAnswers[currentQuestionIndex] === optionText) {
        userAnswers[currentQuestionIndex] = null;
    } else {
        optionElement.classList.add('selected');
        userAnswers[currentQuestionIndex] = optionText;
    }
    updateContinueButtonsState();
}

function updateNavigationButtons() {
    // Menampilkan/menyembunyikan tombol navigasi (sebelumnya, selanjutnya, kirim).
    prevButton.hidden = currentQuestionIndex === 0;
    if (currentQuestionIndex === quizData.length - 1) {
        nextButton.style.display = 'none';
        submitButton.style.display = 'inline-block';
    } else {
        nextButton.style.display = 'inline-block';
        submitButton.style.display = 'none';
    }
}

function nextQuestion() {
    // Pindah ke pertanyaan berikutnya.
    clearInterval(questionTimer);
    if (currentQuestionIndex < quizData.length - 1) {
        quizContainer.classList.add('fade-out');
        setTimeout(() => {
            currentQuestionIndex++;
            displayQuestion();
            quizContainer.classList.remove('fade-out');
        }, 400);
    }
}

function prevQuestion() {
    // Kembali ke pertanyaan sebelumnya.
    clearInterval(questionTimer);
    if (currentQuestionIndex > 0) {
        quizContainer.classList.add('fade-out');
        setTimeout(() => {
            currentQuestionIndex--;
            displayQuestion();
            quizContainer.classList.remove('fade-out');
        }, 400);
    }
}

function submitQuiz() {
    // Mengakhiri kuis, menghitung skor, dan menampilkan hasilnya.
    clearInterval(questionTimer);
    quizContainer.classList.add('fade-out');
    setTimeout(() => {
        quizContainer.style.display = 'none';
        scoreScreen.style.display = 'block';
        scoreScreen.classList.remove('fade-out');
        let score = 0;
        userAnswers.forEach((answer, index) => {
            if (answer === quizData[index].answer) {
                score++;
            }
        });
        const finalScore = Math.round((score / quizData.length) * 100);
        animateScore(finalScore);
        correctAnswersElement.textContent = score;
        totalQuestionsElement.textContent = quizData.length;
        displayReview();
    }, 400);
}

function animateScore(finalScore) {
    // Membuat animasi hitung naik untuk skor akhir.
    let currentScore = 0;
    scoreElement.textContent = 0;
    if (finalScore === 0) return;
    const increment = finalScore / 50;
    const interval = setInterval(() => {
        currentScore += increment;
        if (currentScore >= finalScore) {
            currentScore = finalScore;
            clearInterval(interval);
        }
        scoreElement.textContent = Math.round(currentScore);
    }, 20);
}

function displayReview() {
    // Menampilkan ulasan jawaban benar dan salah setelah kuis selesai.
    reviewContainer.innerHTML = '';
    quizData.forEach((question, index) => {
        const reviewItem = document.createElement('div');
        reviewItem.classList.add('review-item');
        
        const userAnswer = userAnswers[index];
        const correctAnswer = question.answer;

        // BARU: Logika untuk menampilkan status jawaban
        let answerStatus = '';
        if (userAnswer === null) {
            if (timeUpAnswers[index]) {
                answerStatus = '<span class="review-status-timeup">Tidak Dijawab (Waktu Habis)</span>';
            } else {
                answerStatus = '<span class="review-status-skipped">Tidak Dijawab</span>';
            }
        }
        reviewItem.innerHTML = `<p>${index + 1}. ${question.question}</p>${answerStatus}`;

        question.options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('review-option');
            const textElement = document.createElement('span');
            textElement.textContent = option;
            optionElement.appendChild(textElement);
            if (option === correctAnswer) {
                optionElement.classList.add('correct-answer');
                const icon = document.createElement('i');
                icon.className = 'fas fa-check';
                optionElement.appendChild(icon);
            }
            if (option === userAnswer && userAnswer !== correctAnswer) {
                optionElement.classList.add('user-answer', 'incorrect');
                const icon = document.createElement('i');
                icon.className = 'fas fa-times';
                optionElement.appendChild(icon);
            }
            reviewItem.appendChild(optionElement);
        });
        reviewContainer.appendChild(reviewItem);
    });
}

// --- Event Listeners ---
startButton.addEventListener('click', startQuiz);
nextButton.addEventListener('click', nextQuestion);
prevButton.addEventListener('click', prevQuestion);
submitButton.addEventListener('click', submitQuiz);
restartButton.addEventListener('click', startQuiz);
backButton.addEventListener('click', goHome);