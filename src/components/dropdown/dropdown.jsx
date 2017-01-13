import React, { PropTypes, Component } from 'react';

export default class Dropdown extends React.Component {
    
    constructor(props) {
        super(props);
        //bind functions to context
        this.addSelectionOptions         = this.addSelectionOptions.bind( this );
        this.setCurrentDropdownSelection = this.setCurrentDropdownSelection.bind( this );
    }

    addSelectionOptions() {
        let dropdownOptions = [];

        //map the options array to <option> tag for each dropdown
        return this.props.optionsArray.map((item, index) => {
            return <option key={index}>{this.props.optionsArray[index]}</option>;
        });
    }

    setCurrentDropdownSelection(event) {
        //pass newly selected value and dropdown ID to Map component
        this.props.statesToBeSet(event.target.value, this.props.dropdownID);
    }

    render() {
        return (
            <div className="dropdowns-and-button-container__dropdown-container">
				<select className="dropdowns-and-button-container__dropdown-container__dropdown"
                    onChange={this.setCurrentDropdownSelection}>
                        {this.addSelectionOptions()}
                </select>
            </div>
        );
    }
};

Dropdown.propTypes = {
    optionsArray     : React.PropTypes.array.isRequired,
    dropdownID       : React.PropTypes.string,
    statesToBeSet    : React.PropTypes.func
};