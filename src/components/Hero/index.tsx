  'use client';

  import React, { useState, useEffect } from 'react';
  import {  collection, getDocs, query, where} from "firebase/firestore";
  import { teksDB, auth} from "../../lib/firebase-config";
  import { DonationData } from "../../types/donations";
  import Image from 'next/image';
  import { useRouter } from "next/navigation";
  import { Metadata } from "next";
  import Items from '../Items/index';


  // link bg
  // https://www.freepik.com/free-vector/gradient-mountain-landscape_20547362.htm#query=nature%20illustration&position=0&from_view=keyword&track=ais&uuid=4544d526-34b8-4928-b2c6-fbb482537c52

  export const metadata: Metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
  };

    const Hero = () => {
      const router = useRouter();
      const [userDonations, setUserDonations] = useState<DonationData[]>([]);
      const [selectedDonationId, setSelectedDonationId] = useState<string | null>(null);
      const [selectedDonationStatus, setSelectedDonationStatus] = useState<string | null>(null);


      

      const handleDonateClick = () => {
        if (auth.currentUser) {
          router.push('/donations');
        } else {
          router.push('/auth/signin');
        }
      };

      const [donations, setDonations] = useState<DonationData[]>([]);

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
    
    const getDonationRequestStatus = async (donationId: string) => {
      try {
        const requestQuery = query(
          collection(teksDB, 'requests'),
          where('donation_id', '==', donationId),
          where('recipient_id', '==', auth.currentUser?.uid)
        );
    
        const requestSnapshot = await getDocs(requestQuery);
    
        if (!requestSnapshot.empty) {
          const requestDocument = requestSnapshot.docs[0].data();
          const status = requestDocument.status;
    
          console.log('Donation Request Status:', status);
    
          setSelectedDonationStatus(status);
        } else {
          setSelectedDonationStatus(null);
        }
      } catch (error) {
        console.error('Error fetching donation request status:', error);
      }
    };
    

      const getDonationsData = async () => {
        try {
          const valRef = collection(teksDB, "donations");
          const dataDb = await getDocs(valRef);
          const allData = dataDb.docs.map((val) => ({ id: val.id, ...val.data() } as DonationData));
          setDonations(allData);
        } catch (error) {
          console.error("Error fetching donations data:", error);
        }
      };

      useEffect(() => {
        getDonationsData();
      }, []);
      
  return (
    <>
      <section
        id="home"
        className="relative  md:h-screen my-0 mx-auto overflow-hidden pt-[120px] text-black md:pt-[130px] lg:pt-[160px]"
        style={{
          backgroundImage: `url('/images/bg.jpg')`,
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          backgroundRepeat: 'no-repeat', 
        }}
      >
        <div className="container">
          <div className="mx-4 flex flex-wrap items-center">
            <div className="mb-8 w-full px-4">
              <div className="hero-content wow fadeInUp mx-auto max-w-[780px] text-center" data-wow-delay=".2s">
                <h1 className="mb-6 text-3xl font-bold leading-snug text-[#19394e] sm:text-4xl sm:leading-snug lg:text-5xl lg:leading-[1.2]">Share More. Waste Less.</h1>
                <p className="mx-auto mb-4 max-w-[600px] text-base font-medium text-white sm:text-lg sm:leading-[1.44]">Sharing App and Donation</p>
                <div className="group relative bg-white/[0.12] mb-4 inline-block overflow-hidden rounded px-4 py-0 font-medium text-sm text-black">
                  <span className="absolute left-0 top-0 mb-0 flex h-0 w-full translate-y-0 transform bg-[#49adaeff] opacity-90 transition-all duration-200 ease-out group-hover:h-full"></span>
                  <span className="relative gap-2 flex flex-row items-center justify-center group-hover:text-white">
                    Feature
                    <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(90deg)' }}>
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                      <g id="SVGRepo_iconCarrier">
                        <g id="Interface / Line_L">
                          <path id="Vector" d="M12 19V5" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>
                        </g>
                        </g>
                      </svg>
                      <Image src="/Images/donation.svg" alt="Rotated SVG" width={20} height={20} />
                      <Image src="/Images/community.svg" alt="Rotated SVG" width={20} height={20} />
                    </span>
                  </div>
                  <ul className="mb-10 flex flex-wrap items-center justify-center gap-5">
                    <li>
                        <button
                        onClick={handleDonateClick}
                        className="inline-flex items-center justify-center rounded-md hover:opacity-55 bg-white px-7 py-[14px] text-center text-base font-medium text-dark shadow-1 transition duration-300 ease-in-out hover:bg-gray-2">
                        Donate Now
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <Items itemsData={donations.map(donation => ({
            id: donation.id,
            img: donation.imageURL, 
            user: donation.username,
            title: donation.title, 
            category: donation.category,
            total: donation.quantity, 
            province: donation.province,
            district: donation.district,
            deadline: donation.deadline,           
            btn: "Detail",
            btnLink: `donation-detail/${donation.id}`,
          }))} />
        </section>

      </>
    );
  };

  export default Hero;

  Hero.requireAuth = true;
