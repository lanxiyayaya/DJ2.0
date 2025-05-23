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
                
                // 打字效果完成后显示导航栏
                setTimeout(() => {
                    nav.classList.add('visible');
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
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('nav .menu a');
        
        sections.forEach((section, i) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLinks[i].classList.add('active');
            }
        });
    }
    
    // ===== 加载数据并初始化滚动讲故事 =====
    
    // 启动打字效果
    setTimeout(typeTitle, 500);
    
    // 加载JSON数据
    fetch('../data/news_data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('数据已加载，包含', data.sections.length, '个部分');
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
        console.log('初始化滚动讲故事功能...');
        const steps = document.querySelectorAll('#scrolly .step');
        console.log('找到', steps.length, '个滚动步骤');
        
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
            console.log('更新可视化，步骤索引:', stepIndex);
            
            const viz = document.getElementById('visualization');
            
            if (!newsData || !newsData.sections || stepIndex >= newsData.sections.length) {
                viz.innerHTML = '<p>No data available for this step</p>';
                console.error('没有可用的数据，或步骤索引超出范围', {
                    hasNewsData: !!newsData,
                    sectionsLength: newsData ? newsData.sections.length : 0,
                    requestedIndex: stepIndex
                });
                return;
            }
            
            const section = newsData.sections[stepIndex];
            
            // 获取当前激活的step元素来检查它是否有自己的内容
            const activeStep = document.querySelector('.step.is-active');
            
            // 清空之前的内容
            viz.innerHTML = '';
            
            // 只加载可视化数据，不重复添加文本内容
            // 根据数据类型选择可视化
            if (section.data.type === 'chart') {
                // 图表类型
                viz.style.backgroundImage = '';
                viz.style.backgroundColor = '#2a2a2a';
                
                // 添加标题
                const titleEl = document.createElement('h3');
                titleEl.textContent = section.title;
                viz.appendChild(titleEl);
                
                const chartContainer = document.createElement('div');
                chartContainer.className = 'chart-container';
                viz.appendChild(chartContainer);
                
                // 如果已经加载了chart.js文件，使用其中的函数
                if (section.data.chartType === 'line' && typeof createLineChart === 'function') {
                    createLineChart(chartContainer, section.data.values);
                } else if (section.data.chartType === 'bar' && typeof createBarChart === 'function') {
                    createBarChart(chartContainer, section.data.values);
                } else {
                    chartContainer.innerHTML = `<p>图表类型: ${section.data.chartType}</p>
                        <p>数据值: ${JSON.stringify(section.data.values)}</p>`;
                }
            } else if (section.data.type === 'd3Chart') {
                // D3.js 图表
                viz.style.backgroundImage = '';
                viz.style.backgroundColor = '#2a2a2a';
                
                // 创建图表容器
                const chartContainer = document.createElement('div');
                chartContainer.className = 'd3-chart-container';
                chartContainer.id = `d3-chart-${stepIndex}`;
                viz.appendChild(chartContainer);
                
                // 添加标题
                const titleEl = document.createElement('h3');
                titleEl.className = 'chart-title';
                titleEl.textContent = section.title;
                viz.appendChild(titleEl);
                
                console.log('创建D3图表:', section.data.chartType);
                
                // 根据图表类型创建不同的D3图表
                try {
                    if (section.data.chartType === 'barChart' && typeof createD3BarChart === 'function') {
                        createD3BarChart(chartContainer.id, section.data.years, section.data.values);
                    } else if (section.data.chartType === 'horizontalBarChart' && typeof createD3HorizontalBarChart === 'function') {
                        createD3HorizontalBarChart(chartContainer.id, section.data.years, 
                            section.data.degreeAwarded, section.data.delayedGraduation);
                    } else {
                        chartContainer.innerHTML = `<p>未知的D3图表类型: ${section.data.chartType}</p>`;
                    }
                } catch (error) {
                    console.error('创建图表时出错:', error);
                    chartContainer.innerHTML = `<p>创建图表时出错: ${error.message}</p>`;
                }            } else if (section.data.type === 'image') {
                // 图像类型 - 只显示图片背景，不显示文本内容
                viz.style.backgroundImage = `url(${section.data.value})`;
                viz.style.backgroundColor = 'transparent';
            } else if (section.data.type === 'text') {
                // 纯文本类型
                viz.style.backgroundImage = '';
                viz.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                
                const textContainer = document.createElement('div');
                textContainer.className = 'text-container';
                
                // 添加标题
                const titleEl = document.createElement('h2');
                titleEl.textContent = section.title;
                textContainer.appendChild(titleEl);
                
                // 添加内容
                const contentEl = document.createElement('div');
                contentEl.innerHTML = section.content;
                textContainer.appendChild(contentEl);
                
                // 添加值
                if (section.data.value) {
                    const valueEl = document.createElement('p');
                    valueEl.className = 'highlight';
                    valueEl.textContent = section.data.value;
                    textContainer.appendChild(valueEl);
                }
                
                viz.appendChild(textContainer);
            } else {
                // 默认情况
                viz.style.backgroundImage = '';
                viz.style.backgroundColor = '#333';
                
                const defaultContent = document.createElement('div');
                defaultContent.className = 'default-content';
                
                // 标题
                const title = document.createElement('h3');
                title.textContent = section.title || 'Section Title';
                defaultContent.appendChild(title);
                
                // 内容
                if (section.content) {
                    const content = document.createElement('div');
                    content.innerHTML = section.content;
                    defaultContent.appendChild(content);
                }
                
                viz.appendChild(defaultContent);
            }
        }
    }
});
