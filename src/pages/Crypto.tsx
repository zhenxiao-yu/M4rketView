import { Outlet } from 'react-router-dom'
import CryptoTable from '@/components/CryptoTable'
import Filters from '@/components/Filters'
import CategoryFilter from '@/components/CategoryFilter'

const Crypto = () => (
  <section className="w-full mt-8 mb-24">
    <Filters />
    <CategoryFilter />
    <CryptoTable />
    <Outlet />
  </section>
)

export default Crypto
