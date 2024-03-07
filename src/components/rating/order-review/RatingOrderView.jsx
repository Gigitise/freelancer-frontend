import React, { useContext } from "react";
import "./rating-order.css";
import { timeAgo } from "../../../../utils/helpers/TimeAgo";
import Rating from "../Rating";
import { ThemeContext } from "../../../App";

const RatingOrderView = ({ order, key }) => {
  console.log(order);
  const { theme } = useContext(ThemeContext);
  return (
    <div key={key} className={`rating-order-view ${theme === "light" ? "light-mode" : "dark-mode"}`}>
      <div className="review-content">
        <article>{order.rating.message}</article>
        <Rating stars={order.rating.stars} />
        <small>{timeAgo(order.rating.created)}</small>
      </div>
    </div>
  );
};

export default RatingOrderView;
