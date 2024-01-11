import SectionTitle from '../common/SectionTitle';

export default function ItemDesc() {
  return (
    <section className="pb-8 pt-20 px-20  lg:pb-[70px] lg:pt-[120px]">
      <div className="w-full text-center bg-[#f2f4f6">
        <img className="h-auto max-w-full" src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="image description" />
      </div>
      <SectionTitle subtitle="Items" title="Free Queen Bed Frame" paragraph="San Francisco, CA" />
    </section>
  );
}
