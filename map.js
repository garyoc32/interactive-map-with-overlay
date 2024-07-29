import React, {useEffect, useRef, useState} from 'react';
import { createRoot } from 'react-dom/client';
import { useJsApiLoader } from '@react-google-maps/api';
import Map from './interactive-map/Map';

function InteractiveMap(props) {
    const {
        eventSpaces,
        mapBase,
        mapOverlay,
        apiKey,
        mapID,
        mapLegend,
    } = props;

    // Await response from google maps API to run application
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: apiKey,
        version: '3',
    });

    return (
        <div className='interactive-map'>
            { isLoaded ? 
                <Map
                    centerImage={mapBase}
                    centerOverlay={mapOverlay}
                    eventSpaces={eventSpaces}
                    mapLegend={mapLegend}
                    mapID={mapID}
                /> : null
            }
        </div>
    );
}

//Query Dom for presence of component and pass props
const domContainer = document.querySelector('#interactive-map');
const jsonData = domContainer.dataset.interactiveMap;
let props = {};

if(domContainer) {
    props = {...JSON.parse(jsonData)};
    const root = createRoot(domContainer);
    root.render(<InteractiveMap {...props} />);
}