// src/app/api/reset-password/route.js
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';

const usersFilePath = path.join(process.cwd(), 'src', 'lib', 'users.json');

async function readUsers() {
  try {
    const fileContent = await fs.readFile(usersFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    console.error("Error reading users file in reset-password API:", error);
    return [];
  }
}

async function writeUsers(users) {
  await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
}

export async function POST(request) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json({ message: 'Token and new password are required' }, { status: 400 });
    }

    const users = await readUsers();
    const user = users.find(u => u.resetToken === token);

    // Validate token existence and expiry
    if (!user || !user.resetTokenExpiry || Date.now() > user.resetTokenExpiry) {
      // Security: Use a generic message to avoid giving hints to attackers
      return NextResponse.json({ message: 'Invalid or expired token. Please request a new reset link.' }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password and invalidate the token
    user.password = hashedPassword;
    user.resetToken = null; // Invalidate the token
    user.resetTokenExpiry = null; // Clear expiry

    await writeUsers(users);

    return NextResponse.json({ message: 'Password has been reset successfully!' }, { status: 200 });

  } catch (error) {
    console.error('Reset password API error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
