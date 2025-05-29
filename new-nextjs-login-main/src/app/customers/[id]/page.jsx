// File: src/app/customers/[id]/page.jsx
// This is the dynamic route for individual customer details, featuring a subtle 3D animation.

"use client"; // This component needs to be a Client Component for 3D rendering and interactivity.

import React, { useEffect, useRef, useState } from 'react';
import { getCustomerById } from '@/lib/customer-data'; // Import the function to get customer data
import { FiMail, FiPhone, FiCalendar, FiHome, FiClock, FiEdit3, FiChevronLeft, FiBriefcase, FiMessageCircle } from 'react-icons/fi'; // Icons for the detail page
import Link from 'next/link'; // For the back button
import * as THREE from 'three'; // Import Three.js for 3D rendering

// The Page component in a dynamic route receives 'params' as a prop.
export default function CustomerDetailPage({ params }) {
  const { id } = params; // Extract the 'id' from the URL parameters

  // Fetch the customer data based on the ID
  const customer = getCustomerById(id);

  // Ref for the canvas element where the 3D scene will be rendered
  const canvasRef = useRef(null);
  // State to control fade-in animation for content
  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    // Trigger content fade-in after a short delay
    const timer = setTimeout(() => {
      setContentLoaded(true);
    }, 100); // Small delay for initial render

    // --- Three.js Setup ---
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true, // Allow transparency to see the background gradient
      antialias: true,
    });

    // Set initial renderer size and pixel ratio for sharpness
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Add a subtle ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add a directional light to create shadows and highlights
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // Create a simple 3D object (e.g., a dodecahedron for a cool geometric look)
    const geometry = new THREE.DodecahedronGeometry(1.5, 0); // Radius, detail
    const material = new THREE.MeshStandardMaterial({
      color: 0x8a2be2, // BlueViolet
      roughness: 0.5,
      metalness: 0.5,
      transparent: true,
      opacity: 0.7,
    });
    const dodecahedron = new THREE.Mesh(geometry, material);
    scene.add(dodecahedron);

    // Position the camera
    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate the dodecahedron
      dodecahedron.rotation.x += 0.002;
      dodecahedron.rotation.y += 0.003;
      dodecahedron.rotation.z += 0.001;

      renderer.render(scene, camera);
    };

    animate(); // Start the animation

    // Handle window resizing
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function: runs when the component unmounts
    return () => {
      clearTimeout(timer); // Clear the content fade-in timer
      window.removeEventListener('resize', handleResize);
      // Dispose of Three.js resources to prevent memory leaks
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      // Remove the canvas from the DOM if it's still there
      if (canvasRef.current && canvasRef.current.parentNode) {
        canvasRef.current.parentNode.removeChild(canvasRef.current);
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // If customer is not found, display a 404-like message or redirect
  if (!customer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md w-full">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Customer Not Found</h1>
          <p className="text-gray-700 mb-6">The customer with ID "{id}" does not exist.</p>
          <Link href="/customers" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200">
            <FiChevronLeft className="mr-2" size={20} /> Back to Customer List
          </Link>
        </div>
      </div>
    );
  }

  // If customer is found, render their details
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 overflow-hidden">
      {/* Three.js Canvas for 3D animation */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0"></canvas>

      {/* Content Overlay */}
      <div className={`relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8
                     transition-opacity duration-700 ease-out ${contentLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="mx-auto max-w-3xl w-full bg-white rounded-xl shadow-2xl p-8 transform transition-all duration-300 ease-in-out hover:scale-[1.01]">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/customers" className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium transition-colors duration-200">
              <FiChevronLeft className="mr-2" size={20} /> Back to Customer List
            </Link>
          </div>

          <div className="flex flex-col items-center text-center border-b pb-6 mb-6">
            <img
              src={customer.avatar}
              alt={customer.name}
              className="mb-4 h-32 w-32 rounded-full object-cover border-4 border-purple-300 shadow-lg"
            />
            <h1 className="text-4xl font-extrabold text-gray-800 mb-2">{customer.name}</h1>
            <span className={`px-4 py-1 rounded-full text-sm font-semibold
              ${customer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {customer.status}
            </span>
          </div>

          {/* Customer Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center space-x-3 text-gray-700">
              <FiMail size={20} className="text-purple-500" />
              <p className="font-medium">Email:</p>
              <span>{customer.email}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <FiPhone size={20} className="text-purple-500" />
              <p className="font-medium">Phone:</p>
              <span>{customer.phone || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <FiCalendar size={20} className="text-purple-500" />
              <p className="font-medium">Joined:</p>
              <span>{customer.registeredDate}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <FiClock size={20} className="text-purple-500" />
              <p className="font-medium">Last Login:</p>
              <span>{customer.lastLogin || 'N/A'}</span>
            </div>
            {/* NEW CUSTOM FIELDS */}
            <div className="flex items-center space-x-3 text-gray-700">
              <FiBriefcase size={20} className="text-purple-500" />
              <p className="font-medium">Occupation:</p>
              <span>{customer.occupation || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <FiMessageCircle size={20} className="text-purple-500" />
              <p className="font-medium">Preferred Contact:</p>
              <span>{customer.preferredContactMethod || 'N/A'}</span>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start space-x-3 text-gray-700 mb-6 border-t pt-6">
            <FiHome size={20} className="text-purple-500 mt-1" />
            <div>
              <p className="font-medium">Address:</p>
              <span>{customer.address || 'N/A'}</span>
            </div>
          </div>

          {/* Notes Section */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-3">
              <FiEdit3 size={18} className="mr-2 text-purple-500" /> Notes
            </h2>
            <p className="text-gray-600 bg-gray-50 p-4 rounded-lg shadow-inner text-sm leading-relaxed">
              {customer.notes || 'No specific notes for this customer yet.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
