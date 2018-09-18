import React from 'react';
import PropTypes from 'prop-types';

export class PopoverNested extends React.Fragment {
  constructor(props) {
    super(props);
    this.state = {
      page: false, // true for alt page, false for main
    };
  }
  
  render() {
    if (this.state.page) {
      return this.props.menu(() => this.setState({page: false}));
    }
    return this.props.children(() => this.setState({page: true}));
  }
}

PopoverNested.propTypes = {
  children: PropTypes.func.isRequired,
  menu: PropTypes.func.isRequired,
};

export default PopoverNested;