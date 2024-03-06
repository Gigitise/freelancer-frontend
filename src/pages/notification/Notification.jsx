import React, { useContext } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { timeAgo } from "../../../utils/helpers/TimeAgo";
import { useNavigate } from "react-router-dom";
import { MdNotificationAdd } from "react-icons/md";
import { useNotificationContext } from "../../providers/NotificationProvider";
import "./notification.css";
import ViewMore from "../../components/more/ScrollMore";
import { ThemeContext } from "../../App";

const Notification = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const { notifications, loading, markNotificationRead, getNotifications } =
    useNotificationContext();

  const navigateToOrder = (orderId, notifId) => {
    const notif = notifications.list.find((notif) => notif.id === notifId);
    orderId && navigate(`../order/${orderId}`);
    console.log(notif);

    if (!notif.read_status) {
      markNotificationRead(notifId, notif);
      // .then((res) => {
      //   const upatedNotif = {
      //     ...prevNotif,
      //     read_status: res.read_status,
      //   };
      //   upatedNotif.read_status = res.read_status;
      // });
    }
  };

  return (
    <div className={`notifications ${theme === "light" ? "light-mode" : "dark-mode"}`}>
      {loading ? (
        <div className="notif-skeleton">
          <div className="notif-skeleton-content">
            <div className="notif-sk-circle"></div>
            <div className="notif-sk-box">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
          <div className="notif-skeleton-content">
            <div className="notif-sk-circle"></div>
            <div className="notif-sk-box">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
          <div className="notif-skeleton-content">
            <div className="notif-sk-circle"></div>
            <div className="notif-sk-box">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
          <div className="notif-skeleton-content">
            <div className="notif-sk-circle"></div>
            <div className="notif-sk-box">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      ) : notifications.list.length > 0 ? (
        <>
          {notifications.list?.map((notification, index) => {
            return (
              <div
                onClick={() =>
                  navigateToOrder(notification.order_id, notification.id)
                }
                className="notif-box"
                key={index}
              >
                <div className="bell">
                  <IoMdNotificationsOutline size={30} />
                </div>
                <div className="notif-message">
                  <article>{notification.message}</article>
                </div>
                <div className="notif-duration">
                  <article>{timeAgo(notification.created_at)}</article>
                  {!notification?.read_status && (
                    <div className="notif-circle"></div>
                  )}
                </div>
              </div>
            );
          })}
          {notifications.next && (
            <div className="next-notif">
              <ViewMore fetch={getNotifications} />
            </div>
          )}
        </>
      ) : (
        <div className="no-notif">
          <div className="notif-child-box">
            <article>New notifications will appear here, hang on!</article>
            <MdNotificationAdd size={120} className="placeholder-icon" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;