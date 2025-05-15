// 在文档加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化数据
    let newsData = null;
    
    // 加载数据 - 修复数据文件路径
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
    
    function initScrollytelling() {
        // 初始化 scrollama
        const scroller = scrollama();
        
        // 设置步骤和图形区域
        scroller
            .setup({
                step: '#scrolly .step',  // 选择所有步骤
                offset: 0.5,             // 当元素进入视口50%时触发
                debug: false            // 如果需要调试可以设为true
            })
            .onStepEnter(handleStepEnter) // 进入步骤时的回调函数
            .onStepExit(handleStepExit);  // 退出步骤时的回调函数
        
        // 响应窗口调整大小
        window.addEventListener('resize', scroller.resize);
        
        // 处理进入步骤的函数
        function handleStepEnter(response) {
            // response = { element, direction, index }
            
            // 添加激活类
            response.element.classList.add('is-active');
            
            // 根据不同的步骤更新可视化
            updateVisualization(response.index);
        }
        
        // 处理退出步骤的函数
        function handleStepExit(response) {
            // response = { element, direction, index }
            
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
                
                // 如果已经加载了charts.js文件，使用其中的函数
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
    
    // 平滑滚动导航
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        });
    });
});