import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App.tsx'
import './index.css'
import IsLoading from './pages/isLoading/IsLoading';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { element } from './router/Router';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <App /> */}
    <Suspense fallback={<IsLoading />}>
        <RouterProvider router={element} />
      <ToastContainer />
    </Suspense>
  </React.StrictMode>,
)
