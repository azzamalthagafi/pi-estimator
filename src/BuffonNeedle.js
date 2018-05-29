import React from 'react'
import PropTypes from 'prop-types'
import { select } from 'd3-selection'
const Latex = require('react-latex');
const random = require("random-js")();


class BuffonNeedle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      N: 100, // number of trials
      l: 100, // length of needle
      d: 100, // distance between parallel lines
      crossCount: 0,
      totalCount: 0,
      crossColor:'#FF1493',
      needleColor: '#0000FF',
      greyColor: '#202020'
    };
  }

  componentDidMount() {
    this.createSimulation();
  }

  createSimulation() {
    // reset svg
    const node = this.node;
    select(node).html('');

    // constants
    const sideLength = Math.min(this.props.height, this.props.width);

    // append square
    select(node).append('rect')
                .attr('width', sideLength)
                .attr('height', sideLength)
                .attr('x', this.props.width / 2 - sideLength / 2)
                .attr('y', this.props.height / 2 - sideLength / 2)
                .style('stroke', this.state.needleColor)
                .style('fill', 'none');

    // append parallel lines
    for (var i = 0; i <= this.props.width; i+= this.state.d) {
      select(node).append('line')
                  .attr('x1', i)
                  .attr('y1', 0)
                  .attr('x2', i)
                  .attr('y2', this.props.height)
                  .style('stroke', this.state.greyColor);
    }
  }

  runSimulation(N) {
    const node = this.node;

    // function to determine if a needle is crossing a parallel line
    this.isCrossing = function({ x1, y1, x2, y2 }) {
      // loop through all parallel lines and check intersection
      for (var i = 0; i <= this.props.width; i += this.state.d) {
        if ((x1 < i && x2) > i || (x1 > i && x2 < i)) { return true; }
      }

      return false;
    }

    /*
     * function to generate a needle uniformly at random.
     * Note: there are two parameters characterizing a needle.
     *    Theta: the smaller angle made with respect to normal line
     *    h: distance from center of needle to closest parallel line
     *
     * The parameters follow the following distribution
     * theta: Uniform [0, Pi / 2]
     * h: Uniform [0, d]
     */
    this.genNeedle = function() {
      // randomly generate theta and h
      var theta = random.real(0, 1) * Math.PI;
      var h = random.real(0, this.state.d);

      /* the above parameters describe whether a needle crosses a line or not.
       * In order to simulate the dropping of the needle, we need to randomly
       * select a position where the needle falls based on the above criteria.
       */

       // randomly select a center point based on h
       var lines = [];
       for (var i = 0; i < this.props.width; i += this.state.d) {
         if (i != 0) lines.push(i);
       }

       // pick a line to base h on
       var line = random.pick(lines)
       // pick which side of the line the needle's center is at
       var cx = random.bool() ? line + h : line - h;
       // pick y position
       var cy = random.real(0, this.props.height);


       // calculate absolute positions based on cx, cy, h, and theta
       var x1 = cx - Math.sin(theta) * this.state.l / 2;
       var y1 = cy + Math.cos(theta) * this.state.l / 2;
       var x2 = cx + Math.sin(theta) * this.state.l / 2;
       var y2 = cy - Math.cos(theta) * this.state.l / 2;
      return {x1, y1, x2, y2};
    }

    // modifying state directly would not work due to the async nature of setState
    var crossCount = 0;
    var totalCount = 0;

    // create needles
    for (var i = 0; i < N; i++) {
      let needle = this.genNeedle();

      // append node
      setTimeout(() => {
        select(node).append('line')
                    .attr('x1', needle.x1)
                    .attr('y1', needle.y1)
                    .attr('x2', needle.x2)
                    .attr('y2', needle.y2)
                    .style('stroke', this.isCrossing(needle) ? this.state.crossColor : this.state.needleColor);

        if (this.isCrossing(needle)) {
          crossCount++;
        }
        totalCount++;

        this.setState({
          crossCount,
          totalCount
        });

      }, 30);
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const N = Number(document.getElementById('N').value);
    this.setState({ N });
    this.createSimulation();
    this.runSimulation(N);
  }

  renderDetails = () => {
    return (
      <div>
        <h3>{'Monte Carlo Estimation of Pi using Buffon\'s Needle'}</h3>
          <Latex>
          {`Buffon's Needle is a problem in probability that asks for the probability of
            a given needle of length $l$ to land on a line, given the floor has equally spaced parallel
            lines with distance between them equal to $d$`}
          </Latex>
          <br/>
          <br/>
          <Latex>
          In the simple case where $l = d$, the probability is equal to $\frac 2 \pi$.
          We can approximate the value of $\pi$ by using a Monte Carlo simulation of this problem to
          approximate the probability and then solving for $\pi$
          </Latex>
          <br/>
          <br/>

          <form className="form-inline" onSubmit={this.handleSubmit}>
          <label className="sr-only" htmlFor="N">N</label>
          <div className="input-group mb-2 mr-sm-2">
            <div className="input-group-prepend">
              <div className="input-group-text">
                N
              </div>
            </div>
            <input type="number" className="form-control" id='N' placeholder='100' max="10000"/>
          </div>

          <button type="submit" className="btn btn-primary mb-2">Submit</button>
          </form>

          <table className="table">
            <tbody>
              <tr>
                <th scope="row"># of crossing needles</th>
                <td>{this.state.crossCount}</td>
              </tr>

              <tr>
                <th scope="row"># of total needles</th>
                <td>{this.state.totalCount}</td>
              </tr>

              <tr>
                <th scope="row"><Latex>{'$\\pi \\approx 2 \\cdot \\frac\{\\# total\}\{\\# crossing\}$'}</Latex></th>
                <td>{ this.state.totalCount / this.state.crossCount * 2 || undefined}</td>
              </tr>
            </tbody>
          </table>
      </div>
    );
  }

  render () {
    return (
      <div className='row justify-content-md-center' style={{width: 'inherit'}}>
        <div className='col-lg-5 text-center'>
          {this.renderDetails()}
        </div>
        <div className='col-lg-7 text-center'>
          <svg ref={node => this.node = node}
            width = {this.props.width} height = {this.props.height}>
          </svg>
        </div>
      </div>
    );
  }
}

BuffonNeedle.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
}

export default BuffonNeedle;
