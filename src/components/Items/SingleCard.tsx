import { Items } from '@/types/items';
import Link from 'next/link';

const SingleCard = ({ items }: { items: Items }) => {
  const { img, user, title, location, total, btn, btnLink } = items;

  return (
    <div className="w-80 bg-white shadow rounded">
      {' '}
      <div
        className="h-48 w-full bg-gray-200 flex flex-col justify-between p-4 bg-cover bg-center"
        //imgg
        style={{ backgroundImage: `url('${img}')` }}
      >
        {' '}
      </div>{' '}
      <div className="p-4 flex flex-col items-start">
        {/* title */}
        <p className="text-gray-400 flex flex-row gap-1 justify-center text-xs ">
          {user}{' '}
          <svg height="10px" width="10px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xmlSpace="preserve" fill="#3468C0" stroke="#3468C0">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <ellipse style={{ fill: '#3468C0' }} cx="256" cy="256" rx="256" ry="255.832"></ellipse>{' '}
              <polygon style={{ fill: '#FFFFFF' }} points="235.48,392.08 114.44,297.792 148.84,253.616 223.176,311.512 345.848,134.504 391.88,166.392 "></polygon>{' '}
            </g>
          </svg>
        </p>
        <h1 className="text-gray-800 text-center mt-1">{title}</h1>
        {/* location */}
        <p className="text-gray-400  text-xs text-center">Free • {location}</p>

        <div className="inline-flex items-center mt-2">
          <div className="bg-gray-100 border-t border-b border-gray-100 text-gray-600 hover:bg-gray-100 inline-flex items-center px-4 py-1 select-none">Available {total} </div>{' '}
        </div>
        {/* btn & btnLink */}
        <Link href={btnLink} className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50 mt-4 w-full flex items-center justify-center">
          {' '}
          {btn}{' '}
        </Link>
      </div>
    </div>
  );
};

export default SingleCard;