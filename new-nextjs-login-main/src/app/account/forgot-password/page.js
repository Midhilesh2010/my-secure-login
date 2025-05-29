    // src/app/account/forgot-password/page.js
    "use client";

    import Link from 'next/link';
    import React, { useState, useRef, useEffect } from "react";
    import { FiMail } from "react-icons/fi";

    export default function ForgotPasswordPage() {
      const [email, setEmail] = useState("");
      const [emailError, setEmailError] = useState("");
      const [loading, setLoading] = useState(false);
      const [message, setMessage] = useState(null); // For success or general error messages

      const emailInputRef = useRef(null);

      useEffect(() => {
        if (emailInputRef.current) {
          emailInputRef.current.focus();
        }
      }, []);

      const validateEmail = (email) => {
        if (!email) return "Email is required.";
        if (!/\S+@\S+\.\S+/.test(email)) return "Invalid email format.";
        return "";
      };

      const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setEmailError("");

        const validationMsg = validateEmail(email);
        setEmailError(validationMsg);

        if (validationMsg) {
          setLoading(false);
          return;
        }

        try {
          const response = await fetch('/api/forgot-password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });

          const data = await response.json();

          if (response.ok) {
            setMessage(data.message || "If an account with that email exists, a password reset link has been sent.");
            setEmail(""); // Clear email field on success
            // In a real app, you might hide the form here
          } else {
            setMessage(data.message || "Failed to send password reset link. Please try again.");
            console.error('Forgot password API error:', data.message);
          }
        } catch (error) {
          console.error('Frontend forgot password submission error:', error);
          setMessage('Network error or server unreachable. Please try again.');
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
              Forgot Password
            </h1>

            <div className="space-y-6">
              <p className="text-center text-gray-600 text-sm">
                Enter your email address below and we'll send you a link to reset your password.
              </p>

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

              {/* Message Display (Success/Error) */}
              {message && (
                <div className={`rounded-lg p-3 text-sm animate-fade-in ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-500'}`}>
                  {message}
                </div>
              )}

              {/* Send Reset Link Button */}
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
                    Sending Link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>

              {/* Back to Login Link */}
              <p className="text-center text-sm text-gray-600 mt-4">
                Remember your password?{' '}
                <Link href="/" className="text-[hsl(240,75%,60%)] hover:text-[hsl(240,75%,50%)] font-medium transition-colors duration-200">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      );
    }
    