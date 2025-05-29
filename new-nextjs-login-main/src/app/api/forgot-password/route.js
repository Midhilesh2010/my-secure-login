    // src/app/api/forgot-password/route.js
    import { NextResponse } from 'next/server';
    import fs from 'fs/promises';
    import path from 'path';
    import { v4 as uuidv4 } from 'uuid'; // Import UUID generator

    const usersFilePath = path.join(process.cwd(), 'src', 'lib', 'users.json');

    async function readUsers() {
      try {
        const fileContent = await fs.readFile(usersFilePath, 'utf-8');
        return JSON.parse(fileContent);
      } catch (error) {
        if (error.code === 'ENOENT') {
          return [];
        }
        console.error("Error reading users file in forgot-password API:", error);
        return [];
      }
    }

    async function writeUsers(users) {
      await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
    }

    export async function POST(request) {
      try {
        const { email } = await request.json();

        if (!email) {
          return NextResponse.json({ message: 'Email is required' }, { status: 400 });
        }

        const users = await readUsers();
        const user = users.find(u => u.email === email);

        // Security best practice: Always return a generic success message
        // to prevent email enumeration (telling attackers if an email exists)
        if (!user) {
          console.log(`Forgot password request for non-existent email: ${email}`);
          return NextResponse.json({ message: 'If an account with that email exists, a password reset link has been sent.' }, { status: 200 });
        }

        // Generate a unique reset token
        const resetToken = uuidv4();
        // Set token expiry (e.g., 1 hour from now)
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour in milliseconds

        // Update user's record with the token and expiry
        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;

        await writeUsers(users);

        // --- SIMULATED EMAIL SENDING ---
        // In a real application, you would send an actual email here.
        // For this demo, we'll log the reset link to the console.
        const resetLink = `${request.headers.get('origin')}/account/reset-password?token=${resetToken}`;
        console.log(`
          --- PASSWORD RESET LINK (FOR ${email}) ---
          Please click this link to reset your password:
          ${resetLink}
          ------------------------------------------
        `);

        return NextResponse.json({ message: 'If an account with that email exists, a password reset link has been sent.' }, { status: 200 });

      } catch (error) {
        console.error('Forgot password API error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
      }
    }
    