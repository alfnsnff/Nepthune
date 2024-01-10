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

const DonationEdit = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [donationId, setDonationId] = useState<string | null>(null);

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
      if (donationId) {
        const donationDocRef = doc(valRef, donationId);
        await updateDoc(donationDocRef, {
          title: title,
          category: category,
          description: description,
          imageURL: image,
          quantity: quantity,
        });

        alert("Data edited successfully");
        // Sesuaikan dengan path yang sesuai di aplikasi Anda
        window.location.href = "/";
      } else {
        const newDocRef = await addDoc(valRef, {
          userId: auth.currentUser?.uid,
          title: title,
          category: category,
          description: description,
          imageURL: image,
          quantity: quantity,
        });

        const newDonationId = newDocRef.id;
        alert('Data added successfully');
        // Sesuaikan dengan path yang sesuai di aplikasi Anda
        window.location.href = "/";
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
    } catch (error) {
      console.error('Error fetching data:', error);
    }
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
          onChange={(e) => setCategory(e.target.value)}>
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
        <input type="number" name="quantity" id="quantity" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} />
        <br />
        <button type="button" onClick={handleClick}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default DonationEdit;
