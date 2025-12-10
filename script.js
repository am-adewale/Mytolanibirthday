// ============================================
// LOGIN FUNCTIONALITY
// ============================================

const CORRECT_EMAIL = 'temiladeadenola267@gmail.com';
const CORRECT_PASSWORD = 'mytolani';

const loginPage = document.getElementById('loginPage');
const mainContent = document.getElementById('mainContent');
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

// Handle login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    // Check credentials
    if (email === CORRECT_EMAIL && password === CORRECT_PASSWORD) {
        // Success - hide login and show main content
        loginPage.classList.add('hidden');
        mainContent.classList.remove('hidden');
        errorMessage.textContent = '';
        
        // Start confetti and other animations
        startConfetti();
        startCountdown();
        initializeCarousel();
        initializeQuiz();
        
        // Auto-play background music after login (user interaction allows this)
        const backgroundMusic = document.getElementById('backgroundMusic');
        const musicToggle = document.getElementById('musicToggle');
        
        if (backgroundMusic) {
            // Set volume to 70%
            backgroundMusic.volume = 0.7;
            
            // Try to play immediately after login (user interaction allows autoplay)
            const playPromise = backgroundMusic.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Audio is playing successfully
                    if (musicToggle) {
                        musicToggle.textContent = '🎵 Pause Music';
                        isPlaying = true;
                    }
                }).catch(error => {
                    // Auto-play was prevented, but that's okay
                    console.log('Auto-play prevented, user can click button:', error);
                    if (musicToggle) {
                        musicToggle.textContent = '🎵 Play Music';
                    }
                });
            }
        }
    } else {
        // Show error message
        errorMessage.textContent = 'Are you sure it\'s you, my love? Try again ❤';
        errorMessage.style.animation = 'shake 0.5s';
        
        // Reset form
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
    }
});

// Shake animation for error
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// ============================================
// CONFETTI ANIMATION
// ============================================

function startConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confetti = [];
    const colors = ['#ff6b9d', '#c77dff', '#ffb3d9', '#e8b4b8', '#ffd700', '#ff69b4'];
    
    // Create confetti particles
    for (let i = 0; i < 150; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 6 + 4,
            d: Math.random() * confetti.length,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.floor(Math.random() * 10) - 10,
            tiltAngleIncrement: Math.random() * 0.07 + 0.05,
            tiltAngle: 0
        });
    }
    
    function drawConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confetti.forEach((c, i) => {
            ctx.beginPath();
            ctx.lineWidth = c.r / 2;
            ctx.strokeStyle = c.color;
            ctx.moveTo(c.x + c.tilt + c.r, c.y);
            ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r);
            ctx.stroke();
            
            c.tiltAngle += c.tiltAngleIncrement;
            c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2;
            c.tilt = Math.sin(c.tiltAngle - i / 3) * 15;
            
            if (c.y > canvas.height) {
                confetti[i] = {
                    x: Math.random() * canvas.width,
                    y: -20,
                    r: c.r,
                    d: c.d,
                    color: c.color,
                    tilt: Math.floor(Math.random() * 10) - 10,
                    tiltAngleIncrement: c.tiltAngleIncrement,
                    tiltAngle: 0
                };
            }
        });
        
        requestAnimationFrame(drawConfetti);
    }
    
    drawConfetti();
    
    // Stop confetti after 10 seconds
    setTimeout(() => {
        // Gradually fade out
        let opacity = 1;
        const fadeInterval = setInterval(() => {
            opacity -= 0.05;
            canvas.style.opacity = opacity;
            if (opacity <= 0) {
                clearInterval(fadeInterval);
                canvas.style.display = 'none';
            }
        }, 50);
    }, 10000);
}

// Resize canvas on window resize
window.addEventListener('resize', () => {
    const canvas = document.getElementById('confettiCanvas');
    if (canvas && !canvas.classList.contains('hidden')) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});

// ============================================
// COUNTDOWN TIMER
// ============================================

function startCountdown() {
    // Birthday date: December 11, 2025 at 12:00 AM (midnight)
    // Month is 0-indexed, so 11 = December
    const birthday = new Date(2025, 11, 11, 0, 0, 0);
    
    // End date: December 12, 2025 at 12:00 AM (midnight) - when countdown stops
    const birthdayEnd = new Date(2025, 11, 12, 0, 0, 0);
    
    function updateCountdown() {
        const now = new Date().getTime();
        const birthdayTime = birthday.getTime();
        const endTime = birthdayEnd.getTime();
        
        // If we're past the end date (Dec 12, 2025 12:00 AM), stop the countdown
        if (now >= endTime) {
            document.getElementById('days').textContent = '0';
            document.getElementById('hours').textContent = '0';
            document.getElementById('minutes').textContent = '0';
            document.getElementById('seconds').textContent = '0';
            return; // Stop updating
        }
        
        // If we're on the birthday day (Dec 11, 2025 12:00 AM to Dec 12, 2025 12:00 AM)
        if (now >= birthdayTime && now < endTime) {
            // It's her birthday! Show all zeros
            document.getElementById('days').textContent = '0';
            document.getElementById('hours').textContent = '0';
            document.getElementById('minutes').textContent = '0';
            document.getElementById('seconds').textContent = '0';
            return; // Continue updating until endTime
        }
        
        // Countdown to birthday (before Dec 11, 2025 12:00 AM)
        const distance = birthdayTime - now;
        
        if (distance < 0) {
            // Shouldn't happen with the checks above, but safety check
            document.getElementById('days').textContent = '0';
            document.getElementById('hours').textContent = '0';
            document.getElementById('minutes').textContent = '0';
            document.getElementById('seconds').textContent = '0';
            return;
        }
        
        // Calculate time remaining
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Update display
        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours;
        document.getElementById('minutes').textContent = minutes;
        document.getElementById('seconds').textContent = seconds;
    }
    
    // Update immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ============================================
// FLIP CARDS (MESSAGES)
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const messageCards = document.querySelectorAll('.message-card');
    
    messageCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });
});

// ============================================
// CAROUSEL FUNCTIONALITY
// ============================================

function initializeCarousel() {
    const track = document.getElementById('carouselTrack');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('carouselDots');
    
    let currentSlide = 0;
    
    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    function updateCarousel() {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update dots
        document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    function goToSlide(index) {
        currentSlide = index;
        updateCarousel();
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateCarousel();
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateCarousel();
    }
    
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Auto-play carousel
    setInterval(nextSlide, 5000);
}

// ============================================
// QUIZ FUNCTIONALITY
// ============================================

const quizQuestions = [
    {
        question: 'What is my favorite color?',
        options: ['Pink', 'Purple', 'Blue', 'Green'],
        correct: 0
    },
    {
        question: 'What do I love most about you?',
        options: ['Your smile', 'Your kindness', 'Everything', 'Your sense of humor'],
        correct: 2
    },
    {
        question: 'What makes me happiest?',
        options: ['Seeing you happy', 'Chocolate', 'Movies', 'Shopping'],
        correct: 0
    },
    {
        question: 'What is our favorite thing to do together?',
        options: ['Watch movies', 'yunkin yunkin😂', 'Talk for hours', 'All of the above', 'none of the above'],
        correct: 3
    },
    {
        question: 'How much do I love you?',
        options: ['A lot', 'More than words can say', 'To the moon and back', 'All of the above'],
        correct: 3
    }
];

let currentQuestionIndex = 0;
let score = 0;

function initializeQuiz() {
    showQuestion();
    
    document.getElementById('nextQuestionBtn').addEventListener('click', () => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            currentQuestionIndex++;
            showQuestion();
        } else {
            showResults();
        }
    });
    
    document.getElementById('restartQuizBtn').addEventListener('click', () => {
        currentQuestionIndex = 0;
        score = 0;
        document.getElementById('quizContent').classList.remove('hidden');
        document.getElementById('quizResults').classList.add('hidden');
        showQuestion();
    });
}

function showQuestion() {
    const question = quizQuestions[currentQuestionIndex];
    const questionEl = document.getElementById('quizQuestion');
    const optionsEl = document.getElementById('quizOptions');
    const feedbackEl = document.getElementById('quizFeedback');
    const nextBtn = document.getElementById('nextQuestionBtn');
    
    questionEl.textContent = question.question;
    feedbackEl.textContent = '';
    feedbackEl.className = 'quiz-feedback';
    nextBtn.classList.add('hidden');
    
    optionsEl.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionEl = document.createElement('div');
        optionEl.classList.add('quiz-option');
        optionEl.textContent = option;
        optionEl.addEventListener('click', () => selectOption(index, optionEl));
        optionsEl.appendChild(optionEl);
    });
}

function selectOption(selectedIndex, optionEl) {
    const question = quizQuestions[currentQuestionIndex];
    const options = document.querySelectorAll('.quiz-option');
    const feedbackEl = document.getElementById('quizFeedback');
    const nextBtn = document.getElementById('nextQuestionBtn');
    
    // Disable all options
    options.forEach(opt => {
        opt.classList.add('disabled');
        opt.style.pointerEvents = 'none';
    });
    
    // Check answer
    if (selectedIndex === question.correct) {
        optionEl.classList.add('correct');
        feedbackEl.textContent = 'Correct! I know you so well! ❤️';
        feedbackEl.classList.add('correct');
        score++;
    } else {
        optionEl.classList.add('incorrect');
        options[question.correct].classList.add('correct');
        feedbackEl.textContent = 'Almost! But I still love you! 💕';
        feedbackEl.classList.add('incorrect');
    }
    
    nextBtn.classList.remove('hidden');
}

function showResults() {
    const quizContent = document.getElementById('quizContent');
    const quizResults = document.getElementById('quizResults');
    const quizScore = document.getElementById('quizScore');
    
    quizContent.classList.add('hidden');
    quizResults.classList.remove('hidden');
    
    const percentage = (score / quizQuestions.length) * 100;
    let message = '';
    
    if (percentage === 100) {
        message = 'Perfect! You know me inside and out! I love you so much! 💕💕💕';
    } else if (percentage >= 80) {
        message = `Amazing! You got ${score} out of ${quizQuestions.length} correct! I really know you well! ❤️`;
    } else if (percentage >= 60) {
        message = `Good job! You got ${score} out of ${quizQuestions.length} correct! Keep learning about you! 💖`;
    } else {
        message = `You got ${score} out of ${quizQuestions.length} correct! But that's okay, we have forever to learn about each other! 💕`;
    }
    
    quizScore.textContent = message;
}

// ============================================
// BACKGROUND MUSIC
// ============================================

let isPlaying = false;
const musicToggle = document.getElementById('musicToggle');
const backgroundMusic = document.getElementById('backgroundMusic');

// Initialize music functionality
if (musicToggle && backgroundMusic) {
    // Set initial volume to 70%
    backgroundMusic.volume = 0.7;
    
    // Music toggle button click handler
    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            backgroundMusic.pause();
            musicToggle.textContent = '🎵 Play Music';
            isPlaying = false;
        } else {
            const playPromise = backgroundMusic.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    musicToggle.textContent = '🎵 Pause Music';
                    isPlaying = true;
                }).catch(err => {
                    console.log('Audio play failed:', err);
                    musicToggle.textContent = '🎵 Music Error';
                    alert('Unable to play music. Please check the audio file.');
                });
            }
        }
    });
    
    // Update button state when audio plays
    backgroundMusic.addEventListener('play', () => {
        isPlaying = true;
        if (musicToggle) {
            musicToggle.textContent = '🎵 Pause Music';
        }
    });
    
    // Update button state when audio pauses
    backgroundMusic.addEventListener('pause', () => {
        isPlaying = false;
        if (musicToggle) {
            musicToggle.textContent = '🎵 Play Music';
        }
    });
    
    // Handle audio loading errors
    backgroundMusic.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        if (musicToggle) {
            musicToggle.textContent = '🎵 File Not Found';
        }
        alert('Music file not found. Please ensure "Stephen_Sanchez_-_Until_I_Found_You_(mp3.pm).mp3" is in the project folder.');
    });
    
    // Handle when audio can play (loaded successfully)
    backgroundMusic.addEventListener('canplay', () => {
        console.log('Audio file loaded successfully');
    });
}

// ============================================
// SURPRISE MODAL WITH IMAGE GALLERY
// ============================================

const surpriseBtn = document.getElementById('surpriseBtn');
const surpriseModal = document.getElementById('surpriseModal');
const imageGalleryOverlay = document.getElementById('imageGalleryOverlay');
const imageGalleryContent = document.getElementById('imageGalleryContent');
const surpriseConfettiCanvas = document.getElementById('surpriseConfettiCanvas');
const galleryCloseBtn = document.getElementById('galleryCloseBtn');
const modalClose = document.querySelector('.modal-close');

// List of images to display
const surpriseImages = [
    'img 1.jpg',
    'img 4.jpg',
    'img 3.jpg',
    'img 5.jpg',
    'img 6.jpg'
];

// Animation types for variety
const animationTypes = ['fadeIn', 'zoomIn', 'slideLeft', 'slideRight', 'rotateIn'];

let currentImageIndex = 0;
let surpriseConfettiAnimationId = null;

// Function to close image gallery
function closeImageGallery() {
    imageGalleryOverlay.classList.add('hidden');
    stopSurpriseConfetti();
    document.body.style.overflow = 'auto';
    currentImageIndex = 0;
    imageGalleryContent.innerHTML = '';
}

// Start the surprise sequence
surpriseBtn.addEventListener('click', () => {
    // Reset
    currentImageIndex = 0;
    imageGalleryContent.innerHTML = '';
    
    // Show image gallery overlay
    imageGalleryOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    galleryCloseBtn.style.display = 'none'; // Hide close button during animation
    
    // Start confetti animation (runs for 15 seconds)
    startSurpriseConfetti();
    
    // Start showing images
    showNextImage();
});

// Close gallery button
galleryCloseBtn.addEventListener('click', () => {
    closeImageGallery();
});

function showNextImage() {
    if (currentImageIndex >= surpriseImages.length) {
        // All images shown, now show the message
        setTimeout(() => {
            closeImageGallery();
            surpriseModal.classList.remove('hidden');
        }, 1000);
        return;
    }
    
    const imagePath = surpriseImages[currentImageIndex];
    const animationType = animationTypes[currentImageIndex % animationTypes.length];
    
    // Create image element
    const img = document.createElement('img');
    img.src = imagePath;
    img.className = `surprise-image ${animationType}`;
    img.alt = `Memory ${currentImageIndex + 1}`;
    
    // Clear previous image and add new one
    imageGalleryContent.innerHTML = '';
    imageGalleryContent.appendChild(img);
    
    // Add romantic text overlay
    const textOverlay = document.createElement('div');
    textOverlay.className = 'image-text-overlay';
    const messages = [
        'You are beautiful 😍😘',
        'Amazing',
        'Hot 🔥',
        'I love your smile 😊',
        'Cold 🥶'
    ];
    textOverlay.textContent = messages[currentImageIndex] || 'I love you ❤';
    imageGalleryContent.appendChild(textOverlay);
    
    currentImageIndex++;
    
    // Show next image after 3 seconds
    setTimeout(showNextImage, 3000);
}

// Confetti animation for surprise button (runs for 15 seconds)
function startSurpriseConfetti() {
    const canvas = surpriseConfettiCanvas;
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confetti = [];
    const colors = ['#f8b8d0', '#d4a5e8', '#f4c2c2', '#f5c2d1', '#c9a8e0', '#f0b8b8', '#fce4ec'];
    
    // Create confetti particles
    for (let i = 0; i < 200; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 6 + 4,
            d: Math.random() * confetti.length,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.floor(Math.random() * 10) - 10,
            tiltAngleIncrement: Math.random() * 0.07 + 0.05,
            tiltAngle: 0
        });
    }
    
    function drawConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confetti.forEach((c, i) => {
            ctx.beginPath();
            ctx.lineWidth = c.r / 2;
            ctx.strokeStyle = c.color;
            ctx.moveTo(c.x + c.tilt + c.r, c.y);
            ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r);
            ctx.stroke();
            
            c.tiltAngle += c.tiltAngleIncrement;
            c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2;
            c.tilt = Math.sin(c.tiltAngle - i / 3) * 15;
            
            if (c.y > canvas.height) {
                confetti[i] = {
                    x: Math.random() * canvas.width,
                    y: -20,
                    r: c.r,
                    d: c.d,
                    color: c.color,
                    tilt: Math.floor(Math.random() * 10) - 10,
                    tiltAngleIncrement: c.tiltAngleIncrement,
                    tiltAngle: 0
                };
            }
        });
        
        surpriseConfettiAnimationId = requestAnimationFrame(drawConfetti);
    }
    
    drawConfetti();
    
    // Stop confetti after 15 seconds
    setTimeout(() => {
        stopSurpriseConfetti();
    }, 15000);
}

function stopSurpriseConfetti() {
    if (surpriseConfettiAnimationId) {
        cancelAnimationFrame(surpriseConfettiAnimationId);
        surpriseConfettiAnimationId = null;
    }
    if (surpriseConfettiCanvas) {
        const ctx = surpriseConfettiCanvas.getContext('2d');
        ctx.clearRect(0, 0, surpriseConfettiCanvas.width, surpriseConfettiCanvas.height);
    }
}

// Resize canvas on window resize
window.addEventListener('resize', () => {
    if (surpriseConfettiCanvas && !imageGalleryOverlay.classList.contains('hidden')) {
        surpriseConfettiCanvas.width = window.innerWidth;
        surpriseConfettiCanvas.height = window.innerHeight;
    }
});

// Modal close handlers
modalClose.addEventListener('click', () => {
    surpriseModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
});

surpriseModal.addEventListener('click', (e) => {
    if (e.target === surpriseModal) {
        surpriseModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (!surpriseModal.classList.contains('hidden')) {
            surpriseModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
        if (!imageGalleryOverlay.classList.contains('hidden')) {
            closeImageGallery();
        }
    }
});

// ============================================
// SMOOTH SCROLLING
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================

// Only initialize main content features if login is successful
// These will be called from the login success handler

