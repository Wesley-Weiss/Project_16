const svg = d3.select("body")
              .append("svg");

let width = window.innerWidth * 0.95;
let height = window.innerHeight * 0.75;

svg.attr('width', width);
svg.attr('height', height);
svg.style('padding', '20px');

fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
)
  .then((response) => response.json())
  .then((data) => {
    const GDP = data.data.map((item) => item[1]);
    const date = data.data.map((item) => item[0]);
    
    const maxGDP = d3.max(GDP) + 500;

    const lastDate = date[date.length - 1];
    const firstDate = date[0];

    const yScale = d3.scaleLinear()
                      .domain([0, maxGDP])
                      .range([height, 30]);
    
    const xScale = d3.scaleUtc()
                      .domain([new Date(firstDate), new Date(lastDate)])
                      .range([60, width -10])

    const barWidth = xScale(new Date(date[1])) - xScale(new Date(date[0]));
    
    const yAxis = svg.append('g')
      .attr('id', 'y-axis')
      .attr('transform', `translate(60,-30)`)
      .call(d3.axisLeft(yScale))

    yAxis
      .append("text")
      .attr("fill", "currentColor")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -40)
      .text("GDP IN BILLIONS");
    
    const xAxis = svg.append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(0, ${height-30})`)
      .call(d3.axisBottom(xScale));
    
    xAxis
      .append("text")
      .attr("fill", "currentColor")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", 25)
      .text("YEARS");
    
    svg
      .selectAll("rect")
      .data(GDP)
      .enter()
      .append("rect")
      .attr("data-date", (d, i) => date[i])
      .attr("data-gdp", (d) => d)
      .attr("x", (d, i) => (xScale(new Date(date[i]))))
      .attr("y", (d) => yScale(d) - 30)
      .attr("height", (d) => height - yScale(d))
      .attr("width", barWidth)
      .attr("class", "bar")
      .attr("fill", "black");
    
    
    
      $('.bar').hover(
        function() {
          $(this).css("fill", "gray");
          const tooltip = document.createElement('div');
          tooltip.id = 'tooltip';
          const currentDate = $(this).data('date');
          const currentGDP = $(this).data("gdp");
          tooltip.setAttribute('data-date', currentDate);
          tooltip.setAttribute('data-gdp', currentGDP);
          tooltip.innerText = `Date: ${currentDate}
                               GDP: ${currentGDP} Billion`;
          tooltip.style.top = `${$(this).attr('y') + height}px`;
          
          console.log($(this).attr('y'));
          
          $('body').append(tooltip)

        },
        function() {
          $(this).css("fill", "black");
          $('#tooltip').remove()
        }
      )
  })
  .catch((error) => {
  console.log("Error: ",error)
})

