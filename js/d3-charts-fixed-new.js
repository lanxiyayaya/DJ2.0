// D3.js 图表函数 - 全新修复版本 (彻底解决所有柱状图悬停问题)

// 创建博士生招生数据柱状图
function createD3BarChart(containerId, years, values) {
    console.log("创建柱状图 - 全新悬停修复版本");
    console.log("容器ID:", containerId);
    console.log("年份数据:", years);
    console.log("数值数据:", values);
    
    // 清空容器
    d3.select(`#${containerId}`).html('');
    
    // 图表尺寸和边距
    const margin = {top: 50, right: 30, bottom: 70, left: 80};
    const width = 1000 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    // 创建SVG元素
    const svg = d3.select(`#${containerId}`)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
        
    // 添加标题
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -20)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .style('fill', '#e0e0e0')
        .text('我国博士生招生人数（2004年至2022年）');
    
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
    
    // 为数据创建映射
    const dataArray = years.map((year, i) => {
        return {
            year: year,
            value: values[i],
            index: i
        };
    });
    
    console.log("处理的数据:", dataArray);
    
    // 1. 创建条形图组 - 每个条形图都包含在一个组中，便于管理
    const barGroups = svg.selectAll('.bar-group')
        .data(dataArray)
        .enter()
        .append('g')
        .attr('class', 'bar-group')
        .attr('transform', d => `translate(${x(d.year)},0)`);
    
    // 2. 向每个组添加实际的条形图
    const bars = barGroups.append('rect')
        .attr('class', 'bar')
        .attr('x', 0)
        .attr('y', height) // 初始位置在底部
        .attr('width', x.bandwidth())
        .attr('height', 0) // 初始高度为0
        .attr('fill', d => colorScale(d.index))
        .attr('rx', 3) // 圆角
        .attr('ry', 3)
        .style('cursor', 'pointer'); // 添加指针样式
    
    // 3. 向每个组添加完全透明的交互区域，确保整个区域都可以响应鼠标事件
    const hitAreas = barGroups.append('rect')
        .attr('class', 'hit-area')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', x.bandwidth())
        .attr('height', height)
        .attr('fill', 'transparent')
        .style('cursor', 'pointer'); // 添加指针样式
    
    // 4. 添加数值标签
    const valueLabels = barGroups.append('text')
        .attr('class', 'value-label')
        .attr('x', x.bandwidth() / 2)
        .attr('y', d => y(d.value) - 10)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('font-weight', '400')
        .style('fill', '#e0e0e0')
        .style('opacity', 0) // 初始不可见
        .text(d => d3.format(',')(d.value));
    
    // 5. 添加动画效果
    bars.transition()
        .duration(800)
        .delay((d, i) => i * 100)
        .attr('y', d => y(d.value))
        .attr('height', d => height - y(d.value))
        .on('end', function(d, i) {
            // 最后一个柱状图动画完成后显示所有数值标签
            if (i === dataArray.length - 1) {
                valueLabels.transition()
                    .duration(500)
                    .style('opacity', 1);
            }
        });
    
    // 6. 添加交互效果 - 鼠标悬停
    barGroups.on('mouseover', function(event, d) {
        console.log("鼠标悬停在:", d.year, "值:", d.value);
        
        // 高亮当前柱状图
        d3.select(this).select('.bar')
            .transition()
            .duration(200)
            .attr('fill', '#4a9ff8') // 统一的高亮颜色
            .style('filter', 'brightness(1.3)'); // 增加亮度
        
        // 其他柱状图变暗
        barGroups.filter(data => data.year !== d.year)
            .select('.bar')
            .transition()
            .duration(200)
            .attr('opacity', 0.5);
        
        // 高亮当前数值标签
        d3.select(this).select('.value-label')
            .transition()
            .duration(200)
            .style('font-size', '14px')
            .style('font-weight', '700')
            .style('fill', '#ffffff');
        
        // 移除已有的提示框
        d3.select(`#${containerId}`).selectAll('.tooltip').remove();
        
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
            .style('border-left', '4px solid #4a9ff8')
            .style('z-index', '1000')
            .style('pointer-events', 'none');
        
        // 计算提示框位置
        const containerRect = d3.select(`#${containerId}`).node().getBoundingClientRect();
        const tooltipX = event.pageX - containerRect.left + 10;
        const tooltipY = event.pageY - containerRect.top - 60;
        
        // 如果是最近几年，将提示框移至左侧以避免超出屏幕
        const isRecentYear = d.index > years.length - 4;
        const adjustedX = isRecentYear ? tooltipX - 200 : tooltipX;
        
        // 计算增长率（对于非第一年）
        let growthInfo = '';
        if (d.index > 0) {
            const prevValue = values[d.index - 1];
            const growth = d.value - prevValue;
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
                    <strong style="font-size: 16px;">${d.year}</strong>
                </div>
                <div>招生人数: <strong>${d3.format(',')(d.value)}</strong> 人</div>
                ${growthInfo}
            `);
    })
    .on('mouseout', function(event, d) {
        console.log("鼠标离开:", d.year);
        
        // 恢复所有柱状图原样式
        barGroups.select('.bar')
            .transition()
            .duration(200)
            .attr('fill', d => colorScale(d.index))
            .attr('opacity', 1)
            .style('filter', 'none'); // 移除亮度滤镜
        
        // 恢复所有数值标签样式
        barGroups.select('.value-label')
            .transition()
            .duration(200)
            .style('font-size', '12px')
            .style('font-weight', '400')
            .style('fill', '#e0e0e0');
        
        // 移除提示框
        d3.select(`#${containerId}`).selectAll('.tooltip').remove();
    });
    
    // 添加调试信息
    console.log("创建了 " + barGroups.size() + " 个柱状图组");
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
    
    // 缩放比例
    const x = d3.scaleLinear()
        .domain([0, d3.max(degreeAwarded) * 1.1])
        .range([0, width]);
        
    const y = d3.scaleBand()
        .domain(years)
        .range([0, height])
        .padding(0.3);
    
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
    const awardedBars = svg.selectAll('.awarded-bar')
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
    const delayedBars = svg.selectAll('.delayed-bar')
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
    awardedBars.transition()
        .duration(800)
        .delay((d, i) => i * 50)
        .attr('width', d => x(d.awarded));
          
    // 添加动画效果 - 延毕人数条
    delayedBars.transition()
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
                    .attr('x', d => x(d.awarded) + 100)
                    .attr('y', d => y(d.year) + y.bandwidth() / 2 + 5)
                    .text(d => d.isMax ? '🔴 最高延毕率' : '🟢 最低延毕率')
                    .style('font-size', '12px')
                    .style('font-weight', '700')
                    .style('fill', d => d.isMax ? '#ff6b6b' : '#4caf50')
                    .style('opacity', 0)
                    .transition()
                    .duration(500)
                    .delay(500)
                    .style('opacity', 1);
            }
        });
        
    // 为柱状图添加交互效果
    const handleMouseOver = function(event, d) {
        // 创建提示框
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
            .style('border-left', '4px solid #4a9ff8')
            .style('z-index', '1000')
            .style('pointer-events', 'none');
            
        // 计算提示框位置
        const containerRect = d3.select(`#${containerId}`).node().getBoundingClientRect();
        const tooltipX = event.pageX - containerRect.left + 10;
        const tooltipY = event.pageY - containerRect.top - 60;
        
        // 高亮当前行
        svg.selectAll('.background-stripe')
            .filter((_, i) => i === years.indexOf(d.year))
            .transition()
            .duration(200)
            .attr('fill', 'rgba(74, 159, 248, 0.1)');
            
        // 高亮当前柱状图
        awardedBars.filter(data => data.year === d.year)
            .transition()
            .duration(200)
            .attr('fill', 'rgba(95, 140, 170, 1)')
            .style('filter', 'brightness(1.2)');
            
        delayedBars.filter(data => data.year === d.year)
            .transition()
            .duration(200)
            .attr('fill', 'rgba(231, 76, 60, 1)')
            .style('filter', 'brightness(1.2)');
            
        // 设置提示框内容
        tooltip
            .style('left', `${tooltipX}px`)
            .style('top', `${tooltipY}px`)
            .html(`
                <div style="border-bottom: 1px solid rgba(255,255,255,0.2); margin-bottom: 8px; padding-bottom: 5px;">
                    <strong style="font-size: 16px;">${d.year}</strong>
                </div>
                <div>授予学位: <strong>${d3.format(',')(d.awarded)}</strong> 人</div>
                <div>延毕人数: <strong>${d3.format(',')(d.delayed)}</strong> 人</div>
                <div>延毕率: <strong style="color: ${d.isMax ? '#ff6b6b' : d.isMin ? '#4caf50' : '#FFC107'}">${d.rate}%</strong></div>
            `);
    };
    
    const handleMouseOut = function(event, d) {
        // 移除提示框
        d3.select(`#${containerId}`).selectAll('.tooltip').remove();
        
        // 恢复背景条纹
        svg.selectAll('.background-stripe')
            .transition()
            .duration(200)
            .attr('fill', (_, i) => i % 2 === 0 ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)');
            
        // 恢复柱状图样式
        awardedBars.filter(data => data.year === d.year)
            .transition()
            .duration(200)
            .attr('fill', 'rgba(95, 140, 170, 0.8)')
            .style('filter', 'none');
            
        delayedBars.filter(data => data.year === d.year)
            .transition()
            .duration(200)
            .attr('fill', 'rgba(231, 76, 60, 0.8)')
            .style('filter', 'none');
    };
    
    // 为所有的柱状图添加交互事件
    awardedBars.on('mouseover', handleMouseOver)
              .on('mouseout', handleMouseOut);
              
    delayedBars.on('mouseover', handleMouseOver)
              .on('mouseout', handleMouseOut);
}
