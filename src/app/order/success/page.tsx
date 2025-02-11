'use client';

import ProtectedRoute from '@/app/components/ProtectedRoute';
import { client } from '@/sanity/lib/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
    return builder.image(source);
}

interface CartItem {
    product: string;
    quantity: number;
    image: string;
}

interface Order {
    _id: string;
    firstName: string;
    lastName: string;
    country: string;
    street: string;
    city: string;
    provinces: string;
    postalCode: string;
    phone: string;
    email: string;
    totalPrice: number;
    shippingPrice: number;
    subtotal: number;
    status: string;
    cartItems: CartItem[];
}

function Success() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [filter, setFilter] = useState("All");

    // ✅ **Fetch orders from Sanity**
    useEffect(() => {
        client.fetch(`
            *[_type == "order" && status == "success"]{
                _id,
                firstName,
                lastName,
                country,
                street,
                city,
                provinces,
                postalCode,
                phone,
                email,
                totalPrice,
                shippingPrice,
                subtotal,
                status,
                cartItems
            }
        `)
            .then((data) => setOrders(data))
            .catch((error) => console.error("Error fetching orders:", error));
    }, []);

    // ✅ **Update order status**
    const updateOrderStatus = (orderId: string, newStatus: string) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order._id === orderId ? { ...order, status: newStatus } : order
            )
        );

        client
            .patch(orderId)
            .set({ status: newStatus })
            .commit()
            .then(() => Swal.fire("Updated!", "Order status updated successfully", "success"))
            .catch((error) => console.error("Error updating status:", error));
    };

    // ✅ **Delete order**
    const deleteOrder = (orderId: string) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                client
                    .delete(orderId)
                    .then(() => {
                        setOrders((prevOrders) => prevOrders.filter(order => order._id !== orderId));
                        Swal.fire("Deleted!", "Order has been deleted.", "success");
                    })
                    .catch((error) => console.error("Error deleting order:", error));
            }
        });
    };

    const filteredOrders = filter === "All" ? orders : orders.filter((order) => order.status === filter);

    return (
        <ProtectedRoute>
            <div className='flex flex-col h-screen bg-gray-400 text-white'>
                <div className='flex-1 p-6 overflow-y-auto'>
                    <h2 className='text-3xl font-bold text-center text-black mb-6 uppercase'>Success Orders</h2>

                    

                    <div className='overflow-hidden bg-gray-500 rounded-xl shadow-lg p-4'>
                        <table className="w-full border-collapse text-white">
                            <thead>
                                <tr className="bg-[#2C211F] text-[#FF7800]">
                                    <th className="p-3 border">ID</th>
                                    <th className="p-3 border">Customer</th>
                                    <th className="p-3 border">Country</th>
                                    <th className="p-3 border">City</th>
                                    <th className="p-3 border">Total</th>
                                    <th className="p-3 border">Status</th>
                                    <th className="p-3 border">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order) => (
                                    <React.Fragment key={order._id}>
                                        <tr className="cursor-pointer hover:bg-[#FF7800] transition-all border-b">
                                            <td className="p-3 border">{order._id}</td>
                                            <td className="p-3 border">{order.firstName} {order.lastName}</td>
                                            <td className="p-3 border">{order.country}</td>
                                            <td className="p-3 border">{order.city}</td>
                                            <td className="p-3 border">${order.totalPrice}</td>
                                            <td className="p-3 border">
                                                <select
                                                    value={order.status || ""}
                                                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                    className="p-2 border rounded-lg bg-[#2C211F] text-orange-400 font-bold"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="success">Success</option>
                                                    <option value="dispatch">Dispatch</option>
                                                </select>
                                            </td>
                                            <td className="p-3 border">
                                                <button
                                                    onClick={() => deleteOrder(order._id)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>

                                        {/* ✅ **Order Details** */}
                                        {selectedOrderId === order._id && (
                                            <tr>
                                                <td colSpan={7} className="p-4 border bg-[#2C211F]">
                                                    <h3 className="text-lg font-semibold text-[#FF7800]">Order Details</h3>
                                                    <p><strong>Phone:</strong> {order.phone}</p>
                                                    <p><strong>Email:</strong> {order.email}</p>
                                                    <p><strong>Street:</strong> {order.street}</p>
                                                    <p><strong>City:</strong> {order.city}</p>
                                                    <p><strong>Postal Code:</strong> {order.postalCode}</p>
                                                    <ul className="mt-2">
                                                        {order.cartItems.map((item, index) => (
                                                            <li key={`${order._id}-${index}`} className="flex items-center space-x-4 p-2">
                                                                <span>{item.product} (Qty: {item.quantity})</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

export default Success;
