import DonationEdit from "@/components/Donations/DonationEdit";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nepthune | Edit Donations',
};


const page = () => {
  return (
    <>
        <DonationEdit/>
    </>
  );
};

export default page;
