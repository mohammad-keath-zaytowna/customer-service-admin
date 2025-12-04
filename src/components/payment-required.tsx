import React from 'react';
import { RefreshCw, Lock } from 'lucide-react'; // Optional: using lucide-react if available, otherwise SVGs are inline below

export default function PaymentRequired() {
  
  const handleUpdateClick = () => {
    // In a real app, this would router.push('/settings/billing')
    window.location.reload(); 
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4 overflow-hidden font-sans">
      
      {/* Main Container */}
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center relative overflow-hidden">
        
        {/* Decorative Background Element */}
        <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>

        {/* Icon */}
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 text-red-600" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
            />
          </svg>
        </div>

        {/* Text Content */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Required</h1>
        <p className="text-gray-500 mb-8">
          Your subscription has expired or your last payment failed. Access to this workspace is temporarily locked until your billing information is updated.
        </p>

        {/* Amount Due (Mock Data) */}
        <div className="bg-gray-50 rounded-lg p-4 mb-8 border border-gray-100">
          {/* <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Amount Due:</span>
            <span className="font-bold text-gray-900">$29.00</span>
          </div> */}
          <div className="flex justify-between items-center text-sm mt-2">
            <span className="text-gray-600">Due Date:</span>
            <span className="text-red-600 font-medium">Immediate</span>
          </div>
        </div>

        {/* Action Button */}
        <div 
        //   onClick={handleUpdateClick}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center justify-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" 
            />
          </svg>
          Contact us to select Payment Method
        </div>

        <p className="mt-6 text-xs text-gray-400">
          Need help? <a href="#" className="text-gray-600 hover:underline">Contact Support</a>
        </p>
      </div>
    </div>
  );
}