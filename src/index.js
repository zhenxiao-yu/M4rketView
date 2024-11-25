// Importing React and ReactDOM to render the application
import React from 'react';
import ReactDOM from 'react-dom/client';

// Importing global styles
import './index.css';

// Importing routing utilities from react-router-dom
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

// Importing pages and components
import Home from './pages/Home';
import Crypto from './pages/Crypto';
import Trending from './pages/Trending';
import Saved from './pages/Saved';
import CryptoDetails from './components/CryptoDetails';

// Defining routes using createBrowserRouter
const router = createBrowserRouter([
  {
    // Root path rendering the Home component
    path: "/",
    element: <Home />,
    children: [
      {
        // Crypto route nested under Home
        path: "/",
        element: <Crypto />,
        children: [
          {
            // Dynamic route for specific coin details in Crypto
            path: ":coinId",
            element: <CryptoDetails />
          }
        ]
      },
      {
        // Trending route nested under Home
        path: "/trending",
        element: <Trending />,
        children: [
          {
            // Dynamic route for specific coin details in Trending
            path: ":coinId",
            element: <CryptoDetails />
          }
        ]
      },
      {
        // Saved route nested under Home
        path: "/saved",
        element: <Saved />,
        children: [
          {
            // Dynamic route for specific coin details in Saved
            path: ":coinId",
            element: <CryptoDetails />
          }
        ]
      }
    ]
  },
]);

// Creating a root element and rendering the RouterProvider with the defined routes
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
);

/*
 * If you want to start measuring performance in your app,
 * you can pass a function to log results (e.g., reportWebVitals(console.log))
 * or send data to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
 */
// reportWebVitals();
