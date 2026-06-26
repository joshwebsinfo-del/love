import prisma from "@/lib/prisma";
import MemoriesClient from "./MemoriesClient";

export const revalidate = 60; // Cache for 60 seconds for lightning fast loads

export default async function MemoriesPage() {
  const memories = await prisma.memory.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10, // LIMIT TO 10 TO PREVENT 502 BAD GATEWAY
    select: { id: true, title: true, description: true, type: true, imageUrl: true, createdAt: true } // OMIT videoUrl
  });

  return <MemoriesClient initialMemories={memories} />;
}
