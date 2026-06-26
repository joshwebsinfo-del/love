import LandingPage from "@/components/LandingPage";
import prisma from "@/lib/prisma";

export const revalidate = 60; // Cache the dashboard for 60 seconds to drastically improve server load speed

export default async function Home() {
  const [notes, imageMemories, videoMemories, timeline] = await Promise.all([
    prisma.note.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.memory.findMany({ 
      where: { type: 'image' }, 
      orderBy: { createdAt: 'desc' }, 
      take: 5,
      select: { id: true, title: true, description: true, type: true, imageUrl: true, createdAt: true }
    }),
    prisma.memory.findMany({ 
      where: { type: 'video' }, 
      orderBy: { createdAt: 'desc' }, 
      take: 1, // ONLY GRAB 1 VIDEO to prevent RAM exhaustion and 502 crash!
    }),
    prisma.timelineEvent.findMany({ orderBy: { createdAt: 'desc' }, take: 5 })
  ]);

  const combinedMemories = [...imageMemories, ...videoMemories];

  return <LandingPage initialNotes={notes} initialMemories={combinedMemories} initialTimeline={timeline} />;
}
