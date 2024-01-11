import SectionTitle from '../common/SectionTitle';
import SingleCard from './SingleCard';
import ItemsData from './ItemsData';

const Items = () => {
  return (
    <section className="pb-8 pt-20 px-20  lg:pb-[70px] lg:pt-[120px]">
      <div className="container">
        <SectionTitle subtitle="Items" title="Give Your Waste a Seconde Change" info="choose available item below that useful to you" />
        <div className="-mx-4 mt-12 flex gap-6 items-center justify-start flex-wrap ">
          {ItemsData.map((items) => (
            <SingleCard key={items.id} items={items} />
          ))}
          {/* <SingleCard /> */}
        </div>
      </div>
    </section>
  );
};

export default Items;
