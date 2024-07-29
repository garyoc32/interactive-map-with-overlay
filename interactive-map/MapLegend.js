import React from 'react';
import { ReactSVG } from 'react-svg';

export default function MapLegend(props) {
  const {
    mapLegend,
  } = props;
   
  return (
    <div className='interactive-map--legend'>
        <ul className='interactive-map--legend-list'>
        {mapLegend.map((item, index) => {
            return (
                <li key={index} className='interactive-map--legend-list-item'>
                    <ReactSVG
                        src={item.icon}
                        wrapper='span'
                        className='interactive-map--legend-list-item-icon'
                    />
                    <span className='interactive-map--legend-list-item-text' dangerouslySetInnerHTML={{__html: item.title}} />
                </li>
            )
        })}
        </ul>
    </div>
  );
}
