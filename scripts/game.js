// src/scripts/game.js

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-game');
    const gameContainer = document.getElementById('game-container');
    const memoryGame = document.getElementById('memory-game');
    const cardsGrid = document.querySelector('.cards-grid');
    const backgroundMusic = new Audio('assets/sounds/background1.mp3');
    const flipSound = new Audio('assets/sounds/flip.mp3'); // 翻牌音效
    backgroundMusic.loop = true;

    let cards = [];
    let flippedCards = [];
    let matchedCards = 0;
    let gameOver = false;

    // 初始化游戏
    function initGame() {
        console.log('初始化游戏'); // 调试信息
        cards = [];
        flippedCards = [];
        matchedCards = 0;
        gameOver = false;
        cardsGrid.innerHTML = '';

        // 创建卡片数组（每张图片两次）
        const images = [];
        for (let i = 1; i <= 9; i++) { // 目前只用两张图片，你可以根据需要增加
            images.push(`assets/images/image${i}.png`);
            images.push(`assets/images/image${i}.png`);
        }

        // 打乱数组
        images.sort(() => 0.5 - Math.random());

        // 创建卡片
        images.forEach((imgSrc) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.image = imgSrc;

            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">
                        <img src="${imgSrc}" alt="Card Image" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div class="card-back">
                        <img src="assets/images/back.png" alt="Back Image" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                </div>
            `;

            card.addEventListener('click', flipCard);
            cardsGrid.appendChild(card);
            cards.push(card);
        });
    }

    // 翻转卡片
    function flipCard() {
        if (gameOver) return; // 防止游戏结束后继续翻牌
        if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
            this.classList.add('flipped');
            flippedCards.push(this);

            // 播放翻牌声音
            playFlipSound();

            if (flippedCards.length === 2) {
                checkForMatch();
            }
        }
    }

    // 播放翻牌音效
    function playFlipSound() {
        flipSound.currentTime = 0; // 从头播放
        flipSound.play().catch((error) => {
            console.error('音效播放失败:', error);
        });
    }

    // 检查是否匹配
    function checkForMatch() {
        const [card1, card2] = flippedCards;
        if (card1.dataset.image === card2.dataset.image) {
            matchedCards += 2;
            flippedCards = [];
            console.log(`匹配成功，已匹配 ${matchedCards} 张卡片`);

            // 如果所有卡片都匹配成功，显示完成提示并进行延时跳转
            if (matchedCards === cards.length) {
                gameOver = true; // 设置游戏结束标志
                setTimeout(() => {
                    showCompletionMessage(); // 显示完成提示
                }, 500); // 等待0.5秒后显示完成提示
            }
        } else {
            console.log('匹配失败，翻回卡片');
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
            }, 1000);
        }
    }

    // 显示完成提示
    function showCompletionMessage() {
        const completionMessage = document.createElement('div');
        completionMessage.textContent = '恭喜完成所有配对！🌟';

        completionMessage.style.position = 'fixed';
        completionMessage.style.top = '50%';
        completionMessage.style.left = '40%';
        completionMessage.style.transform = 'translate(-50%, -50%)';
        completionMessage.style.fontSize = '30px';
        completionMessage.style.fontWeight = 'bold';
        completionMessage.style.color = '#fff';
        completionMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        completionMessage.style.padding = '20px 40px';
        completionMessage.style.borderRadius = '15px';
        completionMessage.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
        completionMessage.style.zIndex = '5001'; // 确保提示在其他元素上方
        completionMessage.classList.add('animated', 'bounceIn'); // 使用动画类库

        document.body.appendChild(completionMessage);

        setTimeout(() => {
            document.body.removeChild(completionMessage); // 2秒后移除提示
            endGame(); // 结束游戏
        }, 2000);
    }


    function endGame() {
        console.log('游戏结束，调用 countdownStart()');
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;

        // 隐藏游戏容器
        memoryGame.classList.add('hidden');

        // 直接调用 countdownStart，不传递参数
        countdownStart();
    }

    // 开始游戏
    startButton.addEventListener('click', () => {
        console.log('开始游戏按钮被点击'); // 调试信息
        startButton.classList.add('hidden'); // 隐藏开始按钮
        memoryGame.classList.remove('hidden'); // 显示 memoryGame
        initGame();
        backgroundMusic.play().catch((error) => {
            console.error('背景音乐播放失败:', error);
        });
    });

    // 重玩游戏按钮（在倒计时界面）
    const replayButton = document.getElementById('replay-game');
    replayButton.addEventListener('click', () => {
        console.log('重玩游戏按钮被点击'); // 调试信息
        // 隐藏倒计时容器
        const countdownContainer = document.getElementById('countdown-container');
        countdownContainer.classList.remove('visible');
        countdownContainer.classList.add('hidden');

        // 重置游戏状态，不影响倒计时
        gameOver = false;
        memoryGame.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        initGame();
        backgroundMusic.play().catch((error) => {
            console.error('背景音乐播放失败:', error);
        });
    });

    // 重玩游戏按钮（在游戏结束界面，如果需要）
    const replayButtonEnd = document.getElementById('replay-game-end');
    if (replayButtonEnd) {
        replayButtonEnd.addEventListener('click', () => {
            console.log('重玩游戏按钮被点击（结束界面）'); // 调试信息
            // 隐藏游戏结束容器
            const gameOverContainer = document.getElementById('game-over');
            gameOverContainer.classList.remove('visible');
            gameOverContainer.classList.add('hidden');

            // 重置游戏状态
            gameOver = false;
            gameContainer.classList.remove('hidden');
            memoryGame.classList.add('hidden');
            initGame();
            backgroundMusic.play().catch((error) => {
                console.error('背景音乐播放失败:', error);
            });
        });
    }
});
