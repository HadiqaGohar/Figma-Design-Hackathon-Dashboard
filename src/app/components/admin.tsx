'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import client from '../../sanity'
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import { ShoppingBagIcon, CubeIcon, HomeIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import FurnitureAnalytics from '../components/FurnitureAnalytics'
import LocalAuth from '../components/localauth'
import StatisticsBox from "../components/front"
import { LogOutIcon } from 'lucide-react'

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
    <div className="flex min-h-screen bg-pink-50">
      {/* Sidebar */}
      <div className={`w-64 bg-white text-gray-700 shadow-lg rounded-r-2xl border-r border-gray-200 fixed sm:relative top-0 left-0 z-50 transition-transform transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`}>
        {/* Header */}
        <div className="p-6 bg-white shadow-sm rounded-2xl flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center bg-gray-100 rounded-full">
            <svg
              className="h-6 w-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h11M9 21V3m4 18l3-3m0 0l3 3m-3-3V3"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-semibold tracking-wide text-gray-700">Admin Dashboard</h1>
        </div>

        {/* Navigation */}
        <nav className="mt-6 space-y-2">
          {[ 
            { name: 'Home', icon: HomeIcon, tab: 'home' },
            { name: 'Products', icon: CubeIcon, tab: 'products' },
            { name: 'Add Product', icon: PlusIcon, tab: 'addProduct' },
          ].map(({ name, icon: Icon, tab }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center w-full px-6 py-3 text-lg font-medium rounded-md transition-all ${activeTab === tab ? 'bg-gray-100 text-pink-600 font-semibold' : 'hover:bg-gray-50 text-gray-700'}`}
            >
              <Icon className="h-5 w-5 mr-3 text-pink-500" />
              {name}
            </button>
          ))}
        </nav>

        {/* Sign Out Button */}
        <div className="mt-6 px-6">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 text-lg font-medium text-white bg-pink-500 hover:bg-pink-600 rounded-md transition-all shadow-md"
          >
            <LogOutIcon className="h-5 w-5 text-white" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Toggle Button */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)} 
        className="sm:hidden absolute top-5 left-5 z-50 p-3 bg-pink-500 text-white rounded-full"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h18M3 18h18"></path>
        </svg>
      </button>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-white rounded-l-2xl sm:ml-64">
        {activeTab === 'home' && (
          <div>
            <h2 className="text-3xl font-semibold text-pink-600 mb-4">Dashboard Overview</h2>
            <StatisticsBox />
            <FurnitureAnalytics />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {products.map((product) => (
                <div key={product._id} className="bg-white shadow-xl rounded-lg p-6 border border-pink-200">
                  <img
                    src={product.image.asset.url}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">${product.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <h2 className="text-3xl font-semibold text-pink-600 mb-4">Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product._id} className="bg-white shadow-xl rounded-lg p-6 border border-pink-200">
                  <img
                    src={product.image.asset.url}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">${product.price}</p>
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <TrashIcon className="h-5 w-5 mr-2" />
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'addProduct' && (
          <div>
            <h2 className="text-3xl font-semibold text-pink-600 mb-4">Add Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-6">
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full p-4 border border-pink-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <textarea
                placeholder="Product Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="w-full p-4 border border-pink-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <input
                  type="number"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="w-full p-4 border border-pink-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full p-4 border border-pink-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <input
                type="file"
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files ? e.target.files[0] : null })}
                className="w-full p-4 border border-pink-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button
                type="submit"
                className="w-full px-6 py-3 text-lg font-medium text-white bg-pink-500 hover:bg-pink-600 rounded-md transition-all"
              >
                Add Product
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
