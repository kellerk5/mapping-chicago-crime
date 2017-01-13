import React from 'react';
import GoogleMapsLoader from 'google-maps';
import Spinner from 'react-spinner-children';
import 'whatwg-fetch';

import Dropdown from '../dropdown/dropdown.jsx';
import Button from '../button/button.jsx';
import Error from '../error/error.jsx';

export default class Map extends React.Component {
    constructor() {
        super();

        //bind functions to context
        this.gmapsConfiguration                  = this.gmapsConfiguration.bind( this );
        this.setDateDropdownStates               = this.setDateDropdownStates.bind( this );
        this.queryFromButtonClick                = this.queryFromButtonClick.bind( this );
        this.sortDataForDotDistribution          = this.sortDataForDotDistribution.bind( this );
        this.determineSortingByVisualizationType = this.determineSortingByVisualizationType.bind( this );
        this.sortDataForHeatmap                  = this.sortDataForHeatmap.bind( this );
        this.sortDataForDotDistribution          = this.sortDataForDotDistribution.bind( this );
        this.mapHighlightingForHeatmap           = this.mapHighlightingForHeatmap.bind( this );
        this.mapHighlightingForDotDistribution   = this.mapHighlightingForDotDistribution.bind( this );
        this.removeCurrentMapMarkers             = this.removeCurrentMapMarkers.bind( this );

        this.state = {
            dateDropdown:                  'YEAR',
            crimeTypeDropdown:             'CRIME TYPE',
            visualizationTypeDropdown:     'VISUALIZATION TYPE',
            requestLimitDropdown:          'NUMBER OF RESULTS',
            googleMapsObject:              null,
            loadingSpinnerActive:          null,
            currentHeatmapVisualization:   null,
            currentDotDistMap:             null,
            userErrorMessage:              false,
            serverErrorMessage:            false
        };
    }

    gmapsConfiguration () {
        //options and configuration for Google Maps API
        GoogleMapsLoader.KEY = 'AIzaSyA0abnAMtmxBrbBWXSUo7XxLbUBhZ0FewQ';
        GoogleMapsLoader.LIBRARIES = ['geometry', 'places', 'visualization'];
        GoogleMapsLoader.LANGUAGE = 'en';
        GoogleMapsLoader.REGION = 'US';
        GoogleMapsLoader.load((google) => {
            var chiMap = new google.maps.Map(document.getElementById('mapContainer'), {
                center: {lat: 41.877, lng: -87.631},
                zoom: 13,
                streetViewControl: false,
                gestureHandling: 'greedy',
                mapTypeControl: false,
                styles: [
                    {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
                    {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
                    {elementType: 'labels.text.fill', stylers: [{color: '#e0fffd'}]},
                    {
                        featureType: 'poi',
                        elementType: 'geometry',
                        stylers: [{visibility: 'off'}]
                    },
                    {
                        featureType: 'poi',
                        elementType: 'labels.text',
                        stylers: [{visibility: 'off'}]
                    },
                    {
                        featureType: 'poi',
                        elementType: 'labels.icon',
                        stylers: [{visibility: 'off'}]
                    },
                    {
                        featureType: 'landscape',
                        elementType: 'geometry',
                        stylers: [{visibility: 'off'}]
                    },
                    {
                        featureType: 'landscape',
                        elementType: 'labels.text',
                        stylers: [{visibility: 'off'}]
                    },
                    {
                        featureType: 'road',
                        elementType: 'labels.text',
                        stylers: [{visibility: 'off'}]
                    },
                    {
                        featureType: 'road',
                        elementType: 'labels.icon',
                        stylers: [{visibility: 'off'}]
                    },
                    {
                        featureType: 'road',
                        elementType: 'labels.text.fill',
                        stylers: [{color: '#9ca5b3'}]
                    },
                    {
                        featureType: 'road.highway',
                        elementType: 'geometry',
                        stylers: [{color: '#242f3e'}]
                    },
                    {
                        featureType: 'transit',
                        elementType: 'geometry',
                        stylers: [{visibility: 'off'}]
                    },
                    {
                        featureType: 'transit',
                        elementType: 'labels.icon',
                        stylers: [{visibility: 'off'}]
                    },
                    {
                        featureType: 'water',
                        elementType: 'labels.text.fill',
                        stylers: [{color: '#515c6d'}]
                    },
                    {
                        featureType: 'water',
                        elementType: 'labels.text.stroke',
                        stylers: [{color: '#17263c'}]
                    }
                ]    
            });
            //set map to state so it is globally accessible
            this.setState({
                googleMapsObject: chiMap
            });
        });
    }

    componentWillMount() {
        this.gmapsConfiguration();
    }

    setDateDropdownStates(currentDropdownValue, dropdownID) {
        //organize dropdown states for querying w/ URL parameters
        switch(dropdownID) {
            case 'year':
                this.setState({
                    dateDropdown : currentDropdownValue
                });
                break;
            case 'requestLimit':
                this.setState({
                    requestLimitDropdown : currentDropdownValue
                });
                break;
            case 'crimeType':
                this.setState({
                    crimeTypeDropdown : currentDropdownValue
                });
                break;
            default:
                this.setState({
                    visualizationTypeDropdown : currentDropdownValue
                });
                break;
        }
    }

    determineSortingByVisualizationType(data) {
        //choose appropriate function for data sorting 
        //(because viz types will accept data differently)  
        switch(this.state.visualizationTypeDropdown) {
            case 'HEATMAP':
                this.sortDataForHeatmap(data);
                break;
            default:
                this.sortDataForDotDistribution(data);
                break;
        }
    }

    sortDataForHeatmap(data) {
        let latLngArray = [];
        data.forEach((item, index) => {
            if (item.latitude && item.longitude) {
                //convert from strings before passing 
                let convertedLat = Number(item.latitude);
                let convertedLong = Number(item.longitude);
                let latLng = new google.maps.LatLng(convertedLat, convertedLong);
                latLngArray.push(latLng);
            }
        });
        this.mapHighlightingForHeatmap(latLngArray);
    }

    sortDataForDotDistribution(data) {
        let latLngAndOtherInfoArray = [];

        data.forEach((item, index) => {
            //check for information necessary for location positioning
            //as well as all information for the tooltip pop-up
            if (item.latitude && item.longitude && item.primary_type && item.description && item.date && item.arrest) {
                
                let formattedInfoObject = {
                    'latitude': Number(item.latitude),
                    'longitude': Number(item.longitude),
                    'primary_type': item.primary_type,
                    'description': item.description,
                    'date': item.date,
                    'arrest': item.arrest,
                    'fbi_code': item.fbi_code
                };

                latLngAndOtherInfoArray.push(formattedInfoObject);
            }
        });

        this.mapHighlightingForDotDistribution(latLngAndOtherInfoArray);
    }

    mapHighlightingForHeatmap(latLngArray) {
        GoogleMapsLoader.load((google) => {
            let heatmap = new google.maps.visualization.HeatmapLayer({
                data: latLngArray,
                dissipating: false,
                map: this.state.googleMapsObject
            });

            this.setState({
                currentHeatmapVisualization: heatmap,
                loadingSpinnerActive : false
            });
        });
    }

    mapHighlightingForDotDistribution(latLngAndOtherInfoArray) {
        let arrayOfCircleObjects = [];
        let completedForEachCycle;
        GoogleMapsLoader.load((google) => {
            latLngAndOtherInfoArray.forEach((item, index) => {
                // create circle marker for each lat/long point
                let newCircle = new google.maps.Circle({
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#FF0000',
                    fillOpacity: 0.35,
                    map: this.state.googleMapsObject,
                    center: {'lat': item.latitude, 'lng': item.longitude},
                    radius: 100
                });

                //create tooltip info for each circle
                let contentString = 
                '<span>Crime Type: ' + item.primary_type + 
                '</span><br /><span>Description: ' + item.description + 
                '</span><br /><span>Arrest: ' + item.arrest + 
                '</span><br /><span>Date: ' + (item.date.slice(0, 10)) + 
                '</span><br /><span>FBI Code: ' + item.fbi_code + '</span>';

                //create tooltip for each circle 
                let infoWindow = new google.maps.InfoWindow({
                    content: contentString
                });

                //desktop event binding
                newCircle.addListener('click', (ev) => {
                    infoWindow.setPosition(ev.latLng);
                    infoWindow.open(this.state.googleMapsObject);
                });

                //mobile event binding
                newCircle.addListener('ontouchstart', (ev) => {
                    infoWindow.setPosition(ev.latLng);
                    infoWindow.open(this.state.googleMapsObject);
                });
                
                arrayOfCircleObjects.push([newCircle, infoWindow]);

                //see if we have hit end of array
                //so that we can save the state only ONCE outside of this loop
                if (index === (latLngAndOtherInfoArray.length - 1)) {
                    completedForEachCycle = true;
                }
            });
            
            if (completedForEachCycle === true) {
                this.setState({
                    currentDotDistMap: arrayOfCircleObjects,
                    loadingSpinnerActive : false
                });
            }
        });
    }

    queryFromButtonClick() {
        if ((this.state.dateDropdown !== 'YEAR') && 
            (this.state.requestLimitDropdown !== 'NUMBER OF RESULTS') && 
            (this.state.crimeTypeDropdown !== 'CRIME TYPE') && 
            (this.state.visualizationTypeDropdown !== 'VISUALIZATION TYPE')) { 
                //all states are set, we're good to form the URL!
                //actual request limit is ~450,000, though Gmaps can only handle ~10,000
                let requestLimit = this.state.requestLimitDropdown;
                let crimeType = this.state.crimeTypeDropdown;
                let year = this.state.dateDropdown;
                let requestUrl = 
                'https://data.cityofchicago.org/resource/6zsd-86xi.json?primary_type=' + 
                crimeType + '&$limit=' + requestLimit + '&$where=year=' + year;
                
                let myRequest = new Request(requestUrl, { 
                    method: 'GET',
                    mode: 'cors',
                    cache: 'default'
                });

                fetch(myRequest).then((response) => {
                    //unset any previous markers from the map
                    this.removeCurrentMapMarkers();

                    this.setState({
                        loadingSpinnerActive: true
                    });

                    return response.json();
                }).then((data) => {

                    this.setState({
                        userErrorMessage: false,
                        serverErrorMessage: false
                    });

                    this.determineSortingByVisualizationType(data);
                }).catch((err) => {
                    //leaving this here for error logging
                    console.log(err);

                    this.setState({
                        serverErrorMessage: true,
                        loadingSpinnerActive: false
                    });
                });
        } else {
            this.setState({
                userErrorMessage: true
            });
        }
    }

    removeCurrentMapMarkers() {
        //remove heatmap objects from map
        //and also set them to null
        if (this.state.currentHeatmapVisualization !== null) {
            this.state.currentHeatmapVisualization.setMap(null);
            this.setState({
                currentHeatmapVisualization: null
            });
        }
        //remove dotDist objects from map
        //and also set them to null
        if (this.state.currentDotDistMap !== null) {
            this.state.currentDotDistMap.forEach((item, index) => {
                item[0].setMap(null);
            });
            //remove circles and their tooltips
            this.setState({
                currentDotDistMap: null
            });
        }
    }

    render() {
        const spinnerOptions = {
            color: '#242f3e'
        };
        
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="dropdowns-and-button-container col-md-12">
                        <Dropdown
                            optionsArray={['YEAR', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008',
                            '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016']} 
                            dropdownID={'year'}
                            statesToBeSet={this.setDateDropdownStates} />
                        <Dropdown
                            optionsArray={['CRIME TYPE', 'BURGLARY', 'NARCOTICS', 'ROBBERY', 'THEFT', 'BATTERY', 'WEAPONS VIOLATION', 'ASSAULT', 'CRIMINAL DAMAGE', 'CRIM SEXUAL ASSAULT', 'OTHER OFFENSE']}
                            dropdownID={'crimeType'}
                            statesToBeSet={this.setDateDropdownStates} />
                        <Dropdown
                            optionsArray={['VISUALIZATION TYPE', 'HEATMAP', 'DOT DISTRIBUTION']}
                            dropdownID={'visType'}
                            statesToBeSet={this.setDateDropdownStates} />
                        <Dropdown
                            optionsArray={['NUMBER OF RESULTS', '100', '1000', '2000', '3000', '4000', '5000', '6000',
                            '7000', '8000', '9000', '10000']} 
                            dropdownID={'requestLimit'}
                            statesToBeSet={this.setDateDropdownStates} />
                        <Button  
                            modifyQuery={this.queryFromButtonClick}/>
                        <div className="dropdowns-and-button-container__spinner-box">
                            <Spinner loaded={!this.state.loadingSpinnerActive} config={spinnerOptions}/>
                        </div>
                        <Error 
                            errorMessageText={'Please select an option from each of the 4 dropdowns.'}
                            currentErrorState={this.state.userErrorMessage}/>
                        <Error 
                            errorMessageText={'There was an issue with your request! Try again in a bit.'}
                            currentErrorState={this.state.serverErrorMessage}/>
                    </div>
                    <div id='mapContainer'></div>
                </div>
            </div>
        );
    }
};