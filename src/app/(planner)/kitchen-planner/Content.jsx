import SvgIcon from '@/components/SvgIcon.jsx'
import DefineYourSpace from './define-your-space/DefineYourSpace'
import Items from './Items'

export default function Content({ closeContentBox, content }) {
  console.log(content.name)
  return (
    <div className='fixed z-[100] flex h-[100vh] w-[100vw] top-0 left-0 bg-overlay px-[98px] py-[40px]'>
      <div className='bg-white w-full h-full relative'>
        <button
          onClick={closeContentBox}
          className='cursor-pointer w-[max-content] h-[max-content] absolute right-[2.5rem] top-[2rem] z-[900]'
          type='button'
        >
          <SvgIcon shape='close' />
        </button>
        <div className='gutter h-full relative overflow-scroll '>
          <h2 className='py-[2rem] text-[18px]'>{content.heading}</h2>

          {content.name === 'Choose floor plan' && (
            <DefineYourSpace close={closeContentBox} />
          )}
          {/* {content.name === 'Add a wall' && <DefineYourSpace />} */}
          {/* {content.name === 'Add separation area' && <RoomPlanner />} */}
          {/* {content.name === 'Add separation area' && <RoomPlanner />} */}
          {/* {content.name === 'Add sloped ceiling' && <DefineYourSpace />}
            {content.name === 'Add windows' && <DefineYourSpace />}
            {content.name === 'Add doors' && <DefineYourSpace />}
            {content.name === 'Add wall openings' && <DefineYourSpace />} */}
          {content.name === 'Structures' && <Items items={content.items} />}
          {content.name === 'Electricity' && <Items items={content.items} />}
          {content.name === 'Heating' && <Items items={content.items} />}
          {content.name === 'Ventilation' && <Items items={content.items} />}
          {content.name === 'Fittings' && <Items items={content.items} />}
        </div>
      </div>
    </div>
  )
}
