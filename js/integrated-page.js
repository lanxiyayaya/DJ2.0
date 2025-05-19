// 集成页面的主要JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // ===== 全局变量 =====
    let newsData = null;
    let isTypingComplete = false;
    const nav = document.getElementById('main-nav');
    const titleSection = document.getElementById('title-section');
    
    // ===== 标题页打字效果 =====
    const titleText = "“我们破茧而并非成蝶”：博士生的“延”不由衷";
    const titleElement = document.getElementById('typing-title');
    const authorsElement = document.getElementById('authors');
    const continueHintElement = document.getElementById('continue-hint');
    const cursor = document.querySelector('.cursor');
    
    let charIndex = 0;
    
    // 打字效果函数
    function typeTitle() {
        if (charIndex < titleText.length) {
            // 获取当前字符
            const currentChar = titleText.charAt(charIndex);
            
            // 添加字符到标题
            titleElement.innerHTML += currentChar;
            charIndex++;
            
            // 调整光标位置
            setTimeout(() => {
                cursor.style.left = (titleElement.offsetWidth) + 'px';
                cursor.style.right = 'auto';
            }, 0);
            
            // 根据当前字符调整打字速度
            let typingSpeed = 150;
            if ('，。：、""《》？！'.includes(currentChar)) {
                typingSpeed = 400;
            }
            
            setTimeout(typeTitle, typingSpeed);
        } else {
            // 打字完成后
            isTypingComplete = true;
            titleSection.classList.add('typing-completed');
            
            // 确保光标位置正确
            cursor.style.left = (titleElement.offsetWidth) + 'px';
            
            // 显示作者信息
            setTimeout(() => {
                authorsElement.classList.add('visible');
                
                // 显示继续阅读提示
                setTimeout(() => {
                    continueHintElement.classList.add('visible');
                    
                    // 打字效果完成后显示导航栏
                    setTimeout(() => {
                        nav.classList.add('visible');
                    }, 1000);
                }, 1000);
            }, 500);
        }
    }
    
    // ===== 滚动效果处理 =====
    
    // 监听滚动事件，控制导航栏显示/隐藏
    let lastScrollY = 0;
    let ticking = false;
    
    function handleScroll() {
        const currentScrollY = window.scrollY;
        
        // 当不在页面顶部时显示导航栏
        if (currentScrollY > 100 && isTypingComplete) {
            nav.classList.add('visible');
        } else if (currentScrollY <= 100 && !isTypingComplete) {
            nav.classList.remove('visible');
        }
        
        // 检查当前在哪个部分，更新活动导航项
        updateActiveNavItem();
        
        // 标记已处理此滚动事件
        ticking = false;
        lastScrollY = currentScrollY;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(handleScroll);
            ticking = true;
        }
    });
    
    // 更新当前活动导航项
    function updateActiveNavItem() {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        // 获取所有部分
        const sections = [
            document.getElementById('title-section'),
            document.getElementById('intro'),
            document.getElementById('scrolly'),
            document.getElementById('about')
        ];
        
        // 获取所有导航链接
        const navLinks = document.querySelectorAll('.menu a');
        
        // 移除所有活动类
        navLinks.forEach(link => link.classList.remove('active'));
        
        // 检查当前滚动位置在哪个部分
        let currentSectionIndex = 0;
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            if (!section) continue;
            
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSectionIndex = i;
                break;
            }
        }
        
        // 标题区域特殊处理导航栏背景
        if (currentSectionIndex === 0) {
            nav.classList.add('at-title-section');
        } else {
            nav.classList.remove('at-title-section');
        }
        
        // 激活对应的导航链接
        navLinks[currentSectionIndex].classList.add('active');
    }
    
    // ===== 数据加载与可视化 =====
    
    // 加载数据
    fetch('../data/news_data.json')
        .then(response => response.json())
        .then(data => {
            newsData = data;
            initScrollytelling();
        })
        .catch(error => {
            console.error('Error loading data:', error);
            document.getElementById('visualization').innerHTML = `
                <div class="error">
                    <h3>数据加载错误</h3>
                    <p>无法加载数据文件。请检查您的数据路径。</p>
                </div>
            `;
        });
    
    // 初始化滚动讲故事功能
    function initScrollytelling() {
        const scroller = scrollama();
        
        scroller
            .setup({
                step: '#scrolly .step',
                offset: 0.5,
                debug: false
            })
            .onStepEnter(handleStepEnter)
            .onStepExit(handleStepExit);
        
        // 响应窗口调整大小
        window.addEventListener('resize', scroller.resize);
        
        // 处理进入步骤的函数
        function handleStepEnter(response) {
            // 添加激活类
            response.element.classList.add('is-active');
            
            // 根据不同的步骤更新可视化
            updateVisualization(response.index);
        }
        
        // 处理退出步骤的函数
        function handleStepExit(response) {
            // 移除激活类
            response.element.classList.remove('is-active');
        }
        
        // 更新可视化函数
        function updateVisualization(stepIndex) {
            const viz = document.getElementById('visualization');
            
            if (!newsData || !newsData.sections || stepIndex >= newsData.sections.length) {
                viz.innerHTML = '<p>No data available for this step</p>';
                return;
            }
            
            const section = newsData.sections[stepIndex];
            
            // 更新标题和文本
            viz.innerHTML = `<h3>${section.title}</h3>`;
            
            // 根据数据类型选择可视化
            if (section.data.type === 'chart') {
                const chartContainer = document.createElement('div');
                chartContainer.className = 'chart-container';
                viz.appendChild(chartContainer);
                
                // 如果已经加载了chart.js文件，使用其中的函数
                if (typeof drawChart === 'function') {
                    drawChart(chartContainer, section.data.values, section.data.chartType);
                } else {
                    chartContainer.innerHTML = `<p>图表类型: ${section.data.chartType}</p>
                        <p>数据值: ${JSON.stringify(section.data.values)}</p>`;
                }
            } else {
                // 文本类型数据
                viz.innerHTML += `<div class="text-content">${section.data.value}</div>`;
            }
            
            // 添加内容部分
            viz.innerHTML += `<div class="content-section">${section.content}</div>`;
        }
    }
    
    // ===== 平滑导航 =====
    
    // 平滑滚动导航
    document.querySelectorAll('.menu a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // 计算目标位置，考虑导航栏高度
                const navHeight = nav.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // 更新URL但不影响滚动位置
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // ===== 初始化 =====
    
    // 稍微延迟后开始打字效果
    setTimeout(typeTitle, 1000);
});