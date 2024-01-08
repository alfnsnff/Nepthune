import Image from 'next/image';
import Hero from '@/components/Hero';
import ScrollUp from '@/components/common/ScrollUp';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Play Next.js - SaaS Starter Kit and Boilerplate for Next.js',
  description: 'Free Next.js SaaS Boilerplate and Starter Kit designed and built for SaaS startups. It comes with all necessary integrations, pages, and components you need to launch a feature-rich SaaS websites.',
};

export default function Home() {
  return (
    <main>
      <ScrollUp />
      <Hero />
    </main>
  );
}
