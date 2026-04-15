import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { FiSliders, FiX, FiSearch } from "react-icons/fi";
import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import ProductCardSkeleton from "../components/skeletons/ProductCardSkeleton";
import { lazy, Suspense } from "react";

import Select from "react-select";
import { useDebounce } from "../hook/useDebounce";
import { Product } from "../types";

const ProductCard = lazy(() => import("./Products/ProductCard"));

const Shop = () => {
  const dispatch = useAppDispatch();
  const { categories, products, checked, radio } = useAppSelector(
    (state) => state.shop,
  ) as {
    categories: any[];
    products: Product[];
    checked: string[];
    radio: string | string[];
  };

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
    radio: Array.isArray(radio) ? radio : radio ? [radio] : [],
  });

  const prices = filteredProductsQuery.data?.map((p) => p.price) || [];
  const maxPrice = prices.length ? Math.max(...prices) : 100000;

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

      if (debouncedSearch && typeof debouncedSearch === "string") {
        const query = debouncedSearch.toLowerCase();

        filtered = filtered.filter((product) => {
          return (
            product.name?.toLowerCase().includes(query) ||
            product.description?.toLowerCase().includes(query) 
            // product.brand?.toLowerCase().includes(query)
          );
        });
      }

      if (sortBy === "price-low") {
        filtered = filtered.sort((a, b) => a.price - b.price);
      } else if (sortBy === "price-high") {
        filtered = filtered.sort((a, b) => b.price - a.price);
      } else if (sortBy === "newest") {
        filtered = filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
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

  const handleCheck = (value: boolean, id: string) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
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
    control: (base: any) => ({
      ...base,
      borderRadius: "0.5rem",
      borderColor: "#d1d5db",
      boxShadow: "none",
      "&:hover": { borderColor: "#2563eb" },
    }),
  };

  return (
    <>
      <div className="min-h-screen bg-surface-muted">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-text-primary mb-2">
              Shop Products
            </h1>
            <p className="text-text-secondary">
              Showing{" "}
              <span className="font-bold text-primary">{products?.length}</span>{" "}
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
                className="absolute left-3 top-3 text-text-subtle"
                size={20}
              />
              <input
                type="text"
                placeholder="Search products by name, brand, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
              />
            </div>
          </div>

          <div className="md:hidden mb-4 flex gap-2">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="flex-1 bg-primary text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <FiSliders size={20} />
              Filters
            </button>

            <Select
              styles={customStyles}
              options={sortOptions}
              value={sortOptions.find((opt) => opt.value === sortBy)}
              onChange={(selected) => selected && setSortBy(selected.value)}
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
                  <h3 className="text-lg font-bold text-text-primary mb-4 pb-3 border-b-2 border-primary">
                    Categories
                    {checked.length > 0 && (
                      <span className="ml-2 text-sm font-normal text-primary">
                        ({checked.length} selected)
                      </span>
                    )}
                  </h3>
                  <div className="space-y-3">
                    {categories && categories.length > 0 ? (
                      categories.map((c) => (
                        <label
                          key={c._id}
                          className="flex items-center gap-3 cursor-pointer hover:text-primary transition"
                        >
                          <input
                            type="checkbox"
                            checked={checked.includes(c._id)}
                            onChange={(e) =>
                              handleCheck(e.target.checked, c._id)
                            }
                            className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary cursor-pointer"
                          />
                          <span
                            className={`font-medium ${
                              checked.includes(c._id)
                                ? "text-primary font-semibold"
                                : "text-text-secondary"
                            }`}
                          >
                            {c.name}
                          </span>
                        </label>
                      ))
                    ) : (
                      <p className="text-text-subtle text-sm">
                        Loading categories...
                      </p>
                    )}
                  </div>

                  {checked.length > 0 && (
                    <button
                      onClick={() => dispatch(setChecked([]))}
                      className="w-full mt-3 py-2 text-sm text-primary hover:text-primary-dark font-semibold border-2 border-primary rounded-lg hover:bg-primary-subtle transition"
                    >
                      Clear Category Filter
                    </button>
                  )}
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-bold text-text-primary mb-4 pb-3 border-b-2 border-primary">
                    Price Range
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="text-xs text-text-subtle mb-1 block">
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
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
                      />
                    </div>
                    <span className="text-text-subtle mt-5">—</span>
                    <div className="flex-1">
                      <label className="text-xs text-text-subtle mb-1 block">
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
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-text-subtle mt-2">
                    <span>Min: $0</span>
                    <span>Max: ${Number(maxPrice).toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="w-full bg-border hover:bg-border-dark text-text-primary font-semibold py-2 rounded-lg transition"
                >
                  Reset All Filters
                </button>
              </div>
            </div>

            <div className="flex-1">
              <div className="hidden md:flex justify-between items-center mb-6 pb-4 border-b">
                <p className="text-text-secondary">
                  Showing <span className="font-bold">{products?.length}</span>{" "}
                  products
                </p>

                <Select
                  styles={customStyles}
                  options={sortOptions}
                  value={sortOptions.find((opt) => opt.value === sortBy)}
                  onChange={(selected) => selected && setSortBy(selected.value)}
                  className="w-60 z-20"
                  classNamePrefix="react-select"
                />
              </div>

              {filteredProductsQuery.isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              ) : products && products.length > 0 ? (
                <Suspense
                  fallback={
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...Array(9)].map((_, i) => (
                        <ProductCardSkeleton key={i} />
                      ))}
                    </div>
                  }
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((p) => (
                      <ProductCard key={p._id} p={p} />
                    ))}
                  </div>
                </Suspense>
              ) : (
                <div className="text-center py-12">
                  <p className="text-xl text-text-secondary mb-4">
                    No products found with your filters
                  </p>
                  <button
                    onClick={handleReset}
                    className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition"
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
