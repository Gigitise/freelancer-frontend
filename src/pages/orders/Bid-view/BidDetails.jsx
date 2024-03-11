import React, { useEffect } from "react";
import "./Bid-view.css";
import OrderComponent from "../../../components/order-component/OrderComponent";
import { useOrderContext } from "../../../providers/OrderProvider";
import LoadingSkeletonOrder from "../../loading/Loading";
import ViewMore from "../../../components/more/ScrollMore";
import OrderPlaceholder from "../../../components/order-placeholder/OrderPlaceholder";

const BidDetails = () => {
  const { ordersBidding, loadingBids, getBidding } = useOrderContext();
  return loadingBids ? (
    <LoadingSkeletonOrder />
  ) : ordersBidding.orders.length > 0 ? (
    <>
      <div className="main-in-progress">
        {ordersBidding.orders.map((order, index) => {
          return <OrderComponent key={index} content={order} />;
        })}
      </div>
      {ordersBidding.next && <ViewMore fetch={getBidding} />}
    </>
  ) : (
    <OrderPlaceholder message="No bids available" />
  );
};

export default BidDetails;
