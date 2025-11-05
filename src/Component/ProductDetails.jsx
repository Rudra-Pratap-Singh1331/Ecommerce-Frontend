import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AuthContext } from "../Context/AuthContext";
import "@google/model-viewer";

const ProductDetail = () => {
  const { id, cartId } = useParams();
  const [product, setProduct] = useState(null);
  const [showModel, setShowModel] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BK_URL}/api/products/${id}`
        );
        setProduct(res.data);
      } catch (err) {
          toast.error("Failed to load product");
      }
    };

    fetchProduct();
  }, [id]);

  const handleBuyNow = async (product) => {
    if (!user || !user.token) {
      toast.error("Please login to add items to cart.");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BK_URL}/api/cart/add`,
        {
          cartId,
          product: {
            productId: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            imgurl: product.imgurl,
            quantity: 1,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  if (!product) return <p className="p-4 text-center">Loading product...</p>;

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-md p-4 sm:p-6 md:p-10 flex flex-col md:flex-row gap-6 md:gap-10">
        {/* 🖼 Product Image Section */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <img
            src={
              product?.imgUrl?.startsWith("data:image")
                ? product.imgUrl
                : product?.imgUrl ||
                  product?.imgurl ||
                  "https://via.placeholder.com/150"
            }
            alt={product?.name || "Product"}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md object-contain rounded-lg shadow-lg bg-white"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/150";
            }}
          />
        </div>

        {/* 📝 Product Info Section */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-snug">
            {product.name}
          </h1>
          <p className="text-lg sm:text-xl font-semibold text-green-700">
            ₹{product.price}
          </p>
          <p className="text-sm sm:text-base text-gray-600">
            In Stock: {product.quantity}
          </p>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            {product.description}
          </p>

          <div className="border p-4 rounded-md bg-gray-100 mt-2">
            <p className="text-sm sm:text-base text-gray-700 font-semibold mb-3">
              3D Model Viewer
            </p>
            <button
              onClick={() => setShowModel(true)}
              className="bg-[#0071dc] text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm sm:text-base"
            >
              View in 360° / AR
            </button>
          </div>

          <button
            onClick={() => handleBuyNow(product)}
            className="bg-[#0071dc] text-white px-6 py-3 rounded hover:bg-blue-700 transition mt-4 w-full text-sm sm:text-base"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* 🧊 3D Model Modal */}
      {showModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/50 p-4">
          <div className="relative bg-white p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-2xl border border-gray-300">
            <button
              onClick={() => setShowModel(false)}
              className="absolute top-3 right-3 bg-red-500 text-white rounded-full px-3 py-1 text-sm font-semibold shadow-md hover:bg-red-600"
            >
              ✕
            </button>

            {product.modelUrl ? (
              <model-viewer
                src={product.modelUrl}
                ar
                ar-modes="scene-viewer webxr quick-look"
                auto-rotate
                camera-controls
                shadow-intensity="1"
                alt={product.name}
                style={{
                  width: "100%",
                  height: "400px",
                  borderRadius: "0.5rem",
                }}
              ></model-viewer>
            ) : (
              <div className="text-center py-16 sm:py-20 text-gray-600">
                <p className="text-lg font-semibold">3D Model Not Available</p>
                <p className="text-sm mt-2">
                  This product doesn't have a 3D view yet.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
