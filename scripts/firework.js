// firework.js
let background3 = null;
let fireworkSound = null;
let fireworks = null;
let celebrationInProgress = false;
let originalBackground = null; // 保存原始背景

// 将初始化逻辑独立出来
function initFireworks() {
    console.log('初始化烟花相关内容');

    // 预加载音频
    if (!background3) {
        background3 = new Audio('assets/sounds/background3.mp3');
        background3.volume = 0.5;
    }

    if (!fireworkSound) {
        fireworkSound = new Audio('assets/sounds/fireworks-sound.mp3');
        fireworkSound.volume = 0.7;
    }
}

// 在 DOMContentLoaded 时进行初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('firework.js 加载完成');
    initFireworks();
});

// 独立的庆祝按钮事件监听器设置函数
function setupCelebrateButton() {
    const celebrateButton = document.getElementById('celebrate-button');
    if (celebrateButton) {
        celebrateButton.replaceWith(celebrateButton.cloneNode(true));
        const newCelebrateButton = document.getElementById('celebrate-button');
        newCelebrateButton.addEventListener('click', startCelebration);
        console.log('庆祝按钮事件监听器已设置');
    }
}

async function startCelebration() {
    if (celebrationInProgress) {
        console.log('庆祝已经在进行中');
        return;
    }

    console.log('开始庆祝');
    celebrationInProgress = true;

    const celebrateButton = document.getElementById('celebrate-button');
    const fireworksDiv = document.getElementById('fireworks');
    const romanticMessage = document.getElementById('romantic-message');
    const fireworkContainer = document.getElementById('firework-container');
    const messageTexts = document.querySelectorAll('.message-text');

    try {
        // 保存原始背景
        originalBackground = document.body.style.backgroundImage;

        // 隐藏按钮并设置黑色背景
        celebrateButton.style.display = 'none';
        fireworkContainer.classList.add('celebrating');

        // 播放烟花音效
        try {
            fireworkSound.currentTime = 0;
            await fireworkSound.play();
        } catch (error) {
            console.error('烟花音效播放失败:', error);
        }

        // 初始化并启动烟花
        if (!fireworks) {
            fireworks = new Fireworks.default(fireworksDiv, {
                autoresize: true,
                opacity: 0.5,
                acceleration: 1.05,
                friction: 0.97,
                gravity: 1.5,
                particles: 200, // 增加粒子数量
                explosion: 20, // 增大爆炸范围
                intensity: 100, // 提高强度
                scale: 2.0, // 放大烟花效果
                // 其他参数...
            });
        }

        fireworks.start();
        console.log('烟花动画开始');

        // 10秒后切换到背景音乐和文案
        setTimeout(async () => {
            if (fireworks) {
                fireworks.stop();
            }
            if (fireworkSound) {
                fireworkSound.pause();
                fireworkSound.currentTime = 0;
            }

            // 设置背景音乐不循环
            background3.loop = false;

            try {
                background3.currentTime = 0;
                await background3.play();
                console.log('背景音乐3开始播放');
            } catch (error) {
                console.error('背景音乐3播放失败:', error);
            }

            // 显示文案容器
            romanticMessage.style.display = 'block';
            romanticMessage.classList.remove('hidden');

            // 开始逐条显示文案
            showNextMessage(0, messageTexts, 4000); // 从第0条开始，每条显示4秒

            // 监听背景音乐结束事件
            background3.addEventListener('ended', () => {
                // 隐藏所有文案
                messageTexts.forEach(text => {
                    text.style.display = 'none';
                });
                romanticMessage.classList.add('hidden');

                // 恢复初始状态
                document.body.style.backgroundImage = originalBackground;
                celebrateButton.style.display = 'block';
                celebrateButton.disabled = false;
                celebrationInProgress = false;
                console.log('庆祝过程结束');
            });
        }, 15000); // 延长烟花时长至20秒

    } catch (error) {
        console.error('庆祝过程出错:', error);
        celebrationInProgress = false;
        celebrateButton.disabled = false;
    }
}

function showNextMessage(index, messages, duration) {
    if (index >= messages.length) return;

    const currentText = messages[index];
    currentText.style.display = 'block';

    if (index < 8) { // 前八条文案
        currentText.classList.add('slide-in');
    } else { // 后七条文案
        currentText.classList.add('pop-in');
    }

    if (index < messages.length - 1) {
        setTimeout(() => {
            currentText.classList.remove('slide-in', 'pop-in');
            currentText.style.opacity = 0; // 仅淡出，不再滑动
            setTimeout(() => {
                currentText.style.display = 'none';
                showNextMessage(index + 1, messages, duration);
            }, 500); // 0.5秒确保动画结束
        }, duration);
    } else {
        // 最后一句，持续显示直到背景音乐结束
        document.body.style.backgroundImage = 'url("assets/images/background.png")';
    }
}

window.setupCelebrateButton = setupCelebrateButton;