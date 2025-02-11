'use client';

import ProtectedRoute from '@/app/components/ProtectedRoute';
import { client } from '@/sanity/lib/client';
import imageUrlBuilder from '@sanity/image-url';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const builder = imageUrlBuilder(client);

function urlFor(source: any) {
    return builder.image(source);
}

interface CartItem {
    name: string;
    image: string;
}

interface Order {
    _id: string;
    firstName: string;
    lastName: string;
    phone: number;
    email: string;
    address: string;
    zipCode: string;
    city: string;
    total: number;
    discount: number;
    orderDate: string;
    status: string | null;
    cartItems: CartItem[];
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
                phone,
                email,
                address,
                city,
                zipCode,
                total,
                discount,
                orderDate,
                status,
                cartItems[] -> {
                    name,
                    image
                }
            }
        `)
            .then((data) => setOrders(data))
            .catch((error) => console.error("Error fetching orders:", error));
    }, []);

    const filteredOrders = filter === "All" ? orders : orders.filter((order) => order.status === filter);

    const toggleOrderDetails = (orderId: string) => {
        setSelectedOrderId((prev) => (prev === orderId ? null : orderId));
    };

    const handleDelete = async (orderId: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        if (!result.isConfirmed) return;

        try {
            await client.delete(orderId);
            setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
            Swal.fire("Deleted!", "The order has been deleted.", "success");
        } catch (error) {
            Swal.fire("Error", "Failed to delete order", "error");
        }
    };

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            await client.patch(orderId).set({ status: newStatus }).commit();
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                )
            );
            Swal.fire("Success", "Order status updated", "success");
        } catch (error) {
            Swal.fire("Error", "Failed to update status", "error");
        }
    };

    return (
        <ProtectedRoute>
            <div className='flex flex-col h-screen bg-gray-100'>
                <nav className='bg-yellow-600 text-white p-4 shadow-lg flex justify-between'>
                    <h2 className='text-2xl font-bold'>Admin Dashboard</h2>
                    <div className='flex space-x-4'>
                        {["All", "pending", "success", "dispatch"].map((status) => (
                            <button
                                key={status}
                                className={`px-4 py-2 ${filter === status ? "bg-white text-yellow-600" : "text-white"}`}
                                onClick={() => setFilter(status)}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </nav>

                <div className='flex-1 p-6 overflow-y-auto'>
                    <h2 className='text-2xl font-bold text-center'>Orders</h2>
                    <div className='overflow-y-auto bg-white rounded-lg shadow-sm p-4'>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="p-2 border">ID</th>
                                    <th className="p-2 border">Customer</th>
                                    <th className="p-2 border">Address</th>
                                    <th className="p-2 border">Date</th>
                                    <th className="p-2 border">Total</th>
                                    <th className="p-2 border">Status</th>
                                    <th className="p-2 border">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order) => (
                                    <React.Fragment key={order._id}>
                                        <tr
                                            className="cursor-pointer hover:bg-yellow-100 transition-all"
                                            onClick={() => toggleOrderDetails(order._id)}
                                        >
                                            <td className="p-2 border">{order._id}</td>
                                            <td className="p-2 border">{order.firstName} {order.lastName}</td>
                                            <td className="p-2 border">{order.address}</td>
                                            <td className="p-2 border">{new Date(order.orderDate).toLocaleDateString()}</td>
                                            <td className="p-2 border">${order.total}</td>
                                            <td className="p-2 border">
                                                <select
                                                    value={order.status || ""}
                                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                    className="p-1 border rounded bg-gray-100"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="success">Success</option>
                                                    <option value="dispatch">Dispatch</option>
                                                </select>
                                            </td>
                                            <td className="p-2 border">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(order._id);
                                                    }}
                                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>

                                        {selectedOrderId === order._id && (
                                            <tr>
                                                <td colSpan={7} className="p-4 border bg-gray-50">
                                                    <h3 className="text-lg font-semibold">Order Details</h3>
                                                    <p>Phone: <strong>{order.phone}</strong></p>
                                                    <p>Email: <strong>{order.email}</strong></p>
                                                    <p>City: <strong>{order.city}</strong></p>
                                                    <ul className="mt-2">
                                                        {order.cartItems.map((item, index) => (
                                                            <li key={`${order._id}-${index}`} className="flex items-center space-x-4 p-2">
                                                                <span>{item.name}</span>
                                                                {item.image && (
                                                                    <Image
                                                                        src={urlFor(item.image).url()}
                                                                        alt={item.name}
                                                                        width={100}
                                                                        height={100}
                                                                        className="rounded-lg shadow"
                                                                    />
                                                                )}
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

export default AdminDashboard;
