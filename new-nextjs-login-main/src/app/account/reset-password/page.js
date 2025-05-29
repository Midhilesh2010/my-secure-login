// src/app/account/reset-password/page.js
"use client";

import Link from 'next/link';
import React, { useState, useEffect, useRef } from "react";
import { FiLock, FiEye, FiEyeOff, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { useRouter, useSearchParams } from 'next/navigation'; // Import useSearchParams to get token from URL

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [generalMessage, setGeneralMessage] = useState(null); // For success/error messages from API
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState(null); // State to store the reset token

  const router = useRouter();
  const searchParams = useSearchParams(); // Hook to access URL query parameters

  const passwordInputRef = useRef(null);

  // Effect to extract the token from the URL on component mount
  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
      // Optionally, auto-focus password input if token is present
      if (passwordInputRef.current) {
        passwordInputRef.current.focus();
      }
    } else {
      setGeneralMessage({ type: 'error', text: 'No reset token found in the URL. Please use the link from your email.' });
    }
  }, [searchParams]); // Depend on searchParams to re-run if URL changes

  // --- Validation Helpers ---
  const validatePassword = (password) => {
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    // Add more complex password rules if needed (e.g., must contain a number, special char)
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
    setGeneralMessage(null); // Clear previous messages

    // Client-side validation
    const pValidationMsg = validatePassword(password);
    const cpValidationMsg = validateConfirmPassword(confirmPassword, password);

    setPasswordError(pValidationMsg);
    setConfirmPasswordError(cpValidationMsg);

    if (pValidationMsg || cpValidationMsg) {
      setLoading(false);
      return;
    }

    // Ensure token exists before making API call
    if (!token) {
      setGeneralMessage({ type: 'error', text: 'Missing reset token. Cannot reset password.' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (response.ok) {
        setGeneralMessage({ type: 'success', text: data.message || 'Your password has been reset successfully! Redirecting to login...' });
        setPassword("");
        setConfirmPassword("");
        setPasswordError("");
        setConfirmPasswordError("");

        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push('/');
        }, 3000); // Redirect after 3 seconds
      } else {
        setGeneralMessage({ type: 'error', text: data.message || 'Failed to reset password. Please try again.' });
        console.error('Reset password API error:', data.message);
      }
    } catch (error) {
      console.error('Frontend reset password submission error:', error);
      setGeneralMessage({ type: 'error', text: 'Network error or server unreachable. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500 p-4 sm:p-6 lg:p-8">
      <form
        noValidate
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl transition-all duration-300 ease-in-out hover:shadow-3xl"
      >
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-800 animate-fade-in-down">
          Reset Password
        </h1>

        <div className="space-y-6">
          {/* Message Display (Success/Error) */}
          {generalMessage && (
            <div className={`rounded-lg p-3 text-sm animate-fade-in flex items-center
              ${generalMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-500'}`}>
              {generalMessage.type === 'success' ? <FiCheckCircle className="mr-2" /> : <FiAlertCircle className="mr-2" />}
              {generalMessage.text}
            </div>
          )}

          {/* Display message if no token is found initially */}
          {!token && !generalMessage && ( // Only show this if no token and no other message yet
            <div className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-700 animate-fade-in flex items-center">
              <FiAlertCircle className="mr-2" />
              Waiting for a valid reset token in the URL...
            </div>
          )}

          {/* Password Input Field (only show if token is present or no error message) */}
          {(token || !generalMessage || generalMessage.type === 'error') && (
            <>
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <div className={`relative flex items-center overflow-hidden rounded-lg border px-4 py-3 bg-white
                  ${passwordError ? "border-red-500 ring-1 ring-red-500" : "border-gray-200 focus-within:border-[#357AFF] focus-within:ring-1 focus-within:ring-[#357AFF]"}`}>
                  <FiLock className="mr-3 text-gray-400 text-lg" aria-hidden="true" />
                  <input
                    id="password"
                    ref={passwordInputRef}
                    required
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError("");
                      setConfirmPasswordError(validateConfirmPassword(confirmPassword, e.target.value));
                    }}
                    onBlur={(e) => setPasswordError(validatePassword(e.target.value))}
                    autoComplete="new-password"
                    className="w-full rounded-lg bg-transparent text-lg outline-none placeholder-gray-400"
                    aria-invalid={passwordError ? "true" : "false"}
                    aria-describedby={passwordError ? "password-error" : undefined}
                    disabled={loading || !token} // Disable if loading or no token
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="ml-3 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#357AFF] rounded-full"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    disabled={loading || !token}
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

              {/* Confirm Password Input Field (only show if token is present or no error message) */}
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm New Password
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
                    disabled={loading || !token} // Disable if loading or no token
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="ml-3 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#357AFF] rounded-full"
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    disabled={loading || !token}
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

              {/* Reset Password Button */}
              <button
                type="submit"
                disabled={loading || !token} // Disable if loading or no token
                className="w-full rounded-lg bg-[#357AFF] px-4 py-3 text-base font-medium text-white transition-colors hover:bg-[#2E69DE] focus:outline-none focus:ring-2 focus:ring-[#357AFF] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </>
          )}

          {/* Back to Login Link */}
          <p className="text-center text-sm text-gray-600 mt-4">
            <Link href="/" className="text-[hsl(240,75%,60%)] hover:text-[hsl(240,75%,50%)] font-medium transition-colors duration-200">
              Back to Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
