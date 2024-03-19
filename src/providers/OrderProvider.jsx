import { useContext } from "react";
import { createContext } from "react";
import { useAuthContext } from "./AuthProvider";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useJwt } from "react-jwt";

export const OrderContext = createContext();

export const OrderProvider = (props) => {
  const navigate = useNavigate();
  const isSecureConnection = window.location.protocol === "https:";

  const ordersUrl = `${import.meta.env.VITE_API_URL}/orders/`;

  const { userToken } = useAuthContext();
  const { decodedToken } = useJwt(userToken);

  const [orders, setOrders] = useState([]);
  const [ordersAvailable, setOrdersAvailable] = useState({
    orders: [],
    count: 0,
    next: null,
  });
  const [ordersInProgress, setOrdersInProgress] = useState({
    orders: [],
    count: 0,
    next: null,
  });
  const [ordersCompleted, setOrdersCompleted] = useState({
    orders: [],
    count: 0,
    next: null,
  });

  const [ordersBidding, setOrdersBidding] = useState({
    orders: [],
    count: 0,
    next: null,
  });

  const [loadingAvailable, setLoadingAvailable] = useState(true);

  const [loadingInProgress, setLoadingInProgress] = useState(true);
  const [loadingCompleted, setLoadingCompleted] = useState(true);

  const [submitLoading, setSubmitLoading] = useState(false);

  const [loadingAttachemnt, setLoadingAttachment] = useState(false);
  const [loadingBids, setLoadingBids] = useState(true);

  const [user, setUser] = useState();
  const [socket, setSocket] = useState(null);

  const headersContent = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${userToken}`,
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${userToken}`,
  };

  const getAvailable = async (page_number) => {
    try {
      const getAvaialable = await fetch(
        `${ordersUrl}?status=available&page=${page_number}`,
        {
          headers,
        }
      );
      const available = await getAvaialable.json();
      setOrdersAvailable((prev) => ({
        orders: prev.orders.concat(available.results),
        count: available.count,
        next: available.next,
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingAvailable(false);
    }
  };

  const getInProgress = async (page_number) => {
    try {
      const getInProgress = await fetch(
        `${ordersUrl}?status=in_progress&page=${page_number}`,
        {
          headers,
        }
      );
      const inProgress = await getInProgress.json();
      setOrdersInProgress((prev) => ({
        orders: prev.orders.concat(inProgress.results),
        count: inProgress.count,
        next: inProgress.next,
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingInProgress(false);
    }
  };

  const getCompleted = async (page_number) => {
    try {
      const getCompleted = await fetch(
        `${ordersUrl}?status=completed&page=${page_number}`,
        {
          headers,
        }
      );
      const completed = await getCompleted.json();
      setOrdersCompleted((prev) => ({
        orders: prev.orders.concat(completed.results),
        count: completed.count,
        next: completed.next,
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingCompleted(false);
    }
  };

  // const getOrdersAvailable = async () => {
  //   const ordersUrl = `${import.meta.env.VITE_API_URL}/orders?status=available`;
  //   try {
  //     const getOrders = await fetch(ordersUrl, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${userToken}`,
  //       },
  //     });

  //     const orders = await getOrders.json();
  //     const available = orders.results.filter(
  //       (order) => order.status === "Available"
  //     );

  //     setOrdersAvailable(available);
  //     return orders;
  //   } catch (errors) {
  //     console.error(errors);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const getBidding = async (page) => {
    const biddingUrl = `${
      import.meta.env.VITE_API_URL
    }/orders?bidding=true&page=${page}`;

    try {
      const getBiddings = await fetch(biddingUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      const biddings = await getBiddings.json();
      setOrdersBidding((prev) => ({
        orders: prev.orders.concat(biddings.results),
        count: biddings.count,
        next: biddings.next,
      }));
    } catch (errors) {
      console.error(errors);
    } finally {
      setLoadingBids(false);
    }
  };

  // const getAllOrders = async () => {
  //   const ordersUrl = `${import.meta.env.VITE_API_URL}/orders`;
  //   try {
  //     const getOrders = await fetch(ordersUrl, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${userToken}`,
  //       },
  //     });

  //     const orders = await getOrders.json();
  //     // const available = orders.filter(order=>order.status==='Available');
  //     const inProgress = orders.results.filter(
  //       (order) => order.status === "In Progress"
  //     );
  //     const completed = orders.results.filter(
  //       (order) => order.status === "Completed"
  //     );

  //     // setOrdersAvailable(available);
  //     setOrdersInProgress(inProgress);
  //     setOrdersCompleted(completed);
  //     setOrders(orders.results);

  //     return orders.results;
  //   } catch (errors) {
  //     console.error(errors);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const createOrder = async (e) => {
    try {
      setSubmitLoading(true);
      e.preventDefault();
      const title = e.target.title.value;
      const category = e.target.category.value;
      const deadline = new Date(e.target.deadline.value);
      const instructions = e.target.instructions.value;
      const amount = e.target.amount.value;

      const headers = {
        Authorization: `Bearer ${userToken}`,
      };

      let bodyData;

      if (e.target.attachment.files.length > 0) {
        const attachment = e.target.attachment.files[0];
        const data = new FormData();
        data.append("title", title);
        data.append("category", category);
        data.append("attachment", attachment);
        data.append("deadline", deadline.toISOString());
        data.append("instructions", instructions);
        data.append("amount", amount);

        bodyData = data;
      } else {
        const jsonPayload = {
          title,
          category,
          deadline: deadline.toISOString(),
          instructions,
          amount,
        };

        bodyData = JSON.stringify(jsonPayload);
        headers["Content-Type"] = "application/json";
      }

      const createOrder = await fetch(ordersUrl, {
        method: "post",
        headers,
        body: bodyData,
      });

      const status = createOrder.status;

      if (status === 201) {
        console.log("navigation");
        getAllOrders().then(() => {
          navigate("./app");
        });
        setSubmitLoading(false);
      } else if (status === 401) {
        navigate("/login?redirect=create-task");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const updateInstructions = async (instructions, orderId) => {
    try {
      const updateOrder = await fetch(`${ordersUrl}${orderId}/`, {
        method: "put",
        headers: headersContent,
        body: JSON.stringify({
          instructions: instructions,
        }),
      });

      if (updateOrder.ok) {
        const data = updateOrder.json();
        return data;
      } else {
        const status = updateOrder.status;
        if (status === 401) {
          navigate(`../login?order=${orderId}`);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const uploadAttachment = async (file, orderId, solutionType) => {
    const solutionUrl = `${import.meta.env.VITE_API_URL}/orders/${orderId}`;
    setLoadingAttachment(true);

    try {
      const data = new FormData();
      data.append("solution", file);
      data.append("_type", solutionType); // Include the solutionType in the FormData

      const response = await fetch(`${solutionUrl}/solution/`, {
        method: "post",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        body: data,
      });

      if (response.ok) {
        const dataRes = await response.json();
        return dataRes;
      } else {
        const status = response.status;
        if (status === 401) {
          console.log("NOT ALLOWED");
          navigate(`../login?order=${orderId}`);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAttachment(false);
    }
  };

  const completeOrder = async (orderId) => {
    try {
      const completeOrderStatus = await fetch(`${ordersUrl}${orderId}/`, {
        method: "put",
        headers: headersContent,
        body: JSON.stringify({
          status: "Completed",
        }),
      });

      if (completeOrderStatus.ok) {
        const data = await completeOrderStatus.json();
        return data;
      } else {
        const status = completeOrderStatus.status;
        if (status === 401) {
          navigate(`../login?order=${orderId}`);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const handleConfirmDelete = async ({ newOrder }) => {
    setOrdersBidding((prev) => {
      const newOrders = prev?.orders.filter((order) => {
        return order.id !== newOrder.id;
      });
      return {
        ...prev,
        orders: newOrders,
        count: prev.count - 1,
      };
    });
    setOrdersAvailable((prev) => {
      return {
        ...prev,
        orders: [newOrder].concat(prev.orders),
        count: prev.count + 1,
      };
    });
  };

  const updateOrders = ({ newOrder }) => {
    setOrdersAvailable((prev) => {
      const newOrders = prev?.orders.filter((order) => {
        return order.id !== newOrder.id;
      });
      return {
        ...prev,
        orders: newOrders,
        count: prev.count - 1,
      };
    });
    setOrdersBidding((prev) => {
      return {
        ...prev,
        orders: [newOrder].concat(prev.orders),
        count: prev.count + 1,
      };
    });
  };

  useEffect(() => {
    setUser(decodedToken?.user_id);
    if (user) {
      console.log("Connected");
      const newSocket = new WebSocket(
        `${
          isSecureConnection
            ? import.meta.env.VITE_WSS_URL
            : import.meta.env.VITE_WS_URL
        }/order/freelancer/`
      );
      setSocket(newSocket);
      newSocket.onmessage = (event) => {
        const receivedData = JSON.parse(event.data);
        const newOrder = receivedData.message.order;
        setOrdersAvailable((prev) => {
          return {
            ...prev,
            orders: [newOrder].concat(prev.orders),
            count: prev.count + 1,
          };
        });
      };
      setSocket(newSocket);
    } else {
      socket?.close();
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [decodedToken, user]);

  useEffect(() => {
    setUser(decodedToken?.user_id);
    if (user) {
      console.log("Connected");
      const newSocket = new WebSocket(
        `${
          isSecureConnection
            ? import.meta.env.VITE_WSS_URL
            : import.meta.env.VITE_WS_URL
        }/hire/${user}/`
      );
      setSocket(newSocket);
      newSocket.onmessage = (event) => {
        const receivedData = JSON.parse(event.data);
        const newOrder = receivedData.message.order;
        setOrdersBidding((prev) => {
          console.log(prev.orders);
          const newOrders = prev?.orders?.filter((order) => {
            return order.id !== newOrder.id;
          });

          console.log(newOrders);

          return {
            ...prev,
            orders: newOrders,
            count: prev.count - 1,
          };
        });

        setOrdersInProgress((prev) => {
          return {
            ...prev,
            orders: [newOrder].concat(prev.orders),
            count: prev.count + 1,
          };
        });
      };
      setSocket(newSocket);
    } else {
      socket?.close();
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [decodedToken, user]);

  useEffect(() => {
    setUser(decodedToken?.user_id);
    if (user) {
      console.log("Connected");
      const newSocket = new WebSocket(
        `${
          isSecureConnection
            ? import.meta.env.VITE_WSS_URL
            : import.meta.env.VITE_WS_URL
        }/completed/${user}/`
      );
      setSocket(newSocket);
      newSocket.onmessage = (event) => {
        const receivedData = JSON.parse(event.data);
        const newOrder = receivedData.message.order;
        setOrdersInProgress((prev) => {
          const newOrders = prev?.orders?.filter((order) => {
            return order.id !== newOrder.id;
          });

          return {
            ...prev,
            orders: newOrders,
            count: prev.count - 1,
          };
        });

        setOrdersCompleted((prev) => {
          return {
            ...prev,
            orders: [newOrder].concat(prev.orders),
            count: prev.count + 1,
          };
        });
      };
      setSocket(newSocket);
    } else {
      socket?.close();
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [decodedToken, user]);

  const updateOrdersAvailable = (orderRes) => {
    setOrdersAvailable((prev) => {
      const updatedOrders = prev.orders.filter((order) => {
        return order.id !== orderRes?.id;
      });
      return {
        ...prev,
        orders: updatedOrders,
        count: prev.count - 1,
      };
    });

    getAvailable(1);

    setOrdersInProgress((prev) => {
      const updatedOrders = [orderRes].concat(prev.orders);
      return {
        ...prev,
        orders: updatedOrders,
        count: prev.count + 1,
      };
    });
  };

  useEffect(() => {
    // userToken && getAllOrders();
    if (userToken) {
      getAvailable(1);
      getInProgress(1);
      getCompleted(1);
      getBidding(1);
    }
  }, [userToken]);

  return (
    <OrderContext.Provider
      value={{
        orders,
        ordersAvailable,
        ordersInProgress,
        ordersCompleted,
        loadingAvailable,
        loadingInProgress,
        loadingCompleted,
        submitLoading,
        loadingAttachemnt,
        ordersBidding,
        loadingBids,
        createOrder,
        updateInstructions,
        completeOrder,
        getAvailable,
        getInProgress,
        getCompleted,
        uploadAttachment,
        updateOrdersAvailable,
        getBidding,
        handleConfirmDelete,
        updateOrders,
      }}
    >
      {props.children}
    </OrderContext.Provider>
  );
};

export function useOrderContext() {
  return useContext(OrderContext);
}
