import React, { useContext } from "react";
import "./settings.css";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa6";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { MdAppSettingsAlt } from "react-icons/md";
import { useState } from "react";
import { useAuthContext } from "../../providers/AuthProvider";
import toast from "react-hot-toast";
import { ThemeContext } from "../../App";

const Settings = () => {
  const { loadedUserProfile, userToken } = useAuthContext();
  const { theme } = useContext(ThemeContext);
  const [userProfile] = useState(loadedUserProfile);
  const settings = userProfile?.settings;
  const [emailToggleStates, setEmailToggleStates] = useState({
    email_uploaded_work: settings?.email_uploaded_work,
    email_new_messages: settings?.email_new_messages,
    email_deadline: settings?.email_deadline,
  });
  const [appToggleStates, setAppToggleStates] = useState({
    app_uploaded_work: settings?.app_uploaded_work,
    app_new_messages: settings?.app_new_messages,
    app_deadline: settings?.app_deadline,
  });

  const updateSettings = async (field, value) => {
    const profileUrl = `${import.meta.env.VITE_API_URL}/profile/${
      userProfile.id
    }/`;

    const body = JSON.stringify({
      settings: {
        [field]: value,
      },
    });

    try {
      const updateSetting = await fetch(profileUrl, {
        method: "put",
        headers: {
          "content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body,
      });

      const response = await updateSetting.json();

      if (updateSetting.ok) {
        return response;
      } else {
        toast.error("Error updating preferences!");
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const handleEmailToggle = (field) => {
    updateSettings(field, !emailToggleStates[field]).then((response) => {
      setEmailToggleStates((prevState) => ({
        ...prevState,
        [field]: response?.settings[field],
      }));
    });
  };

  const handleAppToggle = (field) => {
    updateSettings(field, !appToggleStates[field]).then((response) => {
      setAppToggleStates((prevState) => ({
        ...prevState,
        [field]: response?.settings[field],
      }));
    });
  };

  const iconSize = 23;
  return (
    <div className={`settings-page ${theme === "light" ? "light-mode" : "dark-mode"}`}>
      <div className="settings-content">
        <div className="settings-personal">
          <div className="feature-1">
            <RiLockPasswordFill size={iconSize} />
            <article>Change Password</article>
            <span>**********</span>
          </div>
          <div className="feature-2">
            <FaUser size={20} />
            <article>Username</article>
            <span>{userProfile?.username}</span>
          </div>
        </div>
        <div className="notifications-settings">
          <strong className="pref-title">Notification Preferences</strong>
          <div className="content">
            <div className="pref">
              <strong>
                <MdOutlineMarkEmailRead size={iconSize} /> Email Notifications
              </strong>
              <div>
                <article>Uploaded Work</article>
                <input
                  className="input-toggle"
                  type="radio"
                  checked={emailToggleStates.email_uploaded_work}
                  hidden={true}
                />
                <label
                  className="label-toggle"
                  onClick={() => handleEmailToggle("email_uploaded_work")}
                ></label>
              </div>
              <div>
                <article>New Messages</article>
                <input
                  className="input-toggle"
                  type="radio"
                  checked={emailToggleStates.email_new_messages}
                  hidden={true}
                />
                <label
                  className="label-toggle"
                  onClick={() => handleEmailToggle("email_new_messages")}
                ></label>
              </div>
              <div>
                <article>Deadline</article>
                <input
                  className="input-toggle"
                  type="radio"
                  checked={emailToggleStates.email_deadline}
                  hidden={true}
                />
                <label
                  className="label-toggle"
                  onClick={() => handleEmailToggle("email_deadline")}
                ></label>
              </div>
            </div>
            <div className="pref">
              <strong>
                <MdAppSettingsAlt size={iconSize} /> In App Notifications
              </strong>
              <div>
                <article>Uploaded Work</article>
                <input
                  className="input-toggle"
                  type="radio"
                  checked={appToggleStates.app_uploaded_work}
                  hidden={true}
                />
                <label
                  className="label-toggle"
                  onClick={() => handleAppToggle("app_uploaded_work")}
                ></label>
              </div>
              <div>
                <article>New Messages</article>
                <input
                  className="input-toggle"
                  type="radio"
                  checked={appToggleStates.app_new_messages}
                  hidden={true}
                />
                <label
                  className="label-toggle"
                  onClick={() => handleAppToggle("app_new_messages")}
                ></label>
              </div>
              <div>
                <article>Deadline</article>
                <input
                  className="input-toggle"
                  type="radio"
                  checked={appToggleStates.app_deadline}
                  hidden={true}
                />
                <label
                  className="label-toggle"
                  onClick={() => handleAppToggle("app_deadline")}
                ></label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
