import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';

// In-memory user store (in production, use Vercel KV, Supabase, or similar)
// For now, we'll use a simple approach that works with Vercel's serverless functions
const DEMO_USERS_KEY = 'demo_users';

interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  createdAt: string;
  role: string;
}

// Simple user storage using Vercel's edge config or local storage
// In production, replace this with a real database
async function getUsers(): Promise<User[]> {
  // For demo purposes, we'll use a hardcoded admin user
  // In production, this would be a database call
  const defaultUsers: User[] = [
    {
      id: '1',
      email: 'peter@securebase.cc',
      username: 'petersung',
      firstName: 'Peter',
      lastName: 'Sung',
      passwordHash: await hash('admin123', 12),
      createdAt: new Date().toISOString(),
      role: 'admin',
    },
  ];

  return defaultUsers;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUsers = await getUsers();
    if (existingUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json(
        { message: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hash(password, 12);

    // Create new user
    const newUser: User = {
      id: `user_${Date.now()}`,
      email: email.toLowerCase(),
      username: `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
      firstName,
      lastName,
      passwordHash,
      createdAt: new Date().toISOString(),
      role: 'user',
    };

    // In a real implementation, save the user to a database here
    // For demo purposes, the user will be able to log in with the Strapi backend
    // or we'd need to implement a proper user store

    console.log('New user registration:', { email: newUser.email, username: newUser.username });

    return NextResponse.json(
      {
        message: 'Account created successfully',
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'An error occurred during sign-up. Please try again.' },
      { status: 500 }
    );
  }
}
