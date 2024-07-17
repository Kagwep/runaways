import React,{ useEffect, useState } from 'react';
import { Runaway } from '../Runaway';

interface PropTypes {}

const runawayse = [
  {
    id: 1,
    imageAlt: 'Runaway One',
    imageSrc: 'https://res.cloudinary.com/dydj8hnhz/image/upload/v1721233960/xmbqlywuqjwijsemgrqt.png',
    name: 'Runaway One',
    color: 'Red',
    price: '$10',
    href: 'https://example.com/runaway1'
  },
  {
    id: 2,
    imageAlt: 'Runaway Two',
    imageSrc: 'https://res.cloudinary.com/dydj8hnhz/image/upload/v1721233960/xmbqlywuqjwijsemgrqt.png',
    name: 'Runaway Two',
    color: 'Blue',
    price: '$12',
    href: 'https://example.com/runaway2'
  },
  {
    id: 3,
    imageAlt: 'Runaway Three',
    imageSrc: 'https://res.cloudinary.com/dydj8hnhz/image/upload/v1721233960/xmbqlywuqjwijsemgrqt.png',
    name: 'Runaway Three',
    color: 'Green',
    price: '$15',
    href: 'https://example.com/runaway3'
  }
];


export const RunAwaysManage: React.FC<PropTypes> = () => {

    const [runaways , setRunawas] = useState(runawayse)
    const [playingRunaway, setPlayingRunaway] = useState<number>(0)


    const handleSetRunawayId=  (id: number) => {
      setPlayingRunaway(id)
      console.log("called")
    }

    return (
      <>
         {
          runaways.length > 0 ?
           (
              
              playingRunaway !=0 ? (
                <Runaway runaway_id={playingRunaway} />
              ): (

                <div className="bg-white">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900">Your Runaways</h2>

                  <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {runaways.map((runaway) => (
                      <div key={runaway.id} className="group relative">
                        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                          <img
                            alt={runaway.imageAlt}
                            src={runaway.imageSrc}
                            className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                          />
                        </div>
                        <div className="mt-4 flex justify-between">
                          <div>
                            <h3 className="text-sm text-gray-700">
                                <span aria-hidden="true" className="absolute inset-0" />
                                {runaway.name}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">{runaway.color}</p>
                          </div>
                          <p className="text-sm font-medium text-gray-900">{runaway.price}</p>
    
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded relative z-10"  onClick={() => handleSetRunawayId(runaway.id)}>
                          Button
                        </button>

                        </div>
                       
                      </div>
                    ))}
                  </div>
                </div>
             </div>
              )
            

          ) :
           (
          <div className="bg-slate-300">
            <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
              <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
                <svg
                  viewBox="0 0 1024 1024"
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
                >
                  <circle r={512} cx={512} cy={512} fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
                  <defs>
                    <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                      <stop stopColor="#7775D6" />
                      <stop offset={1} stopColor="#E935C1" />
                    </radialGradient>
                  </defs>
                </svg>
                <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Request You First Runaway
                    <br />
                    Start your game.
                  </h2>
                  <p className="mt-6 text-lg leading-8 text-gray-300">
                    Collect rewards and grow your runaway, Create new skins. Acquire tour favourite runaways and skins on auction.
                  </p>
                  <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                    <a
                      href="#"
                      className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      Create Runaway
                    </a>
                    <button className='' type='button'></button>
                  </div>
                </div>
                <div className="relative mt-16 h-80 lg:mt-8">
                  <img
                    alt="App screenshot"
                    src="https://res.cloudinary.com/dydj8hnhz/image/upload/v1721233960/xmbqlywuqjwijsemgrqt.png"
                    className="absolute left-0 top-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
                  />
                </div>
              </div>
            </div>
          </div>
          )
         }
      </>
    );
  };
