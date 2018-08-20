export default class WeightHeightChart {
  constructor (athletes) {
    this.weightGroupSize = 3;
    this.heightGroupSize = 3;

    this.weightDimension = athletes.dimension((athlete) => {
      return Math.floor(athlete.weight / this.weightGroupSize) + 'kg' + Math.floor(athlete.height / this.heightGroupSize) + 'cm';
    });

    this.createGroupFromDimension();
    this.chartContainer = d3.select('#weightHeightChart');
    this.chart = null; // This will hold chart SVG Dom element reference
    this.chartWidth = 960; // Width in pixels
    this.chartHeight = 300; // Height in pixels
    this.margin = 50; // Margin in pixels
    this.chartWidthWithoutMargin = this.chartWidth - this.margin;
    this.chartHeightWithoutMargin = this.chartHeight - this.margin;
    this.weightScale = null;
    this.heightScale = null;
    this.countScale = null;
    this.tooltipContainer = null;
  }

  createGroupFromDimension () {
    this.heightGroup = this.weightDimension.group()
      .reduce(
        // reduceAdd()
        (output, input) => {
          output.count++;
          output.weight = input.weight || 0;
          output.height = input.height || 0;
          return output;
        },
        // reduceRemove()
        (output, input) => {
          --output.count;
          output.weight = input.weight || 0;
          output.height = input.height || 0;
          return output;
        },
        // reduceInitial()
        () => {
          return {weight: null, height: null, count: 0};
        }
      )
      .order((p) => {
        return p.count;
      });
  }

  render () {
    this.createSvg();
    this.initScales();
    this.drawAxes();
    this.drawPoints();
  }

  createSvg () {
    this.chart = this.chartContainer
      .append('svg')
      .attr('width', this.chartWidth)
      .attr('height', this.chartHeight);
  }

  initScales () {
    // Get Max Weight
    this.heightGroup.order((p) => {
      return p.weight;
    });

    // TODO dangerouse if array is empty and simply plain ugly
    let maxWeight = this.heightGroup.top(1)[0].value.weight;

    // Get max Height
    this.heightGroup.order((p) => {
      return p.height;
    });

    // TODO dangerouse if array is empty and simply plain ugly
    let maxHeight = this.heightGroup.top(1)[0].value.height;

    // Get Max Count
    this.heightGroup.order((p) => {
      return p.count;
    });

    let maxCount = this.heightGroup.top(1)[0].value.count;

    this.weightScale = d3.scaleLinear().domain([0, maxWeight]).range([this.margin, this.chartWidthWithoutMargin]);
    this.heightScale = d3.scaleLinear().domain([0, maxHeight]).range([this.chartHeightWithoutMargin, this.margin]);
    this.countScale = d3.scalePow().domain([0, maxCount]).range([3, 10]);
  }

  drawAxes () {
    let weightAxis = d3.axisBottom(this.weightScale);
    let heightScale = d3.axisLeft(this.heightScale);

    this.chart
      .append('g')
      .attr('class', 'c-axis')
      .attr('transform', 'translate(0, ' + this.chartHeightWithoutMargin + ')')
      .call(weightAxis);

    this.chart
      .append('g')
      .attr('class', 'c-axis')
      .attr('transform', 'translate(' + this.margin + ', 0)')
      .call(heightScale);
  }

  drawPoints () {
    this.chart
      .append('g')
      .attr('class', 'c-points')
      .selectAll('circle')
      .data(this.heightGroup.top(Infinity))
      .enter()
      .append('circle')
      .attr('cx', (d) => {
        return this.weightScale(d.value.weight);
      })
      .attr('cy', (d) => {
        return this.heightScale(d.value.height);
      })
      .attr('r', (d) => {
        return this.countScale(d.value.count);
      })
      .on('mouseover', (d) => {
        let weightText = d.value.weight + '-' + this.weightGroupSize + d.value.weight + 'kg ';
        if (d.value.weight === 0) {
          weightText = 'N/A kg ';
        }

        let heightText = d.value.height + '-' + this.heightGroupSize + d.value.height + 'cm ';
        if (d.value.height === 0) {
          heightText = 'N/A cm ';
        }

        this.showTooltip(
          weightText + heightText + ': ' + d.value.count,
          d3.event.pageX,
          d3.event.pageY
        );
      })
      .on('mouseout', (d) => {
        this.hideTooltip();
      });
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