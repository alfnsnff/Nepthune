'use client';
import React, { useState } from 'react';
import SectionTitle from '../common/SectionTitle';
import SingleCard from './SingleCard';
import { Items } from '@/types/items';

const ItemsComponent = ({ itemsData }: { itemsData: Items[] }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredItems = itemsData.filter((item) => {
    const categoryCondition = selectedCategory ? item.category === selectedCategory : true;
    const titleCondition = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryCondition && titleCondition;
  });

  return (
    <section className="pb-8 pt-10 px-0 md:px-20 lg:pb-[70px] lg:pt-[80px]">
      <div className="container">
        <div className="w-full flex justify-start mb-8">
          <SectionTitle subtitle="Product" title="Give Your Waste a Second Chance" paragraph="Choose available items below that are useful to you" />
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center w-full border border-gray-500 sm:w-1/2 md:w-1/3 h-10 rounded-lg focus-within:border-2 focus-within:border-blue-400 bg-white overflow-hidden">
            <div className="grid place-items-center h-full w-12 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input type="text" id="searchInput" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by title" className="peer bg-white h-full w-full outline-none text-sm text-black pr-2" />
          </div>
          <div className="flex items-center">
            <div className="border-gray-500 h-10 md:flex items-center hidden text-md border px-3 rounded-full focus-within:border-2 focus-within:border-blue-400">
              <label htmlFor="categoryFilter" className="font-semibold md:mr-2 ">
                Sort by
              </label>
              <select id="categoryFilter" value={selectedCategory || ''} onChange={(e) => setSelectedCategory(e.target.value || null)} className="bg-white outline-none ">
                <option value="">All Categories</option>
                <option value="food">Food</option>
                <option value="non-food">Non-Food</option>
              </select>
            </div>
          </div>
        </div>

        <div className='flex justify-center md:mx-0 mt-12'>
          <div className=" flex sm:gap-6 gap-4  items-stretch xl:justify-start justify-center flex-wrap">
            {filteredItems.map((item) => (
              <SingleCard key={item.id} items={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ItemsComponent;
