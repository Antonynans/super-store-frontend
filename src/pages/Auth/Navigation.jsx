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
  FaCog,
  FaBox,
  FaTag,
  FaList,
  FaTachometerAlt,
  FaUsers,
  FaShoppingCart,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";

const menuItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: FaTachometerAlt },
  { to: "/admin/categorylist", label: "Categories", icon: FaTag },
  { to: "/admin/productlist", label: "Create Product", icon: FaBox },
  { to: "/admin/allproductslist", label: "All Products", icon: FaList },
  { to: "/admin/userlist", label: "Users", icon: FaUsers },
  { to: "/admin/orderlist", label: "Orders", icon: FaShoppingCart },
];

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [dropdownOpen]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const navItemClass =
    "flex items-center gap-2 text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-blue-50";
  const mobileNavItemClass =
    "flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors font-medium";
  const adminItemClass =
    "block px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors";

  return (
    <nav
      className="bg-white shadow-md fixed top-0 w-full z-50 border-b border-gray-200"
      id="navigation-container"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="text-2xl font-bold text-blue-600 hover:opacity-80 transition-opacity"
          >
            SuperStore
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className={navItemClass}>
              <AiOutlineHome size={20} />
              <span>Home</span>
            </Link>

            <Link to="/shop" className={navItemClass}>
              <AiOutlineShopping size={20} />
              <span>Shop</span>
            </Link>

            <Link to="/favorite" className={`${navItemClass} relative`}>
              <FaHeart size={18} />
              <span>Favorites</span>
              <FavoritesCount />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/cart" className="hidden md:flex relative items-center">
              <div className={navItemClass}>
                <AiOutlineShoppingCart size={20} />
                <span>Cart</span>
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 right-0 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.reduce((a, c) => a + c.qty, 0)}
                  </span>
                )}
              </div>
            </Link>

            <div className="hidden md:block relative" ref={dropdownRef}>
              {userInfo ? (
                <>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {userInfo.username?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-700 font-medium">
                      {userInfo.username}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 text-gray-600 transition-transform ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 overflow-hidden">
                      <Link
                        to="/profile"
                        className={`${adminItemClass} flex items-center gap-2 border-b border-gray-100`}
                      >
                        <FaUser size={16} className="text-blue-600" />
                        <span>My Profile</span>
                      </Link>

                      {userInfo.isAdmin && (
                        <>
                          <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wide">
                            Admin Menu
                          </div>
                          <ul className="list-none space-y-2">
                            {menuItems.map((item) => {
                              const Icon = item.icon;
                              return (
                                <li key={item.to}>
                                  <NavLink
                                    to={item.to}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={({ isActive }) =>
                                      `flex items-center gap-3 py-3 px-4 rounded-lg font-semibold transition-colors ${
                                        isActive
                                          ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md"
                                          : "text-gray-700 hover:bg-gray-100"
                                      }`
                                    }
                                  >
                                    <Icon className="w-5 h-5" />
                                    {item.label}
                                  </NavLink>
                                </li>
                              );
                            })}
                          </ul>
                          <hr className="my-2" />
                        </>
                      )}

                      <button
                        onClick={logoutHandler}
                        className={`${adminItemClass} w-full text-left flex items-center gap-2 text-red-600 hover:bg-red-50`}
                      >
                        <FaSignOutAlt size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className={navItemClass}>
                    <AiOutlineLogin size={20} />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <AiOutlineUserAdd size={20} />
                    <span>Register</span>
                  </Link>
                </div>
              )}
            </div>

            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-gray-700 hover:text-blue-600 transition-colors"
            >
              {mobileMenuOpen ? (
                <AiOutlineClose size={24} />
              ) : (
                <AiOutlineMenu size={24} />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white py-4 space-y-2">
            <Link to="/" className={mobileNavItemClass}>
              <AiOutlineHome size={20} />
              <span>Home</span>
            </Link>

            <Link to="/shop" className={mobileNavItemClass}>
              <AiOutlineShopping size={20} />
              <span>Shop</span>
            </Link>

            <Link to="/favorite" className={`${mobileNavItemClass} relative`}>
              <FaHeart size={18} />
              <span>Favorites</span>
              <FavoritesCount />
            </Link>

            <Link to="/cart" className={mobileNavItemClass}>
              <AiOutlineShoppingCart size={20} />
              <div className="flex items-center gap-2">
                <span>Cart</span>
                {cartItems.length > 0 && (
                  <span className="bg-blue-600 text-white text-xs font-bold rounded-full px-2 py-1">
                    {cartItems.reduce((a, c) => a + c.qty, 0)}
                  </span>
                )}
              </div>
            </Link>

            <hr className="my-2" />

            {userInfo ? (
              <>
                <Link to="/profile" className={mobileNavItemClass}>
                  <FaUser size={20} className="text-blue-600" />
                  <span>Profile</span>
                </Link>
                {userInfo.isAdmin && (
                  <>
                    <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Admin
                    </div>
                    <Link to="/admin/dashboard" className={mobileNavItemClass}>
                      <FaCog size={20} className="text-purple-600" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/admin/productlist"
                      className={mobileNavItemClass}
                    >
                      <span>Products</span>
                    </Link>
                    <Link
                      to="/admin/categorylist"
                      className={mobileNavItemClass}
                    >
                      <span>Categories</span>
                    </Link>
                  </>
                )}
                <hr className="my-2" />
                <button
                  onClick={logoutHandler}
                  className={`${mobileNavItemClass} w-full text-left text-red-600 hover:bg-red-50`}
                >
                  <FaSignOutAlt size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={mobileNavItemClass}>
                  <AiOutlineLogin size={20} />
                  <span>Login</span>
                </Link>
                <Link to="/register" className={mobileNavItemClass}>
                  <AiOutlineUserAdd size={20} />
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
