import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import { FaBox, FaClock, FaStar, FaStore } from "react-icons/fa";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  return (
    <div>
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Slider {...settings}>
          {products.map(
            ({
              image,
              _id,
              name,
              price,
              description,
              brand,
              createdAt,
              numReviews,
              rating,
              countInStock,
            }) => (
              <div key={_id}>
                <div className="w-full h-80 bg-gray-100">
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="bg-white p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Link to={`/product/${_id}`} className="group">
                        <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition mb-2">
                          {name}
                        </h2>
                      </Link>

                      <p className="text-3xl font-bold text-blue-600">
                        ${price}
                      </p>

                      <p className="text-gray-600 leading-relaxed">
                        {description.substring(0, 120)}...
                      </p>

                      <Link
                        to={`/product/${_id}`}
                        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                      >
                        View Details
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <FaStore
                            className="text-blue-600 mt-1 flex-shrink-0"
                            size={18}
                          />
                          <div>
                            <p className="text-sm text-gray-600">Brand</p>
                            <p className="font-semibold text-gray-900">
                              {brand}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <FaClock
                            className="text-blue-600 mt-1 flex-shrink-0"
                            size={18}
                          />
                          <div>
                            <p className="text-sm text-gray-600">Added</p>
                            <p className="font-semibold text-gray-900">
                              {moment(createdAt).fromNow()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Ratings value={rating} />
                        </div>

                        <div className="flex items-start gap-3">
                          <FaBox
                            className="text-green-600 mt-1 flex-shrink-0"
                            size={18}
                          />
                          <div>
                            <p className="text-sm text-gray-600">In Stock</p>
                            <p className="font-semibold text-gray-900">
                              {countInStock} items
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <div className="flex items-start gap-3 bg-blue-50 p-3 rounded-lg">
                          <FaStar
                            className="text-blue-600 mt-1 flex-shrink-0"
                            size={18}
                          />
                          <div>
                            <p className="text-sm text-gray-600">Reviews</p>
                            <p className="font-semibold text-gray-900">
                              {numReviews} customer reviews
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ),
          )}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;
