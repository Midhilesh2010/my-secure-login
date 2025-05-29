    // src/app/api/login/route.js
    import { NextResponse } from 'next/server';
    import bcrypt from 'bcryptjs';
    import dbConnect from '@/lib/db'; // Import your database connection utility
    import User from '@/models/User';   // Import your User model

    export async function POST(request) {
      // Establish database connection
      await dbConnect();

      try {
        const { email, password } = await request.json();

        // Server-side validation: ensure fields are present
        if (!email || !password) {
          return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        // Find the user by email in the database
        const user = await User.findOne({ email });

        // If user not found, return authentication error
        if (!user) {
          return NextResponse.json({ message: 'Incorrect email or password. Please double-check your credentials.' }, { status: 401 }); // 401 Unauthorized
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // If passwords do not match, return authentication error
        if (!isPasswordValid) {
          return NextResponse.json({ message: 'Incorrect email or password. Please double-check your credentials.' }, { status: 401 }); // 401 Unauthorized
        }

        // On successful login, return a success response
        // In a real application, you would also return a JWT token here.
        return NextResponse.json({ message: 'Login successful!', user: { id: user._id, name: user.name, email: user.email } }, { status: 200 });

      } catch (error) {
        console.error('Login API error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
      }
    }
    