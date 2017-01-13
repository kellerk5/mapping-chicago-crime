import React from 'react';
import classNames from 'classnames';

export default class Error extends React.Component {
    
    render() {
		let showOrHideErrorMessages = classNames({
            'dropdowns-and-button-container__error-message-container': this.props.currentErrorState,
            'dropdowns-and-button-container__error-message-container inactive': !this.props.currentErrorState
        });

        return (
			<div className={showOrHideErrorMessages}>
				<span className="dropdowns-and-button-container__error-message-container__error-message">{this.props.errorMessageText}</span>
			</div>
        );
    }
};

Error.propTypes = {
    errorMessageText : React.PropTypes.string,
	currentErrorState : React.PropTypes.bool
};