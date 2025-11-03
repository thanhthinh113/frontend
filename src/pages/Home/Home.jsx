import React, { useContext } from "react";
import Slider from "../../admin/components/Slider/Slider";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import { FoodDisplay } from "../../components/FoodDisplay/FoodDisplay";
import { StoreContext } from "../../context/StoreContext";
import ComboDeals from "../../components/ComboDeals/ComboDeals";
import "./Home.css";
import Benefit from "../../components/Benefit/Benefit";

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
      <section className="home-section">
        <ComboDeals />
      </section>
    </div>
  );
};
