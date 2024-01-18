'use client'
import React, { useState, useEffect } from "react";
import {
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { DonationData } from '../../../types/donations';
import { addDoc, collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { auth, imgDB, teksDB } from "../../../lib/firebase-config";
import { v4 } from "uuid";
import { provinceDistrictsData } from "../provinceDistrictsData";
import { useRouter } from "next/navigation";


const DonationEdit = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [deadline, setDeadline] = useState<string>("");
  const [donationId, setDonationId] = useState<string | null>(null);
  const [districtOptions, setDistrictOptions] = useState<string[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);

  
  const router = useRouter();

  const validateForm = () => {
    const isValid =
      title !== '' &&
      category !== '' &&
      description !== '' &&
      image !== '' &&
      quantity > 0 &&
      province !== '' &&
      district !== '' &&
      deadline !== '';
  
    setIsFormValid(isValid);
  };

  useEffect(() => {
    validateForm();
  }, [title, category, description, quantity, province, district, deadline, validateForm]);
  

  const handleUpload = (e:any) => {
    const file = e.target.files[0];

    try {
      const imgRef = ref(imgDB, `Imgs/${v4()}`);
      uploadBytes(imgRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setImage(url);
        });
      });
    } catch (error) {
      console.error("Error uploading image:", error);
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
          district: district
        });

        alert("Data edited successfully");
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
        router.push('/mydonations')
      }
    } catch (error) {
      console.error('Error handling donation:', error);
    }
  };

  const getData = async () => {
    try {
      const valRef = collection(teksDB, "donations");
      const dataDb = await getDocs(valRef);
      const allData = dataDb.docs.map((val: any) => ({ id: val.id, ...val.data() } as DonationData));

      const pathArray = window.location.pathname.split('/');
      const queryDonationId = pathArray[pathArray.length - 1];
      setDonationId(queryDonationId);

      if (!queryDonationId) {
        console.log("No Donation Id found");
        return;
      }

      const donationToEdit = allData.find((donation) => donation.id === queryDonationId);

      if (!donationToEdit) {
        console.log("Donation not found");
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
    setDistrict("");

    if (provinceDistrictsData[selectedProvince]) {
      const districtsForProvince = provinceDistrictsData[selectedProvince];
      setDistrictOptions(districtsForProvince);
    }
  };

  const handleDistrictChange = (e: any) => {
    setDistrict(e.target.value);
  };

  return (
    <div className="lg:py-28">
      <form>
        <label htmlFor="image">Image</label>
        <input type="file" id="image" onChange={handleUpload}/>
        {image && <img src={image} alt="Preview" />}
        <br />
        <br />
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)} required
        />
        <br />
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Select Category</option>
          <option value="food">Food</option>
          <option value="non-food">Non-Food</option>
        </select>
        <br />
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)} required
        />
        <br />
        <label htmlFor="quantity">Quantity</label>
        <input type="number" name="quantity" id="quantity" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} required />
        <br />
        <label htmlFor="province">Province</label>
        <select id="province" value={province} onChange={handleProvinceChange} required>
          <option value="">Select Province</option>
          {Object.keys(provinceDistrictsData).map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>
        <br />
        <label htmlFor="district">District</label>
        <select
          id="district"
          value={district}
          onChange={handleDistrictChange}
          disabled={districtOptions.length === 0} required>
          <option value="">Select District</option>
          {districtOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <br />
        <label htmlFor="deadline">Available Until:</label>
        <input
          type="datetime-local"
          id="deadline"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)} required
        />
        <br />
        <button type="button" onClick={handleClick}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default DonationEdit;
