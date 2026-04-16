import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

const Register = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useAppSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const res = await register({ username, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("Account created successfully");
    } catch (err: any) {
      console.log(err);
      toast.error(err.data.message);
    }
  };

  const strength = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = [
    "",
    "bg-danger",
    "bg-amber-500",
    "bg-primary-light",
    "bg-emerald-500",
  ][strength];
  const strengthText = [
    "",
    "text-danger",
    "text-amber-500",
    "text-primary",
    "text-emerald-600",
  ][strength];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex">
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
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 65%)",
          }}
        />
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />

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
              Join for free
            </span>
          </div>

          <h2 className="text-[52px] font-bold text-white leading-[1.08] tracking-tight mb-5">
            Shop smarter,
            <br />
            save more.
          </h2>
          <p className="text-primary-subtle text-base leading-relaxed max-w-[280px]">
            Create your account in seconds and unlock thousands of products,
            exclusive deals, and fast delivery.
          </p>

          <ul className="mt-10 space-y-3.5">
            {[
              "Free delivery on orders over $50",
              "Exclusive member-only discounts",
              "Easy 30-day returns",
              "Track orders in real time",
            ].map((perk) => (
              <li key={perk} className="flex items-center gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="white"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="text-primary-subtle text-sm">{perk}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 border-l-2 border-white/30 pl-4">
          <p className="text-primary-subtle text-sm italic leading-relaxed">
            "Set up my account in under a minute. Already placed 3 orders!"
          </p>
          <p className="text-primary-subtle/60 text-xs mt-2">— New customer</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-12">
        <div className="flex items-center gap-2.5 mb-8 lg:hidden">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md">
            <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
              <path
                d="M3 5h12M3 9h8M3 13h10"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-text-primary font-bold text-xl tracking-tight">
            ShopNova
          </span>
        </div>

        <div className="w-full max-w-[400px]">
          <div className="mb-7">
            <h1 className="text-[28px] font-bold text-text-primary tracking-tight mb-1.5">
              Create account
            </h1>
            <p className="text-text-secondary text-sm">
              Fill in your details to get started
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
            <form onSubmit={submitHandler} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-[11px] font-semibold text-text-secondary tracking-[2px] uppercase mb-2.5"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full bg-surface-muted border border-border rounded-xl px-4 py-3.5
                    text-text-primary text-sm placeholder:text-text-subtle
                    focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/10 focus:bg-white
                    transition-all duration-200"
                  placeholder="Your full name"
                  value={username}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-[11px] font-semibold text-text-secondary tracking-[2px] uppercase mb-2.5"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full bg-surface-muted border border-border rounded-xl px-4 py-3.5
                    text-text-primary text-sm placeholder:text-text-subtle
                    focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/10 focus:bg-white
                    transition-all duration-200"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-[11px] font-semibold text-text-secondary tracking-[2px] uppercase mb-2.5"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="w-full bg-surface-muted border border-border rounded-xl px-4 py-3.5 pr-12
                      text-text-primary text-sm placeholder:text-text-subtle
                      focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-light/10 focus:bg-white
                      transition-all duration-200"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-subtle hover:text-text-secondary transition-colors"
                    aria-label="Toggle password"
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

                {password && (
                  <div className="mt-2.5">
                    <div className="flex gap-1 mb-1.5">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            i <= strength ? strengthColor : "bg-border"
                          }`}
                        />
                      ))}
                    </div>
                    <p
                      className={`text-[11px] font-semibold tracking-wide ${strengthText}`}
                    >
                      {strengthLabel}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-[11px] font-semibold text-text-secondary tracking-[2px] uppercase mb-2.5"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    id="confirmPassword"
                    className={`w-full bg-surface-muted border rounded-xl px-4 py-3.5 pr-12
                      text-text-primary text-sm placeholder:text-text-subtle
                      focus:outline-none focus:ring-2 transition-all duration-200
                      ${
                        confirmPassword && password !== confirmPassword
                          ? "border-danger focus:border-danger focus:ring-danger/10"
                          : confirmPassword && password === confirmPassword
                            ? "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/10"
                            : "border-border focus:border-primary-light focus:ring-primary-light/10 focus:bg-white"
                      }`}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />

                  {confirmPassword && (
                    <div className="absolute right-10 top-1/2 -translate-y-1/2">
                      {password === confirmPassword ? (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2.5"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      ) : (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="2.5"
                        >
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-subtle hover:text-text-secondary transition-colors"
                    aria-label="Toggle confirm password"
                  >
                    {showConfirm ? (
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
                className="w-full bg-primary hover:bg-primary active:scale-[0.98]
                  text-white font-semibold py-3.5 px-4 rounded-xl text-sm
                  transition-all duration-200 hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                  flex items-center justify-center gap-2 mt-1"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/40 border-t-white" />
                    Creating account…
                  </>
                ) : (
                  "Create Account →"
                )}
              </button>
            </form>
          </div>

          <p className="text-text-secondary text-sm text-center mt-6">
            Already have an account?{" "}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="text-primary hover:text-primary font-semibold transition-colors"
            >
              Sign in
            </Link>
          </p>

          <div className="flex items-center justify-center gap-2 mt-8 opacity-40">
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-text-subtle"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <span className="text-text-subtle text-xs tracking-widest uppercase">
              256-bit SSL encrypted
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
