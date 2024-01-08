import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from "next";

// link bg
// https://www.freepik.com/free-vector/gradient-mountain-landscape_20547362.htm#query=nature%20illustration&position=0&from_view=keyword&track=ais&uuid=4544d526-34b8-4928-b2c6-fbb482537c52

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

const Hero = () => {
  return (
    <>
      <section
        id="home"
        className="relative  md:h-screen my-0 mx-auto overflow-hidden pt-[120px] text-black md:pt-[130px] lg:pt-[160px]"
        style={{
          backgroundImage: `url('/images/bg.jpg')`,
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          backgroundRepeat: 'no-repeat', 
        }}
      >
        <div className="container">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="mb-8 w-full px-4">
              <div className="hero-content wow fadeInUp mx-auto max-w-[780px] text-center" data-wow-delay=".2s">
                <h1 className="mb-6 text-3xl font-bold leading-snug text-[#19394e] sm:text-4xl sm:leading-snug lg:text-5xl lg:leading-[1.2]">Share More. Waste Less.</h1>
                <p className="mx-auto mb-4 max-w-[600px] text-base font-medium text-white sm:text-lg sm:leading-[1.44]">Sharing App and Donation</p>
                <div className="group relative bg-white/[0.12] mb-4 inline-block overflow-hidden rounded px-4 py-0 font-medium text-sm text-black">
                  <span className="absolute left-0 top-0 mb-0 flex h-0 w-full translate-y-0 transform bg-purple-600 opacity-90 transition-all duration-200 ease-out group-hover:h-full"></span>
                  <span className="relative gap-2 flex flex-row items-center justify-center group-hover:text-white">
                    Feature
                    <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(90deg)' }}>
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                      <g id="SVGRepo_iconCarrier">
                        <g id="Interface / Line_L">
                          <path id="Vector" d="M12 19V5" stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"></path>
                        </g>
                      </g>
                    </svg>
                    <Image src="/Images/donation.svg" alt="Rotated SVG" width={20} height={20} />
                    <Image src="/Images/community.svg" alt="Rotated SVG" width={20} height={20} />
                  </span>
                </div>
                <ul className="mb-10 flex flex-wrap items-center justify-center gap-5">
                  <li>
                    <Link
                      href="https://nextjstemplates.com/templates/play"
                      className="inline-flex items-center justify-center rounded-md bg-white px-7 py-[14px] text-center text-base font-medium text-dark shadow-1 transition duration-300 ease-in-out hover:bg-gray-2"
                    >
                      Donate Now
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://github.com/nextjsTemplates/play-nextjs"
                      target="_blank"
                      className="flex items-center gap-4 rounded-md bg-white/[0.12] px-6 py-[14px] text-base font-medium text-white transition duration-300 ease-in-out hover:bg-white hover:text-dark"
                    >
                      <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_2005_10818)">
                          <path d="M12 0.674805C5.625 0.674805 0.375 5.8498 0.375 12.2998C0.375 17.3998 3.7125 21.7498 8.3625 23.3248C8.9625 23.4373 9.15 23.0623 9.15 22.7998C9.15 22.5373 9.15 21.7873 9.1125 20.7748C5.8875 21.5248 5.2125 19.1998 5.2125 19.1998C4.6875 17.8873 3.9 17.5123 3.9 17.5123C2.85 16.7623 3.9375 16.7623 3.9375 16.7623C5.1 16.7998 5.7375 17.9623 5.7375 17.9623C6.75 19.7623 8.475 19.2373 9.1125 18.8998C9.225 18.1498 9.525 17.6248 9.8625 17.3248C7.3125 17.0623 4.575 16.0498 4.575 11.6248C4.575 10.3498 5.0625 9.3373 5.775 8.5498C5.6625 8.2873 5.25 7.0873 5.8875 5.4748C5.8875 5.4748 6.9 5.1748 9.1125 6.6748C10.05 6.4123 11.025 6.2623 12.0375 6.2623C13.05 6.2623 14.0625 6.3748 14.9625 6.6748C17.175 5.2123 18.15 5.4748 18.15 5.4748C18.7875 7.0498 18.4125 8.2873 18.2625 8.5498C19.0125 9.3373 19.4625 10.3873 19.4625 11.6248C19.4625 16.0498 16.725 17.0623 14.175 17.3248C14.5875 17.6998 14.9625 18.4498 14.9625 19.4998C14.9625 21.0748 14.925 22.3123 14.925 22.6873C14.925 22.9873 15.15 23.3248 15.7125 23.2123C20.2875 21.6748 23.625 17.3623 23.625 12.2248C23.5875 5.8498 18.375 0.674805 12 0.674805Z" />
                        </g>
                        <defs>
                          <clipPath id="clip0_2005_10818">
                            <rect width="24" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      Star on Github
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
