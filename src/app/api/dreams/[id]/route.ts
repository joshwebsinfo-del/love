import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { NextRequest } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);
    if (isNaN(id)) {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    const { completed } = await request.json();

    const updatedDream = await prisma.dream.update({
      where: { id },
      data: { completed },
    });

    return NextResponse.json(updatedDream);
  } catch (error) {
    console.error('Error updating dream:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
