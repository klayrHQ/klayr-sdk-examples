import React from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { WalletConnect } from './pages/WalletConnect';
import { Home } from './pages/Home';
import { Layout } from './layout/Layout';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><Home /></Layout>,
    errorElement: <div>404 not found</div>
  },
  {
    path: "/wallet-connect",
    element: <Layout><WalletConnect /></Layout>
  }
])

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
