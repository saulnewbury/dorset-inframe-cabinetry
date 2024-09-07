import Link from 'next/link'

export default function Footer() {
  return (
    <section className='px-[20px] py-[80px]  bg-[#606D8E] text-white'>
      <div className='md:px-[5vw]'>
        <h3 className='font-medium'>Dorset Inframe Cabinetry</h3>
        <div className='pt-[20px] flex flex-col lg:flex-row'>
          <div className='w-[49%]'>
            Unit 10, Court Farm Business Park <br />
            Buckland Newton <br />
            Dorset DT2 7BT
          </div>
          <div className='w-[49%] mt-[20px] lg:mt-0 lg:pl-[100px]'>
            t: 01300 345 555
            <br />
            m: 07800 851 267
            <br />
            <Link
              href='mailto:malcolm@townandcountryjoinery.co.uk'
              className='underline'
            >
              e: malcolm@townandcountryjoinery.co.uk
            </Link>
          </div>
        </div>

        <div className='mt-[4rem] flex flex-col lg:flex-row'>
          <div className='lg:w-[49%] order-last lg:order-1 lg:pl-[100px]'>
            2024 © Dorset Inframe Cabinetry
          </div>
          <div className='lg:w-[49%]'>
            <span className='hover:underline cursor-pointer'>
              Terms and conditions
            </span>
            &nbsp;|&nbsp;{' '}
            <span className='hover:underline cursor-pointer'>
              Privacy policy
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
