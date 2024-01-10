'use client';

import { signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import menuData from './menuData';

const Header = () => {
  const { data: session } = useSession();

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
        className={`ud-header left-0 top-0 z-40 flex w-full items-center ${
          sticky ? 'shadow-nav fixed z-[9999] border-b border-stroke bg-white/80 backdrop-blur-[5px] transition dark:border-dark-3/20 dark:bg-dark/10' : 'absolute bg-transparent'
        }`}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="w-60 max-w-full px-4">
              <Link href="/" className={`navbar-logo block w-full ${sticky ? 'py-2' : 'py-5'} `}>
                <Image src={`/images/logo/logo-white.svg`} alt="logo" width={140} height={30} className="header-logo w-full " />
              </Link>
            </div>
            <div className="flex w-full items-center justify-between px-4">
              <div>
                <button onClick={navbarToggleHandler} id="navbarToggler" aria-label="Mobile Menu" className="absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden">
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] transition-all duration-300 ${navbarOpen ? ' top-[7px] rotate-45' : ' '} ${pathUrl !== '/' && '!bg-dark dark:!bg-white'} ${
                      pathUrl === '/' && sticky ? 'bg-dark dark:bg-white' : 'bg-white'
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] transition-all duration-300 ${navbarOpen ? 'opacity-0 ' : ' '} ${pathUrl !== '/' && '!bg-dark dark:!bg-white'} ${
                      pathUrl === '/' && sticky ? 'bg-dark dark:bg-white' : 'bg-white'
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] transition-all duration-300 ${navbarOpen ? ' top-[-8px] -rotate-45' : ' '} ${pathUrl !== '/' && '!bg-dark dark:!bg-white'} ${
                      pathUrl === '/' && sticky ? 'bg-dark dark:bg-white' : 'bg-white'
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
                        <li key={menuItem.id} className="group relative">
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
                {session?.user ? (
                  <>
                    <p className={`loginBtn px-7 py-3 text-base font-medium ${!sticky && pathUrl === '/' ? 'text-white' : 'text-dark'}`}>{session?.user?.name}</p>
                    {pathUrl !== '/' || sticky ? (
                      <button onClick={() => signOut()} className="signUpBtn rounded-lg bg-primary bg-opacity-100 px-6 py-3 text-base font-medium text-white duration-300 ease-in-out hover:bg-opacity-20 hover:text-dark">
                        Sign Out
                      </button>
                    ) : (
                      <button onClick={() => signOut()} className="signUpBtn rounded-lg bg-white bg-opacity-20 px-6 py-3 text-base font-medium text-white duration-300 ease-in-out hover:bg-opacity-100 hover:text-dark">
                        Sign Out
                      </button>
                    )}
                  </>
                ) : (
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
                        <Link href="/auth/signin" className={`px-7 py-3 text-base font-medium hover:opacity-70 ${sticky ? 'text-dark dark:text-white' : 'text-white'}`}>
                          Sign In
                        </Link>
                        <Link
                          href="/auth/signup"
                          className={`rounded-lg px-6 py-3 text-base font-medium text-white duration-300 ease-in-out ${sticky ? 'bg-primary hover:bg-primary/90 dark:bg-white/10 dark:hover:bg-white/20' : 'bg-white/10 hover:bg-white/20'}`}
                        >
                          Sign Up
                        </Link>
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