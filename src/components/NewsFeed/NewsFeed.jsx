// src/components/NewsFeed/NewsFeed.jsx (Cập nhật)

import React from "react";
import "./NewsFeed.css";
// Không cần Link từ react-router-dom trong component này vì tất cả là link ngoài
// Nếu bạn muốn giữ lại nút "Xem tất cả Tin tức" dẫn đến trang /blog, bạn vẫn cần Link

// Hàm bọc để tạo thẻ <a> cho link ngoài
const ExternalLinkWrapper = ({ to, children, className }) => {
  return (
    <a
      href={to}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
};

// ⭐️ DỮ LIỆU MẪU SỰ KIỆN VÀ BLOG TÌM KIẾM TRÊN GOOGLE ⭐️
const newsData = [
  {
    id: 1,
    title: "Tìm kiếm: Các món Việt vào bảng xếp hạng ẩm thực thế giới 2024",
    date: "22/11/2025",
    image: "/images/1736729121-monan3-1554-width1200height799.jpg",
    // Link tìm kiếm các xu hướng ẩm thực
    link: "https://vnexpress.net/cac-mon-viet-vao-bang-xep-hang-am-thuc-the-gioi-2024-4838000.html",
  },
  {
    id: 2,
    title: "Sự kiện: Hội chợ ẩm thực kết hợp hoạt động trải nghiệm Stem",
    date: "15/11/2025",
    image: "/images/z5067947762094_b6ceb65b57fe052f54be939a329ddf8a.jpg",
    // Link tìm kiếm sự kiện ẩm thực
    link: "https://thcsquangtrungkcr.gialai.edu.vn/tin-tuc-su-kien/hoat-dong-su-kien/hoi-cho-am-thuc-ket-hop-hoat-dong-trai-nghiem-stem-nam-hoc-2023-2024.html",
  },
  {
    id: 3,
    title: "Tìm kiếm: Các mẹo vặt nấu ăn cơ bản cho người mới",
    date: "10/11/2025",
    image: "/images/hoc-nau-an-co-ban-1.jpg", // Đổi tên ảnh (nếu có)
    // Link tìm kiếm các mẹo nấu ăn trên Google
    link: "https://vietgiao.edu.vn/hoc-nau-an-co-ban/",
  },
];

const NewsFeed = ({ newsList = newsData }) => {
  return (
    <div className="news-feed-container">
      <h2 className="news-feed-title">📰 SỰ KIỆN & TIN TỨC ẨM THỰC</h2>

      <div className="news-list">
        {newsList.map((news) => {
          const linkTarget = news.link; // Link mặc định là link Google

          return (
            <div key={news.id} className="news-card">
              {/* 1. LINK HÌNH ẢNH (Dùng thẻ <a>) */}
              <ExternalLinkWrapper
                to={linkTarget}
                className="news-link-wrapper"
              >
                <div className="news-image-wrapper">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="news-image"
                  />
                </div>
              </ExternalLinkWrapper>

              <div className="news-content">
                {/* 2. LINK TIÊU ĐỀ (Dùng thẻ <a>) */}
                <ExternalLinkWrapper
                  to={linkTarget}
                  className="news-link-wrapper title-link"
                >
                  <h3>{news.title}</h3>
                </ExternalLinkWrapper>

                <p className="news-date">{news.date}</p>

                {/* 3. LINK ĐỌC THÊM (Dùng thẻ <a>) */}
                <ExternalLinkWrapper to={linkTarget} className="read-more">
                  Tìm hiểu thêm &gt;
                </ExternalLinkWrapper>
              </div>
            </div>
          );
        })}
      </div>
      <a
        href="https://vnamthuc.blogspot.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <button className="view-all-btn">Xem tất cả Tin tức</button>
      </a>
    </div>
  );
};

export default NewsFeed;
