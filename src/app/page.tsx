import Hero from '@/components/Hero';
import ScrollUp from '@/components/common/ScrollUp';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nepthune',
};

export default function Home() {
  return (
    <main>
      <ScrollUp />
      <Hero />
    </main>
  );
}
