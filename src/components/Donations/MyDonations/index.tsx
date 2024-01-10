'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { teksDB, auth } from '../../../lib/firebase-config';
import { DonationData } from '../../../types/donations';
import { useRouter} from 'next/navigation';

const MyDonations = () => {
    const [userDonations, setUserDonations] = useState<DonationData[]>([]);
    const router = useRouter();

    const getUserDonations = async () => {
        try {
        const userDonationsRef = collection(teksDB, 'donations');
        const userDonationsQuery = query(
            userDonationsRef,
            where('userId', '==', auth.currentUser?.uid)
        );

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
        getUserDonations(); // Ambil ulang data donasi setelah menghapus
      } catch (error) {
        console.error('Error deleting document:', error);
      }
  };

  useEffect(() => {
    getUserDonations();
  }, []);
  return (
    <>
        <div className='my-20'>
            <h2 className='text-2xl ml-4'>My Donations</h2>
            <ul>
                {userDonations.map((donation) => (
                    <li key={donation.id}>
                    <p>Title: {donation.title}</p>
                    <p>Category: {donation.category}</p>
                    <p>Description: {donation.description}</p>
                    <img src={donation.imageURL} alt={donation.title} />
                    <p>Quantity: {donation.quantity}</p>
                    {/* Menambahkan deklarasi variabel donation di sini */}
                    <button className='bg-slate-400 px-2 py-3' onClick={() => deleteDonation(donation.id)}>
                        Delete
                    </button>
                    <button onClick={() => router.push(`mydonations/donation-edit/${donation.id}`)} className=' ml-24'>
                        Edit
                    </button>
                    </li>
                ))}
            </ul>
        </div>
    </>
  );
};

export default MyDonations;
