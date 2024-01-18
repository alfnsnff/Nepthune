import React from "react";
import DonationDetails from "@/components/Donations/DonationDetail";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nepthune | Detail',
};

const DonationDetailPage = () => {
  return (
    <div>
        <DonationDetails/>
    </div>
  );
};

export default DonationDetailPage;
