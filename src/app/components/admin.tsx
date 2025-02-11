'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import client from '../../sanity'
import { TrashIcon, PlusIcon, ClockIcon, TruckIcon, CheckIcon, ClipboardIcon, PaperAirplaneIcon, CreditCardIcon, ChartBarIcon, BanknotesIcon, CurrencyDollarIcon, UserIcon, CogIcon } from '@heroicons/react/24/outline'
import { ShoppingBagIcon, CubeIcon, HomeIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import FurnitureAnalytics from '../components/FurnitureAnalytics'
import LocalAuth from '../components/localauth'
import StatisticsBox from "../components/front"
import { BadgeCentIcon, BadgeIcon, BugPlay, Link, LogOutIcon, LucideListOrdered, ShoppingBasket, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import { link } from 'fs'
import AdminDashboard from '../order/page'
import SideNavbar from './SideNavbar'

interface Order {
  _id: string
  name: string
  _createdAt: string
  _updatedAt: string
  email: string
  address: string
  city: string
  phone: string
  total: number
  _rev: string
  items: {
    title: string
    quantity: number
    price: number
    imageUrl: string
  }[]
}

interface Product {
  _id: string
  name: string
  description: string
  features: string[]
  dimensions: string
  category: string
  price: number
  tags: string[]
  imageUrl: string
  image: {
    asset: {
      _id: string
      url: string
    }
  }
}

export default function AdminPanel() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('home')
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    dimensions: '',
    features: [''],
    tags: [''],
    image: null as File | null
  })
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    fetchOrders()
    fetchProducts()
  }, [])

  const fetchOrders = async () => {
    try {
      const query = `*[_type == "order"] {
        _id,
        _createdAt,
        _updatedAt,
        name,          
        email,
        address,
        city,
        phone,
        total,
        _rev,
        items[] {
          title,
          quantity,
          price,
          "imageUrl": image.asset->url
        }
      }`
      const result = await client.fetch(query)
      setOrders(result)
    } catch (error) {
      toast.error('Error fetching orders')
    }
  }

  const fetchProducts = async () => {
    try {
      const query = `*[_type == "product"] {
        _id,
        name,
        price,
        category,
        sale,
        image {
          asset -> {
            _id,
            url
          }
        }
      }`
      const result = await client.fetch(query)
      setProducts(result)
      setLoading(false)
    } catch (error) {
      toast.error('Error fetching products')
      setLoading(false)
    }
  }

  const deleteProduct = async (productId: string) => {
    try {
      await client.delete(productId)
      toast.success('Product deleted successfully')
      fetchProducts()
    } catch (error) {
      toast.error('Error deleting product')
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const doc: any = {
        _type: 'product',
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        category: newProduct.category,
        dimensions: newProduct.dimensions,
        features: newProduct.features.filter(f => f !== ''),
        tags: newProduct.tags.filter(t => t !== ''),
      }

      if (newProduct.image) {
        const imageAsset = await client.assets.upload('image', newProduct.image)
        doc.image = {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset._id
          }
        }
      }

      await client.create(doc)
      toast.success('Product added successfully')
      setShowAddProduct(false)
      setNewProduct({
        name: '',
        description: '',
        price: '',
        category: '',
        dimensions: '',
        features: [''],
        tags: [''],
        image: null
      })
      fetchProducts()
    } catch (error) {
      toast.error('Error adding product')
    }
  }

  const handleSignOut = () => {
    setIsAuthenticated(false)
    router.push('/')
  }

  if (!isAuthenticated) {
    return <LocalAuth onAuthenticated={() => setIsAuthenticated(true)} />
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="flex min-h-screen font-sans bg-[#29221d]">
     {/* <SideNavbar/> */}

      {/* Main Content */}
      <div className="flex-1 p-8 bg-[#29221d] rounded-l-2xl">
        {activeTab === 'home' && (
          <div>
            <h2 className="text-3xl font-semibold text-[#fe6c00] mb-4">Dashboard Overview</h2>
            <StatisticsBox />
            <FurnitureAnalytics />

            {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              {products.map((product) => (
                <div key={product._id} className="bg-white  shadow-xl rounded-lg p-6 border border-pink-200">
                  <Image
                    src={product.image?.asset?.url || "/placeholder.jpg"}
                    alt={product.name || "Product image"}
                    height={208}
                    width={100}
                    className="w-full h-52 object-cover rounded-lg mb-4"
                  />

                  <h3 className="text-lg font-medium text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-[#fe6c00] font-bold mb-4">${product.price}</p>
                </div>
              ))}
            </div> */}
          </div>
        )}

      

        {/* {activeTab === 'products' && (
          <div>
            <h2 className="text-3xl font-semibold text-yellow-600 mb-4">Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <div key={product._id} className="bg-white opacity-90 shadow-xl rounded-lg p-6 border border-pink-200">
                  <Image
                    src={product.image?.asset?.url || "/placeholder.jpg"}
                    alt={product.name || "Product image"}
                    height={192}
                    width={100}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />

                  <h3 className="text-lg font-medium text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">${product.price}</p>
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#fe6c00] hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <TrashIcon className="h-5 w-5 mr-2" />
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )} */}

        {/* {activeTab === 'addProduct' && (
          <div>
            <h2 className="text-3xl font-semibold text-[#fe6c00] mb-4">Add Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-6">
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full p-4 border-4 bg-gray-200 border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <textarea
                placeholder="Product Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="w-full p-4 border-4 bg-gray-200 border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <input
                  type="number"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="w-full p-4 bg-gray-200 border-4 border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full p-4 bg-gray-200 border-4 border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <input
                type="file"
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files ? e.target.files[0] : null })}
                className="w-full p-4 bg-gray-200 border-4 border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="w-full px-6 py-3 text-lg font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md transition-all"
              >
                Add Product
              </button>
            </form>
          </div>
        )} */}
      </div>
    </div>
  )
}
