import prisma from "@/lib/prisma";
import MemoriesClient from "./MemoriesClient";

export const revalidate = 60; // Cache for 60 seconds for lightning fast loads

export default async function MemoriesPage() {
  const memories = await prisma.memory.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5, // LIMIT TO 5 TO PREVENT 502 BAD GATEWAY FROM HUGE BASE64 STRINGS IN HTML
  });

  return <MemoriesClient initialMemories={memories} />;
}
