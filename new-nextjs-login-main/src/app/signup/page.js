    // src/app/signup/page.js
    "use client"; // Marks this as a Client Component for interactivity

    import Link from 'next/link';
    import React, { useState, useRef, useEffect } from "react";
    // Import icons from react-icons/fi (Feather Icons)
    import { FiMail, FiLock, FiEye, FiEyeOff, FiUser } from "react-icons/fi";
    import { useRouter } from 'next/navigation'; // Import useRouter for client-side navigation

    export default function SignUpPage() {
      // --- State Management ---
      const [name, setName] = useState("");
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [confirmPassword, setConfirmPassword] = useState("");

      const [nameError, setNameError] = useState("");
      const [emailError, setEmailError] = useState("");
      const [passwordError, setPasswordError] = useState("");
      const [confirmPasswordError, setConfirmPasswordError] = useState("");
      const [generalError, setGeneralError] = useState(null); // For API errors
      const [successMessage, setSuccessMessage] = useState(null); // For successful signup

      const [loading, setLoading] = useState(false);
      const [showPassword, setShowPassword] = useState(false);
      const [showConfirmPassword, setShowConfirmPassword] = useState(false);

      const router = useRouter(); // Initialize the router for redirection

      // Ref for auto-focusing name input on load
      const nameInputRef = useRef(null);

      // --- Effects ---
      useEffect(() => {
        // Auto-focus name input on component mount
        if (nameInputRef.current) {
          nameInputRef.current.focus();
        }
      }, []);

      // --- Validation Helpers (Client-Side) ---
      const validateName = (name) => {
        if (!name) return "Name is required.";
        if (name.length < 2) return "Name must be at least 2 characters.";
        return "";
      };

      const validateEmail = (email) => {
        if (!email) return "Email is required.";
        if (!/\S+@\S+\.\S+/.test(email)) return "Invalid email format.";
        return "";
      };

      const validatePassword = (password) => {
        if (!password) return "Password is required.";
        if (password.length < 6) return "Password must be at least 6 characters.";
        return "";
      };

      const validateConfirmPassword = (confirmPassword, password) => {
        if (!confirmPassword) return "Confirm password is required.";
        if (confirmPassword !== password) return "Passwords do not match.";
        return "";
      };

      // --- Form Submission Handler ---
      const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setGeneralError(null); // Clear previous API errors
        setSuccessMessage(null); // Clear previous success messages

        // Perform all client-side validations
        const nameValidationMsg = validateName(name);
        const emailValidationMsg = validateEmail(email);
        const passwordValidationMsg = validatePassword(password);
        const confirmPasswordValidationMsg = validateConfirmPassword(confirmPassword, password);

        setNameError(nameValidationMsg);
        setEmailError(emailValidationMsg);
        setPasswordError(passwordValidationMsg);
        setConfirmPasswordError(confirmPasswordValidationMsg);

        // If any validation error exists, stop submission
        if (nameValidationMsg || emailValidationMsg || passwordValidationMsg || confirmPasswordValidationMsg) {
          setLoading(false);
          return;
        }

        try {
          // Send data to your Next.js API route
          const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            // Handle errors from the API
            setGeneralError(data.message || 'An unexpected error occurred during signup.');
            console.error('Sign-up API error:', data.message);
            return;
          }

          // On successful signup
          setSuccessMessage(data.message || 'Account created successfully! Redirecting to login...');
          console.log('Sign-up success:', data.message);

          // Optionally clear form fields on success
          setName('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setNameError("");
          setEmailError("");
          setPasswordError("");
          setConfirmPasswordError("");


          // Redirect to login page after a short delay
          setTimeout(() => {
            router.push('/'); // Redirect to the login page
          }, 2000); // Redirect after 2 seconds

        } catch (error) {
          console.error('Frontend sign-up submission error:', error);
          setGeneralError('Network error or server unreachable. Please try again.');
        } finally {
          setLoading(false);
        }
      };

      return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500 p-4 sm:p-6 lg:p-8">
          <form
            noValidate // Disable default browser validation
            onSubmit={onSubmit}
            className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl transition-all duration-300 ease-in-out hover:shadow-3xl"
          >
            <h1 className="mb-8 text-center text-3xl font-bold text-gray-800 animate-fade-in-down">
              Sign Up
            </h1>

            <div className="space-y-6">
              {/* Name Input Field */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <div className={`relative flex items-center overflow-hidden rounded-lg border px-4 py-3 bg-white
                  ${nameError ? "border-red-500 ring-1 ring-red-500" : "border-gray-200 focus-within:border-[#357AFF] focus-within:ring-1 focus-within:ring-[#357AFF]"}`}>
                  <FiUser className="mr-3 text-gray-400 text-lg" aria-hidden="true" />
                  <input
                    id="name"
                    ref={nameInputRef}
                    required
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setNameError(""); // Clear error on change
                    }}
                    onBlur={(e) => setNameError(validateName(e.target.value))} // Validate on blur
                    placeholder="Your Full Name"
                    autoComplete="name"
                    className="w-full bg-transparent text-lg outline-none placeholder-gray-400"
                    aria-invalid={nameError ? "true" : "false"}
                    aria-describedby={nameError ? "name-error" : undefined}
                  />
                </div>
                {nameError && (
                  <p id="name-error" className="text-sm text-red-500 mt-1 pl-4 animate-fade-in">
                    {nameError}
                  </p>
                )}
              </div>

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
                    required
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                    }}
                    onBlur={(e) => setEmailError(validateEmail(e.target.value))}
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
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError("");
                      setConfirmPasswordError(validateConfirmPassword(confirmPassword, e.target.value)); // Re-validate confirm password
                    }}
                    onBlur={(e) => setPasswordError(validatePassword(e.target.value))}
                    autoComplete="new-password"
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

              {/* Confirm Password Input Field */}
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div className={`relative flex items-center overflow-hidden rounded-lg border px-4 py-3 bg-white
                  ${confirmPasswordError ? "border-red-500 ring-1 ring-red-500" : "border-gray-200 focus-within:border-[#357AFF] focus-within:ring-1 focus-within:ring-[#357AFF]"}`}>
                  <FiLock className="mr-3 text-gray-400 text-lg" aria-hidden="true" />
                  <input
                    id="confirmPassword"
                    required
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setConfirmPasswordError("");
                    }}
                    onBlur={(e) => setConfirmPasswordError(validateConfirmPassword(e.target.value, password))}
                    autoComplete="new-password"
                    className="w-full rounded-lg bg-transparent text-lg outline-none placeholder-gray-400"
                    aria-invalid={confirmPasswordError ? "true" : "false"}
                    aria-describedby={confirmPasswordError ? "confirm-password-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="ml-3 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#357AFF] rounded-full"
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
                {confirmPasswordError && (
                  <p id="confirm-password-error" className="text-sm text-red-500 mt-1 pl-4 animate-fade-in">
                    {confirmPasswordError}
                  </p>
                )}
              </div>

              {/* General Error/Success Messages */}
              {generalError && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500 animate-fade-in">
                  {generalError}
                </div>
              )}
              {successMessage && (
                <div className="rounded-lg bg-green-50 p-3 text-sm text-green-500 animate-fade-in">
                  {successMessage}
                </div>
              )}

              {/* Sign Up Button */}
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
                    Signing Up...
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>

              {/* "Already have an account? Login here" link */}
              <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{' '}
                <Link href="/" className="text-[hsl(240,75%,60%)] hover:text-[hsl(240,75%,50%)] font-medium transition-colors duration-200">
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </div>
      );
    }
    