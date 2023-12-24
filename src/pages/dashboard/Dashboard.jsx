import React, { useState, useEffect } from 'react';
import { useOrderContext } from '../../providers/OrderProvider';
import OrderComponent from '../../components/order-component/OrderComponent';
import InProgress from '../orders/in-progress/InProgress';
import Completed from '../orders/completed/Completed';
import Solved from '../solved/Solved';

const FreelancerDashboard = () => {
  const { orders, loading } = useOrderContext();
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
 

  return (
    <div className="flex h-screen bg-gray-100 pt-[50px]">
      {/* Sidebar */}
      
    <div class="hidden md:flex flex-col w-64 bg-white rounded-lg">
        <div class="flex flex-col flex-1 overflow-y-auto">
            <nav class="flex-1 px-2 py-4 bg-[#7fc2f5] rounded-lg">
                <a href=""  onClick={() => handlePageChange('dashboard')}
              class={`flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700 ${
                currentPage === 'dashboard' && 'bg-gray-700'
              }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    Dashboard
                </a>
                <a href="#" onClick={() => handlePageChange('inProgress')}
              class={`flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700 ${
                currentPage === 'inProgress' && 'bg-gray-700'
              }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    In progress
                </a>
                <a href="#" onClick={() => handlePageChange('completed')}
              class={`flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700 ${
                currentPage === 'completed' && 'bg-gray-700'
              }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Completed
                </a>
                <a href="#" class="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    solved
                </a>
            </nav>
        </div>
    </div>


      {/* Dashboard content */}
      <div className="flex-1 overflow-x-hidden ">
        {loading ? (
          <div role="status" class="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
        <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
        <span class="sr-only">Loading...</span>
    </div>
        ) : orders.length === 0 ? (
           <section className="flex items-center h-full sm:p-16 dark:bg-gray-900 dark:text-gray-100">
            <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8 space-y-8 text-center sm:max-w-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-20 h-20"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>
              <p className="text-xl">There are no orders currently. Try again later.</p>
              <a rel="noopener noreferrer" href="#" className="px-8 py-3 font-semibold rounded bg-blue-400 dark:text-gray-900">
                Back to homepage
              </a>
            </div>
          </section>
        ) : (
          <div>
          {currentPage === 'inProgress' && <InProgress />}
          {currentPage === 'completed' && <Completed />}
          {currentPage === 'dashboard' && (
            // Orders grid component based on the selected page
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {orders.map((order) => (
                <OrderComponent key={order.id} content={order} />
              ))}
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
};

export default FreelancerDashboard;
