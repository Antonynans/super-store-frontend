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
import Select from "react-select";
import { useDebounce } from "../hook/useDebounce";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop,
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 100000,
  });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked: checked.length > 0 ? checked : [],
    radio,
  });

  const prices = filteredProductsQuery.data?.map((p) => p.price) || [];
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 100000;

  const debouncedSearch = useDebounce(searchQuery, 400);

  useEffect(() => {
    if (!categoriesQuery.isLoading && categoriesQuery.data) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, categoriesQuery.isLoading, dispatch]);

  useEffect(() => {
    if (!filteredProductsQuery.isLoading && filteredProductsQuery.data) {
      let filtered = [...(filteredProductsQuery.data || [])];

      filtered = filtered.filter(
        (product) =>
          product.price >= Number(priceRange.min) &&
          product.price <= Number(priceRange.max),
      );

      if (debouncedSearch) {
        const query = debouncedSearch.toLowerCase();

        filtered = filtered.filter((product) => {
          return (
            product.name?.toLowerCase().includes(query) ||
            product.description?.toLowerCase().includes(query) ||
            product.brand?.toLowerCase().includes(query)
          );
        });
      }

      if (sortBy === "price-low") {
        filtered = filtered.sort((a, b) => a.price - b.price);
      } else if (sortBy === "price-high") {
        filtered = filtered.sort((a, b) => b.price - a.price);
      } else if (sortBy === "newest") {
        filtered = filtered.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
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
    priceRange,
    sortBy,
    debouncedSearch,
  ]);

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setPriceRange({ min: 0, max: 100000 });
    setSortBy("newest");
    setSearchQuery("");
    dispatch(setChecked([]));
  };

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
  ];

  const customStyles = {
    control: (base) => ({
      ...base,
      borderRadius: "0.5rem",
      borderColor: "#d1d5db",
      boxShadow: "none",
      "&:hover": { borderColor: "#2563eb" },
    }),
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Shop Products
            </h1>
            <p className="text-gray-600">
              Showing{" "}
              <span className="font-bold text-blue-600">
                {products?.length}
              </span>{" "}
              of products
              {checked.length > 0 && (
                <span className="ml-2">
                  from{" "}
                  <span className="font-semibold">
                    {checked.length} selected categor
                    {checked.length === 1 ? "y" : "ies"}
                  </span>
                </span>
              )}
            </p>
          </div>

          <div className="mb-6">
            <div className="relative">
              <FiSearch
                className="absolute left-3 top-3 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search products by name, brand, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
              />
            </div>
          </div>

          <div className="md:hidden mb-4 flex gap-2">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <FiSliders size={20} />
              Filters
            </button>

            <Select
              styles={customStyles}
              options={sortOptions}
              value={sortOptions.find((opt) => opt.value === sortBy)}
              onChange={(selected) => setSortBy(selected.value)}
              className="flex-1 z-20"
              classNamePrefix="react-select"
            />
          </div>

          <div className="flex gap-8">
            <div
              className={`${
                isMobileFilterOpen ? "block" : "hidden"
              } md:block md:w-64 flex-shrink-0`}
            >
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                {isMobileFilterOpen && (
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="md:hidden absolute top-4 right-4"
                  >
                    <FiX size={24} />
                  </button>
                )}

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

                  {checked.length > 0 && (
                    <button
                      onClick={() => dispatch(setChecked([]))}
                      className="w-full mt-3 py-2 text-sm text-blue-600 hover:text-blue-800 font-semibold border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition"
                    >
                      Clear Category Filter
                    </button>
                  )}
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b-2 border-blue-600">
                    Price Range
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 mb-1 block">
                        Min ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={priceRange.max}
                        value={priceRange.min}
                        onChange={(e) =>
                          setPriceRange((prev) => ({
                            ...prev,
                            min: Math.max(
                              0,
                              Math.min(Number(e.target.value), prev.max - 1),
                            ),
                          }))
                        }
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
                      />
                    </div>
                    <span className="text-gray-400 mt-5">—</span>
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 mb-1 block">
                        Max ($)
                      </label>
                      <input
                        type="number"
                        min={priceRange.min}
                        max={maxPrice}
                        value={priceRange.max}
                        onChange={(e) =>
                          setPriceRange((prev) => ({
                            ...prev,
                            max: Math.max(Number(e.target.value), prev.min + 1),
                          }))
                        }
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>Min: $0</span>
                    <span>Max: ${Number(maxPrice).toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition"
                >
                  Reset All Filters
                </button>
              </div>
            </div>

            <div className="flex-1">
              <div className="hidden md:flex justify-between items-center mb-6 pb-4 border-b">
                <p className="text-gray-600">
                  Showing <span className="font-bold">{products?.length}</span>{" "}
                  products
                </p>

                <Select
                  styles={customStyles}
                  options={sortOptions}
                  value={sortOptions.find((opt) => opt.value === sortBy)}
                  onChange={(selected) => setSortBy(selected.value)}
                  className="w-60 z-20"
                  classNamePrefix="react-select"
                />
              </div>

              {filteredProductsQuery.isLoading ? (
                <div className="flex justify-center items-center h-96">
                  <Loader />
                </div>
              ) : products && products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
