import React, { useContext } from "react";
import "./transaction.css";
import { timeAgo } from "../../../utils/helpers/TimeAgo";
import { useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import ViewMore from "../more/ScrollMore";
import { ThemeContext } from "../../App";

const Transaction = ({ user, userToken }) => {
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const { theme } = useContext(ThemeContext);

  const [transactions, setTransactions] = useState({
    list: [],
    next: null,
  });

  const getTransactions = async (page) => {
    const transactionUrl = `${
      import.meta.env.VITE_API_URL
    }/transactions/?page=${page}`;
    try {
      const retrieveTransactions = await fetch(transactionUrl, {
        headers: {
          "content-Type": "application/json",
          authorization: `Bearer ${userToken}`,
        },
      });

      if (retrieveTransactions.ok) {
        const transactions = await retrieveTransactions.json();
        setTransactions((prev) => ({
          list: prev.list.concat(transactions.results),
          next: transactions.next,
        }));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingTransactions(false);
    }
  };

  useState(() => {
    userToken && getTransactions(1);
  }, [userToken]);
  return (
    <>
      {loadingTransactions ? (
        <div>
          <PulseLoader size={10} color="#7fc2f5" />
        </div>
      ) : (
        <div className={`transactions ${theme === "light" ? "light-mode" : "dark-mode"}`}>
          <h1>Transaction History</h1>
          <table className="transaction-table">
            <thead>
              <tr>
                <th>From</th>
                <th>To</th>
                <th>Amount</th>
                <th>Mode</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.list?.map((transaction, key) => {
                return (
                  <tr key={key} className="transaction">
                    <td>{transaction._from}</td>
                    <td>{transaction._to}</td>
                    <td>
                      {(user === transaction._from && <>-</>) ||
                        (user === transaction._to && <>+</>)}
                      ${transaction.amount_value}
                    </td>
                    <td>{transaction.channel}</td>
                    <td>{transaction.status}</td>
                    <td>{timeAgo(transaction.timestamp)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {transactions.next && <ViewMore fetch={getTransactions} />}
        </div>
      )}
    </>
  );
};

export default Transaction;
