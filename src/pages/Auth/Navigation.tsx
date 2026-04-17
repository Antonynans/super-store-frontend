import { useState, useRef, useEffect } from "react";
import {
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
  AiOutlineMenu,
  AiOutlineClose,
} from "react-icons/ai";
import {
  FaUser,
  FaBox,
  FaTag,
  FaList,
  FaTachometerAlt,
  FaUsers,
  FaShoppingCart,
  FaSignOutAlt,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../redux/store";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { useGetCartQuery } from "../../redux/api/cartApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";
import { FiHeart } from "react-icons/fi";
import AnimatedBadge from "../../components/AnimatedBridge";
import { motion } from "framer-motion";
import { useGetWishlistQuery } from "../../redux/api/wishlistApiSlice";

const adminMenuItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: FaTachometerAlt },
  { to: "/admin/categorylist", label: "Categories", icon: FaTag },
  { to: "/admin/productlist", label: "Create Product", icon: FaBox },
  { to: "/admin/allproductslist", label: "All Products", icon: FaList },
  { to: "/admin/userlist", label: "Users", icon: FaUsers },
  { to: "/admin/orderlist", label: "Orders", icon: FaShoppingCart },
];

const Navigation = () => {
  const { userInfo } = useAppSelector((state) => state.auth);
  const { data: cart = {} } = useGetCartQuery(undefined, {
    skip: !userInfo,
  });
  const { data: wishlist } = useGetWishlistQuery(undefined, {
    skip: !userInfo,
  });

  const favoriteCount = wishlist?.products.length;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const cartItems = (cart as any)?.cartItems || [];
  const cartCount = cartItems.reduce((a: number, c: any) => a + c.qty, 0);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      )
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

  const desktopLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? "text-primary bg-primary-subtle font-semibold"
        : "text-text-secondary hover:text-primary hover:bg-surface-muted"
    }`;

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-primary-subtle text-primary font-semibold"
        : "text-text-secondary hover:bg-surface-muted"
    }`;

  const dropdownLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
      isActive
        ? "bg-primary-subtle text-primary font-semibold"
        : "text-text-secondary hover:bg-surface-muted"
    }`;

  return (
    <nav className="bg-white border-b border-border shadow-sm fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-2.5 flex-shrink-0 group"
          >
            <span className="text-[17px] font-bold text-text-primary tracking-tight">
              Shop<span className="text-primary">Nova</span>
            </span>
          </Link>

          <div className="flex">
            <div className="hidden md:flex items-center gap-2">
              <NavLink to="/shop" className={desktopLinkClass}>
                <AiOutlineShopping size={20} />
                <span>Shop</span>
              </NavLink>

              <NavLink
                to="/favorite"
                className={({ isActive }) =>
                  `${desktopLinkClass({ isActive })} relative`
                }
              >
                <motion.div
                  key={favoriteCount}
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 0.3 }}
                >
                  <FiHeart size={20} />
                </motion.div>
                <FavoritesCount />
              </NavLink>
            </div>

            <div className="hidden md:flex items-center gap-1">
              <NavLink
                to="/cart"
                className="relative flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-muted transition"
              >
                <motion.div
                  key={cartCount}
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.3 }}
                >
                  <AiOutlineShoppingCart size={20} />
                </motion.div>
                <AnimatedBadge value={cartCount} />
              </NavLink>

              {userInfo ? (
                <div className="relative ml-1" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((o) => !o)}
                    className={`flex items-center gap-3 px-3 py-1.5 rounded-full border transition ${
                      dropdownOpen
                        ? "border-primary bg-primary-subtle"
                        : "border-border hover:border-primary hover:bg-surface-muted"
                    }`}
                  >
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {userInfo.username?.charAt(0).toUpperCase()}
                    </div>

                    <span className="text-sm font-medium text-text-primary hidden lg:block truncate w-16">
                      {userInfo.username}
                    </span>

                    {dropdownOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-border py-1.5 overflow-hidden">
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-surface-muted transition-colors"
                      >
                        <div className="w-6 h-6 bg-primary-subtle rounded-full flex items-center justify-center flex-shrink-0">
                          <FaUser size={13} className="text-primary" />
                        </div>
                        <span className="font-medium">My Profile</span>
                      </Link>

                      {userInfo.isAdmin && (
                        <>
                          <div className="mx-3 my-1 border-t border-border" />
                          <p className="px-4 pt-1.5 pb-1 text-[10px] font-bold text-text-subtle tracking-widest uppercase">
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

                      <div className="mx-3 my-1 border-t border-border" />
                      <button
                        onClick={logoutHandler}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-danger hover:bg-danger-subtle transition-colors"
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
                    <AiOutlineLogin size={20} />
                    <span>Login</span>
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-[0_4px_14px_rgba(37,99,235,0.3)]"
                  >
                    <AiOutlineUserAdd size={20} />
                    <span>Register</span>
                  </NavLink>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <NavLink
              to="/favorite"
              className="relative p-2 text-text-secondary"
            >
              <motion.div
                key={favoriteCount}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 0.3 }}
              >
                <FiHeart size={20} />
              </motion.div>
              <FavoritesCount />
            </NavLink>
            <NavLink to="/cart" className="relative p-2 text-text-secondary">
              <motion.div
                key={cartCount}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.3 }}
              >
                <AiOutlineShoppingCart size={20} />
              </motion.div>
              <AnimatedBadge value={cartCount} />
            </NavLink>
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="p-2 rounded-lg text-text-secondary hover:text-primary hover:bg-primary-subtle transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? (
                <AiOutlineClose size={20} />
              ) : (
                <AiOutlineMenu size={20} />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 pt-3 pb-5 space-y-2 shadow-xl animate-slideDown">
          <NavLink
            to="/shop"
            className={mobileLinkClass}
            onClick={() => setMobileMenuOpen(false)}
          >
            <AiOutlineShopping size={20} />
            <span>Shop</span>
          </NavLink>
          <NavLink
            to="/favorite"
            className={({ isActive }) =>
              `${mobileLinkClass({ isActive })} relative`
            }
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              key={favoriteCount}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 0.3 }}
            >
              <FiHeart size={20} />
            </motion.div>
            <span>Favorites</span>
            <FavoritesCount />
          </NavLink>

          <div className="border-t border-border my-1 pt-1" />

          {userInfo ? (
            <>
              <div className="flex items-center gap-3 px-4 py-2.5">
                <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {userInfo.username?.charAt(0).toUpperCase()}
                </div>
                <div className="truncate">
                  <p className="text-sm font-semibold text-text-primary leading-tight">
                    {userInfo.username}
                  </p>
                  {userInfo.isAdmin && (
                    <p className="text-[11px] text-primary font-medium">
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
                <FaUser size={16} className="text-primary" />
                <span>My Profile</span>
              </NavLink>

              {userInfo.isAdmin && (
                <>
                  <p className="px-4 pt-2 pb-1 text-[10px] font-bold text-text-subtle tracking-widest uppercase">
                    Admin
                  </p>
                  {adminMenuItems.map(({ to, label, icon: Icon }) => (
                    <NavLink
                      key={to}
                      to={to}
                      className={mobileLinkClass}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon
                        size={16}
                        className="text-text-secondary flex-shrink-0"
                      />
                      <span>{label}</span>
                    </NavLink>
                  ))}
                </>
              )}

              <div className="border-t border-border my-1 pt-1" />
              <button
                onClick={() => {
                  logoutHandler();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-danger hover:bg-danger-subtle transition-colors"
              >
                <FaSignOutAlt size={20} />
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
                <AiOutlineLogin size={20} />
                <span>Login</span>
              </NavLink>
              <NavLink
                to="/register"
                className={mobileLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                <AiOutlineUserAdd size={20} />
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
