import LandingPage from "@/components/LandingPage";
import prisma from "@/lib/prisma";

export const revalidate = 60; // Cache the dashboard for 60 seconds to drastically improve server load speed

export default async function Home() {
  const [notes, memories, timeline] = await Promise.all([
    prisma.note.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.memory.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.timelineEvent.findMany({ orderBy: { createdAt: 'desc' }, take: 5 })
  ]);

  return <LandingPage initialNotes={notes} initialMemories={memories} initialTimeline={timeline} />;
}
