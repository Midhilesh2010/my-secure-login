// File: app/customers/page.jsx
// This file defines the /customers route in your Next.js application.

"use client"; // This is a client component, required for useState, useEffect, etc.

import React, { useState, useMemo } from 'react';
import Link from 'next/link'; // For linking to customer detail pages in CustomerCard
import { useRouter } from 'next/navigation'; // For programmatic navigation in CustomerTableRow
import { FiGrid, FiList, FiSearch, FiArrowUp, FiArrowDown } from 'react-icons/fi'; // Icons for UI elements

// Import initialCustomers from the new centralized data file
import { initialCustomers } from '@/lib/customer-data';


// --- Customer Card Component ---
// Displays individual customer data in a card format for the grid view.
const CustomerCard = ({ customer }) => (
  // Wrap the entire card with a Link component to make it clickable
  <Link href={`/customers/${customer.id}`} className="block">
    <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.02] border border-gray-100 flex flex-col items-center text-center">
      {/* Customer Avatar */}
      <img
        src={customer.avatar}
        alt={customer.name}
        className="mb-4 h-20 w-20 rounded-full object-cover border-2 border-purple-300 shadow-md"
      />
      {/* Customer Name */}
      <h3 className="mb-1 text-xl font-semibold text-gray-800">{customer.name}</h3>
      {/* Customer Email - Truncated for long emails */}
      <p className="text-sm text-gray-500 mb-2 truncate w-full px-2">{customer.email}</p>
      {/* Customer ID & Registered Date */}
      <div className="text-xs text-gray-400 space-y-1">
        <p><span className="font-medium text-gray-600">ID:</span> {customer.id}</p>
        <p><span className="font-medium text-gray-600">Joined:</span> {customer.registeredDate}</p>
      </div>
      {/* Status Badge - Changes color based on status */}
      <span className={`mt-4 px-3 py-1 rounded-full text-xs font-semibold
        ${customer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {customer.status}
      </span>
    </div>
  </Link>
);

// --- Customer Table Row Component ---
// Displays individual customer data as a table row for the list view.
const CustomerTableRow = ({ customer }) => {
  const router = useRouter(); // Initialize useRouter for programmatic navigation

  return (
    // Make the entire row clickable
    <tr
      className="border-b border-gray-100 hover:bg-purple-50 transition-colors duration-200 cursor-pointer"
      onClick={() => router.push(`/customers/${customer.id}`)} // Navigate on click
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        <div className="flex items-center">
          {/* Avatar in table row */}
          <img src={customer.avatar} alt={customer.name} className="h-9 w-9 rounded-full object-cover mr-3" />
          {customer.name}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.registeredDate}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        {/* Status Badge in table row */}
        <span className={`px-3 py-1 rounded-full text-xs font-semibold
          ${customer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {customer.status}
      </span>
      </td>
    </tr>
  );
};


// --- Main Customer Dashboard Component ---
// This is the main component for the /customers page.
function CustomersPage() {
  // State for holding all customer data (initialized with mock data from lib/customer-data.js)
  const [customers] = useState(initialCustomers);
  // State for the search input value
  const [searchTerm, setSearchTerm] = useState('');
  // State for the column currently being sorted ('name', 'id', 'registeredDate')
  const [sortColumn, setSortColumn] = useState('name');
  // State for the sort direction ('asc' for ascending, 'desc' for descending)
  const [sortDirection, setSortDirection] = useState('asc');
  // State for the current view mode ('grid' or 'list')
  const [viewMode, setViewMode] = useState('grid');

  // useMemo to optimize filtering and sorting.
  // It re-calculates only when customers, searchTerm, sortColumn, or sortDirection change.
  const filteredAndSortedCustomers = useMemo(() => {
    let currentCustomers = [...customers]; // Create a mutable copy to avoid direct state mutation

    // 1. Filter Logic:
    // If there's a search term, filter customers whose name, email, or ID includes the term (case-insensitive).
    if (searchTerm) {
      currentCustomers = currentCustomers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Sort Logic:
    // Sort the customers based on the selected column and direction.
    currentCustomers.sort((a, b) => {
      const aValue = a[sortColumn]; // Get value from customer 'a' for the sortColumn
      const bValue = b[sortColumn]; // Get value from customer 'b' for the sortColumn

      // Handle date sorting specifically
      if (sortColumn === 'registeredDate') {
        const dateA = new Date(aValue);
        const dateB = new Date(bValue);
        if (dateA < dateB) return sortDirection === 'asc' ? -1 : 1;
        if (dateA > dateB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      }

      // Basic string/number comparison for other columns
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0; // Values are equal
    });

    return currentCustomers; // Return the processed list of customers
  }, [customers, searchTerm, sortColumn, sortDirection]); // Dependencies for useMemo

  // --- Handlers ---
  // Handles sorting when a table header (in list view) or sort option is clicked.
  const handleSort = (column) => {
    if (sortColumn === column) {
      // If the same column is clicked, toggle the sort direction.
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // If a new column is clicked, set it as the sort column and default to ascending.
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Helper function to display the correct sort icon (up/down arrow) next to column headers.
  const getSortIcon = (column) => {
    if (sortColumn === column) {
      // Show up arrow for ascending, down arrow for descending
      return sortDirection === 'asc' ? <FiArrowUp className="ml-1 text-sm" /> : <FiArrowDown className="ml-1 text-sm" />;
    }
    return null; // No icon if not the active sort column
  };

  return (
    // Main container with a beautiful gradient background and responsive padding
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl"> {/* Max width container for content */}
        {/* Dashboard Header */}
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center sm:text-left animate-fade-in-down">
          Customer Overview
        </h1>

        {/* Controls Section: Search, Sort, View Toggle */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Search Bar */}
          <div className="relative w-full sm:w-1/2 md:w-1/3">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-200 py-3 pl-12 pr-4 text-gray-700 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none transition-all duration-200"
            />
          </div>

          {/* Sort Controls */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 text-sm font-medium">Sort by:</span>
            <select
              value={sortColumn}
              onChange={(e) => handleSort(e.target.value)} // Use handleSort to manage sort state
              className="rounded-lg border border-gray-200 py-2 px-3 text-gray-700 bg-white focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none transition-all duration-200"
            >
              <option value="name">Name</option>
              <option value="id">ID</option>
              <option value="registeredDate">Joined Date</option>
            </select>
            {/* Sort Direction Toggle Button */}
            <button
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200"
              aria-label={`Sort direction: ${sortDirection === 'asc' ? 'Ascending' : 'Descending'}`}
            >
              {sortDirection === 'asc' ? <FiArrowUp size={18} /> : <FiArrowDown size={18} />}
            </button>
          </div>

          {/* View Mode Toggle Buttons */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors duration-200 flex items-center justify-center
                ${viewMode === 'grid' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}
              aria-label="Switch to grid view"
            >
              <FiGrid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors duration-200 flex items-center justify-center
                ${viewMode === 'list' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}
              aria-label="Switch to list view"
            >
              <FiList size={20} />
            </button>
          </div>
        </div>

        {/* Customer Display Area */}
        {/* Conditional rendering based on whether customers are found */}
        {filteredAndSortedCustomers.length === 0 ? (
          <div className="text-center text-gray-600 text-lg py-12 bg-white rounded-xl shadow-lg">
            No customers found matching your criteria.
          </div>
        ) : (
          // Render either Grid View or List View based on viewMode state
          viewMode === 'grid' ? (
            // Grid View: Responsive grid of CustomerCard components
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
              {filteredAndSortedCustomers.map(customer => (
                <CustomerCard key={customer.id} customer={customer} />
              ))}
            </div>
          ) : (
            // List View: Responsive table of CustomerTableRow components
            <div className="overflow-x-auto bg-white rounded-xl shadow-lg animate-fade-in">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {/* Table Headers with Sort functionality */}
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center">Name {getSortIcon('name')}</div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('email')}
                    >
                      <div className="flex items-center">Email {getSortIcon('email')}</div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('id')}
                    >
                      <div className="flex items-center">ID {getSortIcon('id')}</div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('registeredDate')}
                    >
                      <div className="flex items-center">Joined Date {getSortIcon('registeredDate')}</div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedCustomers.map(customer => (
                    <CustomerTableRow key={customer.id} customer={customer} />
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default CustomersPage;
