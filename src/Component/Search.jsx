import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Search = () => {
  const [params] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const query = params.get("q");
  const cartId = localStorage.getItem("cartId");
  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BK_URL}/api/search?q=${query}`
        );
        setResults(res.data);
      } catch (err) {
        toast.error("Search failed");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-blue-50 text-gray-800 p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Search Results for: <span className="text-blue-700">"{query}"</span>
      </h2>

      {loading ? (
        <p className="text-gray-600">🔄 Loading results...</p>
      ) : results.length === 0 ? (
        <p className="text-red-600 text-lg">No matching products found.</p>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-4">
            Found {results.length} product{results.length > 1 ? "s" : ""}.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 justify-items-center">
            {results.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 p-5 flex flex-col items-start w-[90%] sm:w-[85%] md:w-[250px] lg:w-[260px] xl:w-[280px]"
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

                {/* Product Details */}
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

                {/* View Details Button */}
                <div className="mt-auto w-full">
                  <Link to={`/product/${product._id}/${cartId}`}>
                    <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition text-sm w-full">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Search;
