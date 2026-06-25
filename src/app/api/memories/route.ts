import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/memories - list all memories with their images
export async function GET(request: Request) {
  try {
    const memories = await prisma.memory.findMany({
      include: { images: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(memories);
  } catch (error) {
    console.error('Error fetching memories:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST /api/memories - create a new memory
// Expected JSON body: { content: string }
export async function POST(request: Request) {
  try {
    const { content } = await request.json();
    if (!content) {
      return new NextResponse('Missing content', { status: 400 });
    }
    const memory = await prisma.memory.create({
      data: { content },
    });
    return NextResponse.json(memory, { status: 201 });
  } catch (error) {
    console.error('Error creating memory:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE /api/memories/:id - delete a memory by id
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return new NextResponse('Missing id parameter', { status: 400 });
    }
    await prisma.memory.delete({ where: { id: Number(id) } });
    return new NextResponse('Deleted', { status: 204 });
  } catch (error) {
    console.error('Error deleting memory:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
