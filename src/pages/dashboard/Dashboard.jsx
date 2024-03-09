import React, { useState,useContext } from 'react';
import { useOrderContext } from '../../providers/OrderProvider';
import OrderComponent from '../../components/order-component/OrderComponent';
import InProgress from '../orders/in-progress/InProgress';
import Completed from '../orders/completed/Completed';
import './dashboard.css';
import Solved from '../solved/Solved';
import {HiMiniClipboardDocumentList} from 'react-icons/hi2';
import LoadingSkeletonOrder from '../loading/Loading';
import { ThemeContext } from "../../App";

const FreelancerDashboard = () => {
  const { orders, loading } = useOrderContext();
  const { theme } = useContext(ThemeContext);
 
  return (
    loading ?
    <LoadingSkeletonOrder />: 
    <div className={`dashboard ${theme === "light" ? "light-mode" : "dark-mode"}`}
    style={{
  backgroundColor: theme === "dark" ? "#404c5e" : "",      
      }}
    > 
        {                           
            (orders?.length > 0)?
            orders?.map((order, index)=>{
                return (
                    <OrderComponent key={index} content={order}/>
                )
            }):
            <div className='create-task-div'>
                <div className='child'>
                    <article>Orders you create will appear here</article>
                    <HiMiniClipboardDocumentList size={120} className='placeholder-icon' />
                    <article className='create-task-helper' onClick={()=>navigate('./create-task')}>No gigs allocated yet!</article>
                </div>
            </div>
        }      
    </div>   
  );
};

export default FreelancerDashboard;
