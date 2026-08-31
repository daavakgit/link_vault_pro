import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, signToken, setAuthCookie } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET(req: NextRequest) {
  try {
    let auth = await getAuthUser(req);
    let session = null;

    if (!auth) {
      session = await getServerSession(authOptions);
    }

    await connectToDatabase();
    let user = null;

    if (auth) {
      user = await User.findById(auth.userId).select('-password');
    } else if (session && session.user && session.user.email) {
      user = await User.findOne({ email: session.user.email.toLowerCase() }).select('-password');
      if (!user) {
        user = await User.create({
          name: session.user.name || 'Google User',
          email: session.user.email.toLowerCase(),
          avatar: session.user.image || '',
        });
      }

      // Automatically issue JWT cookie for future requests
      const jwtToken = signToken({
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
      });

      const response = NextResponse.json({
        success: true,
        user: {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });

      const cookieConfig = setAuthCookie(jwtToken);
      response.cookies.set(cookieConfig.name, cookieConfig.value, cookieConfig);
      return response;
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
