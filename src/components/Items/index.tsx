import SectionTitle from '../common/SectionTitle';
import SingleCard from './SingleCard';
import { Items } from '@/types/items'; // Import the correct type

const ItemsComponent = ({ itemsData }: { itemsData: Items[] }) => {
  return (
    <section className="pb-8 pt-20 px-20 lg:pb-[70px] lg:pt-[120px]">
      <div className="container">
        <SectionTitle subtitle="Product" title="Give Your Waste a Second Chance" paragraph="Choose available items below that are useful to you" />
        <div className="-mx-4 mt-12 flex gap-6 items-center justify-start flex-wrap">
          {itemsData.map((items) => (
            <SingleCard key={items.id} items={items} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ItemsComponent;
