'use client'
// Import necessary modules and components
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, deleteDoc, doc, getDocs, updateDoc, getDoc } from 'firebase/firestore';
import { teksDB, auth, db } from '../../../lib/firebase-config';
import { DonationData } from '../../../types/donations';
import { Unsubscribe } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Request } from '@/types/requests';

const MyDonations = () => {
  const [userDonations, setUserDonations] = useState<DonationData[]>([]);
  const [donationRequests, setDonationRequests] = useState<Request[]>([]);

  const router = useRouter();

  const handleViewRequests = async (donationId: string) => {
    try {
      const requests = await fetchDonationRequests(donationId);
      if (requests) {
        setDonationRequests(requests);
      }
    } catch (error) {
      console.error('Error handling view requests:', error);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const requestDocRef = doc(db, 'requests', requestId);

      console.log(requestId)
  
      // Check if the document exists
      const requestDoc = await getDoc(requestDocRef);
  
      if (requestDoc.exists()) {
        await updateDoc(requestDocRef, { status: 'ACCEPTED' });
  
        alert('Donation request accepted successfully!');
  
      } else {
        console.log('Document does not exist:', requestId);
        alert('Error: The donation request does not exist.');
      }
    } catch (error) {
      console.error('Error handling accept request:', error);
    }
  };
  
  const handleRejectRequest = async (requestId: string) => {
    try {
      const requestDocRef = doc(db, 'requests', requestId);
  
      const requestDoc = await getDoc(requestDocRef);
  
      if (requestDoc.exists()) {
        await updateDoc(requestDocRef, { status: 'REJECTED' });
  
        alert('Donation request rejected successfully!');
      } else {
        console.log('Document does not exist:', requestId);
        alert('Error: The donation request does not exist.');
      }
    } catch (error) {
      console.error('Error handling reject request:', error);
    }
  };

  const fetchDonationRequests = async (donationId: string): Promise<Request[]> => {
    try {
      const donationRequestsRef = collection(db, 'requests');
      const donationRequestsQuery = query(donationRequestsRef, where('donationId', '==', donationId));
  
      const donationRequestsData = await getDocs(donationRequestsQuery);
      const donationRequests = donationRequestsData.docs.map((doc) => {
        const data = doc.data();
        return {
          requestID: doc.id,
          recipient_id: data.recipient_id,
          recipient_name: data.recipient_name,
          donation_id: data.donation_id,
          status: data.status,
          createdAt: data.createdAt,
        } as Request;
      });
  
      return donationRequests;
    } catch (error) {
      console.error('Error fetching donation requests:', error);
      throw error;
    }
  };

  const getUserDonations = async (): Promise<Unsubscribe> => {
    try {
      const userDonationsRef = collection(teksDB, 'donations');
      
      const userDonationsQuery = query(userDonationsRef, where('userId', '==', auth.currentUser?.uid));

      const unsubscribe = onSnapshot(userDonationsQuery, (snapshot) => {
        const userDonations = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as DonationData[];
        setUserDonations(userDonations);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error fetching user donations:', error);
      throw error;
    }
  };

  const deleteDonation = async (donationId: string) => {
    try {
      const donationDocRef = doc(teksDB, 'donations', donationId);
      await deleteDoc(donationDocRef);
      alert('Data deleted successfully');
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
    let unsubscribe: Unsubscribe | undefined;
  
    const fetchData = async () => {
      try {
        unsubscribe = await getUserDonations();
      } catch (error) {
        console.error('Error fetching user donations:', error);
      }
    };
  
    fetchData();
  
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return (
    <section className="pb-8 pt-20 px-0 md:px-20 lg:pb-[70px] lg:pt-[120px]">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl md:leading-[48px] mb-4 sm:mb-6 sm:leading-[60px]">
            Your Donations
          </h2>
        </div>
        <div className="md:mx-0 mt-12 flex md:gap-6 gap-4 items-center justify-start flex-wrap">
          <ul className="md:w-80 sm:w-60 w-32 bg-white shadow rounded">
            {userDonations.map((donation) => (
              <li key={donation.id}>
                <img className="md:h-48 h-20 w-full bg-gray-200 flex flex-col justify-between md:p-4 md:bg-cover bg-center" src={donation.imageURL} alt={donation.title} />
                <div className="p-4 flex flex-col">
                  <div className="flex justify-between items-center">
                    <h1 className="text-black truncate text-base md:text-xl" style={{ textTransform: 'capitalize' }}>{donation.title}</h1>
                    <p className="md:text-base text-[8px]" style={{ textTransform: 'capitalize' }}>{donation.category}</p>
                  </div>
                  <div className="md:flex hidden flex-col items-start">
                    <p className="text-gray-400 flex flex-row gap-1 truncate justify-center md:text-xs text-[8px]" style={{ textTransform: 'capitalize' }}>{donation.description}</p>
                    <p className="text-gray-400 text-xs text-center">{donation.quantity} item</p>
                    <p className="text-gray-400 text-xs text-center">{donation.province}</p>
                    <p className="text-gray-400 text-xs text-center">{donation.district}</p>
                    <p className="text-red-500 text-xs text-center">{formatDeadline(donation.deadline)}</p>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-center">
                  <button className="bg-[#FF6969] text-xs md:text-base text-black w-full md:px-2 py-2" onClick={() => deleteDonation(donation.id)}>
                    Delete
                  </button>
                  <button className="bg-[#A6D0DD] text-xs md:text-base text-black w-full md:px-2 py-2" onClick={() => router.push(`mydonations/donation-edit/${donation.id}`)}>
                    Edit
                  </button>
                  <button onClick={() => handleViewRequests(donation.id)}>
                    View Requests
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {donationRequests.length > 0 && (
            <div>
              <h3>Donation Requests:</h3>
              <ul>
                {donationRequests.map((request) => (
                  <li key={request.recipient_id}>
                    {request.recipient_name}
                    <button onClick={() => handleAcceptRequest(request.requestID)}>
                      Accept
                    </button>
                    <button onClick={() => handleRejectRequest(request.requestID)}>
                      Reject
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MyDonations;
