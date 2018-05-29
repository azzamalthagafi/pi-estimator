import React, { Component } from 'react';
import logo from './logo.png';
import CircleArea from './CircleArea';
import BuffonNeedle from './BuffonNeedle';

import './App.css';
import $ from "jquery";

class App extends Component {
  constructor(props){
    super(props);
    this.state = { simulationID: 'C' };
  }

  renderSimulation() {
    switch (this.state.simulationID) {
      case 'C':
        return <CircleArea width={500} height={500}/>;

      case 'BN':
        return <BuffonNeedle width={500} height={500}/>

      default:
        return <CircleArea width={500} height={500}/>;
    }
  }

  handleClick = (simulationID) => {
    $(".btn-group > .btn").removeClass("active");
    $('#' + simulationID).addClass("active");
    this.setState({ simulationID });
  }

  renderHeader() {
    return  (
      <nav className="navbar navbar-light bg-light justify-content-between">
        <a className="navbar-brand">
          <img src={logo} width="30" height="30" className="d-inline-block align-top mr-2" alt=""/>
          Estimating Pi
        </a>
        <div>
          <span className="navbar-text mr-2">
            Estimation method:
          </span>
          <div className="btn-group" id="SimOptions" role="group" aria-label="Estimation Methods">
            <button type="button" id="C" className="btn btn-secondary active" onClick={() => this.handleClick('C')}>Circle Area</button>
            <button type="button" id="BN" className="btn btn-secondary" onClick={() => this.handleClick('BN')}>Buffon's needle</button>
          </div>
        </div>
      </nav>
    );
  }

  render() {
    return (
      <div className="App">
        {this.renderHeader()}
        <div className="container mt-2">
          {this.renderSimulation()}
        </div>
      </div>
    );
  }
}

export default App;
