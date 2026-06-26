import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const memory = await prisma.memory.findUnique({
      where: { id: Number(id) },
      select: { videoUrl: true }
    });

    if (!memory || !memory.videoUrl) {
      return new NextResponse('Not found', { status: 404 });
    }

    return NextResponse.json({ videoUrl: memory.videoUrl });
  } catch (error) {
    console.error('Error fetching video url:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
