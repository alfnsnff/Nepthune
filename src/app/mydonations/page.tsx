import MyDonations from "@/components/Donations/MyDonations";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nepthune | My Donations',
};

const page = () => {
  return (
    <>
        <MyDonations/>
    </>
  );
};

export default page;
