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

// 更新可视化的主函数
function drawChart(container, data, chartType) {
    switch(chartType) {
        case "line":
            createLineChart(container, data);
            break;
        case "bar":
            createBarChart(container, data);
            break;
        default:
            container.innerHTML = "<p>未支持的图表类型</p>";
    }
}