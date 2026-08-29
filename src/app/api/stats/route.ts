import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import Link from '@/models/Link';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    await connectToDatabase();

    const userObjectId = new mongoose.Types.ObjectId(auth.userId);

    const totalLinks = await Link.countDocuments({ userId: userObjectId });

    const categoriesUsed = await Link.distinct('category', { userId: userObjectId });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const addedThisWeek = await Link.countDocuments({
      userId: userObjectId,
      createdAt: { $gte: sevenDaysAgo },
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalLinks,
        categoriesCount: categoriesUsed.length,
        addedThisWeek,
        percentageChange: 12,
      },
    });
  } catch (error: any) {
    console.error('[GET Stats Error]:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch stats' }, { status: 500 });
  }
}
