function tab1(){
	 var margin = {top: 10, right: 40, bottom: 150, left: 80},
                    width = 1200 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;

                var formatPercent = d3.format(".0%");

                var x = d3.scale.ordinal()
                    .rangeRoundBands([0, width], .1);

                var y = d3.scale.linear()
                    .range([height, 0]);

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left");

                var tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])
                    .html(function(d) {
                    return "<strong>Literate Persons:</strong> <span style='color:red'>" + d.Literatepersons + "</span>";
                     });

                var svg = d3.select("#id1").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                svg.call(tip);

                d3.json('./output/newage.json', function(error, data) {
                    x.domain(data.map(function(d) { return d.Agegroup; }));
                    y.domain([0, d3.max(data, function(d) { return +d.Literatepersons; })]);

                svg.append("g")
                  .attr("class", "x axis")
                  .attr("transform", "translate(0," + height+ ")")
                  .call(xAxis)
                  .append('text')
                  .attr("x", 550)
                  .attr("y", 40)
                  .attr("dx", ".71em")
                  .style("text-anchor", "end")
                  .text("Age Group");

                svg.append("g")
                  .attr("class", "y axis")
                  .call(yAxis)
                  .append("text")
                  .attr("transform", "rotate(-90)")
                  .attr("y", 6)
                  .attr("dy", ".71em")
                  .style("text-anchor", "end")
                  .text("Literate Persons");

                svg.selectAll(".bar")
                  .data(data)
                  .enter().append("rect")
                  .attr("class", "bar")
                  .attr("x", function(d) { return x(d.Agegroup); })
                  .attr("width", x.rangeBand())
                  .attr("y", function(d) { return y(+d.Literatepersons); })
                  .attr("height", function(d) { return height - y(+d.Literatepersons); })
                  .on('mouseover', tip.show)
                  .on('mouseout', tip.hide)
                });
}

function tab2(){
	var margin={top:10, right:40, bottom:210, left:80},
        width=1200-margin.left-margin.right,
        height=500-margin.top-margin.bottom;

    var horizontal=d3.scale.ordinal().rangeRoundBands([0,width],0.25),
        vertical=d3.scale.linear().rangeRound([height,0]);

    var color = d3.scale.category20();

    var xAxis=d3.svg.axis()
        .scale(horizontal)
        .orient("bottom");

    var yAxis=d3.svg.axis()
        .scale(vertical)
        .orient("left");

    var svg=d3.select("#id2").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");

    d3.json("./output/newgraduate.json",function(err,data){
       data.forEach(function(d){
				
        d.AreaName=d.AreaName;
        d.GraduateaboveMales=+d['Educational level - Graduate & above - Males'];
        d.GraduateaboveFemales=+d['Educational level - Graduate & above - Females'];
    });

    var xData=["GraduateaboveMales","GraduateaboveFemales"];

    var dataIntermediate = xData.map(function (c) {
        return data.map(function (d) {
          return {x: d.AreaName, y: d[c]};
        });
    });

    var dataStackLayout = d3.layout.stack()(dataIntermediate);

    horizontal.domain(dataStackLayout[0].map(function (d) {
      return d.x;
    }));

    vertical.domain([0,d3.max(dataStackLayout[dataStackLayout.length - 1],
      function (d) { return d.y0 + d.y;})
    ])
    .nice();

    var layer = svg.selectAll(".stack")
        .data(dataStackLayout)
        .enter().append("g")
        .attr("class", "stack")
        .style("fill", function (d, i) {
        return color(i);
    });

        layer.selectAll("rect")
        .data(function (d) {
          return d;
        })

        .enter().append("rect")
        .attr("height", 0)
        .attr("y", height)
        .transition().duration(3000)
        .delay(function(d,i){
         return i*100;
        })

        .attr("x", function (d) {
         return horizontal(d.x);
        })

        .attr("y", function (d) {
         return vertical(d.y + d.y0);
        })

        .attr("height", function (d) {
         return vertical(d.y0) - vertical(d.y + d.y0);
        })

        .attr("width", horizontal.rangeBand());

        svg.append("g")
          .attr("class", "axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", function(d) {
          return "rotate(-65)"
          })
          .append("text")
          .attr("transform", "translate(" + width + "0)")
          .style("font-size","15px")
          .style("font-weight","bold")
          .style("color","black");

        svg.append("g")
          .attr("class", "axis")
          .call(yAxis)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("dy","1em")
          .style("text-anchor", "end")
          .style("font-size","12px")
          .style("font-weight","bold")
          .style("color","black")
          .text("Graduate Population");

    var legend = svg.selectAll(".legend")
        .data(color.domain().slice().reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 +
        ")"; });

        legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

        legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .style("fill","black")
        .style("font-size","12px")
        .text(function(d,i) { return xData[i]+""; });
      });
}

function tab3(){
	 Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this;
  };

  var margin = {top: 10, right: 80, bottom: 320, left: 90},
      width = 1200 - margin.left - margin.right,
      height = 650 - margin.top - margin.bottom;
  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .35);
  var y = d3.scale.linear()
      .range([height, 0]);
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");
  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(10);

  var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<strong>Total Population:</strong> <span style='color:red'>" + d.TotalPopulation + "</span>";
      });

  var svg = d3.select("#chart").append("svg")
      .attr("width", 1160)
      .attr("height", 650)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      svg.call(tip);

  d3.json("./output/neweducation.json", function(error, data) {

    if (error) throw error;

  var xDomain = data.map(function(d) { return d.EducationCategory; });
      xDomain = xDomain.move(xDomain.indexOf('Educational level - Below Primary - Persons'),0);
      x.domain(xDomain);
      y.domain([0, d3.max(data, function(d) {  return d.TotalPopulation; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.1em")
      .attr("dy", ".15em")
      .attr("transform", function(d) {
      return "rotate(-50)"
      });

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("TotalPopulation");

  svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.EducationCategory); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.TotalPopulation); })
      .attr("height", function(d) { return height - y(d.TotalPopulation); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);
  });
}
