import { FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import UserOrder from "./UserOrder";
import { useAppSelector } from "../../redux/store";
import Favorites from "../Products/Favorites";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [activeTab, setActiveTab] = useState("Orders");
  const tabs = ["Orders", "Wishlist", "Settings"];
  const [showHeader, setShowHeader] = useState(true);

  const { userInfo } = useAppSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    setUserName(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.username]);

  const dispatch = useDispatch();

  const submitHandler = async (e: FormEvent) => {
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
      } catch (err: any) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-surface-muted py-4">
      <div className=" max-w-7xl mx-auto px-4 lg:flex gap-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center  text-2xl font-bold">
            {userInfo?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="w-4/5">
            <h3 className="text-lg font-semibold text-text-primary truncate">
              {userInfo?.username}
            </h3>
            <p className="text-sm text-text-secondary">{userInfo?.email}</p>
          </div>
        </div>
        <div className="pt-4 ">
          <p className="text-xs text-text-secondary uppercase font-semibold mb-2">
            Account Status
          </p>
          <span className="inline-block bg-amber-light text-amber-dark text-xs font-semibold px-3 py-1 rounded-full">
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
          <Favorites setShowHeader={setShowHeader} showHeader={false} />
        )}

        {activeTab === "Settings" && (
          <div className="max-w-7xl mx-auto px-4 pb-12">
            <div className="">
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-semibold text-text-primary mb-8">
                  Update Profile
                </h2>

                <form onSubmit={submitHandler} className="space-y-6">
                  <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
                    <div>
                      <label className="block text-sm font-semibold text-text-secondary mb-2">
                        Username *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your username"
                        className="w-full px-4 py-3 border border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light transition"
                        value={username}
                        onChange={(e) => setUserName(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-text-secondary mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 border border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light transition"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-text-secondary mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter new password (optional)"
                        className="w-full px-4 py-3 border border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light transition"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <p className="text-xs text-text-secondary mt-1">
                        Leave blank to keep current password
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-text-secondary mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full px-4 py-3 border border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light transition"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={loadingUpdateProfile}
                      className=" bg-primary hover:bg-primary text-white font-semibold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
