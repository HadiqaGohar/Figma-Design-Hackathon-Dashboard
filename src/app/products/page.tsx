"use client"

import { useEffect, useState } from "react"
import client from "../../sanity"
import { TrashIcon } from "@heroicons/react/24/outline"
import toast from "react-hot-toast"
import Image from "next/image"

interface Product {
  _id: string // Changed from id to _id
  name: string
  description?: string
  category: string[]
  price: number
  image?: {
    asset?: {
      url: string
    }
  }
}

function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true) // Added loading state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const query = `*[_type == "product"]{
          _id,  // Changed from id to _id
          name,
          description,
          price,
          image {
            asset -> {
              url
            }
          }
        }`

        const result: Product[] = await client.fetch(query)
        console.log("Fetched Products:", result) // Debugging
        setProducts(result)
      } catch (error) {
        console.error("Error fetching products:", error)
        toast.error("Failed to load products")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const deleteProduct = async (productId: string) => {
    try {
      await client.delete(productId)
      toast.success("Product deleted successfully")
      setProducts(products.filter((product) => product._id !== productId)) // Update UI
    } catch (error) {
      toast.error("Error deleting product")
    }
  }

  return (
    <div className="flex h-screen bg-gray-200">
    <div className="flex-1 p-6 overflow-auto">
      <h2 className="text-3xl font-semibold text-gray-800 mb-4 text-center">All Products</h2>
  
      {loading ? (
        <p className="text-center text-gray-600">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-600">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-gray-100 shadow-md rounded-lg p-4 border border-gray-400"
            >
              <Image
                src={product.image?.asset?.url || "/placeholder.jpg"}
                alt={product.name || "Product image"}
                height={200}
                width={200}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {product.name}
              </h3>
              <p className="text-gray-700 mb-4">${product.price.toFixed(2)}</p>
              <button
                onClick={() => deleteProduct(product._id)}
                className="flex items-center justify-center gap-2 px-4 py-2 text-white bg-[#fe6c00] hover:bg-orange-400 rounded-md"
              >
                <TrashIcon className="h-5 w-5" />
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
  
  )
}

export default Products
