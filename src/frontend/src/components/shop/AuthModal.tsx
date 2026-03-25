import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Eye, EyeOff, Lock, Mail, User, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AuthUser {
  name: string;
  email: string;
}

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: (user: AuthUser) => void;
  defaultTab?: "login" | "signup";
}

export function AuthModal({
  open,
  onClose,
  onLogin,
  defaultTab = "login",
}: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "signup">(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});

  const resetForms = () => {
    setLoginForm({ email: "", password: "", rememberMe: true });
    setSignupForm({ name: "", email: "", password: "", confirm: "" });
    setLoginErrors({});
    setSignupErrors({});
    setShowPassword(false);
    setShowConfirm(false);
  };

  const handleClose = () => {
    resetForms();
    onClose();
  };

  const switchTab = (t: "login" | "signup") => {
    setTab(t);
    setLoginErrors({});
    setSignupErrors({});
  };

  const validateLogin = () => {
    const e: Record<string, string> = {};
    if (!loginForm.email.trim() || !loginForm.email.includes("@"))
      e.email = "Enter a valid email address";
    if (!loginForm.password.trim()) e.password = "Password is required";
    setLoginErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateSignup = () => {
    const e: Record<string, string> = {};
    if (!signupForm.name.trim()) e.name = "Full name is required";
    if (!signupForm.email.trim() || !signupForm.email.includes("@"))
      e.email = "Enter a valid email address";
    if (signupForm.password.length < 6)
      e.password = "Password must be at least 6 characters";
    if (signupForm.password !== signupForm.confirm)
      e.confirm = "Passwords do not match";
    setSignupErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;
    const stored = localStorage.getItem("shopzone_user");
    if (stored) {
      const user = JSON.parse(stored) as AuthUser;
      if (user.email !== loginForm.email) {
        setLoginErrors({ email: "No account found with this email" });
        return;
      }
    }
    const user: AuthUser = stored
      ? (JSON.parse(stored) as AuthUser)
      : { name: loginForm.email.split("@")[0], email: loginForm.email };
    if (loginForm.rememberMe) {
      localStorage.setItem("shopzone_user", JSON.stringify(user));
    }
    onLogin(user);
    toast.success(`Welcome back, ${user.name}! 👋`);
    handleClose();
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignup()) return;
    const user: AuthUser = {
      name: signupForm.name.trim(),
      email: signupForm.email.trim(),
    };
    localStorage.setItem("shopzone_user", JSON.stringify(user));
    onLogin(user);
    toast.success(`Welcome to ShopZone, ${user.name}! 🎉`);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        data-ocid="auth.dialog"
        className="sm:max-w-md p-0 overflow-hidden border-0 shadow-2xl"
        showCloseButton={false}
      >
        {/* Purple header */}
        <div className="relative bg-primary px-6 pt-8 pb-6">
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            data-ocid="auth.close_button"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-3">
            <User className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            {tab === "login" ? "Welcome back" : "Create account"}
          </h2>
          <p className="text-white/70 text-sm mt-1">
            {tab === "login"
              ? "Sign in to your ShopZone account"
              : "Join ShopZone and start shopping"}
          </p>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 bg-white/10 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => switchTab("login")}
              className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                tab === "login"
                  ? "bg-white text-primary"
                  : "text-white hover:bg-white/10"
              }`}
              data-ocid="auth.tab"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => switchTab("signup")}
              className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                tab === "signup"
                  ? "bg-white text-primary"
                  : "text-white hover:bg-white/10"
              }`}
              data-ocid="auth.tab"
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Form area */}
        <div className="px-6 py-5 bg-card">
          {tab === "login" ? (
            <form onSubmit={handleLogin} noValidate className="space-y-4">
              {/* Email */}
              <div className="space-y-1">
                <label
                  htmlFor="auth-login-email"
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="auth-login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm((p) => ({ ...p, email: e.target.value }))
                    }
                    className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all ${
                      loginErrors.email ? "border-destructive" : "border-border"
                    }`}
                    data-ocid="auth.input"
                  />
                </div>
                {loginErrors.email && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="auth.error_state"
                  >
                    {loginErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label
                  htmlFor="auth-login-password"
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="auth-login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm((p) => ({ ...p, password: e.target.value }))
                    }
                    className={`w-full pl-9 pr-10 py-2.5 rounded-lg border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all ${
                      loginErrors.password
                        ? "border-destructive"
                        : "border-border"
                    }`}
                    data-ocid="auth.input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {loginErrors.password && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="auth.error_state"
                  >
                    {loginErrors.password}
                  </p>
                )}
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={loginForm.rememberMe}
                  onChange={(e) =>
                    setLoginForm((p) => ({
                      ...p,
                      rememberMe: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 accent-primary"
                  data-ocid="auth.checkbox"
                />
                <span className="text-sm text-muted-foreground">
                  Remember me
                </span>
              </label>

              <button
                type="submit"
                className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all"
                data-ocid="auth.submit_button"
              >
                Sign In
              </button>

              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchTab("signup")}
                  className="text-primary font-semibold hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignup} noValidate className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label
                  htmlFor="auth-signup-name"
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="auth-signup-name"
                    type="text"
                    placeholder="Rahul Sharma"
                    value={signupForm.name}
                    onChange={(e) =>
                      setSignupForm((p) => ({ ...p, name: e.target.value }))
                    }
                    className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all ${
                      signupErrors.name ? "border-destructive" : "border-border"
                    }`}
                    data-ocid="auth.input"
                  />
                </div>
                {signupErrors.name && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="auth.error_state"
                  >
                    {signupErrors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label
                  htmlFor="auth-signup-email"
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="auth-signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={signupForm.email}
                    onChange={(e) =>
                      setSignupForm((p) => ({ ...p, email: e.target.value }))
                    }
                    className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all ${
                      signupErrors.email
                        ? "border-destructive"
                        : "border-border"
                    }`}
                    data-ocid="auth.input"
                  />
                </div>
                {signupErrors.email && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="auth.error_state"
                  >
                    {signupErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label
                  htmlFor="auth-signup-password"
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="auth-signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={signupForm.password}
                    onChange={(e) =>
                      setSignupForm((p) => ({ ...p, password: e.target.value }))
                    }
                    className={`w-full pl-9 pr-10 py-2.5 rounded-lg border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all ${
                      signupErrors.password
                        ? "border-destructive"
                        : "border-border"
                    }`}
                    data-ocid="auth.input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {signupErrors.password && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="auth.error_state"
                  >
                    {signupErrors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label
                  htmlFor="auth-signup-confirm"
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="auth-signup-confirm"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repeat your password"
                    value={signupForm.confirm}
                    onChange={(e) =>
                      setSignupForm((p) => ({ ...p, confirm: e.target.value }))
                    }
                    className={`w-full pl-9 pr-10 py-2.5 rounded-lg border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all ${
                      signupErrors.confirm
                        ? "border-destructive"
                        : "border-border"
                    }`}
                    data-ocid="auth.input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirm ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {signupErrors.confirm && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="auth.error_state"
                  >
                    {signupErrors.confirm}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all"
                data-ocid="auth.submit_button"
              >
                Create Account
              </button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchTab("login")}
                  className="text-primary font-semibold hover:underline"
                >
                  Log In
                </button>
              </p>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
