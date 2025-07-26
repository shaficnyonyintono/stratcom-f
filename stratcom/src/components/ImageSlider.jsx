import React, { useState } from 'react'
import Slider from 'react-slick'
import swtch from '../switch.jpg'
import engineer from '../engineer.webp'
import codes from '../codes.webp'
import rack from '../rack.webp'
import router from '../router.webp'

import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const images = [
    { id: 1, source: engineer, caption: "Our Engineers at Work" },
    { id: 2, source: router, caption: "Modern Networking" },
    { id: 3, source: swtch, caption: "Switching Technology" },
    { id: 4, source: codes, caption: "Clean Code" },
    { id: 5, source: rack, caption: "Server Racks" }
];

const ImageWithLoader = ({ src, alt, caption }) => {
    const [loading, setLoading] = useState(true);
    return (
        <div className="relative w-full h-64 flex items-center justify-center">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse rounded-lg">
                    <span className="text-gray-400">Loading...</span>
                </div>
            )}
            <img
                src={src}
                alt={alt}
                className="object-cover h-64 w-full rounded-lg transition-opacity duration-300"
                style={{ opacity: loading ? 0 : 1 }}
                loading="lazy"
                width={400}
                height={256}
                onLoad={() => setLoading(false)}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-40 text-white text-center py-2 rounded-b-lg text-sm font-semibold">
                {caption}
            </div>
        </div>
    );
};

const ImageSlider = () => {
    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        speed: 1000,
        autoplaySpeed: 3500,
        cssEase: "ease-in-out",
        arrows: false,
    };

    return (
        <div className="w-full max-w-lg mx-auto rounded-xl shadow-2xl overflow-hidden">
            <Slider {...settings}>
                {images.map((image) => (
                    <div key={image.id} className="flex items-center justify-center h-72 bg-gray-100 rounded-lg shadow-md">
                        <ImageWithLoader src={image.source} alt={`slide-${image.id}`} caption={image.caption} />
                    </div>
                ))}
            </Slider>
        </div>
    )
}

export default ImageSlider
