"use client";

import { registerUser } from "@/actions/auth.actions";
import { useState } from "react";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password must be at most 100 characters")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[0-9]/, "Password must contain a number");

const registerSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ),
    email: z.string().trim().email("Enter a valid email address"),
   fullName: z.string().trim().min(2, "Full name is required").max(50),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const loginSchema = z.object({
  identifier: z.string().trim().min(1, "Enter your username or email"),
  password: z.string().min(1, "Enter your password"),
});

const initialForm = {
  username: "",
  email: "",
  fullName:"",
  identifier: "",
  password: "",
  confirmPassword: "",
};

function InputField({
  id,
  label,
  error,
  className = "",
  ...inputProps
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
          error
            ? "border-red-400 ring-2 ring-red-100"
            : "border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
        }`}
        {...inputProps}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setMessage("");
  }

  function switchMode() {
    setIsLogin((current) => !current);
    setForm(initialForm);
    setErrors({});
    setMessage("");
  }

  async function handleSubmit(event) {
  event.preventDefault();

  const values = isLogin
    ? {
        identifier: form.identifier,
        password: form.password,
      }
    : {
        username: form.username,
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      };

  const result = (isLogin ? loginSchema : registerSchema).safeParse(values);

  if (!result.success) {
    const fieldErrors = {};

    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }

    setErrors(fieldErrors);
    setMessage("");
    return;
  }

  setErrors({});
  setMessage("");

  try {
    if (isLogin) {
      const loginResult = await signIn("credentials", {
        redirect: false,
        identifier: form.identifier.trim().toLowerCase(),
        password: form.password,
      });

      if (loginResult?.error) {
        setMessage("Invalid username, email, or password");
        return;
      }

      setMessage("Login successful");
      router.push("/dashboard");
      return;
    }

    // register flow
    const registerResult = await registerUser({
      username: form.username,
      fullName: form.fullName,
      email: form.email,
      password: form.password,
    });
    if (!registerResult.success) {
      setMessage(registerResult.message || "Registration failed");
      return;
    }
    setMessage("Account created successfully. You can now log in.");
    setIsLogin(true);
    setForm({
      username: "",
      fullName: "",
      email: "",
      identifier: form.email,
      password: "",
      confirmPassword: "",
    });
  } catch (error) {
    console.error(error);
    setMessage("Something went wrong. Please try again.");
  }
}

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10">
      <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-orange-200/50 blur-3xl" />
      <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-amber-100/70 blur-3xl" />

      <section className="relative w-full max-w-md rounded-3xl border border-white bg-white/95 p-6 shadow-[0_24px_70px_-28px_rgba(15,23,42,0.35)] sm:p-9">
        <div className="mb-8 text-center">
          <p className="mb-3 text-2xl font-black tracking-tight text-orange-600">
            youflex
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {isLogin
              ? "Sign in to continue building your profile."
              : "Join the community and start sharing your journey."}
          </p>
        </div>

        <form noValidate onSubmit={handleSubmit} className="space-y-4">
          {isLogin ? (
            <InputField
              id="identifier"
              name="identifier"
              label="Username or email"
              type="text"
              autoComplete="username"
              placeholder="Enter your username or email"
              value={form.identifier}
              onChange={updateField}
              error={errors.identifier}
            />
          ) : (
            <>
              <InputField
                id="username"
                name="username"
                
                label="Username"
                type="text"
                autoComplete="username"
                placeholder="Choose a username"
                value={form.username}
                onChange={updateField}
                error={errors.username}
              />
              <InputField
                id="fullName"
                name="fullName"                
                label="fullName"
                type="text"
                autoComplete="fullName"
                placeholder="enter fullName"
                value={form.fullName}
                onChange={updateField}
                error={errors.fullName}
              />
              <InputField
                id="email"
                name="email"
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={updateField}
                error={errors.email}
              />
            </>
          )}

          <InputField
            id="password"
            name="password"
            label="Password"
            type="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            placeholder="Enter your password"
            value={form.password}
            onChange={updateField}
            error={errors.password}
          />

          {!isLogin && (
            <>
              <InputField
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm password"
                type="password"
                autoComplete="new-password"
                placeholder="Enter your password again"
                value={form.confirmPassword}
                onChange={updateField}
                error={errors.confirmPassword}
              />
              <p className="rounded-xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
                Use 8–100 characters with at least one uppercase letter,
                lowercase letter, and number.
              </p>
            </>
          )}

          {message && (
            <p
              role="status"
              className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-orange-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-200 active:scale-[0.99]"
          >
            {isLogin ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-500">
          {isLogin ? "New to youflex?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={switchMode}
            className="font-bold text-orange-600 transition hover:text-orange-700 hover:underline focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            {isLogin ? "Register now" : "Sign in"}
          </button>
        </p>
      </section>
    </main>
  );
}
