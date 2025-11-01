import React, { useState, useEffect, useRef } from "react";
import "./Slider.css";

const slides = [
  {
    image: "/images/slider6.png",
    title: "Hải sản tươi ngon mỗi ngày",
    desc: "Chúng tôi mang đến cho bạn những món hải sản tươi sống được chọn lọc kỹ lưỡng, chế biến khéo léo để giữ trọn vị ngọt tự nhiên và hương thơm đặc trưng từ biển cả.",
  },
  {
    image: "/images/slider3.jpg",
    title: "Giao món tận nơi – Nóng hổi như tại quán",
    desc: "Dù bạn ở đâu, các món ăn luôn được giao tận tay với hương vị nguyên vẹn, nóng hổi, giúp bạn tận hưởng bữa ăn trọn vẹn ngay tại nhà.",
  },
  {
    image: "/images/slider2.jpg",
    title: "Tinh hoa ẩm thực Việt",
    desc: "Mỗi món ăn là sự kết hợp tinh tế giữa truyền thống và hiện đại, mang đậm bản sắc Việt trong từng hương vị và cách trình bày.",
  },
  {
    image: "/images/slider4.jpg",
    title: "Ưu đãi hấp dẫn mỗi ngày",
    desc: "Tận hưởng những ưu đãi đặc biệt khi đặt món online – nhanh chóng, tiện lợi, và tiết kiệm hơn bao giờ hết.",
  },
];

const Slider = () => {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  const startAutoPlay = () => {
    if (!intervalRef.current)
      intervalRef.current = setInterval(nextSlide, 4000);
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
        {slides.map((slide, index) => (
          <div className="slide" key={index}>
            <img src={slide.image} alt={slide.title} loading="lazy" />
            <div className="slide-text bottom-left">
              <h2>{slide.title}</h2>
              <p>{slide.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="arrow left" onClick={prevSlide}>
        ❮
      </button>
      <button className="arrow right" onClick={nextSlide}>
        ❯
      </button>

      <div className="dots">
        {slides.map((_, index) => (
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
