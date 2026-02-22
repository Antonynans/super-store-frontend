import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
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

  // Queries
  const { data: productData } = useGetProductByIdQuery(params._id);
  const { data: categories = [] } = useFetchCategoriesQuery();

  // Mutations
  const [uploadProductImage, { isLoading: uploading }] =
    useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  // State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    quantity: "",
    brand: "",
    countInStock: "",
    image: "", // Cloudinary URL
  });

  const [imagePreview, setImagePreview] = useState("");

  // Update form when product data loads
  useEffect(() => {
    if (productData && productData._id) {
      setFormData({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category: productData.category?._id || "",
        quantity: productData.quantity,
        brand: productData.brand,
        countInStock: productData.countInStock,
        image: productData.image,
      });
      setImagePreview(productData.image);
    }
  }, [productData]);

  // Handle file upload to Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    try {
      // Create FormData for file upload
      const uploadFormData = new FormData();
      uploadFormData.append("image", file);

      // Upload to Cloudinary
      const uploadRes = await uploadProductImage(uploadFormData).unwrap();

      // Set the Cloudinary URL in form data
      setFormData((prev) => ({
        ...prev,
        image: uploadRes.image, // Cloudinary URL
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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
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
      // Send plain object to backend (NOT FormData)
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

  // Handle product deletion
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
      <div className="container xl:mx-[9rem] sm:mx-[0]">
        <div className="flex flex-col md:flex-row">
          <AdminMenu />
          <div className="md:w-3/4 p-3">
            <div className="h-12 text-white text-2xl font-bold mb-6">
              Update / Delete Product
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="text-center mb-6">
                <img
                  src={imagePreview}
                  alt="product preview"
                  className="block mx-auto w-full h-[300px] object-cover rounded-lg"
                />
              </div>
            )}

            {/* Image Upload */}
            <div className="mb-6">
              <label className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 block w-full text-center rounded-lg cursor-pointer font-bold transition">
                {uploading ? "Uploading..." : "Upload Image"}
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name and Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white font-semibold block mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-white font-semibold block mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    className="w-full p-3 border rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Quantity and Brand */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white font-semibold block mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full p-3 border rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-white font-semibold block mb-2">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-white font-semibold block mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full p-3 border rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Stock and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white font-semibold block mb-2">
                    Count In Stock
                  </label>
                  <input
                    type="number"
                    name="countInStock"
                    value={formData.countInStock}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-white font-semibold block mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {categories?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-3 px-6 rounded-lg text-white font-bold bg-green-600 hover:bg-green-700 disabled:opacity-50 transition"
                >
                  Update Product
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex-1 py-3 px-6 rounded-lg text-white font-bold bg-red-600 hover:bg-red-700 transition"
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
