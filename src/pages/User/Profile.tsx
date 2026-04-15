import { FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { useGetWishlistQuery } from "../../redux/api/wishlistApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import UserOrder from "./UserOrder";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useAddToCartMutation } from "../../redux/api/cartApiSlice";
import { useRemoveFromWishlistMutation } from "../../redux/api/wishlistApiSlice";
import ProductCard from "../Products/ProductCard";
import { useAppSelector } from "../../redux/store";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [activeTab, setActiveTab] = useState("Orders");
  const tabs = ["Orders", "Wishlist", "Settings"];

  const { userInfo } = useAppSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  const {
    data: wishlist,
    isLoading: loadingWishlist,
    error: wishlistError,
  } = useGetWishlistQuery();
  const [addToCart] = useAddToCartMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  useEffect(() => {
    setUserName(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.username]);

  useEffect(() => {
    if (wishlistError) {
      toast.error(
        (wishlistError as any)?.data?.message || "Failed to load wishlist",
      );
    }
  }, [wishlistError]);

  const dispatch = useDispatch();

  const submitHandler = async (e:FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const updateData: any = {
          _id: userInfo._id,
          username,
          email,
        };
        if (password) {
          updateData.password = password;
        }
        const res = await updateProfile(updateData).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (err:any) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-surface-muted">
      <div className=" max-w-7xl mx-auto px-4 lg:flex gap-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {userInfo?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {userInfo?.username}
            </h3>
            <p className="text-sm text-text-secondary">{userInfo?.email}</p>
            <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>
              Member since January 2025
            </p>
          </div>
        </div>
        <div className="pt-4 ">
          <p className="text-xs text-text-secondary uppercase font-semibold mb-2">
            Account Status
          </p>
          <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
            Active
          </span>
          {userInfo?.isAdmin && (
            <span className="ml-2 inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">
              Admin
            </span>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div
          style={{
            display: "flex",
            gap: 0,
            borderBottom: "1px solid #e5e7eb",
            marginBottom: 32,
          }}
        >
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              style={{
                padding: "12px 24px",
                border: "none",
                background: "none",
                fontWeight: activeTab === t ? 700 : 500,
                fontSize: 14,
                cursor: "pointer",
                color: activeTab === t ? "#2563eb" : "#6b7280",
                borderBottom:
                  activeTab === t
                    ? "2px solid #2563eb"
                    : "2px solid transparent",
                transition: "all 0.2s",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {activeTab === "Orders" && (
          <div>
            <UserOrder />
          </div>
        )}

        {activeTab === "Wishlist" && (
          <div className="pb-12">
            {loadingWishlist ? (
              <div className="flex justify-center items-center py-12">
                <Loader />
              </div>
            ) : !wishlist?.products || wishlist.products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-text-secondary mb-6">
                  Your wishlist is empty
                </p>
                <Link
                  to="/shop"
                  className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlist?.products.map((product) => (
                  <div key={product._id}>
                    <ProductCard p={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "Settings" && (
          <div className="max-w-7xl mx-auto px-4 pb-12">
            <div className="">
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-8">
                  Update Profile
                </h2>

                <form onSubmit={submitHandler} className="space-y-6">
                  <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Username *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your username"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        value={username}
                        onChange={(e) => setUserName(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter new password (optional)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <p className="text-xs text-text-secondary mt-1">
                        Leave blank to keep current password
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={loadingUpdateProfile}
                      className=" bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loadingUpdateProfile ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Updating...
                        </>
                      ) : (
                        "Update Profile"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
