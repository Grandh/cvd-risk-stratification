import React, {Component} from 'react'
import {Input, Select} from 'antd'
const Option = Select.Option

export default class CustomWithUnitInput extends React.Component {
    constructor(props) {
      super(props);
  
      const value = props.value || {}
      this.state = {
        number: value.number || '',
        unit: value.unit || 'mmol/L', // mg/dl
      };
    }
    componentWillReceiveProps(nextProps) {
      // Should be a controlled component.
      if ('value' in nextProps) {
        const value = nextProps.value;
        this.setState(value);
      }
    }
    handleNumberChange = (e) => {
    //   const number = parseInt(e.target.value || 0, 10);
      var number = e.target.value
      if (isNaN(number)) {
        return
      }
      if (!('value' in this.props)) {
        this.setState({ number });
      }
      this.triggerChange({ number });
    }
    handleCurrencyChange = ( unit ) => {
      if (!('value' in this.props)) {
        this.setState({ unit });
      }
      this.triggerChange({ unit });
    }
    triggerChange = (changedValue) => {
      // Should provide an event to pass value to Form.
      const onChange = this.props.onChange;
      if (onChange) {
        onChange(Object.assign({}, this.state, changedValue));
      }
    }
    render() {
      const { size } = this.props;
      const state = this.state;
      return (
        <span>
          <Input
            type="text"
            size={size}
            value={state.number}
            onChange={this.handleNumberChange}
            style={{ width: '50%', marginRight: '3%' }}
          />
          <Select
            value={state.unit}
            size={size}
            style={{ width: '47%' }}
            onChange={this.handleCurrencyChange}
          >
            <Option value="mmol">mmol/L</Option>
            <Option value="mg">mg/dl</Option>
          </Select>
        </span>
      );
    }
  }