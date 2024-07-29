import React, { useState, useEffect } from 'react';
import {GoogleMap, MarkerF, OverlayView } from '@react-google-maps/api';
import MapInfoBox from './MapInfoBox';
import MapLegend from './MapLegend';
import { ReactSVG } from 'react-svg';
import isResponsive from '../utilities/isResponsive';
import { MAP_STYLES } from './styles';
// /*global google*/

//Default local center for map
const initialCenter = { lat: -37.78251810679187, lng: 144.91149626942436};

function Map(props) {
    const {
        centerImage,
        centerOverlay,
        eventSpaces,
        mapLegend,
        mapID,
    } = props;

    // Setup state
    const [infoDomReady, setInfoDomReady] = useState(false);
    const [mapCenter, setMapCenter] = useState(initialCenter);
    const [instance, setInstance] = useState(null);
    const [isMounted, setIsMounted] = useState(false);
    const [mapHeading, setMapHeading] = useState(323);
    const [mapZoom, setMapZoom] = useState(17);
    const [selectedEventSpace, setSelectedEventSpace] = useState(null);
    const [windowSize, setWindowSize] = useState(defaultWindowSize);
    const [rasterMap, setRasterMap] = useState(false);
    const responsive = isResponsive();

    useEffect(() => 
        setIsMounted(true), 
    []);

    // The Maps API package includes a method that runs on a successful render
    // For the best user experience I have setup various functions to do things such as create fallback settings in the event webGL is not supported in the browser
    // Or to handle visibility, sizing or to rearrange elements in the dom.
    const onLoad = React.useCallback(
        function onLoad(map) {
            setInstance(map);
            moveInfobox();
            handleResize();
            handleParams();
            window.addEventListener('resize', handleResize);
            setMapVisibility();
            map.addListener('renderingtype_changed', () => {
                checkWebGLSupport(map);
            });
        },
        [setInstance]
    );

    function moveInfobox() {
        const mapInfobox = document.querySelector('.interactive-map-box');
        const mapTopLayer = document.querySelector('.js-interactive-map').firstChild.firstChild;
        if(mapInfobox && mapTopLayer) {
            mapTopLayer.appendChild(mapInfobox);
        }
    }

    function handleParams() {
        const searchParams = new URLSearchParams(document.location.search);

        if (searchParams.get('space')) {
            const eventSpace = getEventSpace(searchParams.get('space'));
            handleMarkerClick(eventSpace)
        }
    }

    function handleResize() {
        let updatedWindowSize = {
            width: window.innerWidth,
            height: window.innerHeight,
        }

        setWindowSize(updatedWindowSize);
    }

    function setMapVisibility() {
        const map = document.querySelector('.js-interactive-map');
        const loader = document.querySelector('.js-interactive-map-loader');
        if(map) {
            setTimeout(function(){
                map.classList.remove('hide-map');
                loader.classList.add('loaded');
            }, 2000);
        }
    }

    // 
    function checkWebGLSupport(map) {
        if (map && map.getRenderingType() == 'RASTER') {
            setRasterMap(true);
        }
    }

    function getEventSpace(eventSpace) {
        var result = eventSpaces.find(item => item.slug === eventSpace);
        return result;
    }

    // As this map does not actually accord to NSEW bearing (because the client wanted the overlay to not be crooked)
    // I created this idele function to always reset the tilt and bearing of the map when the user is no longer interacting
    const onIdle = React.useCallback(
        function onIdle() {
            if (instance) {
                instance.setHeading(323);
                instance.setTilt(0);
            }
        },
        [instance]
    );

    const defaultWindowSize = {
        width: window.innerWidth,
        height: window.innerHeight,
    }


    // Handy unit test

    // const onClick = React.useCallback(
    //     function onClick(e) {
    //       console.log(e.latLng.toJSON());
    //     },
    //     [instance]
    // );

    const options = {
        mapId: mapID,
        streetViewControl: false,
        mapTypeControl: false,
        rotateControl: false,
        fullscreenControl: responsive ? false : false,
        enableRotation: false,
        rotateGesturesEnabled: false,
    }

    const backUpOptions = {
        mapId: false,
        styles: MAP_STYLES,
    }

    const getMarkerIcon = (eventSpace) => {
        let icon = eventSpace.status === 'publish' ? require('../../images/marker.svg') : require('../../images/markerdirect.svg');
        if (eventSpace.marker_text_label) {
            icon = require('../../images/markertext.svg');
        }
        
        return {
            url: (icon),
        }
    }

    const getMarkerLabel = (eventSpace) => {
        const color = eventSpace.status === 'publish' ? '#fff' : '#EF4135';
        const label = eventSpace.marker_label ? eventSpace.marker_label : ' ';
        const markerClass = eventSpace.marker_text_label ? 'interactive-map-marker-label-text' : 'interactive-map-marker-label';

        return {
            text: label,
            color: color,
            className: markerClass,
            fontSize: '16px',
            fontWeight: '400',
        }
    }

    const handleMarkerClick = (eventSpace) => {
        if (eventSpace.status != 'publish') {
            return;
        }
        let markercoords = {lat: eventSpace.map_location.lat, lng: eventSpace.map_location.lng};
        setMapCenter(markercoords);
        setMapHeading(323);
        setMapZoom(18);
        setSelectedEventSpace(eventSpace);
    };

    const handleInfoCloseClick = () => {
        setInfoDomReady(false);
        setMapHeading(323);
        setMapCenter(initialCenter);
        setMapZoom(17);
        setSelectedEventSpace(null);
    };

    const backButton = () => {
        const currentUrl = new URL(window.location.href);
        
        if(document.referrer !== '') {
            const referrer = new URL(document.referrer);

            if(currentUrl.origin === referrer.origin) {
                window.history.back();
            }
        } else {
            window.location.href = currentUrl.origin;
        }
    }

    const renderMap = () => (
        <div className='interactive-map--container'>
            <div className='interactive-map--loader js-interactive-map-loader'>
                <div className='dots'></div>
            </div>
            <div
                className='interactive-map--map js-interactive-map hide-map'
                style={windowSize}
            >
                <GoogleMap
                    zoom={mapZoom}
                    center={mapCenter}
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    heading={mapHeading}
                    tilt={0}
                    options={options}
                    onLoad={onLoad}
                    onIdle={onIdle}
                    // onClick={onClick}
                >
                    <OverlayView
                        position={{ lat: -37.78383942050144, lng: 144.90581680529533}}
                        mapPaneName={OverlayView.MAP_PANE}
                        clickable={false}
                        bounds={
                            {
                                ne: { lat: -37.78383942050144, lng: 144.90581680529533 },
                                sw: { lat: -37.77922591051108, lng: 144.91367668354133 },
                            }
                        }
                    >
                        <div
                            className='interactive-map--image-container'
                            style={{
                                width: '100%',
                                height: '100%',
                                display: rasterMap ? 'none' : 'block',
                            }}
                        >
                            <img
                                className='interactive-map--image-container-base'
                                src={centerImage}
                            />
                            {centerOverlay &&
                                <ReactSVG
                                    src={centerOverlay}
                                    wrapper='span'
                                    className='interactive-map--image-container-overlay'
                                />
                            }
                        </div>
                    </OverlayView>
                    {isMounted && eventSpaces.map((eventSpace, index) => {
                        const markercoords = {lat: eventSpace.map_location.lat, lng: eventSpace.map_location.lng};

                        return (
                            <MarkerF
                                key={index}
                                position={markercoords}
                                onClick={() => handleMarkerClick(eventSpace)}
                                label={getMarkerLabel(eventSpace)}
                                icon={getMarkerIcon(eventSpace)}
                            >
                            </MarkerF>
                        )
                    })}
                    <MapInfoBox
                        isReady={infoDomReady}
                        isResponsive={responsive}
                        onCloseClick={handleInfoCloseClick}
                        eventSpace={selectedEventSpace}
                    />
                    <button
                        className='interactive-map-closebutton'
                        onClick={backButton}
                    >
                    </button>
                    <MapLegend mapLegend={mapLegend} />
                </GoogleMap>
            </div>
        </div>
    )

    return renderMap();
}

export default Map;
