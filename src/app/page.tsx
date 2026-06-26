import LandingPage from "@/components/LandingPage";
import prisma from "@/lib/prisma";

export const revalidate = 60; // Cache the dashboard for 60 seconds to drastically improve server load speed

export default async function Home() {
  const [notes, imageMemories, videoMemories, timeline] = await Promise.all([
    prisma.note.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.memory.findMany({ where: { type: 'image' }, orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.memory.findMany({ where: { type: 'video' }, orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.timelineEvent.findMany({ orderBy: { createdAt: 'desc' }, take: 5 })
  ]);

  const combinedMemories = [...imageMemories, ...videoMemories];

  return <LandingPage initialNotes={notes} initialMemories={combinedMemories} initialTimeline={timeline} />;
}
