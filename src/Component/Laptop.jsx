import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Laptop = () => {
  const [shoes, setShoes] = useState([]);
  const cartId = localStorage.getItem("cartId");

  useEffect(() => {
    const fetchShoes = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BK_URL}/api/products/category/electronics`
        );
        setShoes(res.data);
      } catch (err) {
        toast.error("Failed to fetch electronics");
      }
    };

    fetchShoes();
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 text-gray-800 p-6">
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
        gap-8 justify-items-center"
      >
        {shoes.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-xl shadow-[0px_6px_19px_6px_#dbeafe]
            p-4 hover:shadow-lg transition flex flex-col w-[280px] h-[430px]"
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
              className="w-full h-44 object-contain rounded-md mb-4 bg-white"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/150";
              }}
            />

            <h2 className="text-lg font-semibold text-blue-800 mb-1 line-clamp-1">
              {product.name}
            </h2>

            <p
              className="text-sm text-gray-600 mb-3 line-clamp-2 overflow-hidden text-ellipsis"
              style={{ maxHeight: "3.2em" }}
            >
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
};

export default Laptop;
