import React from "react";
import "./in-progress.css";
import OrderComponent from "../../../components/order-component/OrderComponent";
import { useOrderContext } from "../../../providers/OrderProvider";
import LoadingSkeletonOrder from "../../loading/Loading";
import ViewMore from "../../../components/more/ScrollMore";
import OrderPlaceholder from "../../../components/order-placeholder/OrderPlaceholder";
const InProgress = () => {
  const { ordersInProgress, loadingInProgress, getInProgress } =
    useOrderContext();
  return loadingInProgress ? (
    <LoadingSkeletonOrder />
  ) : ordersInProgress.orders.length > 0 ? (
    <>
      <div className="main-in-progress">
        {ordersInProgress.orders.map((order, index) => {
          return <OrderComponent key={index} content={order} />;
        })}
      </div>
      {ordersInProgress.next && <ViewMore fetch={getInProgress} />}
    </>
  ) : (
    <OrderPlaceholder message="No orders in progress" />
  );
};

export default InProgress;
