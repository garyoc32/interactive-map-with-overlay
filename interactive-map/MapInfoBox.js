import React from 'react';
import Gallery from './Gallery';
import { ReactSVG } from 'react-svg';

export default function MapInfoBox(props) {
    const {
        eventSpace,
        onCloseClick,
        isResponsive,
    } = props;

    if(!eventSpace || eventSpace.length === 0) return <article className='interactive-map-box hidden'></article>

    const {
        title, 
        excerpt,
        tagline,
        permalink,
        size,
        capacity,
        types,
        gallery,
        id,
        brandmark,
    } = eventSpace;
   
  return (
    <article className='interactive-map-box'>
        <a
            className='interactive-map-box-close'
            onClick={onCloseClick}>
            <ReactSVG src={require('../../images/icon-close.svg')} />
        </a>
        <div className='interactive-map-box-content'>
            {tagline && 
                <h6 className='interactive-map-box-tagline'>{tagline}</h6>
            }
            {title && 
                <div className='interactive-map-box-titlebox'>
                    <h3 className='interactive-map-box-title'>{title}</h3>
                    {brandmark && 
                        <img className='interactive-map-box-bm' src={brandmark} />
                    }
                </div>
            }
            {excerpt &&
                <div className='interactive-map-box-desc' dangerouslySetInnerHTML={{__html: excerpt}} />
            }
            {gallery &&
                <Gallery
                    gallery={gallery}
                    isResponsive={isResponsive}
                />
            }
            {size &&
                <p className='interactive-map-box-size' dangerouslySetInnerHTML={{__html: 'Size: ' + size + ' sqm'}} />
            }
            {types &&
                <p className='interactive-map-box-types-title'>Ideal for your next:</p>
            }
            <div className='interactive-map-box-types'>
                {types && types.filter((item, idx) => idx < 3).map((type, index) => {
                    return (
                        <span key={index}>
                            <a href={type.permalink} className='interactive-map-box-types-link'>{type.singular_title}{ index + 1 != 4 ? ',' : '...'}</a>
                            {' '}
                        </span>
                    )
                })}
                {types.length > 3 &&
                    <a href={ permalink } className='interactive-map-box-types-link'><span>{'and more...' }</span></a>
                }
            </div>
            {permalink &&
                <a href={ permalink } className='link-arrow link-arrow-brand interactive-map-box-link' aria-label={'Explore ' +  title }><span>{'Explore ' +  title }</span></a>
            }
        </div>
    </article>
  );
}
