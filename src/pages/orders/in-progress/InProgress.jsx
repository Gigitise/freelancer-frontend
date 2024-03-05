import React from "react";
import "./in-progress.css";
import OrderComponent from "../../../components/order-component/OrderComponent";
import { useOrderContext } from "../../../providers/OrderProvider";
import LoadingSkeletonOrder from "../../loading/Loading";
import ViewMore from "../../../components/more/ScrollMore";

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
    <section className="flex items-center h-full sm:p-16 dark:bg-gray-900 dark:text-gray-100">
      <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8 space-y-8 text-center sm:max-w-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-20 h-20"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
          />
        </svg>

        <p className="text-xl">
          There are are no orders currently . Try again later.
        </p>
        <a
          rel="noopener noreferrer"
          href="#"
          className="px-8 py-3 font-semibold rounded bg-blue-400 dark:text-gray-900"
        >
          Back to homepage
        </a>
      </div>
    </section>
  );
};

export default InProgress;
