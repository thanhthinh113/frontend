import React, { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./ComboDeals.css";

const ComboDeals = () => {
  const { combos, url } = useContext(StoreContext);
  const formatCurrency = (value) => {
    if (!value) return "";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="combo-deals">
      <h2>🎁 Combo ưu đãi</h2>
      <div className="combo-list">
        {combos.map((combo) => (
          <div className="combo-card" key={combo._id}>
            <img
              src={`${url}/images/${combo.image}`}
              alt={combo.name}
              className="combo-img"
            />
            <div className="combo-info">
              <h3>{combo.name}</h3>
              <p>{combo.description}</p>
              <p className="combo-price">
                <span className="old-price">{formatCurrency(combo.price)}₫</span>{" "}
                <span className="new-price">
                  {formatCurrency(combo.discountPrice)}₫
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComboDeals;
