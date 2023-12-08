document.addEventListener('DOMContentLoaded', function () {
    // DOM elements
    const progressBar = document.querySelector('#round');
    const progressBarNumber = progressBar.querySelector('.value');
    const PomodoroBtn = document.querySelector('#btn');
    const shortBreakBtn = document.querySelector('#shortBreak');

    // Audio setup and timer constants
    const audio = new Audio('assets/sounds/cling.mp3');
    const defaultTime = 3600;
    const shortBreakTime = 600;
    const defaultTimer = 'POMODORO';
    const shortBreakTimer = 'SHORTBREAK';

    // Timer variables
    let progressInterval;
    let pomodoroType = defaultTimer; // Set initial value directly
    let timerValue = defaultTime;
    let multiplierFactor = 360 / timerValue;

    // Update the progress bar with formatted time
    const updateProgressBar = () => {
        progressBarNumber.textContent = `${numberToString(timerValue)}`;
        progressBar.style.background = `conic-gradient(${timerValue * multiplierFactor}deg, var(--purple) 0deg)`;
    };

    // Format seconds into MM:SS string
    const numberToString = (number) => {
        const minutes = Math.trunc(number / 60).toString().padStart(2, '0');
        const seconds = Math.trunc(number % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    // Start the timer
    const startTimer = () => {
        stopTimer(); // Stop any existing timers
        progressInterval = setInterval(() => {
            timerValue--;
            progressInfo();
        }, 1000);
    };

    // Stop the timer
    const stopTimer = () => {
        clearInterval(progressInterval);
    };

    // Reset the timer
    const resetTimer = () => {
        stopTimer();
        timerValue = pomodoroType === defaultTimer ? defaultTime : shortBreakTime;
        multiplierFactor = 360 / timerValue;
        progressInfo();
        audio.pause();
        audio.currentTime = 0; // Reset audio to the beginning
    };

    // Update the progress bar and check for timer completion
    const progressInfo = () => {
        if (timerValue === 0) {
            stopTimer();
            audio.play();
        }
        updateProgressBar();
    };

    // Function to toggle between dark and light themes
    const toggleTheme = () => {
        document.body.classList.toggle('dark-theme');
        const isDarkTheme = document.body.classList.contains('dark-theme');
        localStorage.setItem('isDarkTheme', isDarkTheme);
        
        // Change the moon/sun icon based on the theme
        const themeIcon = document.getElementById('theme-button');
        if (themeIcon) {
            themeIcon.classList.toggle('uil-sun', !isDarkTheme);
            themeIcon.classList.toggle('uil-moon', isDarkTheme);
        }
        
        // Add any additional elements that need to switch between dark and light themes
    };

    // Event listener for the theme button
    const themeButton = document.querySelector('#theme-button');
    if (themeButton) {
        themeButton.addEventListener('click', toggleTheme);
    } else {
        console.error("Theme button not found!");
    }

    // Check user's theme preference from localStorage
    const isDarkTheme = localStorage.getItem('isDarkTheme') === 'true';
    if (isDarkTheme) {
        document.body.classList.add('dark-theme');
        themeButton.classList.add('uil-moon');
    }

    // Change the Pomodoro timer type
    const changePomodoroType = (type) => {
        pomodoroType = type;

        // Toggle button styles based on the selected type
        if (PomodoroBtn && shortBreakBtn) {
            PomodoroBtn.classList.toggle('active', type === defaultTimer);
            shortBreakBtn.classList.toggle('active', type === shortBreakTimer);
        }

        resetTimer(); // Reset the timer when the type changes
    };

    // Event listeners for Pomodoro and Short Break buttons
    PomodoroBtn.addEventListener('click', () => changePomodoroType(defaultTimer));
    shortBreakBtn.addEventListener('click', () => changePomodoroType(shortBreakTimer));

    // Event listeners for Start, Stop, and Reset buttons
    document.querySelector('.start').addEventListener('click', startTimer);
    document.querySelector('.stop').addEventListener('click', stopTimer);

    // Ensure your reset button has the class 'reset' in your HTML
    const resetButton = document.querySelector('.reset');
    if (resetButton) {
        resetButton.addEventListener('click', resetTimer);
    } else {
        console.error("Reset button not found!");
    }
});