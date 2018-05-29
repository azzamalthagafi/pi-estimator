import React from 'react'
import PropTypes from 'prop-types'
import { select } from 'd3-selection'
const Latex = require('react-latex');
const random = require("random-js")();


class CircleArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      N: 100,
      inCount: 0,
      totalCount: 0,
      squareColor:'#FF1493',
      circleColor: '#0000FF',
    };
  }

  componentDidMount() {
    this.createSimulation();
  }

  createSimulation() {
    // reset svg
    const node = this.node;
    select(node).html('');

    const d = Math.min(this.props.height, this.props.width);
    const r = d / 2 ;
    const cx = this.props.width / 2;
    const cy = this.props.height / 2;

    // append circle
    select(node).append('circle')
                .attr('cx', cx)
                .attr('cy', cy)
                .attr('r', r)
                .style('stroke', this.state.circleColor)
                .style('fill', 'none');

    // append square
    select(node).append('rect')
                .attr('width', d)
                .attr('height', d)
                .attr('x', this.props.width / 2 - r)
                .attr('y', this.props.height / 2 - r)
                .style('stroke', this.state.squareColor)
                .style('fill', 'none');
  }

  runSimulation(N) {
    const node = this.node;

    const d = Math.min(this.props.height, this.props.width);
    const r = d / 2 ;
    const cx = this.props.width / 2;
    const cy = this.props.height / 2;

    // function to identify if a point is in the circle
    this.isIn = function(p) {
      return Math.sqrt((p.x - cx) * (p.x - cx) + (p.y - cy) * (p.y - cy)) <= r;
    }

    // function to generate a point uniformly at random
    this.genPoint = function() {
        var x = random.integer(0, this.props.width)
        var y = random.integer(0, this.props.height)
        return {x, y};
    }

    // modifying state directly would not work due to the async nature of setState
    var inCount = 0;
    var totalCount = 0;
    // create points
    for (var i = 0; i < N; i++) {
      let p = this.genPoint();

      // append node
      setTimeout(() => {
        select(node).append('circle')
                    .attr('cx', p.x)
                    .attr('cy', p.y)
                    .attr('r', 3)
                    .style('fill', this.isIn(p) ? this.state.circleColor : this.state.squareColor);

        if (this.isIn(p)) {
          inCount++;
        }
        totalCount++;

        this.setState({
          inCount,
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
        <h3>{'Monte Carlo Estimation of Pi using circle\'s area'}</h3>
          <Latex>
          Assuming the square has side length $d$, we know that the
          area of the square is $d^2$ while the area of the circle is $\pi(\frac d 2)^2$ $= \frac 1 4 \pi d^2$
          The ratio of the area of the circle to the area of the square is equal to $\frac \pi 4$
          </Latex>
          <br/>
          <br/>
          <Latex>
          By selecting points uniformly at random from the square, we know that the probability
          of the point being within the circle is $\frac \pi 4$. We can estimate the probability using a Monte Carlo
          simulation and thus derive an estimation of $\pi$
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
                <th scope="row"># of inside points</th>
                <td>{this.state.inCount}</td>
              </tr>

              <tr>
                <th scope="row"># of total points</th>
                <td>{this.state.totalCount}</td>
              </tr>

              <tr>
                <th scope="row"><Latex>$\pi$ Estimate</Latex></th>
                <td>{4 * this.state.inCount / this.state.totalCount || undefined}</td>
              </tr>
            </tbody>
          </table>
      </div>
    );
  }

  render () {
    return (
      <div className='row justify-content-md-center' style={{width: 'inherit'}}>
        <div className='col-lg-5'>
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

CircleArea.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
}

export default CircleArea;
