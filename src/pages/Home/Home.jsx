import React, { useState } from "react";
import "./Home.css";
import { Header } from "../../components/Header/Header";
import { ExploreMenu } from "../../components/ExploreMenu/ExploreMenu";
import { FoodDisplay } from "../../components/FoodDisplay/FoodDisplay";
import { AppDownload } from "../../components/AppDownload/AppDownload";
import Slider from "../../admin/components/Slider/Slider";

export const Home = () => {
  const [category, setCategory] = useState("ALL");

  return (
    <div>
      <Slider />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
      <AppDownload />
    </div>
  );
};
