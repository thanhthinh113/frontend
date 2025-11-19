import React, { useContext } from "react";
import Slider from "../../admin/components/Slider/Slider";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import { FoodDisplay } from "../../components/FoodDisplay/FoodDisplay";
import { StoreContext } from "../../context/StoreContext";
import ComboDeals from "../../components/ComboDeals/ComboDeals";
import CustomerTestimonials from "../../components/CustomerTestimonials/CustomerTestimonials"; // <-- Import component mới
import "./Home.css";
import Benefit from "../../components/Benefit/Benefit";
import NewsFeed from "../../components/NewsFeed/NewsFeed";

export const Home = () => {
  const { food_list } = useContext(StoreContext);

  console.log("Home food_list:", food_list);

  return (
    <div className="home">
      <Slider />
      <Benefit />
      <section className="home-section">
        <ExploreMenu />
      </section>

      <section className="home-section">
        {food_list && food_list.length > 0 ? (
          <FoodDisplay foodList={food_list} />
        ) : (
          <p>Đang tải món ăn...</p>
        )}
      </section>
      {/* <-- Thêm Cảm nhận khách hàng ở đây --> */}
      <section className="home-section">
        <CustomerTestimonials />
      </section>
      <section className="home-section">
        <ComboDeals />
      </section>
      <section className="home-section home-news-feed">
        <NewsFeed />
      </section>
    </div>
  );
};
