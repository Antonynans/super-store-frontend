import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
} from "../../redux/api/productApiSlice";
import { useUploadProductImageMutation } from "../../redux/api/uploadApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";

const AdminProductUpdate = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { data: productData } = useGetProductByIdQuery(params._id);
  const { data: categories = [] } = useFetchCategoriesQuery();

  const [uploadProductImage, { isLoading: uploading }] =
    useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    countInStock: "",
    image: "",
  });

  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (productData && productData._id) {
      setFormData({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category: productData.category?._id || "",
        brand: productData.brand,
        countInStock: productData.countInStock,
        image: productData.image,
      });
      setImagePreview(productData.image);
    }
  }, [productData]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("image", file);

      const uploadRes = await uploadProductImage(uploadFormData).unwrap();

      setFormData((prev) => ({
        ...prev,
        image: uploadRes.image,
      }));

      toast.success("Image uploaded successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Image upload failed. Try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      toast.error("Please upload an image", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    try {
      const result = await updateProduct({
        productId: params._id,
        ...formData,
      }).unwrap();

      toast.success("Product updated successfully!", {
        position: "top-right",
        autoClose: 2000,
      });

      navigate("/admin/allproductslist");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Product update failed. Try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleDelete = async () => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this product?",
      );
      if (!confirmed) return;

      await deleteProduct(params._id).unwrap();

      toast.success(`Product deleted successfully`, {
        position: "top-right",
        autoClose: 2000,
      });

      navigate("/admin/allproductslist");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Product deletion failed. Try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mt-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Update Product
              </h1>
              <p className="text-gray-600">Edit or delete product details</p>
            </div>

            {imagePreview && (
              <div className="mb-8 text-center">
                <div className="flex justify-center">
                  <img
                    src={imagePreview}
                    alt="product preview"
                    className="max-h-[300px] rounded-xl shadow-lg"
                  />
                </div>
              </div>
            )}

            <div className="mb-8">
              <label className="relative block border-2 border-dashed border-pink-300 rounded-2xl p-8 text-center cursor-pointer hover:bg-pink-50 transition bg-pink-50/50">
                <div className="flex flex-col items-center">
                  <svg
                    className="w-12 h-12 text-pink-500 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="text-gray-900 font-bold text-lg">
                    {uploading ? "Uploading..." : "Upload Product Image"}
                  </span>
                  <span className="text-gray-600 text-sm mt-1">
                    PNG, JPG up to 5MB
                  </span>
                </div>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-900 font-semibold mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-gray-900 font-semibold mb-2">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-900 font-semibold mb-2">
                    Price * ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-gray-900 font-semibold mb-2">
                    Stock Count
                  </label>
                  <input
                    type="number"
                    name="countInStock"
                    value={formData.countInStock}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-gray-900 font-semibold mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    {categories?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-900 font-semibold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-3 px-8 rounded-xl text-lg font-bold bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 disabled:opacity-50 transition text-white shadow-md"
                >
                  {uploading ? "Processing..." : "Update Product"}
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex-1 py-3 px-8 rounded-xl text-lg font-bold bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition text-white shadow-md"
                >
                  Delete Product
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProductUpdate;
