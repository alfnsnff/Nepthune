import Chat from '@/components/Chat/Chat';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nepthune | Chat',
};

const SignupPage = () => {
  return (
    <>
      <Chat/>
    </>
  );
};

export default SignupPage;
