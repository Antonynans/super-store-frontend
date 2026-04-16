import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateProductMutation } from "../../redux/api/productApiSlice";
import { useUploadProductImageMutation } from "../../redux/api/uploadApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";

const ProductList = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    countInStock: "",
    images: [] as string[],
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories = [] } = useFetchCategoriesQuery();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setImagePreviews(files.map((file) => URL.createObjectURL(file)));

    try {
      setUploading(true);

      const uploadedImages: string[] = [];

      for (const file of files) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        const res = (await uploadProductImage(
          uploadFormData,
        ).unwrap()) as unknown as {
          url: string;
        };

        uploadedImages.push(res.url);
      }

      setFormData((prev) => ({
        ...prev,
        images: uploadedImages,
      }));

      toast.success("Images uploaded successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error: unknown) {
      console.error("Upload error:", error);

      const err = error as { data?: { message?: string } };

      toast.error(err?.data?.message || "Image upload failed", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.price ||
      !formData.category ||
      formData.images.length === 0
    ) {
      toast.error(
        "Please fill all required fields and upload at least one image",
        {
          position: "top-right",
          autoClose: 2000,
        },
      );
      return;
    }

    try {
      const data = await createProduct({
        ...formData,
        price: Number(formData.price),
        countInStock: Number(formData.countInStock),
      }).unwrap();

      toast.success(`${data.name} created successfully!`, {
        position: "top-right",
        autoClose: 2000,
      });

      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        brand: "",
        countInStock: "",
        images: [],
      });
      setImagePreviews([]);

      navigate("/admin/allproductslist");
    } catch (error) {
      console.error("Error:", error);
      toast.error((error as any)?.data?.message || "Product creation failed", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-muted to-surface-subtle p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mt-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-text-primary mb-2">
              Create New Product
            </h1>
            <p className="text-text-secondary">
              Add a new product to your store
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-8">
            {imagePreviews.length > 0 && (
              <div className="mb-8 text-center">
                <div className="flex flex-wrap justify-center gap-4">
                  {imagePreviews.map((preview, index) => (
                    <img
                      key={`${preview}-${index}`}
                      src={preview}
                      alt={`product preview ${index + 1}`}
                      className="h-32 w-32 rounded-xl object-cover shadow-lg"
                    />
                  ))}
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
                  <span className="text-text-primary font-bold text-lg">
                    {uploading ? "Uploading..." : "Upload Product Images"}
                  </span>
                  <span className="text-text-secondary text-sm mt-1">
                    PNG, JPG up to 5MB
                  </span>
                </div>
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  multiple
                  className="hidden"
                />
              </label>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-text-primary font-semibold mb-2"
                  >
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-border-dark rounded-xl bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="price"
                    className="block text-text-primary font-semibold mb-2"
                  >
                    Price * ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    className="w-full px-4 py-3 border border-border-dark rounded-xl bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="brand"
                    className="block text-text-primary font-semibold mb-2"
                  >
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border-dark rounded-xl bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Enter brand name"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-text-primary font-semibold mb-2"
                >
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-border-dark rounded-xl bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Describe your product..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="countInStock"
                    className="block text-text-primary font-semibold mb-2"
                  >
                    Stock Count
                  </label>
                  <input
                    type="number"
                    name="countInStock"
                    value={formData.countInStock}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border-dark rounded-xl bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-text-primary font-semibold mb-2"
                  >
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={() => handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-border-dark rounded-xl bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-3 px-8 rounded-xl text-lg font-bold bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 disabled:opacity-50 transition text-white shadow-md"
                >
                  {uploading ? "Processing..." : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
