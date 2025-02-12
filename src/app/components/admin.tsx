'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import client from '../../sanity'
import toast from 'react-hot-toast'
import FurnitureAnalytics from '../components/FurnitureAnalytics'
import LocalAuth from '../components/localauth'
import StatisticsBox from "../components/front"

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
    <div className="flex  min-h-screen font-sans bg-[#29221d]">
     {/* <SideNavbar/> */}

      {/* Main Content */}
      <div className="flex-1 p-8 bg-[#29221d] rounded-l-2xl">
        {activeTab === 'home' && (
          <div>
            <h2 className="text-3xl text-center font-semibold text-[#fe6c00] mb-4">Dashboard Overview</h2>
            <StatisticsBox />
            <FurnitureAnalytics />
          </div>
        )}
      </div>
    </div>
  )
}
