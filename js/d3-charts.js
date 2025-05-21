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
        
    // 添加Y轴
    svg.append('g')
        .call(d3.axisLeft(y)
            .tickFormat(d => d3.format(',')(d)))
        .selectAll('text')
        .style('font-size', '12px')
        .style('fill', '#e0e0e0');
        
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
        .style('fill', '#e0e0e0')
        .style('opacity', 0)  // 初始透明
        .text(d => d3.format(',')(d));
        
    // 添加标题
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('fill', '#e0e0e0')
        .text('我国博士生招生数据(2004-2022年)');
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
    svg.selectAll('rect')
        .on('mouseover', function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('fill', '#FFC107')
                .attr('opacity', 1);
                
            // 显示数据提示
            const i = d3.select(this).datum();
            const index = values.indexOf(i);
            const year = years[index];
            
            d3.select(`#${containerId}`)
                .append('div')
                .attr('class', 'tooltip')
                .style('position', 'absolute')
                .style('background-color', 'rgba(20, 20, 20, 0.8)')
                .style('color', '#fff')
                .style('padding', '8px 12px')
                .style('border-radius', '4px')
                .style('font-size', '14px')
                .style('box-shadow', '0 2px 10px rgba(0,0,0,0.3)')
                .style('left', `${event.pageX - d3.select(`#${containerId}`).node().getBoundingClientRect().left + 10}px`)
                .style('top', `${event.pageY - d3.select(`#${containerId}`).node().getBoundingClientRect().top - 40}px`)
                .style('pointer-events', 'none')
                .html(`
                    <strong>${year}年</strong><br>
                    博士招生数: <strong>${d3.format(',')(d)}</strong>人
                `);
        })
        .on('mouseout', function() {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('fill', (d, i) => colorScale(i))
                .attr('opacity', 0.9);
                
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
        
    // 数据处理 - 计算延毕比例
    const delayRates = years.map((year, i) => ({
        year,
        awarded: degreeAwarded[i],
        delayed: delayedGraduation[i],
        rate: (delayedGraduation[i] / degreeAwarded[i] * 100).toFixed(1)
    }));
    
    // 为每组创建一个分组
    years.forEach((year, i) => {
        svg.append('g')
            .attr('class', `year-group-${i}`)
            .attr('transform', `translate(0, ${i * (height / years.length)})`);
    });
    
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
        
    // 添加X轴
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d => d3.format(',')(d)))
        .selectAll('text')
        .style('font-size', '12px')
        .style('fill', '#e0e0e0');
        
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
                    .style('fill', '#FFC107')
                    .style('opacity', 0)
                    .transition()
                    .duration(500)
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
                
            // 显示详细信息提示
            d3.select(`#${containerId}`)
                .append('div')
                .attr('class', 'tooltip')
                .style('position', 'absolute')
                .style('background-color', 'rgba(20, 20, 20, 0.9)')
                .style('color', '#fff')
                .style('padding', '10px 15px')
                .style('border-radius', '4px')
                .style('font-size', '14px')
                .style('box-shadow', '0 3px 15px rgba(0,0,0,0.4)')
                .style('left', `${event.pageX - d3.select(`#${containerId}`).node().getBoundingClientRect().left + 15}px`)
                .style('top', `${event.pageY - d3.select(`#${containerId}`).node().getBoundingClientRect().top - 50}px`)
                .style('pointer-events', 'none')
                .style('z-index', '1000')
                .html(`
                    <div style="border-bottom: 1px solid rgba(255,255,255,0.2); margin-bottom: 8px; padding-bottom: 5px;">
                        <strong style="font-size: 16px;">${d.year}</strong>
                    </div>
                    <div>授予学位数: <strong>${d3.format(',')(d.awarded)}</strong>人</div>
                    <div>延毕人数: <strong>${d3.format(',')(d.delayed)}</strong>人</div>
                    <div style="margin-top: 8px; color: #FFC107;">延毕率: <strong>${d.rate}%</strong></div>
                `);
        })
        .on('mouseout', function() {
            // 恢复原始样式
            d3.select(this)
                .transition()
                .duration(200)
                .attr('fill', 'rgba(95, 140, 170, 0.8)')
                .attr('opacity', 0.9);
                
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
                
            // 显示详细信息提示
            d3.select(`#${containerId}`)
                .append('div')
                .attr('class', 'tooltip')
                .style('position', 'absolute')
                .style('background-color', 'rgba(20, 20, 20, 0.9)')
                .style('color', '#fff')
                .style('padding', '10px 15px')
                .style('border-radius', '4px')
                .style('font-size', '14px')
                .style('box-shadow', '0 3px 15px rgba(0,0,0,0.4)')
                .style('left', `${event.pageX - d3.select(`#${containerId}`).node().getBoundingClientRect().left + 15}px`)
                .style('top', `${event.pageY - d3.select(`#${containerId}`).node().getBoundingClientRect().top - 50}px`)
                .style('pointer-events', 'none')
                .style('z-index', '1000')
                .html(`
                    <div style="border-bottom: 1px solid rgba(255,255,255,0.2); margin-bottom: 8px; padding-bottom: 5px;">
                        <strong style="font-size: 16px;">${d.year}</strong>
                    </div>
                    <div>延毕人数: <strong>${d3.format(',')(d.delayed)}</strong>人</div>
                    <div style="margin-top: 8px; color: #FFC107;">延毕率: <strong>${d.rate}%</strong></div>
                `);
        })
        .on('mouseout', function() {
            // 恢复原始样式
            d3.select(this)
                .transition()
                .duration(200)
                .attr('fill', 'rgba(231, 76, 60, 0.8)')
                .attr('opacity', 0.9);
                
            // 移除提示
            d3.select(`#${containerId}`).selectAll('.tooltip').remove();
        });
}
