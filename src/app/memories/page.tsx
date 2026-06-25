import prisma from "@/lib/prisma";
import MemoriesClient from "./MemoriesClient";

export const revalidate = 60; // Cache for 60 seconds for lightning fast loads

export default async function MemoriesPage() {
  const memories = await prisma.memory.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <MemoriesClient initialMemories={memories} />;
}
