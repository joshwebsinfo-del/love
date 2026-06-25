import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('image') as File | null;
  if (!file) {
    return new NextResponse('No image uploaded', { status: 400 });
  }
  // In a real app, you'd upload the file to a storage provider (e.g., S3) and obtain a public URL.
  // Here we simulate by using the original filename as a placeholder URL.
  const placeholderUrl = `https://example.com/uploads/${encodeURIComponent(file.name)}`;
  const image = await prisma.image.create({
    data: {
      url: placeholderUrl,
      // You could store additional metadata like size, MIME type, etc.
    },
  });
  return NextResponse.json(image);
}
