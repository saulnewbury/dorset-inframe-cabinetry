import Image from 'next/image'

// import { useProductList } from './product-list-context'

export default function List({ showList, closeList, items }) {
  // const { productList, removeFromList, clearList } = useProductList()
  return (
    <>
      {showList && (
        <div className='bg-[#0000003f] h-[100vh] w-[100vw] absolute z-[500] flex justify-center items-center'>
          <div className='w-[800px] bg-[white] text-xl px-20 py-20 relative '>
            <button
              className=' text-base cursor-pointer w-[max-content] h-[max-content] absolute right-[2.5rem] top-[2rem] z-[900]'
              type='button'
              onClick={closeList}
            >
              Close
            </button>
            <div className='mb-10 font-bold'>Items</div>
            <div className='text-base'>
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className='flex justify-between mb-[3rem] pb-3 border-b-[1px] border-solid  border-[#c7c7c7]'
                >
                  <div className='h-[150px] '>
                    <Image src={item.image} alt='' className='object-cover' />
                  </div>
                  <div>
                    <div>{item.info.category}</div>
                    <div>{item.info.desc}</div>
                    <div>
                      {item.info.width}cm x {item.info.height}cm
                    </div>
                    <div className='mt-4 font-bold'>£{item.info.price}</div>
                  </div>
                  <div className='font-bold'>x{item.multiple}</div>

                  <div>£{item.total}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
