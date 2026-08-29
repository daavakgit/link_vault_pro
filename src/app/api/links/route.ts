import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import Link from '@/models/Link';
import { z } from 'zod';

const createLinkSchema = z.object({
  name: z.string().min(1, 'Link name is required'),
  url: z.string().min(1, 'URL is required'),
  description: z.string().optional(),
  category: z.enum(['Coding', 'Projects', 'Career', 'Education', 'Social', 'Learning', 'Others']),
});

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    const filter: any = { userId: auth.userId };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: searchRegex },
        { url: searchRegex },
        { description: searchRegex },
      ];
    }

    const links = await Link.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      links: links.map((doc) => ({
        _id: doc._id.toString(),
        userId: doc.userId.toString(),
        name: doc.name,
        url: doc.url,
        description: doc.description,
        category: doc.category,
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString(),
      })),
    });
  } catch (error: any) {
    console.error('[GET Links Error]:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch links' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    const body = await req.json();
    const validation = createLinkSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, url, description, category } = validation.data;

    await connectToDatabase();

    const link = await Link.create({
      userId: auth.userId,
      name,
      url,
      description: description || '',
      category,
    });

    return NextResponse.json({
      success: true,
      link: {
        _id: link._id.toString(),
        userId: link.userId.toString(),
        name: link.name,
        url: link.url,
        description: link.description,
        category: link.category,
        createdAt: link.createdAt.toISOString(),
        updatedAt: link.updatedAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('[POST Link Error]:', error);
    return NextResponse.json({ error: error.message || 'Failed to create link' }, { status: 500 });
  }
}
