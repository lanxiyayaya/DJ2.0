document.addEventListener('DOMContentLoaded', function() {
    // 初始化：为body添加标题页可见的类
    document.body.classList.add('title-visible');
    
    // 标题文本 - 正确处理引号和特殊字符
    const titleText = "“我们破茧而并非成蝶”：博士生的“延”不由衷";
    const titleElement = document.getElementById('typing-title');
    const authorsElement = document.getElementById('authors');
    const continueHintElement = document.getElementById('continue-hint');
    const cursor = document.querySelector('.cursor');
    
    // 获取主内容区域
    const titlePageElement = document.getElementById('title-page');
    const mainContentElement = document.getElementById('main-content');
    
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
      // 用于标记是否已经完成过渡到主内容
    let isTransitioned = false;
    
    // 显示主内容区域的函数
    function showMainContent() {
        if (isComplete && authorsElement.classList.contains('visible') && !isTransitioned) {
            // 标记已经开始过渡，防止重复触发
            isTransitioned = true;
            
            // 平滑过渡：淡出标题页，显示主内容
            titlePageElement.style.transition = "opacity 1s ease";
            titlePageElement.style.opacity = 0;
            
            setTimeout(() => {
                // 移除所有与标题页相关的事件监听器
                window.removeEventListener('wheel', handleWheel);
                window.removeEventListener('touchstart', handleTouchStart);
                window.removeEventListener('touchend', handleTouchEnd);
                window.removeEventListener('keydown', handleKeyDown);
                
                titlePageElement.style.display = "none";
                titlePageElement.classList.add('hidden');
                document.body.classList.remove('title-visible');
                
                mainContentElement.style.display = "block";
                mainContentElement.style.opacity = 0;
                
                // 滚动到页面顶部，确保主内容从头开始显示
                window.scrollTo(0, 0);
                
                setTimeout(() => {
                    mainContentElement.style.transition = "opacity 1s ease";
                    mainContentElement.style.opacity = 1;
                    // 初始化主内容中的动画或交互
                    if (typeof initMainContent === 'function') {
                        initMainContent();
                    }
                }, 50);
            }, 1000);
        }
    }
    
    // 稍微延迟后开始打字效果
    setTimeout(typeTitle, 1000);
      // 添加滚动事件，滚动后显示主内容 - 仅在完成打字后触发
    function handleWheel() {
        showMainContent();
    }
    window.addEventListener('wheel', handleWheel);
    
    // 添加触摸事件，支持移动设备 - 仅在完成打字后触发
    let touchStartY = 0;
    function handleTouchStart(e) {
        touchStartY = e.touches[0].clientY;
    }
    window.addEventListener('touchstart', handleTouchStart);
    
    function handleTouchEnd(e) {
        if (!isComplete || !authorsElement.classList.contains('visible')) return;
        
        const touchEndY = e.changedTouches[0].clientY;
        const yDiff = touchStartY - touchEndY;
        
        // 检测是否是向下滑动手势
        if (yDiff > 50) {
            showMainContent();
        }
    }
    window.addEventListener('touchend', handleTouchEnd);
    
    // 添加键盘响应 - 空格或回车也可显示主内容
    function handleKeyDown(e) {
        if (isComplete && authorsElement.classList.contains('visible') && 
            (e.key === ' ' || e.key === 'Enter')) {
            showMainContent();
        }
    }
    window.addEventListener('keydown', handleKeyDown);
});
