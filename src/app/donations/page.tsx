import DonationsForm from "@/components/Donations";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nepthune | Donate Us',
};

const DonationsFormPage = () => {
  return (
  <>
    <DonationsForm/>
  </>
  )
};

export default DonationsFormPage;
