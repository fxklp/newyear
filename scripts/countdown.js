// countdown.js
let countdownInterval = null;
let countdownStarted = false;
let targetTime = new Date('2024-12-31T18:18:00').getTime();
let background2 = null;

function countdownStart() {
    console.log('countdownStart 函数被调用');

    const countdownContainer = document.getElementById('countdown-container');
    const gameContainer = document.getElementById('game-container');
    const memoryGame = document.getElementById('memory-game');
    const countdownTimer = document.getElementById('countdown-timer');
    const replayButton = document.getElementById('replay-game');

    // 初始化音频（只在第一次调用时）
    if (!background2) {
        background2 = new Audio('assets/sounds/background2.mp3');
        background2.loop = true;
        background2.volume = 0.5;
    }

    // 显示倒计时容器，隐藏游戏容器
    countdownContainer.classList.remove('hidden');
    gameContainer.classList.add('hidden');

    // 确保之前的音频已经停止
    if (background2.paused) {
        background2.play().catch(error => {
            console.error('倒计时背景音乐播放失败:', error);
        });
    }

    // 更新倒计时显示
    function updateCountdown() {
        const now = new Date().getTime();
        const remainingTime = targetTime - now;

        if (remainingTime <= 0) {
            clearInterval(countdownInterval);
            // 在清除倒计时后，稍微延迟停止音频，避免状态切换太快
            setTimeout(() => {
                if (background2) {
                    background2.pause();
                    background2.currentTime = 0;
                }
                showCelebrateButton(); // 直接转到庆祝按钮部分
            }, 100);
            return;
        }

        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
        const seconds = Math.floor((remainingTime / 1000) % 60);

        countdownTimer.textContent = `距元旦还有：${days}天 ${hours}小时 ${minutes}分钟 ${seconds}秒`;
    }

    // 显示庆祝按钮
    function showCelebrateButton() {
        const fireworkContainer = document.getElementById('firework-container');
        const celebrateButton = document.getElementById('celebrate-button');

        // 隐藏倒计时容器
        countdownContainer.classList.add('hidden');

        // 显示烟花容器和庆祝按钮
        fireworkContainer.classList.remove('hidden');
        celebrateButton.style.display = 'block';

        // 调用 setupCelebrateButton 函数重新绑定事件监听器
        window.setupCelebrateButton();
        console.log('庆祝按钮和烟花容器已显示');
    }

    // 重置并启动倒计时
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();  // 立即更新显示

    // 重玩游戏按钮
    replayButton.addEventListener('click', () => {
        if (background2) {
            background2.pause();
            background2.currentTime = 0;
        }
        countdownContainer.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        memoryGame.classList.add('hidden');
        const startButton = document.getElementById('start-game');
        startButton.classList.remove('hidden');
    });
}

function stopCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
    if (background2) {
        background2.pause();
        background2.currentTime = 0;
    }
    countdownStarted = false;
}
