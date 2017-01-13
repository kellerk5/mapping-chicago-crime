import React from 'react';

export default class Button extends React.Component {
    
    render() {
        return (
			<button className="dropdowns-and-button-container__query-button" 
					type="button"
                    onClick={this.props.modifyQuery}>
					SHOW ON MAP
			</button>
        );
    }
};

Button.propTypes = {
    modifyQuery : React.PropTypes.func
};