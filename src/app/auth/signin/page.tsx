import Signin from '@/components/Auth/SignIn';
import Breadcrumb from '@/components/common/Breadcrumb';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nepthune | Sign In',
};

const SigninPage = () => {
  return (
    <>
      <Breadcrumb pageName="Sign In Page" />

      <Signin />
    </>
  );
};

export default SigninPage;
