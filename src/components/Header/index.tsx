'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth } from '../../lib/firebase-config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Image from 'next/image';
import Link from 'next/link';
import menuData from './menuData';

const Header = () => {
  const router = useRouter();

  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user: any) => {
      setUser(user);
    });
  }, []);

  // signout
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        router.push('/');
        console.log('Signed out successfully');
      })
      .catch((error) => {
        // error happened
        console.log(error);
      });
  };

  const pathUrl = usePathname();
  // Navbar toggle
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen);
  };

  // Sticky Navbar
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  useEffect(() => {
    window.addEventListener('scroll', handleStickyNavbar);
  });

  // submenu handler
  const [openIndex, setOpenIndex] = useState(-1);
  const handleSubmenu = (index: any) => {
    if (openIndex === index) {
      setOpenIndex(-1);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <>
      <header
        className={`ud-header left-0 top-0 z-40 flex w-full bg-white items-center ${
          sticky ? 'shadow-nav fixed z-[9999] border-b border-stroke bg-white/80 backdrop-blur-[5px] transition dark:border-dark-3/20 dark:bg-dark/10' : 'absolute bg-white'
        }`}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="w-60 max-w-full px-4">
              <Link href="/" className={`navbar-logo block w-full ${sticky ? 'py-2' : 'py-5'} `}>
                <Image src={`/images/logo/Nepthune.png`} alt="logo" width={40} height={40} className="header-logo w-40 " />
              </Link>
            </div>
            <div className="flex w-full items-center justify-between px-4">
              <div>
                <button onClick={navbarToggleHandler} id="navbarToggler" aria-label="Mobile Menu" className="absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden">
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] transition-all duration-300 ${navbarOpen ? ' top-[7px] rotate-45' : ' '} ${pathUrl !== '/' && ' dark:!bg-black'} ${
                      pathUrl === '/' && sticky ? 'bg-dark dark:bg-white' : 'bg-black'
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] transition-all duration-300 ${navbarOpen ? 'opacity-0 ' : ' '} ${pathUrl !== '/' && ' dark:!bg-black'} ${
                      pathUrl === '/' && sticky ? 'bg-dark dark:bg-white' : 'bg-black'
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] transition-all duration-300 ${navbarOpen ? ' top-[-8px] -rotate-45' : ' '} ${pathUrl !== '/' && ' dark:!bg-black'} ${
                      pathUrl === '/' && sticky ? 'bg-dark dark:bg-white' : 'bg-black'
                    }`}
                  />
                </button>
                <nav
                  id="navbarCollapse"
                  className={`navbar absolute right-0 z-30 w-[250px] rounded border-[.5px] border-body-color/50 bg-white px-6 py-4 duration-300 dark:border-body-color/20 dark:bg-dark-2 lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 lg:dark:bg-transparent ${
                    navbarOpen ? 'visibility top-full opacity-100' : 'invisible top-[120%] opacity-0'
                  }`}
                >
                  <ul className="block justify-center items-center lg:ml-8 xl:ml-32 mx-auto lg:flex lg:gap-x-8  xl:gap-x-12">
                    {menuData.map((menuItem, index) =>
                      menuItem.path ? (
                        <li key={menuItem.id} className="group relative hover:opacity-65 tracking-tighter">
                          {pathUrl !== '/' ? (
                            <Link
                              scroll={false}
                              href={menuItem.path}
                              className={`ud-menu-scroll flex py-2 text-base text-dark group-hover:text-primary  dark:group-hover:text-primary lg:inline-flex lg:px-0 lg:py-6 ${pathUrl === menuItem?.path && 'text-primary'}`}
                            >
                              {menuItem.title}
                            </Link>
                          ) : (
                            <Link
                              scroll={false}
                              href={menuItem.path}
                              className={`ud-menu-scroll flex py-2 text-base lg:inline-flex lg:px-0 lg:py-6 ${sticky ? 'text-dark group-hover:text-primary  dark:group-hover:text-primary' : 'text-body-color  lg:text-[#19394e]'} ${
                                pathUrl === menuItem?.path && sticky && '!text-primary'
                              }`}
                            >
                              {menuItem.title}
                            </Link>
                          )}
                        </li>
                      ) : // Bagian yang dihapus
                      null
                    )}
                  </ul>
                </nav>
              </div>
              <div className="hidden items-center justify-end pr-16 sm:flex lg:pr-0">
                {user ? (
                  <>
                    <p className={`loginBtn px-7 py-3 text-base font-medium ${!sticky && pathUrl === '/' ? 'text-dark' : 'text-dark'}`}>{auth.currentUser?.displayName}</p>
                    {pathUrl !== '/' || sticky ? (
                      <button onClick={handleLogout} className="signUpBtn hover:opacity-70 rounded-lg bg-[#49adaeff]  px-6 py-3 text-base font-medium text-white duration-300 ease-in-out hover:bg-opacity-20 hover:text-dark">
                        Sign Out
                      </button>
                    ) : (
                      <button
                        onClick={handleLogout}
                        className="signUpBtn rounded-lg hover:bg-[#49adaeff]/90 hover:opacity-70 bg-[#49adaeff] dark:hover:bg-white/20 bg-opacity-20 px-6 py-3 text-base font-medium text-white duration-300 ease-in-out hover:bg-opacity-100 hover:text-dark"
                      >
                        Sign Out
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    {!user && (
                      <>
                        {pathUrl !== '/' ? (
                          <>
                            <Link href="/auth/signin" className="px-7 py-3 text-base font-medium text-dark hover:opacity-70 dark:text-white">
                              Sign In
                            </Link>
                            <Link href="/auth/signup" className="rounded-lg bg-primary px-6 py-3 text-base font-medium text-white duration-300 ease-in-out hover:bg-primary/90 dark:bg-white/10 dark:hover:bg-white/20">
                              Sign Up
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link href="/auth/signin" className="px-7 py-3 text-base font-medium text-dark hover:opacity-70 dark:text-white">
                              Sign In
                            </Link>
                            <Link href="/auth/signup" className="rounded-lg bg-primary px-6 py-3 text-base font-medium text-white duration-300 ease-in-out hover:bg-primary/90 dark:bg-white/10 dark:hover:bg-white/20">
                              Sign Up
                            </Link>
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
