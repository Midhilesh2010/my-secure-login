    "use client"; // Marks this as a Client Component for interactivity

    import Link from 'next/link';
    import React, { useState, useRef, useEffect } from "react";
    // Import icons from react-icons/fi (Feather Icons)
    import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
    import { useRouter } from 'next/navigation'; // Import useRouter for client-side navigation

    function LoginPage() {
      // --- State Management ---
      const [email, setEmail] = useState("");
      const [authPassword, setAuthPassword] = useState("");
      const [error, setError] = useState(null); // For general API/login errors
      const [emailError, setEmailError] = useState(""); // For client-side email validation
      const [passwordError, setPasswordError] = useState(""); // For client-side password validation
      const [loading, setLoading] = useState(false); // For button loading state
      const [showPassword, setShowPassword] = useState(false); // For showing/hiding password

      const router = useRouter(); // Initialize the router

      // Ref for auto-focusing email input on load
      const emailInputRef = useRef(null);

      // --- Effects ---
      useEffect(() => {
        // Auto-focus email input on component mount
        if (emailInputRef.current) {
          emailInputRef.current.focus();
        }
      }, []);

      // --- Validation Helpers (Client-Side) ---
      const validateEmail = (email) => {
        if (!email) {
          return "Email is required.";
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
          return "Invalid email format.";
        }
        return "";
      };

      const validatePassword = (password) => {
        if (!password) {
          return "Password is required.";
        }
        // Assuming a minimum password length of 6 for client-side check
        if (password.length < 6) {
          return "Password must be at least 6 characters.";
        }
        return "";
      };

      // --- Form Submission Handler ---
      const onSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setLoading(true); // Show loading spinner
        setError(null); // Clear previous errors

        // Perform client-side validation
        const emailValidationMsg = validateEmail(email);
        const passwordValidationMsg = validatePassword(authPassword);

        setEmailError(emailValidationMsg);
        setPasswordError(passwordValidationMsg);

        // If any client-side validation error exists, stop submission
        if (emailValidationMsg || passwordValidationMsg) {
          setLoading(false);
          return;
        }

        try {
          // --- IMPORTANT CHANGE: CALLING THE ACTUAL BACKEND API ---
          const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password: authPassword }),
          });

          const data = await response.json(); // Parse the JSON response from the API

          if (response.ok) { // Check if the response status is in the 200s (success)
            console.log("Login successful:", data.message);
            // On successful login, redirect to the customer dashboard (or other protected route)
            router.push('/customers');
          } else {
            // If response.ok is false, it means the API returned an error status (e.g., 401, 400, 500)
            console.error('Login failed:', data.message || 'Unknown error');
            // Display the error message from the API, or a generic one
            setError(data.message || "An unexpected error occurred. Please try again.");
          }
        } catch (err) {
          // This catch block handles network errors (e.g., server offline) or issues parsing JSON response
          console.error('Network or parsing error during login:', err);
          setError('Network error or server unreachable. Please try again.');
        } finally {
          setLoading(false); // Hide loading spinner
        }
      };

      return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500 p-4 sm:p-6 lg:p-8">
          <form
            noValidate // Disable default browser validation as we handle it ourselves
            onSubmit={onSubmit}
            className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl transition-all duration-300 ease-in-out hover:shadow-3xl"
          >
            <h1 className="mb-8 text-center text-3xl font-bold text-gray-800 animate-fade-in-down">
              Welcome Back
            </h1>

            <div className="space-y-6">
              {/* Email Input Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className={`relative flex items-center overflow-hidden rounded-lg border px-4 py-3 bg-white
                           ${emailError ? "border-red-500 ring-1 ring-red-500" : "border-gray-200 focus-within:border-[#357AFF] focus-within:ring-1 focus-within:ring-[#357AFF]"}`}>
                  <FiMail className="mr-3 text-gray-400 text-lg" aria-hidden="true" />
                  <input
                    id="email"
                    ref={emailInputRef}
                    required
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError(""); // Clear error on change
                    }}
                    onBlur={(e) => setEmailError(validateEmail(e.target.value))} // Validate on blur
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full bg-transparent text-lg outline-none placeholder-gray-400"
                    aria-invalid={emailError ? "true" : "false"}
                    aria-describedby={emailError ? "email-error" : undefined}
                  />
                </div>
                {emailError && (
                  <p id="email-error" className="text-sm text-red-500 mt-1 pl-4 animate-fade-in">
                    {emailError}
                  </p>
                )}
              </div>

              {/* Password Input Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className={`relative flex items-center overflow-hidden rounded-lg border px-4 py-3 bg-white
                           ${passwordError ? "border-red-500 ring-1 ring-red-500" : "border-gray-200 focus-within:border-[#357AFF] focus-within:ring-1 focus-within:ring-[#357AFF]"}`}>
                  <FiLock className="mr-3 text-gray-400 text-lg" aria-hidden="true" />
                  <input
                    id="password"
                    required
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={authPassword}
                    onChange={(e) => {
                      setAuthPassword(e.target.value);
                      setPasswordError(""); // Clear error on change
                    }}
                    onBlur={(e) => setPasswordError(validatePassword(e.target.value))} // Validate on blur
                    autoComplete="current-password"
                    className="w-full rounded-lg bg-transparent text-lg outline-none placeholder-gray-400"
                    aria-invalid={passwordError ? "true" : "false"}
                    aria-describedby={passwordError ? "password-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="ml-3 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#357AFF] rounded-full"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
                {passwordError && (
                  <p id="password-error" className="text-sm text-red-500 mt-1 pl-4 animate-fade-in">
                    {passwordError}
                  </p>
                )}
              </div>

              {/* General Error Message Display (from backend/API) */}
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500 animate-fade-in">
                  {error}
                </div>
              )}

              {/* Forgot Password Link */}
              <div className="text-right text-sm">
                <a
                  href="/account/forgot-password"
                  className="font-medium text-[#357AFF] hover:text-[#2E69DE] transition-colors duration-200"
                >
                  Forgot password?
                </a>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#357AFF] px-4 py-3 text-base font-medium text-white transition-colors hover:bg-[#2E69DE] focus:outline-none focus:ring-2 focus:ring-[#357AFF] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* "Don't have an account? Sign up" link */}
              <p className="text-center text-sm text-gray-600 mt-4">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="text-[hsl(240,75%,60%)] hover:text-[hsl(240,75%,50%)] font-medium transition-colors duration-200">
                  Sign Up!
                </Link>
              </p>
            </div>
          </form>
        </div>
      );
    }

    export default LoginPage;
    