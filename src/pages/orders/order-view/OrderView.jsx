import React from "react";
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
import { IoMdAdd } from "react-icons/io";
import ViewMore from "../../../components/more/ScrollMore";

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

  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const { orderId } = useParams();

  const { loadingAttachemnt, uploadAttachment } = useOrderContext();

  const [orderContent, setOrderContent] = useState();

  const [loading, setLoading] = useState(true);

  const [solutionType, setSolutionType] = useState("Draft");

  const deadline = formatDeadline(orderContent?.deadline);

  const deadlinePassed = checkDeadline(orderContent?.deadline);

  const [selectedFileName, setSelectedFileName] = useState("");

  const [solution, setSolution] = useState({
    list: null,
    count: null,
    next: null,
  });

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setSelectedFileName(selectedFile.name);
    }
  };
  const openFileDialog = () => {
    console.log("Open");
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const uploadAttachmentFile = () => {
    const attachment = fileInputRef.current.files[0];
    console.log("Uploading...");
    if (attachment) {
      if (attachment.size <= 20 * 1024 * 1024) {
        try {
          uploadAttachment(attachment, orderId, solutionType).then((res) => {
            const updatedOrder = {
              ...orderContent,
              solution: res,
            };

            setSolution((prev) => {
              return {
                ...prev,
                list: prev.list?.length > 0 ? [res].concat(prev.list) : [res],
              };
            });
            toast.success("Successfully uploaded your solution");

            orderContent.solution = res;
            setSelectedFileName("");
            setOrderContent(updatedOrder);
          });
        } catch (error) {
          toast.error("Failed to upload ");
        }
      } else {
        toast.error("Select a lower size file");
      }
    } else {
      toast.error("Please select a file");
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
        } else if (status === 404) {
          toast.error("We could not find that order");
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

  const [selectedSolutionId, setSelectedSolutionId] = useState("");

  const { UpdateModal, setShowUpdateModal } = useUpdateModal(orderContent);
  const { DeleteModal, setShowDeleteModal } = useDeleteModal(setOrderContent);
  const { SolutionModal, setShowSolutionModal } = useSolutionModal(
    orderContent,
    selectedSolutionId,
    setSolution
  );

  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const getSolutionForOrder = async (page) => {
    const getSolution = await fetch(
      `${ordersUrl}${orderId}/solution?page=${page}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    if (getSolution.ok) {
      const response = await getSolution.json();

      setSolution((prev) => {
        return {
          ...prev,
          list: prev?.list
            ? response.results.concat(prev?.list)
            : response.results,
          count: response.count,
          next: response.next,
        };
      });
    }
  };

  const deleteSolution = (id) => {
    setShowSolutionModal(true);
    setSelectedSolutionId(id);
  };

  useEffect(() => {
    orderId && getSolutionForOrder(1);
  }, [orderId]);
  return (
    <div className="order-view">
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
                  style={{ width: "fit-content" }}
                  className="prof-disp-icon"
                  to={`../client-profile/${orderContent.client.user.username}`}
                >
                  <div>
                    <IoPersonSharp size={50} />
                  </div>
                  <span>{orderContent.client.user.username}</span>
                </Link>
                <span className="inline-flex mt-2 justify-center ">
                  {orderContent?.status != "Completed" && (
                    <div>
                      {deadlinePassed && (
                        <article>
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
                </div>
              )}

              {(orderContent.status === "Completed" ||
                orderContent.status === "In Progress") && (
                <div className="order-soln">
                  {solution.list?.length > 0 && loadingAttachemnt ? (
                    <div className="animate-pulse"></div>
                  ) : (
                    <div className="solution">
                      <strong>
                        {solution.list?.length > 0 ? "Solutions" : "Solution"}
                        {/* {orderContent?.status === "In Progress" && (
                          <>
                            <input
                              // onChange={uploadAttachmentFile}
                              ref={fileInputRef}
                              className="hidden"
                              size={20 * 1024 * 1024}
                              type="file"
                              name=""
                              id=""
                            />
                          </>
                        )} */}
                      </strong>
                    </div>
                  )}
                  {orderContent?.status === "In Progress" && (
                    <div className="upload-div">
                      <span
                        onClick={openFileDialog}
                        className="block w-[105px] md:w-full lg:w-full cursor-pointer  h-auto  border border-sky-300 border-dashed bg-accent px-3 py-2 text-sm transition  focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 "
                      >
                        <p
                          style={{ textOverflow: "ellipsis" }}
                          className="text-center justify-center align-middle flex mt-1 truncate text-sky-400"
                        >
                          {selectedFileName
                            ? selectedFileName
                            : solution.list?.length > 0
                            ? "Attach another solution"
                            : "Attach your solution file here"}
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

                  {solution.list?.length > 0 && (
                    <>
                      <div className="solution-uploaded flex ">
                        {solution.list.map((sln) => {
                          return (
                            <div className="file">
                              <a
                                href={sln?.solution}
                                id="solution-file"
                                rel="noopener noreferrer"
                                download
                                className="block rounded-lg p-3 shadow-sm bg-accent w-[100px] md:max-w-[200px] lg:w-full truncate"
                              >
                                {typeof sln?.solution === "string"
                                  ? sln?.solution.substring(
                                      sln?.solution.lastIndexOf("/") + 1
                                    )
                                  : ""}
                              </a>
                              <div>
                                <dl>
                                  <div>
                                    <dd
                                      className={`text-[14px] ${
                                        sln?._type === "Final"
                                          ? "text-green-500"
                                          : "text-orange-500"
                                      }`}
                                    >
                                      {sln?._type}
                                    </dd>
                                  </div>
                                </dl>
                              </div>
                              {orderContent?.status === "In Progress" && (
                                <div>
                                  <RiDeleteBin6Line
                                    onClick={() =>
                                      deleteSolution(sln?.id.toString())
                                    }
                                    className="cursor-pointer text-white h-7 w-7 "
                                    size={64}
                                  />
                                </div>
                              )}
                              <span className="text-white">
                                {timeAgo(sln?.created)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      {solution.next && (
                        <ViewMore fetch={getSolutionForOrder} />
                      )}
                      {/* <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "2rem",
                        }}
                      >
                        <IoMdAdd
                          size={24}
                          style={{ cursor: "pointer" }}
                          onClick={() => openFileDialog()}
                        />
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
                        <span>Add another solution</span>
                      </div> */}
                    </>
                  )}
                </div>
              )}
              <div className="instructions">
                <strong className="text-white">
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
                <div className="attachments">
                  {orderContent?.attachment && loadingAttachemnt ? (
                    <div style={{ height: "1.5rem" }}></div>
                  ) : (
                    <strong style={{ height: "1.5rem" }}>
                      <p className="text-white">
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
                        <article>
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
