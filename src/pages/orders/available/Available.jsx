import React from "react";
import OrderComponent from "../../../components/order-component/OrderComponent";
import { useOrderContext } from "../../../providers/OrderProvider";
import LoadingSkeletonOrder from "../../loading/Loading";
import ViewMore from "../../../components/more/ScrollMore";
import { useEffect } from "react";

const Available = () => {
  const { getAvailable, loadingAvailable, ordersAvailable } = useOrderContext();

  return loadingAvailable ? (
    <LoadingSkeletonOrder />
  ) : ordersAvailable.orders.length > 0 ? (
    <>
      <div className="main-available">
        {ordersAvailable.orders.map((order, index) => {
          return <OrderComponent key={index} content={order} />;
        })}
      </div>
      {ordersAvailable.next && <ViewMore fetch={getAvailable} />}
    </>
  ) : (
    <div className="create-task-div">
      <div className="child">
        <article>There are no available orders!</article>
      </div>
    </div>
  );

  // </div>
};

export default Available;
