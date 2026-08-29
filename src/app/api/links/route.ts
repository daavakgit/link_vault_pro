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

const DEFAULT_SAMPLE_LINKS = [
  {
    name: 'Tailwind CSS Documentation',
    url: 'https://tailwindcss.com/docs',
    category: 'Coding',
    description: 'Official Tailwind CSS documentation and utility reference.',
  },
  {
    name: 'LinkVault Architecture Diagram',
    url: 'https://figma.com/file/xyz123/architecture',
    category: 'Projects',
    description: 'Figma diagram of system architecture and DB schema.',
  },
  {
    name: 'Advanced WebGL Shaders Tutorial',
    url: 'https://thebookofshaders.com',
    category: 'Learning',
    description: 'Guide to fragment shaders and WebGL graphics.',
  },
  {
    name: 'Updated Resume 2024',
    url: 'https://drive.google.com/file/d/resume-2024',
    category: 'Career',
    description: 'Current CV and portfolio achievements.',
  },
  {
    name: 'Design Inspiration Board',
    url: 'https://pinterest.com/ui-ux-ideas',
    category: 'Social',
    description: 'Curated gallery of SaaS web design concepts.',
  },
  {
    name: 'GitHub Repositories',
    url: 'https://github.com/linkvault-main',
    category: 'Coding',
    description: 'Direct access to core platform repositories and codebase.',
  },
  {
    name: 'Design System Tokens',
    url: 'https://figma.com/design-tokens',
    category: 'Projects',
    description: 'Figma library source of truth and exported JSON tokens.',
  },
  {
    name: 'Q3 Marketing Plan',
    url: 'https://docs.google.com/q3-marketing',
    category: 'Education',
    description: 'Google doc with budget breakdown and campaign goals.',
  },
  {
    name: 'Weekly Sync Meet',
    url: 'https://zoom.us/j/weekly-sync',
    category: 'Others',
    description: 'Recurring Zoom meeting link for the core team.',
  },
];

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

    // Auto-seed if user has 0 links total
    const totalCount = await Link.countDocuments({ userId: auth.userId });
    if (totalCount === 0 && !search && (!category || category === 'All')) {
      console.log('[Links API] Auto-seeding sample Stitch links for user:', auth.userId);
      await Link.insertMany(
        DEFAULT_SAMPLE_LINKS.map((item) => ({
          ...item,
          userId: auth.userId,
        }))
      );
    }

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
