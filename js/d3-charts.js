// D3.js 图表函数

// 创建博士生招生数据柱状图
function createD3BarChart(containerId, years, values) {
    // 清空容器
    d3.select(`#${containerId}`).html('');
    
    // 图表尺寸和边距
    const margin = {top: 30, right: 30, bottom: 70, left: 80};
    const width = 800 - margin.left - margin.right;
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
        .padding(0.2);
        
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
        .attr('ry', 3)
        .attr('stroke', (d, i) => {
            // 为最大和最小值添加特殊边框
            if (d === d3.max(values)) return '#FFC107';
            if (d === d3.min(values)) return '#4caf50';
            return 'none';
        })
        .attr('stroke-width', (d) => {
            // 为最大和最小值添加边框宽度
            if (d === d3.max(values) || d === d3.min(values)) return 2;
            return 0;
        })
        .attr('stroke-dasharray', (d) => {
            // 为最大和最小值添加虚线边框
            if (d === d3.max(values) || d === d3.min(values)) return '3,2';
            return 'none';
        });
          // 添加数值标签
    svg.selectAll('.value-label')
        .data(values)
        .enter()
        .append('text')
        .attr('class', 'value-label')
        .attr('x', (d, i) => x(years[i]) + x.bandwidth() / 2)
        .attr('y', d => y(d) - 10)
        .attr('text-anchor', 'middle')
        .style('font-size', (d) => {
            // 为最大和最小值使用更大的字体
            if (d === d3.max(values) || d === d3.min(values)) return '13px';
            return '12px';
        })
        .style('font-weight', (d) => {
            // 为最大和最小值使用加粗字体
            if (d === d3.max(values) || d === d3.min(values)) return '700';
            return '400';
        })
        .style('fill', (d) => {
            // 为最大和最小值使用特殊颜色
            if (d === d3.max(values)) return '#FFC107';
            if (d === d3.min(values)) return '#4caf50';
            return '#e0e0e0';
        })
        .style('opacity', 0)  // 初始透明
        .text(d => d3.format(',')(d));
        
    // 添加标题
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('fill', '#e0e0e0')

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
                    
                // 为最大和最小值添加特殊标记
                const maxValue = d3.max(values);
                const minValue = d3.min(values);
                const maxIndex = values.indexOf(maxValue);
                const minIndex = values.indexOf(minValue);
                
                // 添加最大值标记
                svg.append('text')
                    .attr('class', 'max-indicator')
                    .attr('x', x(years[maxIndex]) + x.bandwidth() / 2)
                    .attr('y', y(maxValue) - 20)
                    .attr('text-anchor', 'middle')
                    .style('font-size', '12px')
                    .style('font-weight', '700')
                    .style('fill', '#FFC107')
                    .text('峰值')
                    .style('opacity', 0)
                    .transition()
                    .duration(500)
                    .style('opacity', 1);
                
                // 添加最小值标记
                svg.append('text')
                    .attr('class', 'min-indicator')
                    .attr('x', x(years[minIndex]) + x.bandwidth() / 2)
                    .attr('y', y(minValue) - 20)
                    .attr('text-anchor', 'middle')
                    .style('font-size', '12px')
                    .style('font-weight', '700')
                    .style('fill', '#4caf50')
                    .text('低点')
                    .style('opacity', 0)
                    .transition()
                    .duration(500)
                    .style('opacity', 1);
                    
                // 计算整体增长趋势
                const firstValue = values[0];
                const lastValue = values[values.length - 1];
                const growthPercentage = ((lastValue - firstValue) / firstValue * 100).toFixed(1);
                
                // 添加总体增长趋势标签
                svg.append('text')
                    .attr('class', 'growth-trend')
                    .attr('x', width / 2)
                    .attr('y', 20)
                    .attr('text-anchor', 'middle')
                    .style('font-size', '14px')
                    .style('font-weight', '500')
                    .style('fill', '#e0e0e0')
                    .html(`近二十年招生总体增长: <tspan style="fill: #4caf50; font-weight: 700">${growthPercentage}%</tspan>`)
                    .style('opacity', 0)
                    .transition()
                    .duration(800)
                    .delay(500)
                    .style('opacity', 1);
            }
        });
          // 添加交互效果 - 鼠标悬停
    svg.selectAll('rect')
        .on('mouseover', function(event, d) {
            // 获取当前柱状图的索引
            const index = values.indexOf(d);
            const year = years[index];
            
            // 高亮当前柱状图
            d3.select(this)
                .transition()
                .duration(200)
                .attr('fill', '#FFC107')
                .attr('opacity', 1);
                
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
            // 获取当前柱状图的索引
            const index = values.indexOf(d3.select(this).datum());
            
            // 恢复柱状图原样式
            d3.select(this)
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
    // 清空容器
    d3.select(`#${containerId}`).html('');
    
    // 图表尺寸和边距
    const margin = {top: 50, right: 170, bottom: 50, left: 80};
    const width = 900 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    
    // 创建SVG元素
    const svg = d3.select(`#${containerId}`)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
          // 数据处理 - 计算延毕比例与高亮基准
    const delayRates = years.map((year, i) => {
        // 计算延毕率
        const rate = (delayedGraduation[i] / degreeAwarded[i] * 100).toFixed(1);
        
        // 计算是否是最高延毕率年份
        const isMax = i === delayedGraduation.indexOf(Math.max(...delayedGraduation));
        
        // 计算是否是最低延毕率年份
        const isMin = i === delayedGraduation.indexOf(Math.min(...delayedGraduation));
        
        return {
            year,
            awarded: degreeAwarded[i],
            delayed: delayedGraduation[i],
            rate: rate,
            isMax: isMax,
            isMin: isMin
        };
    });
    
    // 为每组创建一个分组
    years.forEach((year, i) => {
        svg.append('g')
            .attr('class', `year-group-${i}`)
            .attr('transform', `translate(0, ${i * (height / years.length)})`);
    });
    
    // 添加交替的背景条纹，增强可读性
    svg.selectAll('.background-stripe')
        .data(years)
        .enter()
        .append('rect')
        .attr('class', 'background-stripe')
        .attr('x', 0)
        .attr('y', (d, i) => y(d))
        .attr('width', width)
        .attr('height', y.bandwidth())
        .attr('fill', (d, i) => i % 2 === 0 ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)')
        .attr('rx', 2)
        .attr('ry', 2);
    
    // 缩放比例
    const x = d3.scaleLinear()
        .domain([0, d3.max(degreeAwarded) * 1.1])
        .range([0, width]);
        
    const y = d3.scaleBand()
        .domain(years)
        .range([0, height])
        .padding(0.3);
          // 添加Y轴 (年份)
    svg.append('g')
        .call(d3.axisLeft(y))
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
        .text('年份');
        
    // 添加X轴
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d => d3.format(',')(d)))
        .selectAll('text')
        .style('font-size', '12px')
        .style('fill', '#e0e0e0');
    
    // 添加X轴标签
    svg.append('text')
        .attr('class', 'axis-label')
        .attr('x', width / 2)
        .attr('y', height + 40)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('fill', '#e0e0e0')
        .text('人数');
        
    // 添加网格线
    svg.append('g')
        .attr('class', 'grid')
        .call(d3.axisBottom(x)
            .tickSize(height)
            .tickFormat('')
            .ticks(10))
        .attr('transform', 'translate(0,0)')
        .selectAll('.tick line')
        .style('stroke', 'rgba(255, 255, 255, 0.1)');
        
    // 添加授予学位数条形图
    svg.selectAll('.awarded-bar')
        .data(delayRates)
        .enter()
        .append('rect')
        .attr('class', 'awarded-bar')
        .attr('x', 0)
        .attr('y', d => y(d.year))
        .attr('height', y.bandwidth())
        .attr('width', 0)  // 初始宽度为0
        .attr('fill', 'rgba(95, 140, 170, 0.8)')
        .attr('rx', 3)
        .attr('ry', 3);
        
    // 添加延毕人数条形图
    svg.selectAll('.delayed-bar')
        .data(delayRates)
        .enter()
        .append('rect')
        .attr('class', 'delayed-bar')
        .attr('x', 0)
        .attr('y', d => y(d.year) + y.bandwidth() / 3)
        .attr('height', y.bandwidth() / 3)
        .attr('width', 0)  // 初始宽度为0
        .attr('fill', 'rgba(231, 76, 60, 0.8)')
        .attr('rx', 2)
        .attr('ry', 2);
          // 添加标题
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -20)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('fill', '#e0e0e0')
        .text('博士生学位授予与延毕情况(2007-2022年)');
        
    // 计算整体趋势
    const firstRate = parseFloat(delayRates[0].rate);
    const lastRate = parseFloat(delayRates[delayRates.length-1].rate);
    const rateDifference = (lastRate - firstRate).toFixed(1);
    const trendDescription = rateDifference > 0 ? 
        `延毕率整体上升了${Math.abs(rateDifference)}%` : 
        `延毕率整体下降了${Math.abs(rateDifference)}%`;
    const trendColor = rateDifference > 0 ? '#ff6b6b' : '#4caf50';
    
    // 添加趋势标注
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -2)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('fill', trendColor)
        .style('opacity', 0)  // 初始不可见
        .text(`${trendDescription} (${firstRate}% → ${lastRate}%)`)
        .transition()
        .duration(1000)
        .delay(1000)  // 延迟显示
        .style('opacity', 1);
        
    // 添加图例
    const legend = svg.append('g')
        .attr('transform', `translate(${width + 20}, 0)`);
        
    // 授予学位图例
    legend.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 18)
        .attr('height', 18)
        .attr('fill', 'rgba(95, 140, 170, 0.8)');
        
    legend.append('text')
        .attr('x', 25)
        .attr('y', 14)
        .text('授予学位数')
        .style('font-size', '14px')
        .style('fill', '#e0e0e0');
        
    // 延毕人数图例
    legend.append('rect')
        .attr('x', 0)
        .attr('y', 30)
        .attr('width', 18)
        .attr('height', 18)
        .attr('fill', 'rgba(231, 76, 60, 0.8)');
        
    legend.append('text')
        .attr('x', 25)
        .attr('y', 44)
        .text('延毕人数')
        .style('font-size', '14px')
        .style('fill', '#e0e0e0');
        
    // 添加动画效果 - 授予学位数条
    svg.selectAll('.awarded-bar')
        .transition()
        .duration(800)
        .delay((d, i) => i * 50)
        .attr('width', d => x(d.awarded));
          // 添加动画效果 - 延毕人数条
    svg.selectAll('.delayed-bar')
        .transition()
        .duration(800)
        .delay((d, i) => i * 50 + 400)
        .attr('width', d => x(d.delayed))
        .on('end', function(d, i) {
            // 最后一个动画结束后添加数值标签
            if (i === delayRates.length - 1) {
            // 添加比率标签
                svg.selectAll('.rate-label')
                    .data(delayRates)
                    .enter()
                    .append('text')
                    .attr('class', 'rate-label')
                    .attr('x', d => x(d.awarded) + 10)
                    .attr('y', d => y(d.year) + y.bandwidth() / 2 + 5)
                    .text(d => `延毕率: ${d.rate}%`)
                    .style('font-size', '12px')
                    .style('fill', d => {
                        if (d.isMax) return '#ff6b6b'; // 最高延毕率标红
                        if (d.isMin) return '#4caf50'; // 最低延毕率标绿
                        return '#FFC107';              // 默认黄色
                    })
                    .style('font-weight', d => (d.isMax || d.isMin) ? '700' : '400')
                    .style('opacity', 0)
                    .transition()
                    .duration(500)
                    .style('opacity', 1);
                    
                // 为最高和最低延毕率添加特殊标记
                svg.selectAll('.rate-indicator')
                    .data(delayRates.filter(d => d.isMax || d.isMin))
                    .enter()
                    .append('text')
                    .attr('class', 'rate-indicator')
                    .attr('x', d => x(d.awarded) + 120)
                    .attr('y', d => y(d.year) + y.bandwidth() / 2 + 5)
                    .text(d => d.isMax ? '⬆ 最高' : '⬇ 最低')
                    .style('font-size', '12px')
                    .style('fill', d => d.isMax ? '#ff6b6b' : '#4caf50')
                    .style('font-weight', '600')
                    .style('opacity', 0)
                    .transition()
                    .duration(800)
                    .delay(600)
                    .style('opacity', 1);
            }
        });
          // 添加交互效果 - 授予学位条
    svg.selectAll('.awarded-bar')
        .on('mouseover', function(event, d) {
            // 高亮当前条
            d3.select(this)
                .transition()
                .duration(200)
                .attr('fill', '#63c5da')
                .attr('opacity', 1);
                
            // 同时高亮对应的延毕条
            const yearIndex = delayRates.findIndex(item => item.year === d.year);
            svg.selectAll('.delayed-bar')
                .filter((_, i) => i === yearIndex)
                .transition()
                .duration(200)
                .attr('fill', '#e74c3c')
                .attr('opacity', 1);
                
            // 高亮对应的延毕率标签
            svg.selectAll('.rate-label')
                .filter((_, i) => i === yearIndex)
                .transition()
                .duration(200)
                .style('font-size', '14px')
                .style('font-weight', '700')
                .style('fill', '#FFC107');
                
            // 显示详细信息提示
            const tooltip = d3.select(`#${containerId}`)
                .append('div')
                .attr('class', 'tooltip')
                .style('position', 'absolute')
                .style('background-color', 'rgba(20, 20, 20, 0.9)')
                .style('color', '#fff')
                .style('padding', '10px 15px')
                .style('border-radius', '4px')
                .style('font-size', '14px')
                .style('box-shadow', '0 3px 15px rgba(0,0,0,0.4)')
                .style('pointer-events', 'none')
                .style('z-index', '1000');
                
            // 计算提示框位置，避免触摸边界
            const containerRect = d3.select(`#${containerId}`).node().getBoundingClientRect();
            const tooltipX = event.pageX - containerRect.left + 15;
            const tooltipY = event.pageY - containerRect.top - 50;
            
            // 计算同比变化（如果不是第一年）
            let changeInfo = '';
            if (yearIndex > 0) {
                const prevData = delayRates[yearIndex - 1];
                const awardedChange = d.awarded - prevData.awarded;
                const awardedChangeRate = ((awardedChange / prevData.awarded) * 100).toFixed(1);
                const delayedChange = d.delayed - prevData.delayed;
                const delayedChangeRate = ((delayedChange / prevData.delayed) * 100).toFixed(1);
                const rateChange = (d.rate - prevData.rate).toFixed(1);
                
                const awardedColor = awardedChange >= 0 ? '#4caf50' : '#f44336';
                const delayedColor = delayedChange < 0 ? '#4caf50' : '#f44336';  // 延毕减少是好事
                const rateColor = rateChange < 0 ? '#4caf50' : '#f44336';  // 延毕率降低是好事
                
                changeInfo = `
                <div style="margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 8px;">
                    <div style="font-size: 13px; margin-bottom: 5px;">较${prevData.year}变化：</div>
                    <div>学位授予数: <span style="color:${awardedColor}; font-weight:600;">${awardedChange >= 0 ? '+' : ''}${d3.format(',')(awardedChange)} (${awardedChange >= 0 ? '+' : ''}${awardedChangeRate}%)</span></div>
                    <div>延毕人数: <span style="color:${delayedColor}; font-weight:600;">${delayedChange >= 0 ? '+' : ''}${d3.format(',')(delayedChange)} (${delayedChange >= 0 ? '+' : ''}${delayedChangeRate}%)</span></div>
                    <div>延毕率: <span style="color:${rateColor}; font-weight:600;">${rateChange >= 0 ? '+' : ''}${rateChange}%</span></div>
                </div>`;
            }
                
            tooltip
                .style('left', `${tooltipX}px`)
                .style('top', `${tooltipY}px`)
                .html(`
                    <div style="border-bottom: 1px solid rgba(255,255,255,0.2); margin-bottom: 8px; padding-bottom: 5px;">
                        <strong style="font-size: 16px;">${d.year}</strong>
                    </div>
                    <div>授予学位数: <strong>${d3.format(',')(d.awarded)}</strong>人</div>
                    <div>延毕人数: <strong>${d3.format(',')(d.delayed)}</strong>人</div>
                    <div style="margin-top: 8px; color: #FFC107;">延毕率: <strong>${d.rate}%</strong></div>
                    ${changeInfo}
                `);
        })
        .on('mouseout', function() {
            // 恢复原始样式
            d3.select(this)
                .transition()
                .duration(200)
                .attr('fill', 'rgba(95, 140, 170, 0.8)')
                .attr('opacity', 0.9);
                
            // 恢复对应的延毕条样式
            svg.selectAll('.delayed-bar')
                .transition()
                .duration(200)
                .attr('fill', 'rgba(231, 76, 60, 0.8)')
                .attr('opacity', 0.9);
                
            // 恢复延毕率标签样式
            svg.selectAll('.rate-label')
                .transition()
                .duration(200)
                .style('font-size', '12px')
                .style('font-weight', '400')
                .style('fill', '#FFC107');
                
            // 移除提示
            d3.select(`#${containerId}`).selectAll('.tooltip').remove();
        });
          // 添加交互效果 - 延毕人数条
    svg.selectAll('.delayed-bar')
        .on('mouseover', function(event, d) {
            // 高亮当前条
            d3.select(this)
                .transition()
                .duration(200)
                .attr('fill', '#e74c3c')
                .attr('opacity', 1);
            
            // 同时高亮对应的授予学位条
            const yearIndex = delayRates.findIndex(item => item.year === d.year);
            svg.selectAll('.awarded-bar')
                .filter((_, i) => i === yearIndex)
                .transition()
                .duration(200)
                .attr('fill', '#63c5da')
                .attr('opacity', 0.7);
                
            // 高亮对应的延毕率标签
            svg.selectAll('.rate-label')
                .filter((_, i) => i === yearIndex)
                .transition()
                .duration(200)
                .style('font-size', '14px')
                .style('font-weight', '700')
                .style('fill', '#FFC107');
                
            // 显示详细信息提示
            const tooltip = d3.select(`#${containerId}`)
                .append('div')
                .attr('class', 'tooltip')
                .style('position', 'absolute')
                .style('background-color', 'rgba(20, 20, 20, 0.9)')
                .style('color', '#fff')
                .style('padding', '10px 15px')
                .style('border-radius', '4px')
                .style('font-size', '14px')
                .style('box-shadow', '0 3px 15px rgba(0,0,0,0.4)')
                .style('pointer-events', 'none')
                .style('z-index', '1000');
                
            // 计算提示框位置，避免触摸边界
            const containerRect = d3.select(`#${containerId}`).node().getBoundingClientRect();
            const tooltipX = event.pageX - containerRect.left + 15;
            const tooltipY = event.pageY - containerRect.top - 50;
                
            // 计算占比信息
            const delayPercentage = ((d.delayed / d.awarded) * 100).toFixed(1);
            
            // 计算同比变化（如果不是第一年）
            let changeInfo = '';
            if (yearIndex > 0) {
                const prevData = delayRates[yearIndex - 1];
                const delayedChange = d.delayed - prevData.delayed;
                const delayedChangeRate = ((delayedChange / prevData.delayed) * 100).toFixed(1);
                const rateChange = (d.rate - prevData.rate).toFixed(1);
                
                const delayedColor = delayedChange < 0 ? '#4caf50' : '#f44336';  // 延毕减少是好事
                const rateColor = rateChange < 0 ? '#4caf50' : '#f44336';  // 延毕率降低是好事
                
                changeInfo = `
                <div style="margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 8px;">
                    <div style="font-size: 13px; margin-bottom: 5px;">较${prevData.year}变化：</div>
                    <div>延毕人数: <span style="color:${delayedColor}; font-weight:600;">${delayedChange >= 0 ? '+' : ''}${d3.format(',')(delayedChange)} (${delayedChange >= 0 ? '+' : ''}${delayedChangeRate}%)</span></div>
                    <div>延毕率: <span style="color:${rateColor}; font-weight:600;">${rateChange >= 0 ? '+' : ''}${rateChange}%</span></div>
                </div>`;
            }
                
            tooltip
                .style('left', `${tooltipX}px`)
                .style('top', `${tooltipY}px`)
                .html(`
                    <div style="border-bottom: 1px solid rgba(255,255,255,0.2); margin-bottom: 8px; padding-bottom: 5px;">
                        <strong style="font-size: 16px;">${d.year}</strong>
                    </div>
                    <div>延毕人数: <strong>${d3.format(',')(d.delayed)}</strong>人</div>
                    <div>占授予学位总数: <strong>${delayPercentage}%</strong></div>
                    <div style="margin-top: 8px; color: #FFC107;">延毕率: <strong>${d.rate}%</strong></div>
                    ${changeInfo}
                `);
        })
        .on('mouseout', function() {
            // 恢复原始样式
            d3.select(this)
                .transition()
                .duration(200)
                .attr('fill', 'rgba(231, 76, 60, 0.8)')
                .attr('opacity', 0.9);
                
            // 恢复对应的授予学位条样式
            svg.selectAll('.awarded-bar')
                .transition()
                .duration(200)
                .attr('fill', 'rgba(95, 140, 170, 0.8)')
                .attr('opacity', 0.9);
                
            // 恢复延毕率标签样式
            svg.selectAll('.rate-label')
                .transition()
                .duration(200)
                .style('font-size', '12px')
                .style('font-weight', '400')
                .style('fill', '#FFC107');
                
            // 移除提示
            d3.select(`#${containerId}`).selectAll('.tooltip').remove();
        });
}
