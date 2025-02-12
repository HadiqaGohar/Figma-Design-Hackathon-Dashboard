'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import client from '../../sanity'
import toast from 'react-hot-toast'
import LocalAuth from '../components/localauth'

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

function AddProduct() {
    // const router = useRouter()
    // const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [orders, setOrders] = useState<Order[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddProduct, setShowAddProduct] = useState(false)
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: 0, // Fixed: changed from string to number
        category: '',
        dimensions: '',
        features: [''],
        tags: [''],
        image: null as File | null
    })

    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            await fetchOrders()
            await fetchProducts()
            setLoading(false)
        }
        loadData()
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
            toast.error(`Error fetching orders: ${(error as any).message}`)
        }
    }

    const fetchProducts = async () => {
        try {
            const query = `*[_type == "product"] {
                _id,
                name,
                price,
                category,
                image {
                    asset -> {
                        _id,
                        url
                    }
                }
            }`
            const result = await client.fetch(query)
            setProducts(result)
        } catch (error) {
            toast.error(`Error fetching products: ${(error as any).message}`)
        }
    }

    const deleteProduct = async (productId: string) => {
        try {
            await client.delete(productId)
            toast.success('Product deleted successfully')
            fetchProducts()
        } catch (error) {
            toast.error(`Error deleting product: ${(error as any).message}`)
        }
    }

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Adding product..."); // Debugging
    
        try {
            const doc: any = {
                _type: 'product',
                name: newProduct.name,
                description: newProduct.description,
                price: Number(newProduct.price) || 0,
                category: newProduct.category,
                dimensions: newProduct.dimensions,
                features: newProduct.features.filter(f => f !== ''),
                tags: newProduct.tags.filter(t => t !== ''),
            };
    
            console.log("Product Data Before Upload:", doc);
    
            if (newProduct.image) {
                console.log("Uploading image...");
                const imageAsset = await client.assets.upload('image', newProduct.image);
                doc.image = {
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: imageAsset._id
                    }
                };
            }
    
            const result = await client.create(doc);
            console.log("Product Added:", result);
    
            toast.success('Product added successfully');
            setShowAddProduct(false);
            setNewProduct({
                name: '',
                description: '',
                price: 0,
                category: '',
                dimensions: '',
                features: [''],
                tags: [''],
                image: null
            });
    
            fetchProducts();
        } catch (error) {
            console.error("Error adding product:", error);
            if (error instanceof Error) {
                toast.error(`Error adding product: ${error.message}`);
            } else {
                toast.error('Error adding product');
            }
        }
    };
    

    // const handleSignOut = () => {
    //     setIsAuthenticated(false)
    //     router.push('/')
    // }

    // if (!isAuthenticated) {
    //     return <LocalAuth onAuthenticated={() => setIsAuthenticated(true)} />
    // }

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>
    }

    return (
        <div className="bg-gradient-to-br from-[#f3d2aa] to-[#e2a478] bg-opacity-90 min-h-screen flex items-center justify-center p-6">
  <div className="max-w-screen-lg w-full bg-white/70 backdrop-blur-md shadow-xl rounded-lg p-10">
    <h2 className="text-3xl font-bold text-center text-gray-700 mb-10 uppercase">Add Products</h2>

    <form onSubmit={handleAddProduct} className="space-y-6">
      <input
        type="text"
        placeholder="Product Name"
        value={newProduct.name}
        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        className="w-full p-4 border bg-white/60 border-[#FF7800] text-black rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF7800]"
      />
      <textarea
        placeholder="Product Description"
        value={newProduct.description}
        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
        className="w-full p-4 border bg-white/60 border-[#FF7800] text-black rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF7800]"
      />
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
          className="w-full p-4 border bg-white/60 border-[#FF7800] text-black rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF7800]"
        />
        <input
          type="text"
          placeholder="Category"
          value={newProduct.category}
          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          className="w-full p-4 border bg-white/60 border-[#FF7800] text-black rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF7800]"
        />
      </div>
      <input
        type="file"
        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files ? e.target.files[0] : null })}
        className="w-full p-4 border bg-white/60 border-[#FF7800] text-black rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF7800]"
      />
      <button
        type="submit"
        className="w-full px-6 py-3 text-lg font-medium text-white bg-[#FF7800] hover:bg-[#E86C1A] rounded-md transition-all shadow-lg"
      >
        Add Product
      </button>
    </form>
  </div>
</div>
      
    )
}

export default AddProduct
