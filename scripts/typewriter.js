// scripts/typewriter.js

function startTypewriter() {
    const messages = [
        '唯愿烟花像星辰，祝你所愿皆成真',
        '我与旧事归于尽，来年依旧桃花开',
        '山一程水一程，总会有人与你一道过一程',
        '我会与你一道过一程',
        '唯愿年年岁岁常康健，岁岁年年常相见',
        '唯愿星河绚烂，所见即所念',
        'ʸᵒᵘ ᵃʳᵉ ᵗʰᵉ ᵒⁿˡʸ ᵇᵉˢᵗ ᶠᵒʳ ᵐᵉ.',
        '于我而言，你是最好且是唯一❤️'
    ];

    const typewriterText = document.getElementById('typewriter-text');
    const cursor = document.getElementById('cursor');
    let messageIndex = 0;
    let charIndex = 0;
    const typingSpeed = 100; // 每个字符的间隔时间（毫秒）

    function typeMessage() {
        if (messageIndex < messages.length) {
            const currentMessage = messages[messageIndex];
            if (charIndex < currentMessage.length) {
                typewriterText.innerHTML += currentMessage.charAt(charIndex);
                charIndex++;
                setTimeout(typeMessage, typingSpeed);
            } else {
                // 完成当前消息后，清除并显示下一个消息
                setTimeout(() => {
                    typewriterText.innerHTML = '';
                    messageIndex++;
                    charIndex = 0;
                    setTimeout(typeMessage, typingSpeed);
                }, 1000); // 每条消息之间的间隔时间
            }
        } else {
            // 所有消息完成后，隐藏打字机容器并显示浪漫消息
            document.getElementById('typewriter-container').classList.add('hidden');
            document.getElementById('firework-container').classList.remove('celebrating'); // 根据需要调整
            // 触发浪漫消息的动画（如果需要）
        }
    }

    typeMessage();
}

// 将 startTypewriter 函数暴露到全局，以便在其他脚本中调用
window.startTypewriter = startTypewriter;
