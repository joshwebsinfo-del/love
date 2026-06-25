import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { NextRequest } from 'next/server';

export async function GET() {
  try {
    const dreams = await prisma.dream.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(dreams);
  } catch (error) {
    console.error('Error fetching dreams:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, category, completed } = await request.json();
    if (!title || !category) {
      return new NextResponse('Missing fields', { status: 400 });
    }
    const dream = await prisma.dream.create({
      data: { title, category, completed: completed || false },
    });
    return NextResponse.json(dream, { status: 201 });
  } catch (error) {
    console.error('Error creating dream:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
