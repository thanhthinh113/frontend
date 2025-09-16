import React, { useState, useEffect, useRef } from "react";
import "./Slider.css";

const images = [
  "/images/slider2.jpg",
  "/images/slider3.jpg",
  "/images/slider2.jpg",
];

const Slider = () => {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const startAutoPlay = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(nextSlide, 3000);
    }
  };


  const stopAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, []);

  return (
    <div
      className="slider"
      onMouseEnter={stopAutoPlay} 
      onMouseLeave={startAutoPlay} 
    >
      <div
        className="slider-track"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((img, index) => (
          <div className="slide" key={index}>
            <img src={img} alt={`Slide ${index}`} loading="lazy" />
          </div>
        ))}
      </div>

      {/* Mũi tên điều hướng */}
      <button className="arrow left" onClick={prevSlide}>
        ❮
      </button>
      <button className="arrow right" onClick={nextSlide}>
        ❯
      </button>

      {/* Chấm tròn */}
      <div className="dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === current ? "active" : ""}`}
            onClick={() => setCurrent(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Slider;
