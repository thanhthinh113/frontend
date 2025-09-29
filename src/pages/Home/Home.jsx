import React, { useContext } from "react";
import Slider from "../../admin/components/Slider/Slider";
import  ExploreMenu  from "../../components/ExploreMenu/ExploreMenu";
import { FoodDisplay } from "../../components/FoodDisplay/FoodDisplay";
import { StoreContext } from "../../context/StoreContext";
import "./Home.css";

export const Home = () => {
  const { food_list } = useContext(StoreContext);

  console.log("Home food_list:", food_list);

  return (
    <div className="home">
      <Slider />

      <section className="home-section">
        <ExploreMenu />
      </section>

      <section className="home-section">
        {/* <h2 className="section-title">Món ăn nổi bật</h2> */}
        {food_list && food_list.length > 0 ? (
          <FoodDisplay foodList={food_list} />
        ) : (
          <p>Đang tải món ăn...</p>
        )}
      </section>
    </div>
  );
};
