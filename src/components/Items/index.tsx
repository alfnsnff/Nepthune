'use client'
import React, { useState } from 'react';
import SectionTitle from '../common/SectionTitle';
import SingleCard from './SingleCard';
import { Items } from '@/types/items';

const ItemsComponent = ({ itemsData }: { itemsData: Items[] }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredItems = itemsData.filter((item) =>
    selectedCategory ? item.category === selectedCategory : true
  );

  return (
    <section className="pb-8 pt-20 px-20 lg:pb-[70px] lg:pt-[120px]">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <SectionTitle subtitle="Product" title="Give Your Waste a Second Chance" paragraph="Choose available items below that are useful to you" />
          <div>
            <label htmlFor="categoryFilter">Filter by Category:</label>
            <select
              id="categoryFilter"
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
            >
              <option value="">All Categories</option>
              <option value="food">Food</option>
              <option value="non-food">Non-Food</option>
            </select>
          </div>
        </div>
        <div className="-mx-4 mt-12 flex gap-6 items-center justify-start flex-wrap">
          {filteredItems.map((item) => (
            <SingleCard key={item.id} items={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ItemsComponent;