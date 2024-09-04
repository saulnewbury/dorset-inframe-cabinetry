export default function MenuButton({ toggleNav, isVisible }) {
  return (
    <button className='h-[30px] w-[30px] relative' onClick={toggleNav}>
      <div className={isVisible ? 'hidden' : 'block'}>
        <div className='h-[1px] w-full absolute bg-black top-[7px]'></div>
        <div className='h-[1px] w-full absolute bg-black bottom-[14.5px]'></div>
        <div className='h-[1px] w-full absolute bg-black bottom-[7px]'></div>
      </div>
      <div className={isVisible ? 'block' : 'hidden'}>
        <div className='h-[1px] w-full absolute bg-black top-[14.5px] -rotate-45'></div>
        <div className='h-[1px] w-full absolute bg-black bottom-[14.5px] rotate-45'></div>
      </div>
    </button>
  )
}
