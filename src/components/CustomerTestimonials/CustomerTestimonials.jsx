import React from "react";
import { useInView } from "react-intersection-observer"; // <-- Import hook
import "./CustomerTestimonials.css";

const testimonialsData = [
  {
    id: 1,
    text: "Giao hàng siêu nhanh! Đồ ăn vẫn còn nóng hổi và tươi ngon như vừa nấu xong. Rất hài lòng với dịch vụ này!",
    name: "Sơn Tùng",
    location: "Hồ Chí Minh",
    avatar: "/images/anh-son-tung-mtp-thumb.jpg",
    image:
      "/images/mi-tuong-den-bao-nhieu-calo-an-mi-tuong-den-co-tot-khong-202110082340510401.jpg",
  },
  {
    id: 2,
    text: "Món ăn đóng gói cẩn thận, đầy đủ và chất lượng vượt xa mong đợi so với giá tiền.",
    name: "Huỳnh Công Hiếu",
    location: "Hồ Chí Minh",
    avatar: "/images/huynh-cong-hieu-tong-quan-0.jpg",
    image: "/images/thumb-31.jpg",
  },
  {
    id: 3,
    text: "Ứng dụng dễ sử dụng, tìm kiếm món ăn nhanh chóng. Shipper nhiệt tình và đồ uống luôn chuẩn vị.",
    name: "Phan Mạnh Quỳnh",
    location: "Hồ Chí Minh",
    avatar: "/images/phan-manh-quynh-1.jpg",
    image: "/images/tra-sua-03.jpg",
  },
];

const CustomerTestimonials = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const getAnimationClass = (index) => {
    if (inView) {
      if (index === 0) return "slide-in-left";
      if (index === 1) return "slide-in-top";
      if (index === 2) return "slide-in-right";
    }

    return "initial-hidden-retrigger";
  };

  return (
    <div className="customer-testimonials" ref={ref}>
      {" "}
      <h2 className="testimonials-title">CẢM NHẬN CỦA KHÁCH HÀNG</h2>
      <div className="testimonials-list">
        {testimonialsData.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className={`testimonial-card ${
              inView ? getAnimationClass(index) : "initial-hidden-retrigger"
            }`}
          >
            <div className="testimonial-image-container">
              {testimonial.image ? (
                <img
                  src={testimonial.image}
                  alt={`Ảnh khách hàng ${testimonial.name}`}
                />
              ) : (
                <p className="image-placeholder">Chưa có ảnh</p>
              )}
            </div>

            <p className="testimonial-text">{testimonial.text}</p>

            <div className="customer-info">
              <div className="customer-avatar">
                {testimonial.avatar && (
                  <img
                    src={testimonial.avatar}
                    alt={`Avatar của ${testimonial.name}`}
                  />
                )}
              </div>
              <div className="customer-details">
                <p className="customer-name">
                  <strong>{testimonial.name}</strong>
                </p>
                <p className="customer-location">{testimonial.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerTestimonials;
