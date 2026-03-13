import { useState, useRef, useEffect } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
  AiOutlineMenu,
  AiOutlineClose,
} from "react-icons/ai";
import {
  FaHeart,
  FaUser,
  FaBox,
  FaTag,
  FaList,
  FaTachometerAlt,
  FaUsers,
  FaShoppingCart,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { useGetCartQuery } from "../../redux/api/cartApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";

const adminMenuItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: FaTachometerAlt },
  { to: "/admin/categorylist", label: "Categories", icon: FaTag },
  { to: "/admin/productlist", label: "Create Product", icon: FaBox },
  { to: "/admin/allproductslist", label: "All Products", icon: FaList },
  { to: "/admin/userlist", label: "Users", icon: FaUsers },
  { to: "/admin/orderlist", label: "Orders", icon: FaShoppingCart },
];

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: cart = {} } = useGetCartQuery(undefined, {
    skip: !userInfo,
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    if (dropdownOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const cartItems = cart.cartItems || [];
  const cartCount = cartItems.reduce((a, c) => a + c.qty, 0);

  const desktopLinkClass = ({ isActive }) =>
    `relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? "text-blue-600 bg-blue-50 font-semibold"
        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-blue-50 text-blue-600 font-semibold"
        : "text-gray-600 hover:bg-gray-50"
    }`;

  const dropdownLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
      isActive
        ? "bg-blue-50 text-blue-600 font-semibold"
        : "text-gray-700 hover:bg-gray-50"
    }`;

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-2.5 flex-shrink-0 group"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition-colors duration-200">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path
                  d="M3 5h12M3 9h8M3 13h10"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="text-[17px] font-bold text-gray-900 tracking-tight">
              Shop<span className="text-blue-600">Nova</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-0.5">
            <NavLink to="/" end className={desktopLinkClass}>
              <AiOutlineHome size={18} />
              <span>Home</span>
            </NavLink>

            <NavLink to="/shop" className={desktopLinkClass}>
              <AiOutlineShopping size={18} />
              <span>Shop</span>
            </NavLink>

            <NavLink
              to="/favorite"
              className={({ isActive }) =>
                `${desktopLinkClass({ isActive })} relative`
              }
            >
              <FaHeart size={15} />
              <span>Favorites</span>
              <FavoritesCount />
            </NavLink>
          </div>

          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/cart" className="relative p-2 text-gray-600">
              <AiOutlineShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-blue-600 text-white text-[9px] font-bold rounded-full min-w-[15px] min-h-[15px] flex items-center justify-center px-0.5 leading-none">
                  {cartCount}
                </span>
              )}
            </NavLink>

            {userInfo ? (
              <div className="relative ml-1" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className={`flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border transition-all duration-200 ${
                    dropdownOpen
                      ? "border-blue-300 bg-blue-50"
                      : "border-gray-200 hover:border-blue-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {userInfo.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-700 text-sm font-medium max-w-[90px] truncate">
                    {userInfo.username}
                  </span>
                  <svg
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 overflow-hidden">
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaUser size={11} className="text-blue-600" />
                      </div>
                      <span className="font-medium">My Profile</span>
                    </Link>

                    {userInfo.isAdmin && (
                      <>
                        <div className="mx-3 my-1 border-t border-gray-100" />
                        <p className="px-4 pt-1.5 pb-1 text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                          Admin
                        </p>
                        {adminMenuItems.map(({ to, label, icon: Icon }) => (
                          <NavLink
                            key={to}
                            to={to}
                            onClick={() => setDropdownOpen(false)}
                            className={dropdownLinkClass}
                          >
                            <Icon size={13} className="flex-shrink-0" />
                            {label}
                          </NavLink>
                        ))}
                      </>
                    )}

                    <div className="mx-3 my-1 border-t border-gray-100" />
                    <button
                      onClick={logoutHandler}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <FaSignOutAlt size={13} className="flex-shrink-0" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-1">
                <NavLink to="/login" className={desktopLinkClass}>
                  <AiOutlineLogin size={18} />
                  <span>Login</span>
                </NavLink>
                <NavLink
                  to="/register"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-[0_4px_14px_rgba(37,99,235,0.3)]"
                >
                  <AiOutlineUserAdd size={18} />
                  <span>Register</span>
                </NavLink>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <NavLink to="/cart" className="relative p-2 text-gray-600">
              <AiOutlineShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-blue-600 text-white text-[9px] font-bold rounded-full min-w-[15px] min-h-[15px] flex items-center justify-center px-0.5 leading-none">
                  {cartCount}
                </span>
              )}
            </NavLink>
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? (
                <AiOutlineClose size={22} />
              ) : (
                <AiOutlineMenu size={22} />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-5 space-y-1 shadow-lg">
          <NavLink
            to="/"
            end
            className={mobileLinkClass}
            onClick={() => setMobileMenuOpen(false)}
          >
            <AiOutlineHome size={19} />
            <span>Home</span>
          </NavLink>
          <NavLink
            to="/shop"
            className={mobileLinkClass}
            onClick={() => setMobileMenuOpen(false)}
          >
            <AiOutlineShopping size={19} />
            <span>Shop</span>
          </NavLink>
          <NavLink
            to="/favorite"
            className={({ isActive }) =>
              `${mobileLinkClass({ isActive })} relative`
            }
            onClick={() => setMobileMenuOpen(false)}
          >
            <FaHeart size={16} />
            <span>Favorites</span>
            <FavoritesCount />
          </NavLink>

          <div className="border-t border-gray-100 my-1 pt-1" />

          {userInfo ? (
            <>
              <div className="flex items-center gap-3 px-4 py-2.5">
                <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {userInfo.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 leading-tight">
                    {userInfo.username}
                  </p>
                  {userInfo.isAdmin && (
                    <p className="text-[11px] text-blue-600 font-medium">
                      Admin
                    </p>
                  )}
                </div>
              </div>

              <NavLink
                to="/profile"
                className={mobileLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaUser size={16} className="text-blue-600" />
                <span>My Profile</span>
              </NavLink>

              {userInfo.isAdmin && (
                <>
                  <p className="px-4 pt-2 pb-1 text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                    Admin
                  </p>
                  {adminMenuItems.map(({ to, label, icon: Icon }) => (
                    <NavLink
                      key={to}
                      to={to}
                      className={mobileLinkClass}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon size={16} className="text-gray-500 flex-shrink-0" />
                      <span>{label}</span>
                    </NavLink>
                  ))}
                </>
              )}

              <div className="border-t border-gray-100 my-1 pt-1" />
              <button
                onClick={() => {
                  logoutHandler();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <FaSignOutAlt size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={mobileLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                <AiOutlineLogin size={19} />
                <span>Login</span>
              </NavLink>
              <NavLink
                to="/register"
                className={mobileLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                <AiOutlineUserAdd size={19} />
                <span>Register</span>
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navigation;
