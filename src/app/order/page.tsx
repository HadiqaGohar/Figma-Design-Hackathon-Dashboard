'use client';

import ProtectedRoute from '@/app/components/ProtectedRoute';
import { client } from '@/sanity/lib/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import SideNavbar from '../components/SideNavbar';

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
    image: string;
    id: number;
    productName: string;
}

function AdminDashboard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        client.fetch(`
            *[_type == "order"]{
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
                cartItems,
                image,
                id,
                productName,
            }
        `)
            .then((data) => setOrders(data))
            .catch((error) => console.error("Error fetching orders:", error));
    }, []);

    const toggleDropdown = (orderId: string) => {
        setSelectedOrderId(selectedOrderId === orderId ? null : orderId);
    };

    return (
        <ProtectedRoute>
            <div className='flex flex-col h-screen bg-[#D2B48C] text-black'>
                <SideNavbar />
                <div className='sm:ml-[36%] md:ml-[30%] lg:ml-[23%] xl:ml-[18%] 2xl:ml-[15%] flex-1 overflow-auto p-6 overflow-y-auto'>
                    <h2 className='text-3xl font-bold text-center text-black mb-2 mt-6 uppercase'>Orders</h2>

                    {/* ✅ **Filter Orders by Status** */}
                    <div className="mb-4 text-black">
                        <label className="mr-2">Filter:</label>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="p-2 border rounded-lg bg-[#A67B5B] text-white"
                        >
                            <option value="All">All</option>
                            <option value="pending">Pending</option>
                            <option value="success">Success</option>
                            <option value="dispatch">Dispatch</option>
                        </select>
                    </div>

                    <div className='overflow-hidden bg-[#E5C1A1] rounded-xl shadow-lg p-4'>
                        <table className="text-xs w-full border-collapse text-black">
                            <thead>
                                <tr className="bg-[#8B5A2B] text-[#ff9f2a]">
                                    <th className="p-3 border">ID</th>
                                    <th className="p-3 border">Customer</th>
                                    <th className="p-3 border">Country</th>
                                    <th className="p-3 border">City</th>
                                    <th className="p-3 border">Total</th>
                                    <th className="p-3 border">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders
                                    .filter(order => filter === "All" || order.status.toLowerCase() === filter.toLowerCase()) // ✅ Apply filter
                                    .map((order) => (
                                        <React.Fragment key={order._id}>
                                            <tr className="text-xs md:text-sm cursor-pointer hover:bg-[#FFA54F] transition-all border-b" onClick={() => toggleDropdown(order._id)}>
                                                <td className="p-3 border">{order._id}</td>
                                                <td className="p-3 border">{order.firstName} {order.lastName}</td>
                                                <td className="p-3 border">{order.country}</td>
                                                <td className="p-3 border">{order.city}</td>
                                                <td className="p-3 border">${order.totalPrice}</td>
                                                <td className="p-3 border">{order.status}</td>
                                            </tr>
                                            {selectedOrderId === order._id && (
                                                <tr>
                                                    <td colSpan={6} className="p-4 border bg-[#8B5A2B] text-white">
                                                        <h3 className="text-lg font-semibold">Order Details</h3>
                                                        <p><strong>Phone:</strong> {order.phone}</p>
                                                        <p><strong>Email:</strong> {order.email}</p>
                                                        <p><strong>Street:</strong> {order.street}</p>
                                                        <p><strong>Postal Code:</strong> {order.postalCode}</p>
                                                        <p><strong>Image Address:</strong> {order.image}</p>
                                                        <p><strong>Id:</strong> {order.id}</p>
                                                        <p><strong>Subtotal:</strong> {order.subtotal}</p>
                                                        <p><strong>Shipping:</strong> {order.shippingPrice}</p>
                                                        <p><strong>Total:</strong> {order.totalPrice}</p>
                                                        {/*  */}
                                                        <p><strong>First Name:</strong> {order.firstName}</p>
                                                        <p><strong>Last Name:</strong> {order.lastName}</p>
                                                        <p><strong>Country:</strong> {order.country}</p>
                                                        <p><strong>City:</strong> {order.city}</p>
                                                        {/* <p><strong>Total:</strong> {order.totalPrice}</p> */}
                                                        <p><strong>Status:</strong> {order.status}</p>
                                                        <ul className="mt-2">
                                                            {order.cartItems.map((item, index) => (
                                                                <li key={index} className="p-2">{item.product} (Qty: {item.quantity})</li>
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

export default AdminDashboard;
