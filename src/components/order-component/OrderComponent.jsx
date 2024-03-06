import React, { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { checkDeadline, formatDeadline } from '../../../utils/helpers/DeadlineFormat';
import { ThemeContext } from "../../App";


const OrderComponent = ({ content }) => {
  const navigate = useNavigate();
  const orderId = content.id;
  const { theme } = useContext(ThemeContext);

  const deadline = formatDeadline(content.deadline);
  const deadlinePassed = checkDeadline(content.deadline);

  const status = content.status;

  const maxCharsToDisplay = 70;

  return (
    <div className={`order-content ${theme === "light" ? "light-mode" : "dark-mode"}`}
    onClick={() => navigate(`../order/${orderId}?status=${status.toLowerCase()}`)}>
      <div className='title-box'>
        <article>
          {(content.title.length > maxCharsToDisplay) ? `${(content.title).slice(0, 60)}...` : content.title}
        </article>
      </div>
      
      <div className='bottom-box '>
        <div className='fx-start'>
        </div>
        {content.status === 'Available' && (
          <div></div>
        )}
      </div>   
      
        

      <div className='bottom-box'>
        <div className='fx-start'>
          <article>{content.category}</article>
          <article>${content.amount}</article>
        </div>
        {status === 'Completed' ?
          <div className='fx-end'>
            <article className='deadline'>Completed</article>
          </div> :
          <div className='fx-end'>
            {deadlinePassed && (
              <article className='deadline' style={{
                color: 'red',
                backgroundColor: '#f7fafc'
              }}>
                {deadline}
                <span className='ml-2'>overdue</span>
              </article>
            )}
            {!deadlinePassed && (
              <article className='deadline'>
                {deadline}
              </article>
            )}
          </div>
        }
      </div>
    </div>
  );
}

export default OrderComponent;