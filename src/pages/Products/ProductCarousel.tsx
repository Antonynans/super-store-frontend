import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import { FaBox, FaClock, FaStar, FaStore } from "react-icons/fa";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import CarouselSkeleton from "../../components/skeletons/CaroselSkeleton";
import getPrimaryImage from "../../Utils/getPrimaryImage";
import ProductImage from "../../components/ProductImage";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();
  const topProducts = products ?? [];

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
      {isLoading ? (
        <div className="space-y-6">
          {[...Array(2)].map((_, i) => (
            <CarouselSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <Message variant="danger">
          {(error as any)?.data?.message ||
            (error as any)?.error ||
            "An error occurred"}
        </Message>
      ) : (
        // @ts-ignore
        <Slider {...settings}>
          {topProducts.map((product) => {
            const {
              images,
              _id,
              name,
              price,
              description,
              createdAt,
              numReviews,
              rating,
              countInStock,
            } = product;
            return (
              <div key={_id}>
                <div className="w-full h-80 bg-border overflow-hidden relative">
                  <ProductImage
                    src={getPrimaryImage(images)}
                    alt={name}
                  />
                </div>

                <div className="bg-white p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Link to={`/product/${_id}`} className="group">
                        <h2 className="text-2xl font-bold text-text-primary group-hover:text-primary transition mb-2">
                          {name}
                        </h2>
                      </Link>

                      <p className="text-3xl font-bold text-primary">
                        ${price}
                      </p>

                      <p className="text-text-secondary leading-relaxed">
                        {description.substring(0, 120)}...
                      </p>

                      <Link
                        to={`/product/${_id}`}
                        className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary transition"
                      >
                        View Details
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <FaStore
                            className="text-primary mt-1 flex-shrink-0"
                            size={18}
                          />
                        </div>

                        <div className="flex items-start gap-3">
                          <FaClock
                            className="text-primary mt-1 flex-shrink-0"
                            size={18}
                          />
                          <div>
                            <p className="text-sm text-text-secondary">Added</p>
                            <p className="font-semibold text-text-primary">
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
                            className="text-amber mt-1 flex-shrink-0"
                            size={18}
                          />
                          <div>
                            <p className="text-sm text-text-secondary">
                              In Stock
                            </p>
                            <p className="font-semibold text-text-primary">
                              {countInStock} items
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <div className="flex items-start gap-3 bg-primary-subtle p-3 rounded-lg">
                          <FaStar
                            className="text-primary mt-1 flex-shrink-0"
                            size={18}
                          />
                          <div>
                            <p className="text-sm text-text-secondary">
                              Reviews
                            </p>
                            <p className="font-semibold text-text-primary">
                              {numReviews} customer reviews
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;
