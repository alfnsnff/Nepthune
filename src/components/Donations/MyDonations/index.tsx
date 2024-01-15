'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import SectionTitle from '@/components/common/SectionTitle';
import { teksDB, auth } from '../../../lib/firebase-config';
import { DonationData } from '../../../types/donations';
import { useRouter } from 'next/navigation';

const MyDonations = () => {
  const [userDonations, setUserDonations] = useState<DonationData[]>([]);
  const router = useRouter();

  const getUserDonations = async () => {
    try {
      const userDonationsRef = collection(teksDB, 'donations');
      const userDonationsQuery = query(userDonationsRef, where('userId', '==', auth.currentUser?.uid));

      const userDonationsData = await getDocs(userDonationsQuery);
      const userDonations = userDonationsData.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as DonationData[];

      setUserDonations(userDonations);
    } catch (error) {
      console.error('Error fetching user donations:', error);
    }
  };

  const deleteDonation = async (donationId: string) => {
    try {
      const donationDocRef = doc(teksDB, 'donations', donationId);
      await deleteDoc(donationDocRef);
      alert('Data deleted successfully');
      await getUserDonations();
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const formatDeadline = (deadline: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short',
    };

    return new Intl.DateTimeFormat('id-ID', options).format(new Date(deadline));
  };

  useEffect(() => {
    getUserDonations();
  }, []);
  return (
    <section className="pb-8 pt-20 px-0 md:px-20 lg:pb-[70px] lg:pt-[120px]">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <SectionTitle subtitle="Your donation" title="Thanks a lot yo!" paragraph="Customize or eliminate your entire donation – the power is in your hands!" />
        </div>
        <div className="md:mx-0 mt-12 flex md:gap-6 gap-4 items-center justify-start flex-wrap">
          <ul className="md:w-80 sm:w-60 w-32 bg-white shadow rounded">
            {userDonations.map((donation) => (
              <li key={donation.id}>
                <img className="md:h-48 h-20 w-full bg-gray-200 flex flex-col justify-between md:p-4 md:bg-cover bg-center" src={donation.imageURL} alt={donation.title} />
                <div className="p-4 flex flex-col">
                  {/* title */}
                  <div className="flex justify-between items-center">
                    <h1 className=" text-black truncate text-base  md:text-xl" style={{textTransform: 'capitalize'}}>{donation.title}</h1>
                    <p className="md:text-base text-[8px]" style={{textTransform: 'capitalize'}}>{donation.category}</p>
                  </div>
                  {/* desc */}
                  <div className="md:flex hidden flex-col items-start">
                    <p className="text-gray-400 flex flex-row gap-1  truncate justify-center md:text-xs text-[8px]" style={{textTransform: 'capitalize'}}>{donation.description}</p>
                    <p className="text-gray-400  text-xs text-center">{donation.quantity} item</p>
                    <p className="text-gray-400  text-xs text-center">{donation.province}</p>
                    <p className="text-gray-400  text-xs text-center">{donation.district}</p>
                    <p className="text-red-500  text-xs text-center"> {formatDeadline(donation.deadline)}</p>
                  </div>
                </div>
                {/* button */}
                <div className="flex flex-row items-center justify-center">
                  <button className="bg-[#FF6969] text-xs md:text-base text-black w-full md:px-2 py-2" onClick={() => deleteDonation(donation.id)}>
                    Delete
                  </button>
                  <button className="bg-[#A6D0DD] text-xs md:text-base text-black w-full md:px-2 py-2" onClick={() => router.push(`mydonations/donation-edit/${donation.id}`)} >
                    Edit
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <ul></ul>
        </div>
      </div>
    </section>
  );
};

export default MyDonations;
