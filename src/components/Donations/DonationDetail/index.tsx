'use client';
import React, { useState, useEffect } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { DonationData } from '../../../types/donations';
import { addDoc, collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { auth, imgDB, teksDB } from '../../../lib/firebase-config';
import { v4 } from 'uuid';
import { provinceDistrictsData } from '../provinceDistrictsData';
import { useRouter } from 'next/navigation';

const DonationDetail = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [deadline, setDeadline] = useState<string>('');
  const [donationId, setDonationId] = useState<string | null>(null);
  const [districtOptions, setDistrictOptions] = useState<string[]>([]);

  const router = useRouter();

  const getData = async () => {
    try {
      const valRef = collection(teksDB, 'donations');
      const dataDb = await getDocs(valRef);
      const allData = dataDb.docs.map((val: any) => ({ id: val.id, ...val.data() } as DonationData));

      const pathArray = window.location.pathname.split('/');
      const queryDonationId = pathArray[pathArray.length - 1];
      setDonationId(queryDonationId);

      if (!queryDonationId) {
        console.log('No Donation Id found');
        return;
      }

      const donationToEdit = allData.find((donation) => donation.id === queryDonationId);

      if (!donationToEdit) {
        console.log('Donation not found');
        return;
      }
      const initialCategory = donationToEdit.category || '';
      setTitle(donationToEdit.title);
      setCategory(initialCategory);
      setDescription(donationToEdit.description);
      setImage(donationToEdit.imageURL);
      setQuantity(donationToEdit.quantity);
      setProvince(donationToEdit.province);
      setDistrict(donationToEdit.district);
      setDeadline(donationToEdit.deadline || '');
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const formatDeadline = (deadline: string): string => {
    const deadlineDate = new Date(deadline);

    if (isNaN(deadlineDate.getTime())) {
      return 'Invalid Deadline';
    }

    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short',
    };

    return new Intl.DateTimeFormat('id-ID', options).format(deadlineDate);
  };
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (provinceDistrictsData[province]) {
      setDistrictOptions(provinceDistrictsData[province]);
    }
  }, [province]);

  return (
    <section className="container md:mt-20 mt-0 pt-[120px] px-8 lg:py-8 mx-auto xl:px-5 max-w-screen-md">
      <div className="mx-auto">
        {/* img */}
        <div className="w-full mb-4 bg-[#f2f4f6] mx-auto aspect-video max-w-screen-lg overflow-hidden lg:rounded-lg">{image && <img src={image} alt="Preview" />}</div>

        {/* title and category */}
        <div className="flex md:flex-row justify-between gap-4 px-4 flex-col">
          <div className=" flex flex-wrap">
            <div className="w-full ">
              <span className=" block text-xs font-light italic text-primary">{category && category.charAt(0).toUpperCase() + category.slice(1)}</span>
              <h2 className="mb-4 text-3xl font-bold text-dark  sm:text-4xl md:text-[40px] md:leading-[1.2]">{title && title.charAt(0).toUpperCase() + title.slice(1)}</h2>
            </div>
          </div>
          {/* user */}
          <div className="rounded-xl  border text-black p-4">
            <div className="flex items-center gap-4">
              <img alt="Developer" src="/images/user.svg" className="h-16 w-16  object-cover" />

              <div>
                <h3 className="text-lg font-medium text-black">Karim</h3>

                <div className="flow-root">
                  <ul className="-m-1 flex flex-wrap">
                    <li className="p-1 leading-none">
                      <a href="#" className="text-xs font-medium text-black">
                        {' '}
                        Twitter{' '}
                      </a>
                    </li>

                    <li className="p-1 leading-none">
                      <a href="#" className="text-xs font-medium text-black">
                        {' '}
                        GitHub{' '}
                      </a>
                    </li>

                    <li className="p-1 leading-none">
                      <a href="#" className="text-xs font-medium text-black">
                        Website
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="flex justify-center h-full rounded-lg border border-gray-700 p-4 hover:border-pink-600">
                  <strong className="font-medium text-center text-black">Text Me</strong>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full flex flex-col col-span-12 p-6 divide-y lg:col-span-6 lg:p-10 dark:divide-gray-700">
          <div className="pt-6 pb-4 space-y-2">
            <span className="text-xs">Description : </span>
            <h1 className="text-3xl font-bold">{description && description.charAt(0).toUpperCase() + description.slice(1)}</h1>
          </div>
          <div className="pt-6 pb-4 space-y-2">
            <span className="text-xs">Quantity: </span>
            <h1 className="text-3xl font-bold">{quantity}</h1>
          </div>
          <div className="pt-6 pb-4 space-y-2">
            <span className="text-xs">Province: </span>
            <h1 className="text-3xl font-bold">{province && province.charAt(0).toUpperCase() + province.slice(1)}</h1>
          </div>
          <div className="pt-6 pb-4 space-y-2">
            <span className="text-xs">District: </span>
            <h1 className="text-3xl font-bold">{district && district.charAt(0).toUpperCase() + district.slice(1)}</h1>
          </div>
          <div className="pt-6 pb-4 space-y-2">
            <span className="text-xs">Deadline: </span>
            <h1 className="text-3xl font-bold">{formatDeadline(deadline)}</h1>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push('/')}
          className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 mb-2 text-lg text-white bg-green-500 rounded-md hover:bg-green-400 sm:w-auto sm:mb-0"
          data-primary="green-400"
          data-rounded="rounded-2xl"
          data-primary-reset="{}"
        >
          <svg className="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ transform: "rotate(180deg)" }}>
            <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
          Back
        </button>
      </div>
    </section>
  );
};

export default DonationDetail;
