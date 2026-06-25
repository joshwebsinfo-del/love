import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { NextRequest } from 'next/server';

export async function GET() {
  try {
    const timelineEvents = await prisma.timelineEvent.findMany({
      orderBy: { createdAt: 'asc' }, // usually timeline is chronological
    });
    return NextResponse.json(timelineEvents);
  } catch (error) {
    console.error('Error fetching timeline:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { date, title, description, icon } = await request.json();
    if (!date || !title || !description) {
      return new NextResponse('Missing fields', { status: 400 });
    }
    const timelineEvent = await prisma.timelineEvent.create({
      data: { date, title, description, icon: icon || 'Circle' },
    });
    return NextResponse.json(timelineEvent, { status: 201 });
  } catch (error) {
    console.error('Error creating timeline event:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
