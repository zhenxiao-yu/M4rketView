import { StrictMode, lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

import './index.css'
import { queryClient } from '@/lib/queryClient'
import Home from '@/pages/Home'
import PageSkeleton from '@/components/PageSkeleton'

// Persist query cache to localStorage — instant loads on revisit, survives API outages
persistQueryClient({
  queryClient,
  persister: createSyncStoragePersister({ storage: window.localStorage }),
  maxAge: 24 * 60 * 60 * 1000,   // 24 hours
})

const Dashboard  = lazy(() => import('@/pages/Dashboard'))
const Crypto     = lazy(() => import('@/pages/Crypto'))
const Trending   = lazy(() => import('@/pages/Trending'))
const Saved      = lazy(() => import('@/pages/Saved'))
const Portfolio  = lazy(() => import('@/pages/Portfolio'))
const Compare    = lazy(() => import('@/pages/Compare'))
const CoinDetail = lazy(() => import('@/pages/CoinDetail'))
const News       = lazy(() => import('@/pages/News'))
const Heatmap    = lazy(() => import('@/pages/Heatmap'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    children: [
      { index: true,          element: <Suspense fallback={<PageSkeleton />}><Dashboard /></Suspense> },
      { path: 'markets',      element: <Suspense fallback={<PageSkeleton />}><Crypto /></Suspense> },
      { path: 'trending',     element: <Suspense fallback={<PageSkeleton />}><Trending /></Suspense> },
      { path: 'saved',        element: <Suspense fallback={<PageSkeleton />}><Saved /></Suspense> },
      { path: 'portfolio',    element: <Suspense fallback={<PageSkeleton />}><Portfolio /></Suspense> },
      { path: 'compare',      element: <Suspense fallback={<PageSkeleton />}><Compare /></Suspense> },
      { path: 'coin/:coinId', element: <Suspense fallback={<PageSkeleton />}><CoinDetail /></Suspense> },
      { path: 'news',         element: <Suspense fallback={<PageSkeleton />}><News /></Suspense> },
      { path: 'heatmap',      element: <Suspense fallback={<PageSkeleton />}><Heatmap /></Suspense> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </StrictMode>
)
