// filepath: d:\一堆破事夹\乱七八糟\Data_Journalism\DJ2\DJ2.0\js\integrated-page.js
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
    console.log('正在尝试加载数据文件...');
    fetch('../data/news_data.json')
        .then(response => {
            console.log('数据加载响应状态:', response.status);
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
            // 检查step元素是否有实际内容（不只是注释）
            const hasHtmlContent = activeStep && activeStep.querySelector('p, h1, h2, h3, h4, h5, h6');
            
            // 清空之前的内容
            viz.innerHTML = '';
            
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
                
                // 只有当HTML步骤中没有内容时，才添加JSON中的内容
                if (!hasHtmlContent) {
                    const contentSection = document.createElement('div');
                    contentSection.className = 'content-section';
                    contentSection.innerHTML = section.content;
                    viz.appendChild(contentSection);
                }
            } else if (section.data.type === 'image') {
                // 图片类型 - 设置为背景图片
                viz.style.backgroundImage = `url('${section.data.value}')`;
                viz.style.backgroundSize = 'contain';
                viz.style.backgroundPosition = 'center';
                viz.style.backgroundRepeat = 'no-repeat';
                viz.style.backgroundColor = 'transparent';
                
                // 只有当HTML步骤中没有内容时，才添加JSON中的内容覆盖层
                if (!hasHtmlContent) {
                    const contentOverlay = document.createElement('div');
                    contentOverlay.className = 'content-overlay';
                    contentOverlay.innerHTML = section.content;
                    viz.appendChild(contentOverlay);
                }
            } else if (section.data.type === 'd3Chart') {
                // D3.js 可视化图表
                console.log('处理 D3 图表, 类型:', section.data.chartType);
                viz.style.backgroundImage = '';
                viz.style.backgroundColor = '#2a2a2a';
                
                // 添加标题
                const titleEl = document.createElement('h3');
                titleEl.textContent = section.title;
                viz.appendChild(titleEl);
                
                // 创建图表容器
                const d3ChartContainer = document.createElement('div');
                d3ChartContainer.className = 'd3-chart-container';
                d3ChartContainer.id = `d3-chart-${stepIndex}`;
                viz.appendChild(d3ChartContainer);
                
                try {
                    // 基于图表类型渲染不同的D3图表
                    if (section.data.chartType === 'barChart') {
                        console.log('创建柱状图，数据年份:', section.data.years, '数据值:', section.data.values);
                        createD3BarChart(d3ChartContainer.id, section.data.years, section.data.values);
                    } else if (section.data.chartType === 'horizontalBarChart') {
                        console.log('创建横向条形图，年份:', section.data.years);
                        createD3HorizontalBarChart(d3ChartContainer.id, section.data.years, section.data.degreeAwarded, section.data.delayedGraduation);
                    }
                } catch (chartError) {
                    console.error('创建图表时出错:', chartError);
                    d3ChartContainer.innerHTML = `<div class="chart-error">创建图表时出错: ${chartError.message}</div>`;
                }
                
                // 只有当HTML步骤中没有内容时，才添加JSON中的内容
                if (!hasHtmlContent) {
                    const contentSection = document.createElement('div');
                    contentSection.className = 'content-section';
                    contentSection.innerHTML = section.content;
                    viz.appendChild(contentSection);
                }
            } else {
                // 文本类型数据
                viz.style.backgroundImage = '';
                viz.style.backgroundColor = '#2a2a2a';
                
                // 添加标题
                const titleEl = document.createElement('h3');
                titleEl.textContent = section.title;
                viz.appendChild(titleEl);
                
                // 添加文本内容
                const textContent = document.createElement('div');
                textContent.className = 'text-content';
                textContent.textContent = section.data.value;
                viz.appendChild(textContent);
                
                // 只有当HTML步骤中没有内容时，才添加JSON中的内容
                if (!hasHtmlContent) {
                    const contentSection = document.createElement('div');
                    contentSection.className = 'content-section';
                    contentSection.innerHTML = section.content;
                    viz.appendChild(contentSection);
                }
            }
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
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
                
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
