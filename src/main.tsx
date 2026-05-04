import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import './index.css'
import { queryClient } from '@/lib/queryClient'

import Home from '@/pages/Home'
import Dashboard from '@/pages/Dashboard'
import Crypto from '@/pages/Crypto'
import Trending from '@/pages/Trending'
import Saved from '@/pages/Saved'
import Portfolio from '@/pages/Portfolio'
import Compare from '@/pages/Compare'
import CoinDetail from '@/pages/CoinDetail'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'markets', element: <Crypto /> },
      { path: 'trending', element: <Trending /> },
      { path: 'saved', element: <Saved /> },
      { path: 'portfolio', element: <Portfolio /> },
      { path: 'compare', element: <Compare /> },
      { path: 'coin/:coinId', element: <CoinDetail /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
)
