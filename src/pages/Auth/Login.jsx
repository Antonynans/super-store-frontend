import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex">
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-16">
        <div className="flex items-center gap-2.5 mb-10 lg:hidden">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
            <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
              <path
                d="M3 5h12M3 9h8M3 13h10"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-gray-900 font-bold text-xl tracking-tight">
            ShopNova
          </span>
        </div>

        <div className="w-full max-w-[400px]">
          <div className="mb-8">
            <h1 className="text-[28px] font-bold text-gray-900 tracking-tight mb-1.5">
              Welcome back
            </h1>
            <p className="text-gray-500 text-sm">
              Sign in to your account to continue shopping
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <form onSubmit={submitHandler} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-[11px] font-semibold text-gray-500 tracking-[2px] uppercase mb-2.5"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5
                    text-gray-900 text-sm placeholder:text-gray-400
                    focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:bg-white
                    transition-all duration-200"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label
                    htmlFor="password"
                    className="block text-[11px] font-semibold text-gray-500 tracking-[2px] uppercase"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 pr-12
                      text-gray-900 text-sm placeholder:text-gray-400
                      focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:bg-white
                      transition-all duration-200"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" />
                      </svg>
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98]
                  text-white font-semibold py-3.5 px-4 rounded-xl text-sm
                  transition-all duration-200 hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                  flex items-center justify-center gap-2 mt-1"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/40 border-t-white" />
                    Signing in…
                  </>
                ) : (
                  "Sign In →"
                )}
              </button>
            </form>
          </div>

          <p className="text-gray-500 text-sm text-center mt-6">
            Don&apos;t have an account?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Create one free
            </Link>
          </p>

          <div className="flex items-center justify-center gap-2 mt-8 opacity-50">
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-400"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <span className="text-gray-400 text-xs tracking-widest uppercase">
              256-bit SSL encrypted
            </span>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-14 overflow-hidden bg-blue-600">
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div
          className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 65%)",
          }}
        />
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
                <path
                  d="M3 5h12M3 9h8M3 13h10"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              ShopNova
            </span>
          </div>
        </div>

        <div className="relative z-10 -mt-16">
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-3.5 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-white text-xs font-semibold tracking-widest uppercase">
              Welcome back
            </span>
          </div>

          <h2 className="text-[52px] font-bold text-white leading-[1.08] tracking-tight mb-5">
            Your cart
            <br />
            is waiting.
          </h2>
          <p className="text-blue-100 text-base leading-relaxed max-w-[280px]">
            Sign in to pick up where you left off — orders, saved items, and
            exclusive deals.
          </p>

          <div className="flex gap-10 mt-12">
            {[
              { value: "50K+", label: "Customers" },
              { value: "4.9★", label: "Rating" },
              { value: "Free", label: "Returns" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-white font-bold text-[22px] leading-none">
                  {value}
                </p>
                <p className="text-blue-200 text-xs mt-1.5 tracking-wide uppercase">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 border-l-2 border-white/30 pl-4">
          <p className="text-blue-100 text-sm italic leading-relaxed">
            "Fastest checkout I've ever used. Orders arrive next day."
          </p>
          <p className="text-blue-200/60 text-xs mt-2">— Verified customer</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
