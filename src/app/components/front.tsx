  import React, { useState, useEffect } from 'react';
  import { Package, Layers, Users, Truck } from "lucide-react";

  const StatisticsBox = () => {
    const [clientCount, setClientCount] = useState(890);
    const [productCount, setProductCount] = useState(1234);
    const [stockCount, setStockCount] = useState(5678);
    const [deliveryCount, setDeliveryCount] = useState(432);

    useEffect(() => {
      const interval = setInterval(() => {
        setClientCount(prev => prev + Math.floor(Math.random() * 10));
        setProductCount(prev => prev + Math.floor(Math.random() * 5));
        setStockCount(prev => prev + Math.floor(Math.random() * 15));
        setDeliveryCount(prev => prev + Math.floor(Math.random() * 3));
      }, 3000);

      return () => clearInterval(interval);
    }, []);

    return (

<div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
  <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
    <div className="h-12 w-12 flex items-center justify-center bg-pink-100 rounded-full">
      <Package className="h-6 w-6 text-pink-600" />
    </div>
    <div>
      <h3 className="text-pink-600 text-2xl font-bold">{productCount}</h3>
      <p className="text-gray-600">Total Products</p>
    </div>
  </div>

  <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
    <div className="h-12 w-12 flex items-center justify-center bg-green-100 rounded-full">
      <Layers className="h-6 w-6 text-green-600" />
    </div>
    <div>
      <h3 className="text-green-600 text-2xl font-bold">{stockCount}</h3>
      <p className="text-gray-600">Stock Items</p>
    </div>
  </div>

  <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
    <div className="h-12 w-12 flex items-center justify-center bg-blue-100 rounded-full">
      <Users className="h-6 w-6 text-blue-600" />
    </div>
    <div>
      <h3 className="text-blue-600 text-2xl font-bold">{clientCount}</h3>
      <p className="text-gray-600">Active Clients</p>
    </div>
  </div>

  <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
    <div className="h-12 w-12 flex items-center justify-center bg-yellow-100 rounded-full">
      <Truck className="h-6 w-6 text-yellow-600" />
    </div>
    <div>
      <h3 className="text-yellow-600 text-2xl font-bold">{deliveryCount}</h3>
      <p className="text-gray-600">Deliveries</p>
    </div>
  </div>
</div>

    );
  };

  export default StatisticsBox;