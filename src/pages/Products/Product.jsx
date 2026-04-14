import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
import getPrimaryImage from "../../utils/getPrimaryImage";

const Product = ({ product }) => {
  return (
    <div className="w-full p-3 relative">
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={getPrimaryImage(product.images)}
          alt={product.name}
          className="w-full h-64 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
        />
        <HeartIcon product={product} />
      </div>

      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center gap-2">
            <div className="text-lg font-medium text-gray-900 truncate">
              {product.name}
            </div>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap">
              ${product.price}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default Product;
