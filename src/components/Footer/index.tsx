import React from 'react';

export default function Footer() {
  return (
    <footer className="md:px-20 px-6 py-6 md:py-0  border-t border-black">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <div>
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{' '}
            <a href="#" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">
              BackSpace
            </a>
            . The source code is available on{' '}
            <a href="#" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">
              GitHub
            </a>
            .
          </p>
        </div>
        <a href=" https://www.freepik.com/free-vector/gradient-mountain-landscape_20547362.htm#query=nature%20illustration&position=0&from_view=keyword&track=ais&uuid=4544d526-34b8-4928-b2c6-fbb482537c52" target="_blank" rel="noreferrer" className="font-[8px] text-gray-300 md:block hidden hover:underline underline-offset-4">
          Illustration by Freepik
        </a>
      </div>
    </footer>
  );
}
