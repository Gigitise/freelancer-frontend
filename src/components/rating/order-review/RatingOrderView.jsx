import "./rating-order.css";
import { timeAgo } from "../../../../utils/helpers/TimeAgo";
import Rating from "../Rating";

const RatingOrderView = ({ order, key }) => {
  console.log(order);
  return (
    <div key={key} className="rating-order-view">
      <div className="review-content">
        <article>{order.rating.message}</article>
        <Rating stars={order.rating.stars} />
        <small>{timeAgo(order.rating.created)}</small>
      </div>
    </div>
  );
};

export default RatingOrderView;
