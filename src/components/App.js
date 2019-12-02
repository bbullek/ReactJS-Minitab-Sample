import React, { Component } from 'react';
import { Grid, InputLabel, Paper, Table, TableBody, TableCell, TableRow, TextField } from '@material-ui/core';
import { Button } from "./Button";
import { SimpleCheckbox } from "./SimpleCheckbox";
import '../styles/App.css';

class App extends Component {
  constructor() {
    super();
    this.state = this.getDefaultState();

    // Bind event handlers
    this._handleCheckboxToggle = this._handleCheckboxToggle.bind(this);
    this._handleValidateClick = this._handleValidateClick.bind(this);
    this._handleResetClick = this._handleResetClick.bind(this);
  }

  /**
   * Restores the component's state to its original values, clearing any 
   * user-entered input.
   */
  getDefaultState() {
    return ({
      // User-provided values
      sampleSizeValue: '',
      sampleMeanValue: '',
      standardDevValue: '',
      isChecked: false,
      hypMeanValue: '',

      // Holds text for helpful error messages in case of invalid input
      sampleSizeErrorText: '',
      sampleMeanErrorText: '',
      standardDevErrorText: '',
      hypMeanErrorText: '',
      hideTable: true,

      // Temp values to prevent table from auto-updating before user clicks 'OK'
      sampleSizeTemporary: '',
      sampleMeanTemporary: '',
      standardDevTemporary: '',
      hypMeanTemporary: ''
    })
  }

  /**
   * Event handler for 'Perform hypothesis test' checkbox. 
   */
  _handleCheckboxToggle() {
    this.setState(state => ({
      isChecked: !this.state.isChecked,
      hypMeanErrorText: ''
    }));

    // Ensure table is hidden if textfield entry is invalid
    if (!this.state.isChecked && this.state.hypMeanTemporary === '') {
      this.setState(state => ({
        hideTable: true
      }));
    }
  }

  /**
   * Event handler for 'OK' button. Checks all applicable TextField input and
   * displays accompanying error messages (if invalid) or a simple table (if valid).
   */
  _handleValidateClick() {
    // Check sample size input
    this.setState(state => ({
      sampleSizeErrorText: this.checkUserInput(this.state.sampleSizeTemporary, 2, true)
    }));

    // Check sample mean input
    this.setState(state => ({
      sampleMeanErrorText: this.checkUserInput(this.state.sampleMeanTemporary, null)
    }));

    // Check stdev input
    this.setState(state => ({
      standardDevErrorText: this.checkUserInput(this.state.standardDevTemporary, 0, false)
    }));

    // Check hypothesized mean input
    if (this.state.isChecked) {
      this.setState(state => ({
        hypMeanErrorText: this.checkUserInput(this.state.hypMeanTemporary, null)
      }));
    }

    // Update old values to reflect properly in table
    this.setState(state => ({
      sampleSizeValue: this.state.sampleSizeTemporary,
      sampleMeanValue: this.state.sampleMeanTemporary,
      standardDevValue: this.state.standardDevTemporary,
      hypMeanValue: this.state.hypMeanTemporary
    }))

    this.setTableVisibility();
  }

  /**
   * Checks if the summation of error messages is just an empty string (i.e. all
   * given input is correct). If so, toggles 'visibility: visible' in the Table
   * element.
   */
  setTableVisibility() {
    var e1 = this.checkUserInput(this.state.sampleSizeTemporary, 2, true);
    var e2 = this.checkUserInput(this.state.sampleMeanTemporary, null);
    var e3 = this.checkUserInput(this.state.standardDevTemporary, 0, false);
    var e4 = this.state.isChecked ? this.checkUserInput(this.state.hypMeanTemporary, null) : '';
    var allInputsValid = e1.length + e2.length + e3.length + e4.length === 0;

    this.setState(state => ({
      hideTable: !allInputsValid
    }));
  }

  /**
   * Event handler for the 'Reset' button.
   */
  _handleResetClick() {
    this.setState(state => this.getDefaultState());
  }

  /**
   * Checks a user-entered value and returns an error message detailing why 
   * the input failed. Returns an empty string if input is correct.
   * @param {string} value 
   * @param {int} lowerLimit 
   * @param {boolean} isInclusive
   */
  checkUserInput(value, lowerLimit, isInclusive) {
    if (value === '') {
      return 'Please enter a value.';
    }
    if (isNaN(value)) {
      return 'Value must be numeric.';
    }
    if (lowerLimit != null && parseFloat(value) < lowerLimit) {
      var qualifier = 'greater than' + (isInclusive ? ' or equal to ' : ' ');
      return 'Value must be ' + qualifier + lowerLimit + '.';
    }
    return '';
  }

  render() {
    return (
      <div style={{textAlign: 'center'}}>
        <div style={{display: 'inline-block', padding: '5%', textAlign: 'left'}}>

          {/* TextField: sample size */}
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={6}>
              <InputLabel className="label">Sample size:</InputLabel> 
            </Grid>
            <Grid item xs={6}>
              <TextField 
                value={this.state.sampleSizeTemporary} 
                helperText={this.state.sampleSizeErrorText}
                onChange={e => this.setState({ sampleSizeTemporary: e.target.value })}
              />
            </Grid>
          </Grid>

          {/* TextField: sample mean */}
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={6}>
              <InputLabel className="label">Sample mean:</InputLabel> 
            </Grid>
            <Grid item xs={6}>
              <TextField 
                value={this.state.sampleMeanTemporary} 
                helperText={this.state.sampleMeanErrorText}
                onChange={e => this.setState({ sampleMeanTemporary: e.target.value })}
              />
            </Grid>
          </Grid>

          {/* TextField: stdev */}
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={6}>
              <InputLabel className="label">Standard deviation:</InputLabel> 
            </Grid>
            <Grid item xs={6}>
              <TextField 
                value={this.state.standardDevTemporary}
                helperText={this.state.standardDevErrorText}
                onChange={e => this.setState({ standardDevTemporary: e.target.value })}
              />
            </Grid>
          </Grid>

          {/* Checkbox toggle for hypothesized mean */}
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <SimpleCheckbox 
                onChange={this._handleCheckboxToggle} 
                checked={this.state.isChecked}
              />
            </Grid>
            <Grid item>
              <InputLabel className="label">Perform hypothesis test</InputLabel> 
            </Grid>
          </Grid>

          {/* TextField: hypothesized mean */}
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={6}>
              <InputLabel className={this.state.isChecked ? 'label' : 'label-disabled' }>
                Hypothesized mean:
              </InputLabel> 
            </Grid>
            <Grid item xs={6}>
              <TextField 
                disabled={!this.state.isChecked}
                value={this.state.hypMeanTemporary} 
                helperText={this.state.hypMeanErrorText}
                onChange={e => this.setState({ hypMeanTemporary: e.target.value })}
              />
            </Grid>
          </Grid>

          {/* Button row */}
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Button onClick={this._handleValidateClick}>
                OK
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={this._handleResetClick}
                buttonStyle="btn--secondary--outline">
                Reset
              </Button>
            </Grid>
          </Grid>

          { /* Table of user's values -- only visible when all input is correct */ }
          <Grid container>
            <Paper className="table--container" style={this.state.hideTable ? { display: 'none' } : { display: 'inline' }}>
              <Table style={{width: "100%", marginTop: "5%"}}>
                <TableBody>
                    <TableRow hover>
                      <TableCell>Sample size</TableCell>
                      <TableCell>{this.state.sampleSizeValue}</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell>Sample mean</TableCell>
                      <TableCell>{this.state.sampleMeanValue}</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell>Standard deviation</TableCell>
                      <TableCell>{this.state.standardDevValue}</TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell>Hypothesized mean</TableCell>
                      <TableCell>{this.state.isChecked ? this.state.hypMeanValue : "N/A"}</TableCell>
                    </TableRow>
                </TableBody>
              </Table>
            </Paper>

          </Grid>
        </div>
      </div>
    );
  }
}

export default App;
