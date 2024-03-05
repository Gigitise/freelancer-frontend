import {
  MdVerified,
  MdPendingActions,
  MdOutlineAddTask,
  MdTaskAlt,
} from "react-icons/md";
import getUnicodeFlagIcon from "country-flag-icons/unicode";
import { useAuthContext } from "../../providers/AuthProvider";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const ClientProfile = () => {
  const { clientParam } = useParams();
  const { userToken } = useAuthContext();

  const [clientData, setClientData] = useState();

  const headers = {
    "content-Type": "application/json",
    Authorization: `Bearer ${userToken}`,
  };

  const getViewProfile = async (client) => {
    const profileUrl = `${
      import.meta.env.VITE_API_URL
    }/profile/?user=${client}`;

    try {
      const viewProfile = await fetch(profileUrl, {
        headers,
      });

      if (viewProfile.ok) {
        const response = await viewProfile.json();
        console.log(response);
        setClientData(response[0]);
      } else {
        toast.error(`Error occured while fetching ${client}'s profile`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    clientParam && getViewProfile(clientParam);
  }, [clientParam]);
  const iconSize = 20;

  return (
    <div className="flex">
      <div className="flex-1 flex flex-col">
        <div className="p-4 my-4">
          <div className="flex gap-3 items-center">
          {clientData?.profile_photo ? (
            <div
              className="rounded-full w-16 h-16 overflow-hidden"
              style={{ width: '4rem', height: '4rem' }} 
            >
              <img
                className="w-full h-full object-cover"
                src={clientData?.profile_photo}
                alt="profile-cover"
              />
            </div>
          ) : (
            <label className="bg-sky-300 rounded-full w-16 p-4 text-center text-white text-2xl">
              {clientData &&
                `${
                  clientData?.username.charAt(0).toUpperCase() +
                  clientData?.username.slice(1).slice(0, 1)
                }`}
            </label>
          )}
            <div className="space-y-1 text-gray-600">
              <article
                className=""
                style={{
                  fontWeight: "bold",
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                  color: "#f7fafc",
                }}
              >
                {clientData?.username}
                {clientData?.is_verified === "True" && (
                  <MdVerified className="" size={iconSize} />
                )}
              </article>
              <article className="text-white">
                {clientData?.first_name} {clientData?.last_name}
              </article>
            </div>
          </div>
          <div className="address text-white flex mt-10">
            <div className="address-element">
              {clientData?.address.country ? (
                <div className="flex mr-10">
                  <article className="mr-10">{clientData?.address.country}</article>
                  <article>
                    {getUnicodeFlagIcon(`${clientData?.address.countryCode}`)}
                  </article>
                </div>
              ) : (
                <span>Loading Country</span>
              )}
            </div>
            <div className="address-element ml-10">
              <span>Time Zone: </span>
              {clientData?.address.timezone}
            </div>
          </div>
          <div className="prof-summary flex flex-wrap gap-4 w-full items-center mt-4">
            <div className="prof-element justify-between p-4 border border-gray-600 flex items-center flex-1 text-gray-600">
              <div className="flex items-center gap-2">
                <MdTaskAlt className="text-white" size={iconSize} />
                <article className="text-white">Total Orders</article>
              </div>
              <span className="">{clientData?.orders_count}</span>
            </div>
            <div className="prof-element justify-between p-4 border border-gray-600 flex items-center flex-1 text-gray-600">
              <div className="flex items-center gap-2">
                <MdPendingActions className="text-white" size={iconSize} />
                <article className="text-white">Orders in Progress</article>
              </div>
              <span className="">{clientData?.in_progress}</span>
            </div>
            <div className="prof-element justify-between p-4 border border-gray-600 flex items-center flex-1 text-gray-600">
              <div className="flex items-center gap-2">
                <MdOutlineAddTask className="text-white" size={iconSize} />
                <article className="text-white">Orders completed</article>
              </div>
              <span className="">{clientData?.completed}</span>
            </div>
          </div>
          <div className="mt-5 flex flex-col space-y-2 mb-4">
            <div className="bio">
              <strong>Bio</strong>
              <article>{clientData?.bio}</article>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
