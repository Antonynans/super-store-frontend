import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import ProductCard from "../pages/Products/ProductCard";
import ProductCarousel from "../pages/Products/ProductCarousel";
import { FaStar, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import HeaderSkeleton from "./skeletons/HeaderSkeleton";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <HeaderSkeleton />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-danger-subtle border border-danger-subtle rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-danger-dark mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-danger-light">
            Failed to load featured products. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary-subtle">
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-text-primary">
                Discover Our Latest Collections
              </h1>
              <p className="text-xl text-text-secondary">
                Explore our carefully curated selection of premium fashion
                items. Find your perfect style today with exclusive designs and
                limited editions.
              </p>
              <div className="flex gap-4 pt-4">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary text-white px-8 py-3 rounded-lg font-bold transition"
                >
                  Shop Now <FaArrowRight size={18} />
                </Link>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden shadow-lg">
              <ProductCarousel />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary-subtle py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <div className="flex items-center gap-2 justify-center">
              <div className=" bg-accent text-accent-dark rounded-full p-3 shadow-lg border-2 border-white">
                <FaStar size={20} className="fill-accent-dark" />
              </div>
              <h2 className="text-4xl font-bold text-center text-text-primary">
                Top Rated This Month
              </h2>
            </div>
          </div>

          {data && data.length > 0 ? (
            <div className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4">
              {data.slice(0, 8).map((product: any) => (
                <div
                  key={product._id}
                  className="min-w-[250px] sm:min-w-[280px] md:min-w-[300px] flex-shrink-0 snap-start"
                >
                  <div className="group relative">
                    <ProductCard p={product} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg">
              <p className="text-text-secondary text-lg">
                No top-rated products available
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mt-20 pt-20 border-t border-primary-light grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🚚",
                title: "Free Shipping",
                description: "On orders over $50",
              },
              {
                icon: "↩️",
                title: "Easy Returns",
                description: "30-day return policy",
              },
              {
                icon: "💬",
                title: "24/7 Support",
                description: "Dedicated customer service",
              },
            ].map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
