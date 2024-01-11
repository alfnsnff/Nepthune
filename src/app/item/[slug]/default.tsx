import Image from 'next/image';
import Link from 'next/link';
import SectionTitle from '@/components/common/SectionTitle';

export default function Post() {
  return (
    <section className="container px-8 lg:py-8 mx-auto xl:px-5 max-w-screen-lg">
      <div className="mx-auto max-w-screen-md ">
        <div className="w-full  bg-[#f2f4f6] relative z-0 mx-auto aspect-video max-w-screen-lg overflow-hidden lg:rounded-lg">
          <Image
            className="h-auto object-cover"
            src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="image description"
          />
        </div>
        <SectionTitle subtitle="Items" title="Free Queen Bed Frame" paragraph="San Francisco, CA" />
      </div>
    </section>
  );
}
