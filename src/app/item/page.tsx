import Link from 'next/link';
import { Items } from '@/types/items';
import SectionTitle from '@/components/common/SectionTitle';

const Post = ({ items }: { items: Items }) => {
 

  return (
    <section className="container md:mt-20 mt-0 pt-[120px] px-8 lg:py-8 mx-auto xl:px-5 max-w-screen-md">
      <div className="mx-auto ">
        <div className="w-full mb-2 bg-[#f2f4f6] mx-auto aspect-video max-w-screen-lg overflow-hidden lg:rounded-lg">
          <img
            className=" object-cover"
            src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="image description"
            
          />
        </div>
        <div className="flex md:flex-row justify-between gap-4 flex-col">
          <SectionTitle subtitle="Karim" title="Free Queen Bed Frame" info="San Francisco, CA" />
          <div className="rounded-xl  border text-black p-4">
            <div className="flex items-center gap-4">
              <img
                alt="Developer"
                src="/Images/user.svg"
                className="h-16 w-16  object-cover"
              />

              <div>
                <h3 className="text-lg font-medium text-black">Karim</h3>

                <div className="flow-root">
                  <ul className="-m-1 flex flex-wrap">
                    <li className="p-1 leading-none">
                      <a href="#" className="text-xs font-medium text-black">
                        {' '}
                        Twitter{' '}
                      </a>
                    </li>

                    <li className="p-1 leading-none">
                      <a href="#" className="text-xs font-medium text-black">
                        {' '}
                        GitHub{' '}
                      </a>
                    </li>

                    <li className="p-1 leading-none">
                      <a href="#" className="text-xs font-medium text-black">
                        Website
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="flex justify-center h-full rounded-lg border border-gray-700 p-4 hover:border-pink-600">
                  <strong className="font-medium text-center text-black">Text Me</strong>
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* <article className="mx-auto max-w-screen-md ">
          <div className="prose mx-auto my-3 dark:prose-invert">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </div>
        </article> */}
      </div>
    </section>
  );
};

export default Post;
