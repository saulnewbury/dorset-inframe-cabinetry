import SvgIcon from '@/components/SvgIcon'
import DefineYourSpace from './define-your-space/DefineYourSpace'

export default function ContentBox({ closeContentBox, content }) {
  console.log(content)
  return (
    <div className='fixed z-[100] flex h-[100vh] w-[100vw] top-0 left-0 bg-overlay px-[98px] py-[40px]'>
      <div className='bg-white w-full h-full relative'>
        <button
          onClick={closeContentBox}
          className='cursor-pointer w-[max-content] h-[max-content] absolute right-[20px] top-[20px] z-[900]'
          type='button'
        >
          <SvgIcon shape='close' />
        </button>
        <div className='gutter h-full relative'>
          <h2 className='pt-[2rem] text-[18px]'>{content.content.title}</h2>
          {content.name === 'Define your space' && (
            <DefineYourSpace close={closeContentBox} />
          )}
          {/* {content.name === 'Add a wall' && <DefineYourSpace />}
            {content.name === 'Add seperation area' && <DefineYourSpace />}
            {content.name === 'Add sloped ceiling' && <DefineYourSpace />}
            {content.name === 'Add windows' && <DefineYourSpace />}
            {content.name === 'Add doors' && <DefineYourSpace />}
            {content.name === 'Add wall openings' && <DefineYourSpace />}
            {content.name === 'Structure' && <DefineYourSpace />}
            {content.name === 'Electricity' && <DefineYourSpace />}
            {content.name === 'Heating' && <DefineYourSpace />}
            {content.name === 'Ventilation' && <DefineYourSpace />}
            {content.name === 'Fittings' && <DefineYourSpace />} */}
        </div>
      </div>
    </div>
  )
}
