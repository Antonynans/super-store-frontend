import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { FiSliders, FiX, FiSearch } from "react-icons/fi";
import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all products without category filter initially
  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked: checked.length > 0 ? checked : [], // Pass empty array if no categories checked
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading && categoriesQuery.data) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, categoriesQuery.isLoading, dispatch]);

  useEffect(() => {
    if (!filteredProductsQuery.isLoading && filteredProductsQuery.data) {
      let filtered = [...(filteredProductsQuery.data || [])];

      // If NO categories are checked, show ALL products
      // If categories ARE checked, the API already filtered them
      // (the filteredProductsQuery handles category filtering on backend)

      // Filter by price if provided
      if (priceFilter) {
        filtered = filtered.filter((product) => {
          return (
            product.price.toString().includes(priceFilter) ||
            product.price === parseInt(priceFilter, 10)
          );
        });
      }

      // Filter by search query
      if (searchQuery) {
        filtered = filtered.filter((product) => {
          return (
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchQuery.toLowerCase())
          );
        });
      }

      // Sort products
      if (sortBy === "price-low") {
        filtered = filtered.sort((a, b) => a.price - b.price);
      } else if (sortBy === "price-high") {
        filtered = filtered.sort((a, b) => b.price - a.price);
      } else if (sortBy === "newest") {
        filtered = filtered.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      }

      dispatch(setProducts(filtered));
    }
  }, [
    checked,
    radio,
    filteredProductsQuery.data,
    filteredProductsQuery.isLoading,
    dispatch,
    priceFilter,
    sortBy,
    searchQuery,
  ]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand || []));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined && brand !== null)
      )
    ),
  ];

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  const handleReset = () => {
    setPriceFilter("");
    setSortBy("newest");
    setSearchQuery("");
    dispatch(setChecked([])); // This will show all products again
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Shop Products
            </h1>
            <p className="text-gray-600">
              Showing{" "}
              <span className="font-bold text-blue-600">{products?.length}</span>{" "}
              of products
              {checked.length > 0 && (
                <span className="ml-2">
                  from{" "}
                  <span className="font-semibold">
                    {checked.length} selected categor{checked.length === 1 ? "y" : "ies"}
                  </span>
                </span>
              )}
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products by name, brand, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
              />
            </div>
          </div>

          {/* Mobile Filter Button */}
          <div className="md:hidden mb-4 flex gap-2">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <FiSliders size={20} />
              Filters
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-gray-900"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          <div className="flex gap-8">
            {/* Sidebar Filters */}
            <div
              className={`${
                isMobileFilterOpen ? "block" : "hidden"
              } md:block md:w-64 flex-shrink-0`}
            >
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                {/* Close Button Mobile */}
                {isMobileFilterOpen && (
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="md:hidden absolute top-4 right-4"
                  >
                    <FiX size={24} />
                  </button>
                )}

                {/* Filter by Categories */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b-2 border-blue-600">
                    Categories
                    {checked.length > 0 && (
                      <span className="ml-2 text-sm font-normal text-blue-600">
                        ({checked.length} selected)
                      </span>
                    )}
                  </h3>
                  <div className="space-y-3">
                    {categories && categories.length > 0 ? (
                      categories.map((c) => (
                        <label
                          key={c._id}
                          className="flex items-center gap-3 cursor-pointer hover:text-blue-600 transition"
                        >
                          <input
                            type="checkbox"
                            checked={checked.includes(c._id)}
                            onChange={(e) =>
                              handleCheck(e.target.checked, c._id)
                            }
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-600 cursor-pointer"
                          />
                          <span
                            className={`font-medium ${
                              checked.includes(c._id)
                                ? "text-blue-600 font-semibold"
                                : "text-gray-700"
                            }`}
                          >
                            {c.name}
                          </span>
                        </label>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">
                        Loading categories...
                      </p>
                    )}
                  </div>

                  {/* Clear Category Filter */}
                  {checked.length > 0 && (
                    <button
                      onClick={() => dispatch(setChecked([]))}
                      className="w-full mt-3 py-2 text-sm text-blue-600 hover:text-blue-800 font-semibold border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition"
                    >
                      Clear Category Filter
                    </button>
                  )}
                </div>

                {/* Filter by Brands */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b-2 border-blue-600">
                    Brands
                  </h3>
                  <div className="space-y-3">
                    {uniqueBrands && uniqueBrands.length > 0 ? (
                      uniqueBrands.map((brand) => (
                        <label
                          key={brand}
                          className="flex items-center gap-3 cursor-pointer hover:text-blue-600 transition"
                        >
                          <input
                            type="radio"
                            name="brand"
                            onChange={() => handleBrandClick(brand)}
                            className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-600 cursor-pointer"
                          />
                          <span className="text-gray-700 font-medium">
                            {brand}
                          </span>
                        </label>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No brands found</p>
                    )}
                  </div>
                </div>

                {/* Filter by Price */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b-2 border-blue-600">
                    Price Range
                  </h3>
                  <input
                    type="text"
                    placeholder="Enter price (e.g., 50)"
                    value={priceFilter}
                    onChange={handlePriceChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
                  />
                </div>

                {/* Reset Button */}
                <button
                  onClick={handleReset}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition"
                >
                  Reset All Filters
                </button>
              </div>
            </div>

            {/* Products Section */}
            <div className="flex-1">
              {/* Top Controls */}
              <div className="hidden md:flex justify-between items-center mb-6 pb-4 border-b">
                <p className="text-gray-600">
                  Showing <span className="font-bold">{products?.length}</span>{" "}
                  products
                </p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-gray-900"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              {/* Products Grid */}
              {filteredProductsQuery.isLoading ? (
                <div className="flex justify-center items-center h-96">
                  <Loader />
                </div>
              ) : products && products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((p) => (
                    <div key={p._id}>
                      <ProductCard p={p} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-600 mb-4">
                    No products found with your filters
                  </p>
                  <button
                    onClick={handleReset}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;