import React, { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./ComboDeals.css";

const ComboDeals = () => {
  const { combos = [], addToCart, url } = useContext(StoreContext);

  const formatCurrency = (value) => {
    if (!value) return "";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleAddCombo = (combo) => {
    if (combo.items && combo.items.length > 0) {
      combo.items.forEach((foodId) => addToCart(foodId));
    }
  };
  //   const handleAddCombo = (combo) => {
  //   addToCart(combo);
  // };

  return (
    <div className="combo-deals">
      <div className="combo-header">
        <h2>🎁 Combo ưu đãi</h2>
      </div>
      <div className="combo-list">
        {combos.length > 0 ? (
          combos.map((combo) => (
            <div className="combo-card" key={combo._id}>
              <img
                src={
                  combo.image?.startsWith("http")
                    ? combo.image
                    : `${url}/images/${combo.image}`
                }
                alt={combo.name}
                className="combo-img"
              />
              <div className="combo-info">
                <h3>{combo.name}</h3>
                <p>{combo.description}</p>

                <p className="combo-price">
                  {combo.discountPrice ? (
                    <>
                      <span className="old-price">
                        {formatCurrency(combo.price)}₫
                      </span>{" "}
                      <span className="new-price">
                        {formatCurrency(combo.discountPrice)}₫
                      </span>
                    </>
                  ) : (
                    <span className="new-price">
                      {formatCurrency(combo.price)}₫
                    </span>
                  )}
                </p>

                {/* ✅ Button thêm combo */}
                <button
                  onClick={() => handleAddCombo(combo)}
                  className="btn-add"
                >
                  ➕ Chọn combo
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>⏳ Chưa có combo ưu đãi</p>
        )}
      </div>
    </div>
  );
};

export default ComboDeals;
