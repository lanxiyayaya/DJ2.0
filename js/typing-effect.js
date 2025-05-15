document.addEventListener('DOMContentLoaded', function() {
    // 标题文本 - 正确处理引号和特殊字符
    const titleText = '"我们破茧而并非成蝶"：博士生的"延"不由衷';
    const titleElement = document.getElementById('typing-title');
    const authorsElement = document.getElementById('authors');
    const continueHintElement = document.getElementById('continue-hint');
    const cursor = document.querySelector('.cursor');
    
    let charIndex = 0;
    let isComplete = false;
    
    // 打字效果函数
    function typeTitle() {
        if (charIndex < titleText.length) {
            // 获取当前字符
            const currentChar = titleText.charAt(charIndex);
            
            // 添加字符到标题
            titleElement.innerHTML += currentChar;
            charIndex++;
            
            // 调整光标位置 - 使用更可靠的方法
            setTimeout(() => {
                cursor.style.left = (titleElement.offsetWidth) + 'px';
                cursor.style.right = 'auto';
            }, 0);
            
            // 根据当前字符调整打字速度
            let typingSpeed = 150;
            
            // 如果是当前字符是标点符号，则下一个字符前停顿时间长一些
            if ('，。：、""《》？！'.includes(currentChar)) {
                typingSpeed = 400;
            }
            
            setTimeout(typeTitle, typingSpeed);
        } else {
            // 打字完成后，显示作者信息
            isComplete = true;
            
            // 确保光标位置正确
            cursor.style.left = (titleElement.offsetWidth) + 'px';
            
            // 显示作者信息
            setTimeout(() => {
                authorsElement.classList.add('visible');
                
                // 显示继续阅读提示
                setTimeout(() => {
                    continueHintElement.classList.add('visible');
                }, 1000);
            }, 500);
        }
    }
    
    // 稍微延迟后开始打字效果
    setTimeout(typeTitle, 1000);
    
    // 添加滚动事件，滚动后跳转到主页 - 仅在完成打字后触发
    window.addEventListener('wheel', function() {
        if (isComplete && authorsElement.classList.contains('visible')) {
            window.location.href = 'index.html';
        }
    });
    
    // 添加触摸事件，支持移动设备 - 仅在完成打字后触发
    let touchStartY = 0;
    window.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    });
    
    window.addEventListener('touchend', function(e) {
        if (!isComplete || !authorsElement.classList.contains('visible')) return;
        
        const touchEndY = e.changedTouches[0].clientY;
        const yDiff = touchStartY - touchEndY;
        
        // 检测是否是向下滑动手势
        if (yDiff > 50) {
            window.location.href = 'index.html';
        }
    });
    
    // 添加键盘响应 - 空格或回车也可进入主页
    window.addEventListener('keydown', function(e) {
        if (isComplete && authorsElement.classList.contains('visible') && 
            (e.key === ' ' || e.key === 'Enter')) {
            window.location.href = 'index.html';
        }
    });
});