import React from 'react';
import ReactDOM from 'react-dom';

//map component
import Map from './components/map/map';

//styles
import './components/map/style/map.scss';
import './components/error/style/error.scss';
import './components/dropdown/style/dropdown.scss';
import './components/button/style/button.scss';

ReactDOM.render(
    <Map />
  , document.querySelector('.map-container'));
