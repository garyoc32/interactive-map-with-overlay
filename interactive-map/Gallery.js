import React, { useState, useEffect } from 'react';

export default function Gallery(props) {
    const {
        gallery,
        isResponsive,
    } = props;

    useEffect(() => {
        setActiveImage(gallery[0])
    }, [gallery]);

    let [activeImage, setActiveImage] = useState(null);
   
    return (
        <section className='interactive-map-box-gallery'>
            <div className='interactive-map-box-gallery-grid'>
                {activeImage &&
                    <img
                        src={activeImage.sizes.large}
                    />
                }
                {!isResponsive && gallery.map((gallery_image, index) => {
                    return (
                        <img
                            key={index}
                            onClick={() => setActiveImage(gallery_image)}
                            src={gallery_image.sizes.thumbnail}
                        />
                    )
                })}
            </div>
        </section>
    );
}
