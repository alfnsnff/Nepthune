// "use client"
import Chat from '@/components/Chat/Chat';
import Breadcrumb from '@/components/common/Breadcrumb';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up | Play SaaS Starter Kit and Boilerplate for Next.js',
};

const SignupPage = () => {
  return (
    <>
      <Chat/>
    </>
  );
};

export default SignupPage;
