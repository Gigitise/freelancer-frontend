import React, { useContext } from "react";
import { useOrderContext } from "../../providers/OrderProvider";
import OrderComponent from "../../components/order-component/OrderComponent";
import "./dashboard.css";
import LoadingSkeletonOrder from "../loading/Loading";
import { ThemeContext } from "../../App";
import OrderPlaceholder from "../../components/order-placeholder/OrderPlaceholder";

const FreelancerDashboard = () => {
  const { orders, loading } = useOrderContext();
  const { theme } = useContext(ThemeContext);

  return loading ? (
    <LoadingSkeletonOrder />
  ) : orders?.length > 0 ? (
    <div
      className={`dashboard ${theme === "light" ? "light-mode" : "dark-mode"}`}
    >
      {orders?.map((order, index) => {
        return <OrderComponent key={index} content={order} />;
      })}
    </div>
  ) : (
    <OrderPlaceholder message="No orders available at the moment" />
  );
};

export default FreelancerDashboard;
