'use client';

import React, { useState, useEffect } from "react";
import { auth, imgDB, teksDB } from "../../lib/firebase-config";
import { v4 } from "uuid";
import { useRouter } from "next/navigation";
import {
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

import {DonationData} from '../../types/donations';
import { addDoc, collection, getDocs } from "firebase/firestore";
import { provinceDistrictsData } from "./provinceDistrictsData";

const DonationsForm = () => {
    const router = useRouter();
    const [title, setTitle] = useState(""); // Memastikan tipe data string pada useState
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [province, setProvince] = useState("");
    const [district, setDistrict] = useState("");
    const [deadline, setDeadline] = useState<string>("");
    const [districtOptions, setDistrictOptions] = useState<string[]>([]);
    const [data, setData] = useState<DonationData[]>([]);

  const handleUpload = (e:any) => {
    const file = e.target.files[0];

    // Menggunakan try-catch untuk menangani error dengan lebih baik
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
        deadline: deadline
      });

      const donationId = newDocRef.id; 

      alert('Data added successfully');
      router.push('/');
    } catch (error) {
      console.error('Error adding document:', error);
    }
  };

  const handleProvinceChange = (e:any) => {
    const selectedProvince = e.target.value;
    setProvince(selectedProvince);
    setDistrict("");

    if (provinceDistrictsData[selectedProvince]) {
      const districtsForProvince = provinceDistrictsData[selectedProvince];
      setDistrictOptions(districtsForProvince);
    }
  };

  const handleDistrictChange = (e:any) => {
    setDistrict(e.target.value);
  };


  const getData = async () => {
    const valRef = collection(teksDB, "donations");
    const dataDb = await getDocs(valRef);
    const allData = dataDb.docs.map((val) => ({ id: val.id, ...val.data() } as DonationData));
  
    setData(allData);
    console.log(dataDb);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="lg:py-28">
      <form>
        <label htmlFor="image">Image</label>
        <input type="file" id="image" onChange={handleUpload} />
        {image && <img src={image} alt="Preview" />}
        <br />
        <br />
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <label htmlFor="category">Category</label>
        <select
        id="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        >
        <option value="">Select Category</option>
        <option value="food">Food</option>
        <option value="non-food">Non-Food</option>
        </select>
        <br />
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />
        <label htmlFor="quantity">Quantity</label>
        <input type="number" name="quantity" id="quantity" value={quantity} onChange={(e)=> setQuantity(parseInt(e.target.value))} />
        <br />
        <label htmlFor="province">Province</label>
        <select id="province" value={province} onChange={handleProvinceChange}>
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
          disabled={districtOptions.length === 0}>
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
          onChange={(e) => setDeadline(e.target.value)}
        />
        <br />
        <button type="button" onClick={handleClick}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default DonationsForm;
