import React, { useContext } from "react";
import "./orderview.css";
import { IoMdDownload } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoChatbubblesSharp, IoCloseOutline } from "react-icons/io5";
import Chat from "../../../components/chat/Chat";
import { Link, useParams } from "react-router-dom";
import { useOrderContext } from "../../../providers/OrderProvider";
import { timeAgo } from "../../../../utils/helpers/TimeAgo";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useRef } from "react";
import OrderSkeletonLoading from "../../loading/OrderSkeletonLoading";
import { useAuthContext } from "../../../providers/AuthProvider";
import { checkDeadline } from "../../../../utils/helpers/DeadlineFormat";
import { formatDeadline } from "../../../../utils/helpers/DeadlineFormat";
import { useBiddingModal } from "../../BiddingModal/biddingModal";
import { useUpdateModal } from "../../BiddingModal/UpdateModal";
import { useDeleteModal } from "../../BiddingModal/DeleteModal";
import { checkBid } from "../../../../utils/helpers/checkBid";
import { useSolutionModal } from "../../BiddingModal/SolutionModal";
import { toast } from "react-hot-toast";
import RatingOrderView from "../../../components/rating/order-review/RatingOrderView";
import { IoPersonSharp } from "react-icons/io5";
import { ThemeContext } from "../../../App";

const FloatingButton = ({ onClick }) => {
  return (
    <div className="floating-button" onClick={onClick}>
      <IoChatbubblesSharp className="chat-icon" size={25} />
    </div>
  );
};

const OrderView = () => {
  const ordersUrl = `${import.meta.env.VITE_API_URL}/orders/`;

  const { userToken, loadedUserProfile } = useAuthContext();
  const { theme } = useContext(ThemeContext);

  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const { orderId } = useParams();

  const { loadingAttachemnt, uploadAttachment } = useOrderContext();

  const [orderContent, setOrderContent] = useState();

  const [loading, setLoading] = useState(true);

  const uploadedAt = timeAgo(orderContent?.solution?.created);

  const [solutionType, setSolutionType] = useState("Draft");

  const deadline = formatDeadline(orderContent?.deadline);

  const deadlinePassed = checkDeadline(orderContent?.deadline);

  const [selectedFileName, setSelectedFileName] = useState("");

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setSelectedFileName(selectedFile.name);
    }
  };
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const uploadAttachmentFile = () => {
    const attachment = fileInputRef.current.files[0];

    if (attachment) {
      if (attachment.size <= 20 * 1024 * 1024) {
        uploadAttachment(attachment, orderId, solutionType).then((res) => {
          const attachmentUrl = res?.solution;

          const updatedOrder = {
            ...orderContent,
            solution: attachmentUrl,
          };

          orderContent.solution = attachmentUrl;

          setOrderContent(updatedOrder);
        });
      } else {
        console.log("Select a lower size file");
      }
    } else {
      console.log("Select a correct file format");
    }
  };

  const getOrder = async (orderId) => {
    try {
      const getOrderById = await fetch(`${ordersUrl}${orderId}`, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (getOrderById.ok) {
        const orderDetails = await getOrderById.json();
        setOrderContent(orderDetails);
      } else {
        const status = getOrderById.status;
        if (status === 401) {
          navigate(`/login?order=${orderId}`);
        }
      }
      // return orderDetails;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrder(orderId);
  }, [orderId]);

  useEffect(() => {
    orderContent && setMyBid(checkBid(orderContent, loadedUserProfile));
  }, [orderContent]);

  const [myBid, setMyBid] = useState(checkBid(orderContent, loadedUserProfile));

  const { BiddingModal, setShowBiddingModal } = useBiddingModal(
    orderContent,
    setOrderContent
  );
  const { UpdateModal, setShowUpdateModal } = useUpdateModal(orderContent);
  const { DeleteModal, setShowDeleteModal } = useDeleteModal(setOrderContent);
  const { SolutionModal, setShowSolutionModal } = useSolutionModal(
    orderContent,
    setOrderContent
  );

  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className={`order-view ${theme === "light" ? "light-mode" : "dark-mode"} ${theme === "light" ? "light-mode" : "dark"}`}
    style={{ Color: theme === "light" ? "#535354" : "" }}>
      {orderContent?.status === "Available" && (
        <>
          <BiddingModal />
          <UpdateModal />
          <DeleteModal />
          <SolutionModal />
        </>
      )}
      {orderContent?.status === "In Progress" && (
        <>
          <SolutionModal />
        </>
      )}
      {loading ? (
        <OrderSkeletonLoading />
      ) : (
        orderContent && (
          <>
            <div className="order-details">
              <strong style={{ fontWeight: "bold" }}>
                {orderContent?.title}
              </strong>
              <div className="order-elements">
                <article className="category">{orderContent?.category}</article>
                <strong>{!loading && "$" + orderContent?.amount}</strong>
                {orderContent?.status === "Available" && (
                  <>
                    {myBid ? (
                      <>
                        <a
                          onClick={() => setShowUpdateModal(true)}
                          className="inline-block px-3 py-2 text-sm rounded-3xl font-medium text-white bg-sky-400 border border-sky-400 active:text-sky-400 hover:text-white cursor-pointer focus:outline-none focus:ring"
                        >
                          Edit Bid
                        </a>
                        <a
                          onClick={() => setShowDeleteModal(true)}
                          className="inline-block px-3 py-2 text-sm rounded-3xl font-medium text-white bg-red-400 border border-red-400 active:text-sky-400 hover:text-white cursor-pointer focus:outline-none focus:ring"
                        >
                          Cancel bid
                        </a>
                      </>
                    ) : (
                      <a
                        onClick={() => setShowBiddingModal(true)}
                        className="inline-block px-3 py-2 text-sm rounded-3xl font-medium text-white bg-sky-400 border border-sky-400 active:text-sky-400 hover:text-white cursor-pointer focus:outline-none focus:ring"
                      >
                        Place bid
                      </a>
                    )}
                  </>
                )}
                {orderContent?.status != "Available" && (
                  <article className="status">{orderContent?.status}</article>
                )}
              </div>
              <h2 className="card-jobtitle">
                <Link
                  className="prof-disp-icon"
                  to={`../client-profile/${orderContent.client.user.username}`}
                >
                  <div>
                    <IoPersonSharp size={50} />
                  </div>
                  <span>{orderContent.client.user.username}</span>
                </Link>
                <span className="inline-flex ml-4 mt-2 justify-center ">
                  {orderContent?.status != "Completed" && (
                    <div>
                      {deadlinePassed && (
                        <article
                          style={{
                            color: "red",
                          }}
                        >
                          {deadline}
                          <span className="ml-2">overdue</span>
                        </article>
                      )}
                      {!deadlinePassed && (
                        <article style={{ color: "green" }}>
                          {deadline} Remaing
                        </article>
                      )}
                    </div>
                  )}
                </span>
              </h2>
              {orderContent.rating && (
                <div className="review-box">
                  <RatingOrderView order={orderContent} />
                  {/* <div className="flex gap-0.5">
                    {[...Array(orderContent.rating.stars)].map((_, index) => (
                      <svg
                        key={index}
                        className="h-6 w-6 shrink-0 fill-amber-400"
                        viewBox="0 0 256 256"
                      >
                        <path d="M239.2 97.4A16.4 16.4.0 00224.6 86l-59.4-4.1-22-55.5A16.4 16.4.0 00128 16h0a16.4 16.4.0 00-15.2 10.4L90.4 82.2 31.4 86A16.5 16.5.0 0016.8 97.4 16.8 16.8.0 0022 115.5l45.4 38.4L53.9 207a18.5 18.5.0 007 19.6 18 18 0 0020.1.6l46.9-29.7h.2l50.5 31.9a16.1 16.1.0 008.7 2.6 16.5 16.5.0 0015.8-20.8l-14.3-58.1L234 115.5A16.8 16.8.0 00239.2 97.4z"></path>
                      </svg>
                    ))}
                    {[...Array(5 - orderContent.rating.stars)].map(
                      (_, index) => (
                        <svg
                          key={index}
                          className="h-6 w-6 shrink-0 fill-gray-300"
                          viewBox="0 0 256 256"
                        >
                          <path d="M239.2 97.4A16.4 16.4.0 00224.6 86l-59.4-4.1-22-55.5A16.4 16.4.0 00128 16h0a16.4 16.4.0 00-15.2 10.4L90.4 82.2 31.4 86A16.5 16.5.0 0016.8 97.4 16.8 16.8.0 0022 115.5l45.4 38.4L53.9 207a18.5 18.5.0 007 19.6 18 18 0 0020.1.6l46.9-29.7h.2l50.5 31.9a16.1 16.1.0 008.7 2.6 16.5 16.5.0 0015.8-20.8l-14.3-58.1L234 115.5A16.8 16.8.0 00239.2 97.4z"></path>
                        </svg>
                      )
                    )}
                  </div> */}
                  {/* <div class="instructions mt-3">
                    <strong>OVERALL RATING</strong>

                    <article className="mt-1 ml-2">
                      <span className="mr-2  ">message:</span>
                      {orderContent.rating.message}
                    </article>
                  </div> */}
                </div>
              )}

              {(orderContent.status === "Completed" ||
                orderContent.status === "In Progress") && (
                <div className="order-soln bg-slate-200">
                  {orderContent?.solution && loadingAttachemnt ? (
                    <div className="animate-pulse"></div>
                  ) : (
                    <div className="solution">
                      <strong>
                        {orderContent?.solution ? "Solutions" : "Solutions"}

                        {orderContent?.status === "In Progress" && (
                          <>
                            <input
                              onChange={uploadAttachmentFile}
                              ref={fileInputRef}
                              className="hidden bg-white"
                              size={20 * 1024 * 1024}
                              type="file"
                              name=""
                              id=""
                            />
                          </>
                        )}
                      </strong>
                    </div>
                  )}
                  {!orderContent?.solution &&
                    orderContent?.status === "In Progress" && (
                      <div className="upload-div">
                        <span
                          onClick={openFileDialog}
                          className="block w-[105px] md:w-full lg:w-full cursor-pointer  h-auto  border border-sky-300 border-dashed bg-accent px-3 py-2 text-sm transition  focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 "
                        >
                          <p className="text-center justify-center align-middle flex mt-1 truncate text-sky-400">
                            {selectedFileName
                              ? selectedFileName
                              : "Upload solution"}
                          </p>

                          <input
                            onChange={(e) => {
                              setSolutionType("Draft");
                              handleFileInputChange(e);
                            }}
                            ref={fileInputRef}
                            className="hidden"
                            size={20 * 1024 * 1024}
                            type="file"
                            name=""
                            id="photobutton"
                          />
                        </span>

                        <div className="">
                          <select
                            onChange={(e) => setSolutionType(e.target.value)}
                            value={solutionType}
                            className="h-10 border-2 border-sky-500 mr-3 ml-4 focus:outline-none focus:border-sky-400 text-sky-400 rounded py-0 md:py-1 tracking-wider"
                          >
                            <option value="Draft">Draft</option>
                            <option value="Final">Final</option>
                          </select>
                        </div>

                        <a
                          onClick={uploadAttachmentFile}
                          className="inline-flex px-3 py-3 left-0 ml-4  text-sm font-medium bg-sky-400 border border-sky-400 rounded  cursor-pointer focus:outline-none focus:ring"
                        >
                          Submit
                        </a>
                      </div>
                    )}

                  {orderContent?.solution && (
                    <div className="flex items-center space-x-11 md:space-x-[69px] bg-slate-200  h-[64px]">
                      <a
                        href={orderContent?.solution?.solution}
                        id="solution-file"
                        rel="noopener noreferrer"
                        download
                        className="block  p-4  w-[100px] md:max-w-[200px] lg:w-full truncate"
                      >
                        {typeof orderContent?.solution?.solution === "string"
                          ? orderContent?.solution?.solution.substring(
                              orderContent?.solution?.solution.lastIndexOf(
                                "/"
                              ) + 1
                            )
                          : ""}
                      </a>
                      <div className="mt-2">
                        <dl>
                          <div>
                            <dd
                              className={`text-[14px] ${
                                solutionType === "Draft"
                                  ? "text-green-500"
                                  : "text-orange-500"
                              }`}
                            >
                              {orderContent?.solution?._type}
                            </dd>
                          </div>
                        </dl>
                      </div>
                      {orderContent?.status === "In Progress" && (
                         <RiDeleteBin6Line
                         onClick={() => setShowSolutionModal(true)}
                         className="cursor-pointer dark:text-white h-7 w-7 "
                         size={64}
                       />
                  )}
                      
                      <span className="dark:text-white">{uploadedAt}</span>
                    </div>
                  )}
                </div>
              )}
              <div className="instructions bg-slate-200">
                <strong className="text">
                  {orderContent?.status === "In Progress" ||
                  orderContent?.status === "Available"
                    ? orderContent?.instructions
                      ? "Instructions"
                      : "No instructions available at the moment."
                    : orderContent?.status === "Completed" && "Instructions"}
                </strong>
                {orderContent?.instructions && (
                  <div>
                    <article className="content">
                      {orderContent?.instructions}
                    </article>
                  </div>
                )}
              </div>
              {orderContent?.status === "Completed" &&
              !orderContent?.attachment ? null : (
                <div className="attachments bg-slate-200">
                  {orderContent?.attachment && loadingAttachemnt ? (
                    <div style={{ height: "1.5rem" }}></div>
                  ) : (
                    <strong style={{ height: "1.5rem" }}>
                      <p className="text">
                        {" "}
                        {orderContent?.attachment
                          ? "Attachments"
                          : "Attachments"}
                      </p>
                      {orderContent?.status === "In Progress"}
                    </strong>
                  )}
                  {!orderContent?.attachment &&
                    (orderContent?.status === "In Progress" ||
                      orderContent?.status === "Available") && (
                      <div className="upload-div">
                        <article onClick={openFileDialog}>
                          No Attachments available at the moment.
                        </article>
                      </div>
                    )}
                  {orderContent?.attachment && (
                    <div>
                      <a
                        href={orderContent?.attachment}
                        target="_blank"
                        download
                      >
                        {orderContent?.attachment.substring(
                          orderContent?.attachment.lastIndexOf("/") + 1
                        )}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
            {(myBid ||
              orderContent?.freelancer?.user.username ===
                loadedUserProfile?.username) && (
              <div className={`chat-drawer ${isChatOpen ? "show" : ""}`}>
                <Chat
                  orderId={orderId}
                  client={orderContent.client}
                  freelancer={orderContent.freelancer}
                  isChatOpen={isChatOpen}
                  toggleChat={toggleChat}
                />
              </div>
            )}
            {(myBid ||
              orderContent?.freelancer?.user.username ===
                loadedUserProfile?.username) && (
              <div>
                {window.innerWidth <= 900 && (
                  <FloatingButton onClick={toggleChat} />
                )}
              </div>
            )}
          </>
        )
      )}
    </div>
  );
};

export default OrderView;
