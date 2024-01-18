'use client'

import { Items } from '@/types/items';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase-config';
import { addDoc, collection, getDocs, query, where} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const SingleCard = ({ items }: { items: Items }) => {
  const { id, img, user, title, category, province, district, deadline, total, btn, btnLink } = items;
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  const [btnTakeLabel, setBtnTakeLabel] = useState<string>();

  useEffect(() => {
    const checkAcceptedRequest = async () => {
      try {
        const auth = getAuth();
        const existingAcceptedRequestQuery = query(
          collection(db, 'requests'),
          where('donationId', '==', id),
          where('recipient_id', '==', auth.currentUser?.uid),
          where('status', '==', 'ACCEPTED')
        );
  
        const existingAcceptedRequestSnapshot = await getDocs(existingAcceptedRequestQuery);
  
        if (!existingAcceptedRequestSnapshot.empty) {
          setBtnTakeLabel('Accepted');
        } else {
          const existingRejectedRequestQuery = query(
            collection(db, 'requests'),
            where('donationId', '==', id),
            where('recipient_id', '==', auth.currentUser?.uid),
            where('status', '==', 'REJECTED')
          );
  
          const existingRejectedRequestSnapshot = await getDocs(existingRejectedRequestQuery);
  
          if (!existingRejectedRequestSnapshot.empty) {
            setBtnTakeLabel('Rejected');
          } else {
            setBtnTakeLabel('Take');
          }
        }
      } catch (error) {
        console.error('Error checking accepted/rejected request:', error);
      }
    };
  
    checkAcceptedRequest();
  }, [id]);
  
  
  const handleTakeButtonClick = async () => {
    try {
      const auth = getAuth();
  
      // Check if there is an existing accepted request
      const existingAcceptedRequestQuery = query(
        collection(db, 'requests'),
        where('donationId', '==', id),
        where('recipient_id', '==', auth.currentUser?.uid),
        where('status', '==', 'ACCEPTED')
      );
  
      const existingAcceptedRequestSnapshot = await getDocs(existingAcceptedRequestQuery);
  
      if (!existingAcceptedRequestSnapshot.empty) {
        setBtnTakeLabel('Accepted');
        alert('Your donation request has been accepted!');
        return;
      }
  
      const existingRejectedRequestQuery = query(
        collection(db, 'requests'),
        where('donationId', '==', id),
        where('recipient_id', '==', auth.currentUser?.uid),
        where('status', '==', 'REJECTED')
      );
  
      const existingRejectedRequestSnapshot = await getDocs(existingRejectedRequestQuery);
  
      if (!existingRejectedRequestSnapshot.empty) {
        alert('You cannot send a request for this donation. It has been rejected.');
        setBtnTakeLabel('Rejected');
        return;
      }
  
      const existingPendingRequestQuery = query(
        collection(db, 'requests'),
        where('donationId', '==', id),
        where('recipient_id', '==', auth.currentUser?.uid),
        where('status', '==', 'PENDING')
      );
  
      const existingPendingRequestSnapshot = await getDocs(existingPendingRequestQuery);
  
      if (!existingPendingRequestSnapshot.empty) {
        alert('You have a pending request for this donation. Please wait for the response.');
        setBtnTakeLabel('Pending');
        return;
      }
  
      const requestRef = await addDoc(collection(db, 'requests'), {
        recipient_id: auth.currentUser?.uid,
        recipient_name: auth.currentUser?.displayName,
        donationId: id,
        status: 'PENDING',
        createdAt: new Date(),
      });
  
      const requestId = requestRef.id;
  
      alert('Donation request sent successfully!');
      setBtnTakeLabel('Pending');
      localStorage.setItem(`donationStatus_${id}`, 'Pending');
      setRequestStatus('PENDING');
    } catch (error) {
      console.error('Error handling take button click:', error);
    }
  };
  

  const isDonationAvailable = (deadline: string): boolean => {
    const currentDateTime = new Date();
    const donationDeadline = new Date(deadline);

    const isAvailable = currentDateTime < donationDeadline;

    return isAvailable;
  };

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
  };

  const formattedDeadline = new Intl.DateTimeFormat('id-ID', options).format(new Date(deadline));

  return (
    <div className="lg:w-80 sm:w-60 xs:w-40  w-32 bg-white shadow rounded">
      {' '}
      <div
        className="md:h-48 h-20 w-full bg-gray-200 flex flex-col justify-between md:p-4 bg-cover bg-center"
        //imgg
        style={{ backgroundImage: `url('${img}')` }}
      >
        {' '}
      </div>{' '}
      <div className="p-4 flex flex-col">
        {/* title */}
        <div className="flex justify-between">
          <p className="text-gray-400 flex flex-row gap-1  truncate justify-center md:text-xs text-[8px]" style={{ textTransform: 'capitalize' }}>
            {user}{' '}
            <svg
              height="10px"
              width="10px"
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 512 512"
              xmlSpace="preserve"
              fill="#3468C0"
              stroke="#3468C0"
              className="hidden md:block"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <ellipse style={{ fill: '#3468C0' }} cx="256" cy="256" rx="256" ry="255.832"></ellipse>{' '}
                <polygon style={{ fill: '#FFFFFF' }} points="235.48,392.08 114.44,297.792 148.84,253.616 223.176,311.512 345.848,134.504 391.88,166.392 "></polygon>{' '}
              </g>
            </svg>
          </p>
          <p className="md:text-base text-[8px]">{category}</p>
        </div>
        <div className="md:flex hidden flex-col items-start">
          <h1 className="text-gray-800 text-center mt-1" style={{ textTransform: 'capitalize' }}>
            {title}
          </h1>
          {/* location */}
          <p className="text-gray-400  text-xs text-center">{province}</p>
          <p className="text-gray-400  text-xs text-center">{district}</p>
          {isDonationAvailable(deadline) ? <p className="text-gray-400  text-xs text-center">Available until: {formattedDeadline}</p> : <p className="text-red-700  text-xs text-center">Donation has expired</p>}
        </div>

        <div className="md:inline-flex hidden items-center mt-2">
          <div className="bg-gray-100 border-t border-b border-gray-100 text-gray-600 hover:bg-gray-100 inline-flex items-center px-4 py-1 select-none">Available {total} </div>{' '}
        </div>
        <Link href={btnLink} className="py-2 md:px-4 px-2 md:text-base text-xs  bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50 md:mt-4 mt-1 w-full flex items-center justify-center">
          {' '}
          {btn}{' '}
        </Link>
        <button
          type="button"
          onClick={handleTakeButtonClick}
          className={`py-2 md:px-4 px-2 md:text-base text-xs w-full flex items-center justify-center rounded ${btnTakeLabel === 'Accepted' ? 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700' : (btnTakeLabel === 'Rejected' ? 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700' : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50')} md:mt-4 mt-1`}>
          {btnTakeLabel}
        </button>
      </div>
    </div>
  );
};

export default SingleCard;
