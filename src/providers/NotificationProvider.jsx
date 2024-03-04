import { useContext } from "react";
import { createContext } from "react";
import { useJwt } from "react-jwt";
import { useAuthContext } from "./AuthProvider";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { timeFormater } from "../../utils/helpers/TimeFormater";
import notifTone from "../assets/sounds/newMessageTone.wav";

export const NotificationContext = createContext();

export const NotificationProvider = (props) => {
  const { userToken } = useAuthContext();
  const isSecureConnection = window.location.protocol === "https:";

  const { decodedToken } = useJwt(userToken);

  const [socket, setSocket] = useState();

  const [user, setUser] = useState();

  const notifUrl = `${import.meta.env.VITE_API_URL}/notifications`;

  const [newNotification, setNewNotification] = useState({});
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState({
    list: [],
    next: null,
  });
  const [loading, setLoading] = useState(true);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${userToken}`,
  };
  const toggleShow = () => {
    setShowNotification(false);
  };

  // const getUnread = (notifications) => {
  //   const updatedNotif = notifications.filter(
  //     (notif) => notif.read_status === false
  //   );
  //   setUnreadNotif(updatedNotif);
  //   return updatedNotif;
  // };

  const getNotifications = async (page) => {
    try {
      const getNotif = await fetch(`${notifUrl}/?page=${page}`, {
        method: "get",
        headers,
      });

      if (getNotif.ok) {
        const notifications = await getNotif.json();
        setUnreadNotifCount(notifications.unread_count);
        setNotifications((prev) => ({
          list: prev.list.concat(notifications.results),
          next: notifications.next,
        }));
        // return notifications.results;
      } else {
        const status = getNotif.status;
        if (status === 401) {
          navigate("/login?redirect=notifications");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const markNotificationRead = async (notifId, notif) => {
    const readNotification = await fetch(`${notifUrl}/${notifId}/`, {
      method: "put",
      headers,

      body: JSON.stringify({
        read_status: true,
      }),
    });

    if (readNotification.ok) {
      const res = await readNotification.json();

      if (notif) {
        notif.read_status = res.read_status;
      }

      const getUnread = await fetch(`${notifUrl}/?status=unread_count`, {
        headers,
      });
      if (getUnread.ok) {
        const res = await getUnread.json();
        setUnreadNotifCount(res.unread_count);
      }

      return res;
    }
  };

  useEffect(() => {
    userToken && getNotifications(1);
  }, [userToken]);

  const CustomToast = ({ newNotification }) => {
    return (
      <div
        style={{
          display: "flex",
        }}
      >
        <article>{newNotification?.message}</article>
        <small
          style={{
            position: "absolute",
            right: "4%",
            bottom: "4%",
          }}
        >
          {timeFormater(newNotification.created_at)}
        </small>
      </div>
    );
  };

  useEffect(() => {
    setUser(decodedToken?.user_id);

    if (user) {
      const newSocket = new WebSocket(
        `${
          isSecureConnection
            ? import.meta.env.VITE_WSS_URL
            : import.meta.env.VITE_WS_URL
        }/notifications/${user}/`
      );
      setSocket(newSocket);

      newSocket.onmessage = (event) => {
        const receivedData = JSON.parse(event.data);
        console.log(receivedData);

        if (receivedData.type === "new_notification") {
          const sound = new Audio(notifTone);

          sound.play();

          const newNotification = receivedData.message.notification;
          setNewNotification(newNotification);
          toast.success(<CustomToast newNotification={newNotification} />, {
            position: "bottom-left",
            html: true,
          });
          setNotifications((prev) => {
            return {
              ...prev,
              list: [newNotification].concat(prev.list),
            };
          });
          receivedData.type = null;
        }
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
  }, [user, decodedToken]);

  return (
    <NotificationContext.Provider
      value={{
        loading,
        unreadNotifCount,
        showNotification,
        newNotification,
        notifications,
        markNotificationRead,
        getNotifications,
        toggleShow,
      }}
    >
      {props.children}
    </NotificationContext.Provider>
  );
};

export function useNotificationContext() {
  return useContext(NotificationContext);
}
