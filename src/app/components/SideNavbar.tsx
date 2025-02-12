'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { LogOutIcon, ShoppingCart } from 'lucide-react'
import { HomeIcon, CubeIcon, PlusIcon, ClockIcon, TruckIcon, CheckIcon, CreditCardIcon } from '@heroicons/react/24/outline'

function SideNavbar() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = () => {
    router.push('/')
  }

  return (
    <>
      {/* Overlay for Mobile Sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#29221d] text-white shadow-lg border-r transform transition-transform ease-in-out duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } sm:translate-x-0`}
      >
        {/* Header */}
        <div className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full overflow-hidden">
            <Image
              src="/doll.jpeg"
              alt="Profile"
              height={50}
              width={50}
              className="h-full w-full object-cover"
            />
          </div>
          <h1 className="text-lg font-normal text-white">Hadiqa-Gohar</h1>
        </div>

        {/* Navigation */}
        <nav className="mt-2 space-y-2 p-2 font-light">
          {[
            { name: 'Home', icon: HomeIcon, path: '/' },
            { name: 'Products', icon: CubeIcon, path: '/products' },
            { name: 'Add Product', icon: PlusIcon, path: '/addProducts' },
            { name: 'Orders', icon: ShoppingCart, path: '/order' },
            { name: 'Pending', icon: ClockIcon, path: '/order/pending' },
            { name: 'Success', icon: CheckIcon, path: '/order/success' },
            { name: 'Dispatch', icon: TruckIcon, path: '/order/dispatch' },
            { name: 'Subscriptions', icon: CreditCardIcon, path: '/subscriptions' },
          ].map(({ name, icon: Icon, path }) => (
            <Link
              key={path}
              href={path}
              className="flex items-center w-full px-6 py-3 text-lg font-medium rounded-md transition-all hover:bg-gray-700"
            >
              <Icon className="h-5 w-5 mr-3 text-gray-400" />
              {name}
            </Link>
          ))}
        </nav>

        {/* Sign Out Button */}
        <div className="absolute bottom-6 w-full px-6">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 text-lg font-light text-white bg-[#fe6c00] hover:bg-orange-600 rounded-md transition-all shadow-md"
          >
            <LogOutIcon className="h-5 w-5 text-white" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="sm:hidden fixed top-5 left-5 z-50 p-3 bg-[#fe6c00] text-white rounded-full focus:outline-none"
      >
        ☰
      </button>
    </>
  )
}

export default SideNavbar
