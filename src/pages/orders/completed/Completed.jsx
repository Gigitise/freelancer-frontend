import React from "react";
import "./completed.css";
import OrderComponent from "../../../components/order-component/OrderComponent";
import { useOrderContext } from "../../../providers/OrderProvider";
import LoadingSkeletonOrder from "../../loading/Loading";
import { useNavigate } from "react-router-dom";
import ViewMore from "../../../components/more/ScrollMore";
import OrderPlaceholder from "../../../components/order-placeholder/OrderPlaceholder";

const Completed = () => {
  const navigate = useNavigate();

  const { ordersCompleted, loadingCompleted, getCompleted } = useOrderContext();

  return loadingCompleted ? (
    <LoadingSkeletonOrder />
  ) : ordersCompleted.orders.length > 0 ? (
    <>
      <div className="completed">
        {ordersCompleted.orders.map((order, index) => {
          return <OrderComponent content={order} key={index} />;
        })}
      </div>
      {ordersCompleted.next && <ViewMore fetch={getCompleted} />}
    </>
  ) : (
    <OrderPlaceholder message="Orders completed will appear here" />
  );
};

export default Completed;
