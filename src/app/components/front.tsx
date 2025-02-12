// import React, { useState, useEffect } from "react";
// import { Package, Layers, Users, Truck } from "lucide-react";

// const StatisticsBox = () => {
//   const [clientCount, setClientCount] = useState(890);
//   const [productCount, setProductCount] = useState(1234);
//   const [stockCount, setStockCount] = useState(5678);
//   const [deliveryCount, setDeliveryCount] = useState(432);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setClientCount((prev) => prev + Math.floor(Math.random() * 10));
//       setProductCount((prev) => prev + Math.floor(Math.random() * 5));
//       setStockCount((prev) => prev + Math.floor(Math.random() * 15));
//       setDeliveryCount((prev) => prev + Math.floor(Math.random() * 3));
//     }, 3000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-[#191414]">
//       <div className="bg-[#26221f] rounded-2xl shadow-lg p-6 flex items-center gap-4 border border-[#fe6c00]">
//         <div className="h-12 w-12 flex items-center justify-center bg-[#fe6c00] rounded-full">
//           <Package className="h-6 w-6 text-white" />
//         </div>
//         <div>
//           <h3 className="text-orange-400 text-2xl font-bold">{productCount}</h3>
//           <p className="text-gray-400">Total Products</p>
//         </div>
//       </div>

//       <div className="bg-[#26221f] rounded-2xl shadow-lg p-6 flex items-center gap-4 border border-[#fe6c00]">
//         <div className="h-12 w-12 flex items-center justify-center bg-[#fe6c00] rounded-full">
//           <Layers className="h-6 w-6 text-white" />
//         </div>
//         <div>
//           <h3 className="text-orange-400 text-2xl font-bold">{stockCount}</h3>
//           <p className="text-gray-400">Stock Items</p>
//         </div>
//       </div>

//       <div className="bg-[#26221f] rounded-2xl shadow-lg p-6 flex items-center gap-4 border border-[#fe6c00]">
//         <div className="h-12 w-12 flex items-center justify-center bg-[#fe6c00] rounded-full">
//           <Users className="h-6 w-6 text-white" />
//         </div>
//         <div>
//           <h3 className="text-orange-400 text-2xl font-bold">{clientCount}</h3>
//           <p className="text-gray-400">Active Clients</p>
//         </div>
//       </div>

//       <div className="bg-[#26221f] rounded-2xl shadow-lg p-6 flex items-center gap-4 border border-[#fe6c00]">
//         <div className="h-12 w-12 flex items-center justify-center bg-[#fe6c00] rounded-full">
//           <Truck className="h-6 w-6 text-white" />
//         </div>
//         <div>
//           <h3 className="text-orange-400 text-2xl font-bold">{deliveryCount}</h3>
//           <p className="text-gray-400">Deliveries</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StatisticsBox;
'use client'
import React, { useState, useEffect } from "react";
import { Package, Layers, Users, Truck } from "lucide-react";
import client from "@/sanity"; // Sanity client import karo

const StatisticsBox = () => {
  const [clientCount, setClientCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [stockCount, setStockCount] = useState(0);
  const [deliveryCount, setDeliveryCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await client.fetch(`*[_type == "product"]`);
        const clients = await client.fetch(`*[_type == "order"]`);
        const deliveries = await client.fetch(`*[_type == "order"]`);
        const stock = await client.fetch(`*[_type == "order" ]`);

        setProductCount(products.length);
        setClientCount(clients.length);
        setStockCount(stock.length);
        setDeliveryCount(deliveries.length);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 bg-[#191414]">
      {/* Products */}
      <div className="bg-[#26221f] rounded-2xl shadow-lg p-6 flex items-center gap-4 border border-[#fe6c00]">
        <div className="h-12 w-12 flex items-center justify-center bg-[#fe6c00] rounded-full">
          <Package className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-orange-400 text-2xl font-bold">{productCount}</h3>
          <p className="text-gray-400">Total Products</p>
        </div>
      </div>

      {/* Stock */}
      <div className="bg-[#26221f] rounded-2xl shadow-lg p-6 flex items-center gap-4 border border-[#fe6c00]">
        <div className="h-12 w-12 flex items-center justify-center bg-[#fe6c00] rounded-full">
          <Layers className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-orange-400 text-2xl font-bold">{stockCount}</h3>
          <p className="text-gray-400">Stock Items</p>
        </div>
      </div>

      {/* Clients */}
      <div className="bg-[#26221f] rounded-2xl shadow-lg p-6 flex items-center gap-4 border border-[#fe6c00]">
        <div className="h-12 w-12 flex items-center justify-center bg-[#fe6c00] rounded-full">
          <Users className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-orange-400 text-2xl font-bold">{clientCount}</h3>
          <p className="text-gray-400">Active Clients</p>
        </div>
      </div>

      {/* Deliveries */}
      <div className="bg-[#26221f] rounded-2xl shadow-lg p-6 flex items-center gap-4 border border-[#fe6c00]">
        <div className="h-12 w-12 flex items-center justify-center bg-[#fe6c00] rounded-full">
          <Truck className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-orange-400 text-2xl font-bold">{deliveryCount}</h3>
          <p className="text-gray-400">Deliveries</p>
        </div>
      </div>
    </div>
  );
};

export default StatisticsBox;
