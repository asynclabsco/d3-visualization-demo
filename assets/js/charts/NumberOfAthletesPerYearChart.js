export default class NumberOfAthletesPerYearChart {
  constructor (athletes) {
    this.athletesDimension = athletes.dimension(function (athlete) {
      return athlete.year + athlete.season;
    });
    this.createGroupFromDimension();
    this.chartContainer = d3.select('#yearAthletesCountChart');
    this.chart = null; // This will hold chart SVG Dom element reference
    this.chartWidth = 960; // Width in pixels
    this.chartHeight = 400; // Height in pixels
    this.margin = 50; // Margin in pixels
    this.chartHeightWithoutMargin = this.chartHeight - this.margin;
    this.countScale = null;
    this.yearScale = null;
    this.tooltipContainer = null;
  }

  createGroupFromDimension () {
    this.numberOfAthletesPerYearGroup = this.athletesDimension.group()
      .reduce(
        // reduceAdd()
        (output, input) => {
          output.count++;
          output.year = input.year;
          output.season = input.season;
          return output;
        },
        // reduceRemove()
        (output, input) => {
          --output.count;
          output.year = input.year;
          output.season = input.season;
          return output;
        },
        // reduceInitial()
        () => {
          return {year: null, season: null, count: 0};
        }
      )
      .order(function (p) {
        return p.count;
      });
  }

  createSvg () {
    this.chart = this.chartContainer
      .append('svg')
      .attr('width', this.chartWidth)
      .attr('height', this.chartHeight);
  }

  initScales () {
    // TODO potentially unsafe, if top() returns []
    let maxCount = this.numberOfAthletesPerYearGroup.top(1)[0];
    let chartWidth = +this.chart.attr('width') - this.margin;
    let chartHeight = +this.chart.attr('height') - this.margin;

    this.countScale = d3.scaleLinear().domain([0, maxCount.value.count]).range([chartHeight, this.margin]);
    // TODO We are hardcoding years for now
    this.yearScale = d3.scaleLinear().domain([1896, 2018]).range([this.margin, chartWidth]);
  }

  drawAxes () {
    let countAxis = d3.axisLeft(this.countScale);
    let yearAxis = d3.axisBottom(this.yearScale);

    this.chart
      .append('g')
      .attr('class', 'c-axis')
      .attr('transform', 'translate(' + this.margin + ', 0)')
      .call(countAxis);

    this.chart
      .append('g')
      .attr('class', 'c-axis')
      .attr('transform', 'translate(0, ' + this.chartHeightWithoutMargin + ')')
      .call(yearAxis);
  }

  drawPoints () {
    this.chart
      .append('g')
      .attr('class', 'c-points')
      .selectAll('circle')
      .data(this.numberOfAthletesPerYearGroup.top(Infinity))
      .enter()
      .append('circle')
      .attr('cx', (d) => {
        return this.yearScale(d.value.year);
      })
      .attr('cy', (d) => {
        return this.countScale(d.value.count);
      })
      .attr('r', '5')
      .on('mouseover', (d) => {
        this.showTooltip(
          d.value.year + ' ' + d.value.season + ': ' + d.value.count,
          d3.event.pageX,
          d3.event.pageY
        );
      })
      .on('mouseout', (d) => {
        this.hideTooltip();
      });
  }

  drawLine () {
    let line = d3.line()
      .x((d) => {
        return this.yearScale(d.value.year);
      })
      .y((d) => {
        return this.countScale(d.value.count);
      });

    this.numberOfAthletesPerYearGroup.order((d) => {
      return d.year;
    });

    this.chart
      .append('g')
      .attr('class', 'c-line')
      .append('path')
      .attr('d', line(this.numberOfAthletesPerYearGroup.top(Infinity)));
  }

  render () {
    this.createSvg();
    this.initScales();
    this.drawAxes();
    this.drawLine();
    this.drawPoints();
  }

  createTooltipIfDoesntExist () {
    if (this.tooltipContainer !== null) {
      return;
    }

    this.tooltipContainer = this.chartContainer
      .append('div')
      .attr('class', 'c-tooltip');
  }

  showTooltip (content, left, top) {
    this.createTooltipIfDoesntExist();

    this.tooltipContainer
      .html(content)
      .style('left', left + 'px')
      .style('top', top + 'px');

    this.tooltipContainer
      .transition()
      .duration(200)
      .style('opacity', 1);
  }

  hideTooltip () {
    this.createTooltipIfDoesntExist();

    this.tooltipContainer
      .transition()
      .duration(500)
      .style('opacity', 0);
  }
}