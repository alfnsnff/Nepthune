'use client';
import React, { useState, useEffect } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { DonationData } from '../../../types/donations';
import { addDoc, collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { auth, imgDB, teksDB } from '../../../lib/firebase-config';
import { v4 } from 'uuid';
import { provinceDistrictsData } from '../provinceDistrictsData';
import { useRouter } from 'next/navigation';

const DonationEdit = () => {
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
  const [isFormValid, setIsFormValid] = useState(false);

  const router = useRouter();

  const validateForm = () => {
    const isValid = title !== '' && category !== '' && description !== '' && image !== '' && quantity > 0 && province !== '' && district !== '' && deadline !== '';

    setIsFormValid(isValid);
  };

  useEffect(() => {
    validateForm();
  }, [title, category, description, quantity, province, district, deadline]);

  const handleUpload = (e: any) => {
    const file = e.target.files[0];

    try {
      const imgRef = ref(imgDB, `Imgs/${v4()}`);
      uploadBytes(imgRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setImage(url);
        });
      });
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleClick = async () => {
    const valRef = collection(teksDB, 'donations');

    try {
      if (!title || !category || !description || quantity <= 0 || !province || !district || !deadline) {
        alert('Please fill in all required fields.');
        return;
      }
      if (donationId) {
        const donationDocRef = doc(valRef, donationId);
        await updateDoc(donationDocRef, {
          title: title,
          category: category,
          description: description,
          imageURL: image,
          quantity: quantity,
          province: province,
          district: district,
        });

        alert('Data edited successfully');
        router.push('/mydonations');
      } else {
        const newDocRef = await addDoc(valRef, {
          userId: auth.currentUser?.uid,
          username: auth.currentUser?.displayName,
          title: title,
          category: category,
          description: description,
          imageURL: image,
          quantity: quantity,
          province: province,
          district: district,
        });

        const newDonationId = newDocRef.id;
        alert('Data added successfully');
        router.push('/mydonations');
      }
    } catch (error) {
      console.error('Error handling donation:', error);
    }
  };

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

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (provinceDistrictsData[province]) {
      setDistrictOptions(provinceDistrictsData[province]);
    }
  }, [province]);

  const handleProvinceChange = (e: any) => {
    const selectedProvince = e.target.value;
    setProvince(selectedProvince);
    setDistrict('');

    if (provinceDistrictsData[selectedProvince]) {
      const districtsForProvince = provinceDistrictsData[selectedProvince];
      setDistrictOptions(districtsForProvince);
    }
  };

  const handleDistrictChange = (e: any) => {
    setDistrict(e.target.value);
  };

  return (
    <section className="min-h-screen flex items-stretch text-white">
      <div
        className="lg:flex w-1/2 hidden bg-gray-500 bg-no-repeat bg-cover text-center relative items-center "
        style={{
          backgroundImage: `url('/images/bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
        <div className="w-full px-24 z-10">
          <h1 className="text-4xl font-bold text-center tracking-wide">
            Alone we can do so little. <br />
            together we can do so much.
          </h1>
        </div>{' '}
      </div>

      <div className="lg:w-1/2 w-full h-full flex-col flex items-center justify-center text-center md:px-16 px-0 z-0 bg-[#161616]">
        <div className="w-full md:px-0 px-4 py-20 z-20 ">
          <form>
            <div className="flex flex-col gap-2 justify-start items-start">
              <label htmlFor="image">Image</label>
              <div>
                <input type="file" id="image" onChange={handleUpload} className="mb-2" required />
                {image && <img src={image} alt="Preview" />}
              </div>
              <label htmlFor="title">Title</label>
              <div>
                <input className="block w-full p-4 text-lg rounded-sm bg-black" type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <label htmlFor="category">Category</label>
              <select id="category" className="block w-full p-4 text-lg rounded-sm bg-black" value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="">Select Category</option>
                <option value="food">Food</option>
                <option value="non-food">Non-Food</option>
              </select>

              <label htmlFor="description">Description</label>
              <textarea id="description" className="block w-full p-4 text-lg rounded-sm bg-black" value={description} onChange={(e) => setDescription(e.target.value)} required />

              <label htmlFor="quantity">Quantity</label>
              <input className="block w-full p-4 text-lg rounded-sm bg-black" type="number" name="quantity" id="quantity" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} required />

              <label htmlFor="province">Province</label>
              <select className="block w-full p-4 text-lg rounded-sm bg-black" id="province" value={province} onChange={handleProvinceChange} required>
                <option value="">Select Province</option>
                {Object.keys(provinceDistrictsData).map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>

              <label htmlFor="district">District</label>
              <select className="block w-full p-4 text-lg rounded-sm bg-black" id="district" value={district} onChange={handleDistrictChange} disabled={districtOptions.length === 0} required>
                <option value="">Select District</option>
                {districtOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <label htmlFor="deadline">Available Until:</label>
              <input className="block w-full p-4 text-lg rounded-sm bg-black" type="datetime-local" id="deadline" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />

              <button
                type="button"
                onClick={handleClick}
                className="inline-flex items-center justify-center w-full px-6 py-3 mb-2 text-lg text-white bg-green-500 rounded-md hover:bg-green-400 sm:w-auto sm:mb-0"
                data-primary="green-400"
                data-rounded="rounded-2xl"
                data-primary-reset="{}"
              >
                Submit
                <svg className="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default DonationEdit;
