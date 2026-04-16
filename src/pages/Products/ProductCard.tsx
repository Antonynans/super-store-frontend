import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useAppSelector } from "../../redux/store";
import { useAddToCartHandler } from "../../hook/useAddToCartHandler";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import { useState } from "react";
import getPrimaryImage from "../../Utils/getPrimaryImage";
import { Product } from "../../types";
import ProductImage from "../../components/ProductImage";

const ProductCard = ({ p }: { p: Product }) => {
  const [hovered, setHovered] = useState(false);
  const addToCartHandler = useAddToCartHandler();

  return (
    <Link to={`/product/${p?._id}`}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl  cursor-pointer h-full flex flex-col"
        style={{ transform: hovered ? "translateY(-4px)" : "none" }}
      >
        <div className="relative overflow-hidden bg-surface-subtle min-w-[250px] sm:min-w-[280px] md:min-w-[300px]  h-48">
         <div className="relative w-full aspect-[3/4] bg-surface-subtle rounded-t-lg overflow-hidden">
  <ProductImage src={getPrimaryImage(p?.images)} alt={p?.name} />
</div>

          <div className="absolute top-3 right-8">
            <HeartIcon product={p} />
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col justify-between">
          <h3 className="font-semibold text-text-primary mb-2 line-clamp-2 hover:text-primary transition">
            {p?.name}
          </h3>

          <Ratings value={p?.rating} text={`${p?.numReviews} reviews`} />

          <div className="">
            {p?.countInStock > 0 ? (
              <span className="text-xs text-amber font-semibold">
                ✓ In Stock
              </span>
            ) : (
              <span className="text-xs text-danger-light font-semibold">
                Out of Stock
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-text-primary">
                {p?.price?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </span>
            </div>
            <div className="">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (p?.countInStock > 0) {
                    addToCartHandler(p, 1);
                  }
                }}
                disabled={p?.countInStock === 0}
                className={`w-full rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2 py-2 px-4 ${
                  p?.countInStock === 0
                    ? "bg-text-subtle text-text-secondary cursor-not-allowed"
                    : "bg-primary hover:bg-primary text-white"
                }`}
              >
                <AiOutlineShoppingCart size={18} />
                {/* {p?.countInStock === 0 ? "Out of Stock" : "Add to Cart"} */}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
