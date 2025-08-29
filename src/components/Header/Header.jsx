import React from "react";
import "./Header.css";
export const Header = () => {
  return (
    <div className="header">
      <div className="head-contents">
        <h2>Order your favorite food here</h2>
        <p>
          Choose from a diverse menu featuring a delectable array of dishes
          crafted with the finest ingredients and culinary expertise. Our team
          is dedicated to providing you with an exceptional dining experience.
        </p>
        <button>View Menu</button>
      </div>
    </div>
  );
};
