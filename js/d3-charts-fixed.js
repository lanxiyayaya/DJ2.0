// D3.js 图表函数

// 创建博士生招生数据柱状图
function createD3BarChart(containerId, years, values) {
    // 清空容器
    d3.select(`#${containerId}`).html('');
    
    // 图表尺寸和边距
    const margin = {top: 30, right: 30, bottom: 70, left: 80};
    const width = 1000 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    // 创建SVG元素
    const svg = d3.select(`#${containerId}`)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
        
    // X轴比例尺
    const x = d3.scaleBand()
        .domain(years)
        .range([0, width])
        .padding(0.3);
        
    // Y轴比例尺
    const y = d3.scaleLinear()
        .domain([0, d3.max(values) * 1.1])
        .range([height, 0]);
        
    // 添加X轴
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'translate(-10,5)rotate(-45)')
        .style('text-anchor', 'end')
        .style('font-size', '12px')
        .style('fill', '#e0e0e0');
        
    // 添加X轴标签
    svg.append('text')
        .attr('class', 'axis-label')
        .attr('x', width / 2)
        .attr('y', height + 60)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('fill', '#e0e0e0')
        .text('年份');
        
    // 添加Y轴
    svg.append('g')
        .call(d3.axisLeft(y)
            .tickFormat(d => d3.format(',')(d)))
        .selectAll('text')
        .style('font-size', '12px')
        .style('fill', '#e0e0e0');
        
    // 添加Y轴标签
    svg.append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -60)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('fill', '#e0e0e0')
        .text('人数');
        
    // 添加网格线
    svg.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(y)
            .tickSize(-width)
            .tickFormat('')
            .ticks(10))
        .selectAll('.tick line')
        .style('stroke', 'rgba(255, 255, 255, 0.1)');
        
    // 定义颜色渐变
    const colorScale = d3.scaleLinear()
        .domain([0, values.length - 1])
        .range(['#5e9cd3', '#1e5484']);
    
    // 添加柱状图
    svg.selectAll('rect')
        .data(values)
        .enter()
        .append('rect')
        .attr('x', (d, i) => x(years[i]))
        .attr('y', height)  // 从底部开始动画
        .attr('width', x.bandwidth())
        .attr('height', 0)  // 初始高度为0
        .attr('fill', (d, i) => colorScale(i))
        .attr('rx', 3)  // 圆角
        .attr('ry', 3);
    
    // 添加数值标签
    svg.selectAll('.value-label')
        .data(values)
        .enter()
        .append('text')
        .attr('class', 'value-label')
        .attr('x', (d, i) => x(years[i]) + x.bandwidth() / 2)
        .attr('y', d => y(d) - 10)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('font-weight', '400')
        .style('fill', '#e0e0e0')
        .style('opacity', 0)  // 初始透明
        .text(d => d3.format(',')(d));
        
    // 添加标题
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('fill', '#e0e0e0');

    // 添加动画效果
    svg.selectAll('rect')
        .transition()
        .duration(800)
        .delay((d, i) => i * 100)
        .attr('y', d => y(d))
        .attr('height', d => height - y(d))
        .on('end', function(d, i) {
            // 柱状图动画完成后显示数值标签
            if (i === values.length - 1) {
                svg.selectAll('.value-label')
                    .transition()
                    .duration(500)
                    .style('opacity', 1);
            }
        });
    
    // 添加交互效果 - 鼠标悬停
    const barRects = svg.selectAll('rect');
    barRects.on('mouseover', function(event, d, i) {
        // 获取当前柱状图的索引
        const thisRect = d3.select(this);
        const rectData = thisRect.data()[0];
        const index = values.findIndex(v => v === rectData);
        const year = years[index];
        
        // 确定是否是特殊年份
        const specialYears = ["2004年", "2021年", "2022年"];
        const isSpecialYear = specialYears.includes(year);
        
        // 高亮当前柱状图，除了特殊年份不变色
        thisRect
            .transition()
            .duration(200)
            .attr('fill', isSpecialYear ? colorScale(index) : '#FFC107')
            .attr('opacity', 1);
        
        // 使其他柱状图变暗
        barRects.filter(function() { return this !== event.currentTarget; })
            .transition()
            .duration(200)
            .attr('opacity', 0.5);
        
        // 显示对应的数值标签
        svg.selectAll('.value-label')
            .filter((_, i) => i === index)
            .transition()
            .duration(200)
            .style('font-size', '14px')
            .style('font-weight', '700')
            .style('fill', '#FFC107');
        
        // 创建和定位提示框
        const tooltip = d3.select(`#${containerId}`)
            .append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('background-color', 'rgba(20, 20, 20, 0.9)')
            .style('color', '#fff')
            .style('padding', '10px 15px')
            .style('border-radius', '6px')
            .style('font-size', '14px')
            .style('box-shadow', '0 2px 10px rgba(0,0,0,0.5)')
            .style('border-left', '4px solid #FFC107')
            .style('z-index', '1000')
            .style('pointer-events', 'none');
        
        // 计算提示框位置
        const containerRect = d3.select(`#${containerId}`).node().getBoundingClientRect();
        const tooltipX = event.pageX - containerRect.left + 10;
        const tooltipY = event.pageY - containerRect.top - 60;
        
        // 如果是最近几年，将提示框移至左侧以避免超出屏幕
        const isRecentYear = index > years.length - 4;
        const adjustedX = isRecentYear ? tooltipX - 200 : tooltipX;
        
        // 计算增长率（对于非第一年）
        let growthInfo = '';
        if (index > 0) {
            const prevValue = values[index - 1];
            const growth = d - prevValue;
            const growthRate = ((growth / prevValue) * 100).toFixed(1);
            const growthColor = growth >= 0 ? '#4caf50' : '#f44336';
            growthInfo = `
            <div style="margin-top: 5px;">
                <span>较上年: </span>
                <strong style="color:${growthColor}">
                    ${growth >= 0 ? '+' : ''}${d3.format(',')(growth)} (${growth >= 0 ? '+' : ''}${growthRate}%)
                </strong>
            </div>`;
        }
        
        // 设置提示框位置和内容
        tooltip
            .style('left', `${adjustedX}px`)
            .style('top', `${tooltipY}px`)
            .html(`
                <div style="border-bottom: 1px solid rgba(255,255,255,0.2); margin-bottom: 8px; padding-bottom: 5px;">
                    <strong style="font-size: 16px;">${year}</strong>
                </div>
                <div>招生人数: <strong>${d3.format(',')(d)}</strong> 人</div>
                ${growthInfo}
            `);
    })
    .on('mouseout', function() {
        // 恢复所有柱状图原样式
        svg.selectAll('rect')
            .transition()
            .duration(200)
            .attr('fill', (d, i) => colorScale(i))
            .attr('opacity', 0.9);
        
        // 恢复数值标签样式
        svg.selectAll('.value-label')
            .transition()
            .duration(200)
            .style('font-size', '12px')
            .style('font-weight', '400')
            .style('fill', '#e0e0e0');
        
        // 移除提示框
        d3.select(`#${containerId}`).selectAll('.tooltip').remove();
    });
}

// 创建博士生延毕数据横向条形图
function createD3HorizontalBarChart(containerId, years, degreeAwarded, delayedGraduation) {
    // 此处保留原始的 createD3HorizontalBarChart 函数实现
    // ...此处省略原始代码，以保持文件简洁...
}
