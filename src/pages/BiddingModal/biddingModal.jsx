import { useParams } from 'react-router-dom';
import Modal from "./modal";
import { useState, useCallback, useMemo } from "react";
import { useAuthContext } from "../../providers/AuthProvider";
import { toast } from "react-hot-toast"

const BiddingModal = ({ showBiddingModal, setBiddingModal, orderDetails }) => {
  const [bidAmount, setBidAmount] = useState(orderDetails.amount); 
  const [bidList, setBidList] = useState([]);
  const { orderId } = useParams();
  const { userToken } = useAuthContext();

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    try {
      if (bidAmount < orderDetails.amount) {
        toast.error("Bid amount should be equal or greater than the client's amount.");
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/${orderId}/bid/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({ amount: bidAmount }),
      });

      if (response.ok) {
        const newBid = await response.json();
        //console.log(newBid);
        toast.success("Bid placed successfully")
        setBidList([...bidList, newBid]);
      } else {
        console.error("Failed to place bid:", response.statusText);
      }
    } catch (error) {
      console.error("Error placing bid:", error.message);
    }
  };

  const handleCloseModal = () => {
    setBiddingModal(false);
  };

  return (
    <Modal showModal={showBiddingModal} setShowModal={setBiddingModal}>
      <div className="w-full overflow-hidden shadow-xl md:max-w-md md:rounded-2xl md:border md:border-gray-200">
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative dark:bg-gray-700">
            <form className="p-4 md:p-5" onSubmit={handleBidSubmit}>
              <div className='flex items-center mb-8'>
                <span htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
                  Bidding Price
                </span>
                <button
                  title='Close bidding'
                  type="button"
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="price"
                  id="price"
                  min={bidAmount}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(parseFloat(e.target.value))}
                  className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="0.00"
                />
              </div>

              <button
                type="submit"
                className="flex w-full justify-center mt-4 rounded-md bg-sky-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Place bid
              </button>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export function useBiddingModal() {
  const [showBiddingModal, setShowBiddingModal] = useState(false);

  const BiddingModalCallback = useCallback(
    (orderDetails) => {
      return (
        <BiddingModal
          showBiddingModal={showBiddingModal}
          setBiddingModal={setShowBiddingModal}
          orderDetails={orderDetails}
        />
      );
    },
    [showBiddingModal]
  );

  return useMemo(() => ({ setShowBiddingModal, BiddingModal: BiddingModalCallback }), [
    setShowBiddingModal,
    BiddingModalCallback,
  ]);
}