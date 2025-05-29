    // src/app/api/signup/route.js
    import { NextResponse } from 'next/server';
    import bcrypt from 'bcryptjs';
    import dbConnect from '@/lib/db'; // Import your database connection utility
    import User from '@/models/User';   // Import your User model

    export async function POST(request) {
      // Establish database connection
      await dbConnect();

      try {
        const { name, email, password } = await request.json();

        // Basic server-side validation
        if (!name || !email || !password) {
          return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return NextResponse.json({ message: 'User with this email already exists.' }, { status: 409 }); // 409 Conflict
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user in the database
        const newUser = await User.create({
          name,
          email,
          password: hashedPassword,
        });

        // Respond with success
        return NextResponse.json({ message: 'User registered successfully!', user: { id: newUser._id, name: newUser.name, email: newUser.email } }, { status: 201 });

      } catch (error) {
        console.error('Signup API error:', error);
        // Handle specific Mongoose validation errors if necessary
        if (error.code === 11000) { // Duplicate key error (e.g., email unique constraint)
          return NextResponse.json({ message: 'User with this email already exists.' }, { status: 409 });
        }
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
      }
    }
    