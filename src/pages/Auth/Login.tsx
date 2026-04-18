import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useAppSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo && userInfo.token) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const res = await login({ email, password }).unwrap();
      if (!res) return;
      dispatch(setCredentials(res));
      navigate(redirect);
    } catch (err: any) {
      setErrorMessage(err?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex">
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-[400px]">
          <div className="mb-8">
            <h1 className="text-[28px] font-bold text-text-primary mb-1.5">
              Welcome back
            </h1>
            <p className="text-text-secondary text-sm">
              Sign in to your account to continue shopping
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
            <form onSubmit={submitHandler} className="space-y-5">
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className={`w-full border rounded-xl px-4 py-3 text-sm transition
                    ${errorMessage ? "border-red-300 focus:ring-red-200" : "border-border focus:ring-primary-light"}
                  `}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage("");
                  }}
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`w-full border rounded-xl px-4 py-3 pr-12 text-sm transition
                      ${errorMessage ? "border-red-300 focus:ring-red-200" : "border-border focus:ring-primary-light"}
                    `}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMessage("");
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <FiEye /> : <FiEyeOff />}
                  </button>
                </div>
              </div>

              <button
                disabled={isLoading || !email || !password}
                type="submit"
                className="w-full bg-primary text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>

          <p className="text-sm text-center mt-6">
            Don&apos;t have an account?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="text-primary font-semibold"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-14 overflow-hidden bg-primary">
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
          <p className="text-primary-subtle text-base leading-relaxed max-w-[280px]">
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
                <p className="text-primary-subtle text-xs mt-1.5 tracking-wide uppercase">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 border-l-2 border-white/30 pl-4">
          <p className="text-primary-subtle text-sm italic leading-relaxed">
            &quot;Fastest checkout I&apos;ve ever used. Orders arrive next
            day.&quot;
          </p>
          <p className="text-primary-subtle/60 text-xs mt-2">
            — Verified customer
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
