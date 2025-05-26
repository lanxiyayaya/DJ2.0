// 这个文件将包含数据可视化的代码

// 使用D3.js创建折线图的函数
function createLineChart(container, data) {
    // 清空容器
    d3.select(container).html("");
    
    // 设置尺寸和边距
    const margin = {top: 20, right: 30, bottom: 30, left: 40},
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
    
    // 创建SVG
    const svg = d3.select(container)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    // X轴比例尺
    const x = d3.scaleLinear()
        .domain([0, data.length - 1])
        .range([0, width]);
    
    // Y轴比例尺
    const y = d3.scaleLinear()
        .domain([0, d3.max(data)])
        .nice()
        .range([height, 0]);
    
    // 添加X轴
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));
    
    // 添加Y轴
    svg.append("g")
        .call(d3.axisLeft(y));
    
    // 创建折线生成器
    const line = d3.line()
        .x((d, i) => x(i))
        .y(d => y(d))
        .curve(d3.curveMonotoneX);
    
    // 添加折线路径
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#0066cc")
        .attr("stroke-width", 2)
        .attr("d", line);
    
    // 添加数据点
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", (d, i) => x(i))
        .attr("cy", d => y(d))
        .attr("r", 5)
        .attr("fill", "#0066cc");
}

// 创建柱状图的函数
function createBarChart(container, data) {
    // 清空容器
    d3.select(container).html("");
    
    // 设置尺寸和边距
    const margin = {top: 20, right: 30, bottom: 40, left: 40},
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
    
    // 创建SVG
    const svg = d3.select(container)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    // X轴比例尺
    const x = d3.scaleBand()
        .domain(data.map(d => d.category))
        .range([0, width])
        .padding(0.1);
    
    // Y轴比例尺
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .nice()
        .range([height, 0]);
    
    // 添加X轴
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");
    
    // 添加Y轴
    svg.append("g")
        .call(d3.axisLeft(y));
    
    // 添加柱状图
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.category))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", "#0066cc");
}

// 创建年度博士生招生数量柱状图函数（带悬停效果）
function createYearlyBarChart(container, years, values) {
    // 清空容器
    d3.select(container).html("");
    
    // 输出调试信息
    console.log("创建年度柱状图", years, values);
    
    // 设置尺寸和边距
    const margin = {top: 30, right: 30, bottom: 70, left: 60},
        width = 800 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;
    
    // 创建SVG
    const svg = d3.select(container)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    // 创建工具提示div
    const tooltip = d3.select(container)
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "1px solid #ddd")
        .style("border-radius", "3px")
        .style("padding", "10px")
        .style("pointer-events", "none")
        .style("font-size", "12px")
        .style("box-shadow", "0 0 10px rgba(0,0,0,0.1)");
    
    // X轴比例尺
    const x = d3.scaleBand()
        .domain(years)
        .range([0, width])
        .padding(0.2);
    
    // Y轴比例尺
    const y = d3.scaleLinear()
        .domain([0, d3.max(values) * 1.1]) // 给顶部留一些空间
        .nice()
        .range([height, 0]);
    
    // 添加X轴
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end")
        .style("font-size", "10px");
    
    // 添加Y轴
    svg.append("g")
        .call(d3.axisLeft(y).tickFormat(d => d3.format(",")(d)));
    
    // 添加Y轴标题
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 15)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .text("招生人数");
    
    // 定义颜色渐变
    const colorScale = d3.scaleSequential()
        .domain([0, years.length-1])
        .interpolator(d3.interpolateBlues);
      // 添加柱状图
    svg.selectAll(".bar")
        .data(values)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => x(years[i]))
        .attr("y", d => y(d))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d))
        .attr("fill", (d, i) => colorScale(i + 3)) // 避免颜色太浅
        .attr("rx", 3) // 圆角矩形
        .attr("ry", 3)
        // 添加交互效果
        .on("mouseover", function(event, d) {
            // 高亮当前柱形
            d3.select(this)
                .transition()
                .duration(200)
                .attr("fill", "#ff7f0e");
            
            // 获取当前柱形的索引
            const index = values.indexOf(d);
            const year = years[index];
            
            // 显示工具提示
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`${year}<br>博士招生: <b>${d3.format(",")(d)}人</b>`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            // 恢复颜色
            const index = values.indexOf(d);
            d3.select(this)
                .transition()
                .duration(200)
                .attr("fill", colorScale(index + 3));
            
            // 隐藏工具提示
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
    
    // 添加标题
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("2004-2022年博士生招生数量");
    
    // 可选：添加数据标签
    svg.selectAll(".label")
        .data(values)
        .enter().append("text")
        .attr("class", "label")
        .attr("x", (d, i) => x(years[i]) + x.bandwidth() / 2)
        .attr("y", d => y(d) - 5)
        .attr("text-anchor", "middle")
        .style("font-size", "8px")
        .style("opacity", 0) // 初始不显示
        .text(d => d3.format(",")(d))
        // 仅在悬停时显示数据标签
        .on("mouseover", function() {
            d3.select(this).transition().style("opacity", 1);
        })
        .on("mouseout", function() {
            d3.select(this).transition().style("opacity", 0);
        });
}

// 更新可视化的主函数
function drawChart(container, data, chartType) {
    console.log("drawChart 被调用", container, data, chartType);
    
    switch(chartType) {
        case "line":
            createLineChart(container, data);
            break;
        case "bar":
            createBarChart(container, data);
            break;
        case "yearlyBar":
            // 如果是年度数据，则使用专门的年度柱状图函数
            if (data.years && data.values) {
                console.log("调用 createYearlyBarChart 函数", data.years, data.values);
                createYearlyBarChart(container, data.years, data.values);
            } else {
                console.error("年度数据格式不正确", data);
            }
            break;
        default:
            container.innerHTML = "<p>未支持的图表类型</p>";
    }
}