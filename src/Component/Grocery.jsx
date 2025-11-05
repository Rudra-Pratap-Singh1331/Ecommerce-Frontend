import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Grocery = () => {
  const [products, setProducts] = useState([]);
  const [popupData, setPopupData] = useState(null);

  const cartId = localStorage.getItem("cartId");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BK_URL}/api/products/category/grocery`
        );
        setProducts(res.data);
      } catch (err) {
        toast.error("Failed to fetch grocery items");
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 text-gray-800 px-4 sm:px-6 md:px-8 py-8">
      {/* Header */}
      <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-8 text-center">
        Grocery Essentials
      </h1>

      {/* Product Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 justify-items-center">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 duration-300 flex flex-col items-start w-[90%] sm:w-[85%] md:w-[250px] lg:w-[260px] xl:w-[280px] p-5"
          >
            {/* Product Image */}
            <div className="w-full h-48 flex justify-center items-center bg-white rounded-lg mb-4 overflow-hidden">
              <img
                src={
                  product?.imgUrl?.startsWith("data:image")
                    ? product.imgUrl
                    : product?.imgUrl ||
                      product?.imgurl ||
                      "https://via.placeholder.com/150"
                }
                alt={product?.name || "Product"}
                className="max-h-44 object-contain"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/150";
                }}
              />
            </div>

            {/* Product Info */}
            <h2 className="text-lg font-semibold text-blue-800 mb-1 line-clamp-1">
              {product.name}
            </h2>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {product.description}
            </p>

            <div className="text-sm text-gray-700 mb-4 w-full">
              <p>
                <span className="font-medium">Price:</span> ₹{product.price}
              </p>
              <p>
                <span className="font-medium">In Stock:</span>{" "}
                {product.quantity}
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-auto flex gap-2 w-full">
              <Link to={`/product/${product._id}/${cartId}`} className="w-1/2">
                <button className="bg-blue-600 text-white py-2 px-3 rounded hover:bg-blue-700 transition text-sm w-full">
                  View
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* 🔄 Unified Modal for Loading and AI Response */}
      {popupData && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative overflow-y-auto max-h-[90vh]">
            {/* Loader */}
            {
              <div className="flex items-center gap-3 justify-center">
                <svg
                  className="animate-spin h-6 w-6 text-[#0071dc]"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                <p className="text-gray-700 font-medium text-base sm:text-lg">
                  Thinking...
                </p>
              </div>
            }

            {/* AI Response */}
            {popupData && (
              <>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#0071dc] mb-4 text-center">
                  Product Information
                </h2>

                <div className="text-sm sm:text-base text-gray-700 space-y-4 max-h-[60vh] overflow-y-auto">
                  {popupData.ingredients && (
                    <div>
                      <h3 className="font-semibold">Ingredients:</h3>
                      <ul className="list-disc pl-5 text-gray-600">
                        {popupData.ingredients.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {popupData.nutritionalContent && (
                    <div>
                      <h3 className="font-semibold">Nutritional Content:</h3>
                      <ul className="list-disc pl-5 text-gray-600">
                        {popupData.nutritionalContent.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {popupData.benefits && (
                    <div>
                      <h3 className="font-semibold text-green-700">
                        Benefits:
                      </h3>
                      <ul className="list-disc pl-5 text-green-700">
                        {popupData.benefits.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {popupData.disadvantages && (
                    <div>
                      <h3 className="font-semibold text-red-600">
                        Disadvantages:
                      </h3>
                      <ul className="list-disc pl-5 text-red-600">
                        {popupData.disadvantages.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {popupData.raw && (
                    <div className="text-gray-600 whitespace-pre-line border border-gray-200 rounded p-3 bg-gray-50">
                      {popupData.raw}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setPopupData(null)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-2xl font-bold"
                >
                  ×
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Grocery;
