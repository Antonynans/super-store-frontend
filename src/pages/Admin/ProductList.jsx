import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
} from "../../redux/api/productApiSlice";
import { useUploadProductImageMutation } from "../../redux/api/uploadApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const ProductList = () => {
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
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories = [] } = useFetchCategoriesQuery();

  // ✅ FIX 1: Handle image upload properly
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
      setUploading(true);

      const uploadFormData = new FormData();
      uploadFormData.append("image", file);

      const res = await uploadProductImage(uploadFormData).unwrap();

      // ✅ FIX 2: Save Cloudinary URL to formData, not just image state
      setFormData((prev) => ({
        ...prev,
        image: res.image, // Cloudinary URL
      }));

      toast.success("Image uploaded successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error?.data?.message || "Image upload failed", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setUploading(false);
    }
  };

  // ✅ FIX 3: Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ FIX 4: Send plain object, NOT FormData
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.price || !formData.category || !formData.image) {
      toast.error("Please fill all required fields and upload an image", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    try {
      // ✅ Send plain object, not FormData
      const data = await createProduct(formData).unwrap();

      toast.success(`${data.name} created successfully!`, {
        position: "top-right",
        autoClose: 2000,
      });

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        quantity: "",
        brand: "",
        countInStock: "",
        image: "",
      });
      setImagePreview("");

      navigate("/admin/allproductslist");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.data?.message || "Product creation failed", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="container xl:mx-[9rem] sm:mx-[0]">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="md:w-3/4 p-3">
          <div className="h-12 text-white text-2xl font-bold mb-6">
            Create Product
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="text-center mb-6">
              <img
                src={imagePreview}
                alt="product preview"
                className="block mx-auto max-h-[300px] rounded-lg"
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
          <form onSubmit={handleSubmit} className="space-y-4 p-3">
            {/* Name and Price */}
            <div className="flex flex-wrap gap-10">
              <div className="flex-1">
                <label htmlFor="name" className="text-white font-semibold">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="p-4 mt-2 w-full border rounded-lg bg-[#101011] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Product name"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="price" className="text-white font-semibold">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  className="p-4 mt-2 w-full border rounded-lg bg-[#101011] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Quantity and Brand */}
            <div className="flex flex-wrap gap-10">
              <div className="flex-1">
                <label htmlFor="quantity" className="text-white font-semibold">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="1"
                  className="p-4 mt-2 w-full border rounded-lg bg-[#101011] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="brand" className="text-white font-semibold">
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="p-4 mt-2 w-full border rounded-lg bg-[#101011] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brand name"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="text-white font-semibold">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="p-2 mt-2 bg-[#101011] border rounded-lg w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Product description"
              />
            </div>

            {/* Stock and Category */}
            <div className="flex flex-wrap gap-10">
              <div className="flex-1">
                <label htmlFor="countInStock" className="text-white font-semibold">
                  Count In Stock
                </label>
                <input
                  type="number"
                  name="countInStock"
                  value={formData.countInStock}
                  onChange={handleInputChange}
                  className="p-4 mt-2 w-full border rounded-lg bg-[#101011] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              <div className="flex-1">
                <label htmlFor="category" className="text-white font-semibold">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="p-4 mt-2 w-full border rounded-lg bg-[#101011] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading}
              className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-green-600 hover:bg-green-700 disabled:opacity-50 transition text-white"
            >
              Create Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductList;