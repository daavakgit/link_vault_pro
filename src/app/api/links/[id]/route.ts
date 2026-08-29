import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import Link from '@/models/Link';
import { z } from 'zod';

const updateLinkSchema = z.object({
  name: z.string().min(1, 'Link name is required'),
  url: z.string().min(1, 'URL is required'),
  description: z.string().optional(),
  category: z.enum(['Coding', 'Projects', 'Career', 'Education', 'Social', 'Learning', 'Others']),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const validation = updateLinkSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingLink = await Link.findById(id);
    if (!existingLink) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    if (existingLink.userId.toString() !== auth.userId) {
      return NextResponse.json({ error: 'Unauthorized to modify this link' }, { status: 403 });
    }

    const { name, url, description, category } = validation.data;

    existingLink.name = name;
    existingLink.url = url;
    existingLink.description = description || '';
    existingLink.category = category;

    await existingLink.save();

    return NextResponse.json({
      success: true,
      link: {
        _id: existingLink._id.toString(),
        userId: existingLink.userId.toString(),
        name: existingLink.name,
        url: existingLink.url,
        description: existingLink.description,
        category: existingLink.category,
        createdAt: existingLink.createdAt.toISOString(),
        updatedAt: existingLink.updatedAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('[PUT Link Error]:', error);
    return NextResponse.json({ error: error.message || 'Failed to update link' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    const { id } = await params;

    await connectToDatabase();

    const existingLink = await Link.findById(id);
    if (!existingLink) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    if (existingLink.userId.toString() !== auth.userId) {
      return NextResponse.json({ error: 'Unauthorized to delete this link' }, { status: 403 });
    }

    await Link.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Link deleted successfully',
    });
  } catch (error: any) {
    console.error('[DELETE Link Error]:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete link' }, { status: 500 });
  }
}
