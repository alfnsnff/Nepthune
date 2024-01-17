import SignUp from '@/components/Auth/SignUp';
import Breadcrumb from '@/components/common/Breadcrumb';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nepthune | Sign Up',
};

const SignupPage = () => {
  return (
    <>
      <Breadcrumb pageName="Sign Up Page" />

      <SignUp />
    </>
  );
};

export default SignupPage;
