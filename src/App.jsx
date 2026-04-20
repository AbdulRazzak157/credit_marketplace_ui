import React from "react";
import { RouterProvider } from 'react-router-dom'
import './App.css'
import CustomCircleLoader from './shared/CustomCircleLoader';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './routes/Route.jsx';
import { ToastContainer } from "react-toastify";
import "flatpickr/dist/themes/material_red.css";

function App() {


  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div>
          <React.Suspense fallback={
            <div className='flex items-center justify-center w-full h-screen'>
              <CustomCircleLoader />
            </div>
          } >
            <RouterProvider router={router} />
          </React.Suspense>
          <ToastContainer />
        </div>
      </QueryClientProvider>
    </>
  )
}

export default App
