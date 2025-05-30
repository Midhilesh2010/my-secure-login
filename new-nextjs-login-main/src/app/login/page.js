// src/app/login/page.js
"use client"; // This is crucial for client-side interactivity like state, hooks, and event handlers

import Link from 'next/link';
import React, { useState, useRef, useEffect } from "react";
// Import icons from react-icons/fi (Feather Icons)
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter } from 'next/navigation'; // Import useRouter for client-side navigation

function LoginPage() {
  const router = useRouter(); // Initialize router for navigation

  // --- State Management ---
  const [email, setEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null); // State for displaying error messages
  const [loading, setLoading] = useState(false); // State for loading indicator

  // --- Ref for password input (for toggling visibility) ---
  const passwordInputRef = useRef(null);

  // --- Toggle password visibility ---
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    if (passwordInputRef.current) {
      passwordInputRef.current.focus(); // Keep focus on the input
    }
  };

  // --- Form Submission Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true); // Set loading to true
    setError(null); // Clear any previous errors

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password: authPassword }),
      });

      if (response.ok) { // Check if response status is in the 200s (success)
        const data = await response.json(); // Parse the JSON response from the API
        console.log('Login successful:', data.message);

        // Redirect to customers page on successful login
        router.push('/customers'); // Navigate to the customers dashboard
      } else {
        // If response.ok is false, it means the API returned an error status (e.g., 401, 400, 500)
        const errorData = await response.json(); // Parse error response
        console.error('Login failed:', errorData.message || 'Unknown error');
        // Display the error message from the API, or a generic one
        setError(errorData.message || "An unexpected error occurred. Please try again.");
      }
    } catch (err) {
      // Handle network errors or other exceptions during the fetch
      console.error('Network error or unexpected issue:', err);
      setError("Failed to connect to the server. Please check your internet connection.");
    } finally {
      setLoading(false); // Set loading to false regardless of success or failure
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500 p-4 sm:p-6 lg:p-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl transition-all duration-300 ease-in-out hover:shadow-3xl"
      >
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
          Welcome Back
        </h1>

        {/* Error message display */}
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500 animate-fade-in mb-4">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FiMail size={20} />
              </span>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-3 text-lg outline-none focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF]"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FiLock size={20} />
              </span>
              <input
                id="password"
                ref={passwordInputRef}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 pl-10 pr-10 py-3 text-lg outline-none focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF]"
              />
              <span
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-400"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </span>
            </div>
          </div>
        </div>

        {/* Forgot Password Link */}
        <div className="mt-4 text-right">
          <Link href="/account/forgot-password" className="text-sm font-medium text-[#357AFF] hover:underline">
            Forgot password?
          </Link>
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          disabled={loading} // Disable button when loading
          className="mt-6 w-full rounded-lg bg-[#357AFF] px-4 py-3 text-base font-medium text-white transition-colors hover:bg-[#2E69DE] focus:outline-none focus:ring-2 focus:ring-[#357AFF] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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

        {/* Sign Up Link */}
        <div className="mt-6 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-[#357AFF] hover:underline">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;