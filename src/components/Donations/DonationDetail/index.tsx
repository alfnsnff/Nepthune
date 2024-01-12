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

const DonationDetail = () => {
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
  
  const router = useRouter();

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

  const formatDeadline = (deadline: string): string => {
    const deadlineDate = new Date(deadline);
  
    // Periksa apakah deadlineDate adalah waktu yang valid
    if (isNaN(deadlineDate.getTime())) {
      return "Invalid Deadline";
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
    <div className="lg:py-28">
    <div>
      {image && <img src={image} alt="Preview" />}
    </div>
    <div>
      <span>Title: {title && title.charAt(0).toUpperCase() + title.slice(1)}</span>
    </div>
    <div>
      <span>Category: {category && category.charAt(0).toUpperCase() + category.slice(1)}</span>
    </div>
    <div>
      <span>Description: {description && description.charAt(0).toUpperCase() + description.slice(1)}</span>
    </div>
    <div>
      <span>Quantity: {quantity}</span>
    </div>
    <div>
      <span>Province: {province && province.charAt(0).toUpperCase() + province.slice(1)}</span>
    </div>
    <div>
      <span>District: {district && district.charAt(0).toUpperCase() + district.slice(1)}</span>
    </div>
    <div>
      <span>Deadline: {formatDeadline(deadline)}</span>
    </div>
    <button type="button" onClick={() => router.push('/')}>
      Back
    </button>
  </div>
  );
};

export default DonationDetail;