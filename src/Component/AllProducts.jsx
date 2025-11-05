// ✅ AllProducts.jsx (responsive only)
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function CustomerPage() {
  const [products, setProducts] = useState([]);
  const [cartId, setCartId] = useState("");

  useEffect(() => {
    let existingCartId = localStorage.getItem("cartId");

    if (!existingCartId) {
      existingCartId = `cart_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      localStorage.setItem("cartId", existingCartId);
    }

    setCartId(existingCartId);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_BK_URL}/api/showproducts/show`
      );
      const data = await res.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 text-gray-800 p-4 sm:p-6 md:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-xl shadow-[0px_6px_19px_6px_#dbeafe] p-4 hover:shadow-lg transition flex flex-col w-full max-w-sm mx-auto"
          >
            <img
              src={
                product?.imgUrl?.startsWith("data:image")
                  ? product.imgUrl
                  : product?.imgUrl ||
                    product?.imgurl ||
                    "https://via.placeholder.com/150"
              }
              alt={product?.name || "Product"}
              className="w-full h-40 sm:h-48 md:h-52 object-contain rounded-md mb-4 bg-white"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/150";
              }}
            />

            <h2 className="text-lg sm:text-xl font-semibold text-blue-800 mb-1 line-clamp-1">
              {product.name}
            </h2>

            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {product.description}
            </p>

            <div className="text-sm text-gray-700 mb-4">
              <p>
                <span className="font-medium">Price:</span> ₹{product.price}
              </p>
              <p>
                <span className="font-medium">In Stock:</span>{" "}
                {product.quantity}
              </p>
            </div>

            <div className="mt-auto">
              <Link to={`/product/${product._id}/${cartId}`}>
                <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition text-sm w-full">
                  View Details
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
