import React from "react";
import Proptypes from "prop-types";

export default class GraphUVI extends React.Component {
  static propTypes = {
    historyUVI: Proptypes.arrayOf(
      Proptypes.objectOf(
        /* lat */
        Proptypes.number,
        /* lon */
        Proptypes.number,
        /* date_iso */
        Proptypes.string,
        /* date */
        Proptypes.number,
        /* value */
        Proptypes.number
      ).isRequired
    ).isRequired
  };

  constructor(props) {
    super(props);
    this.graphUVI = React.createRef();
    this.updateGraph = this.updateGraph.bind(this);
  }

  componentDidMount() {
    this.updateGraph();
  }

  componentDidUpdate() {
    this.updateGraph();
  }

  updateGraph() {
    const { historyUVI } = this.props;
    const points = historyUVI.map(uvi => {
      return {
        date: new Date(uvi.date * 1000).toLocaleString().split(",")[0],
        value: uvi.value
      };
    });

    /* Get canvas */
    const canvas = this.graphUVI.current;
    const context = canvas.getContext("2d");
    /* Outer chart style */
    context.fillStyle = "#f0ffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    /* Clear for displaying data */
    context.clearRect(100, 50, 600, 500);
    /* Inner chart */
    context.beginPath();
    /* Draw vertical line */
    context.moveTo(100, 50);
    context.lineTo(100, 550);
    /* Draw horizontal line */
    context.lineTo(700, 550);

    /* Add some labels */
    context.font = "10px Comic Sans MS";
    context.strokeText("UVI", 80, 50);
    context.strokeText("Days", 720, 550);
    context.strokeText(points[0].date, 120, 560);
    context.strokeText(points[points.length - 1].date, 680, 560);

    /* Make lines connecting the points */
    let xAxisVisitor = 120;
    context.moveTo(xAxisVisitor, 550 - points[0].value * 30);
    context.rect(xAxisVisitor, 550 - points[0].value * 30, 2, 2);
    points.slice(1, points.length).forEach(point => {
      xAxisVisitor += 20;
      context.lineTo(xAxisVisitor, 550 - point.value * 30);
      context.rect(xAxisVisitor, 550 - point.value * 30, 2, 2);
    });

    /* Apply all draws */
    context.stroke();
  }

  render() {
    return (
      <canvas
        ref={this.graphUVI}
        width={900}
        height={600}
        style={{ border: "1px solid black" }}
      />
    );
  }
}
