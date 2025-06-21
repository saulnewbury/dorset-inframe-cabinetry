/**
 * Renders a table row for a kitchen unit, including image, description, quantity
 * and price.
 */

export default function UnitRow({ item }) {
  return (
    <div className="grid grid-cols-[8rem,1fr,4rem] items-center gap-x-4 mb-3 pb-3 border-b-[1px] border-solid border-[#c7c7c7]">
      <div className="w-[100px] h-[100px]">
        {item.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt=""
            className="h-full object-contain"
            style={{ clipPath: 'inset(2px)' }}
          />
        )}
      </div>
      <div>
        <div>{item.info.desc}</div>
        <div>
          {item.info.width}mm x {item.info.height}mm{' '}
          {item.info.finish &&
            '[' +
              item.info.finish.map((f) => `${f[0]}: ${f[1]}`).join(', ') +
              ']'}
        </div>
        <div className="text-xs">
          x{item.multiple} @ £{item.info.price}
        </div>
      </div>
      <div className="font-bold text-right pr-2">£{item.total}</div>
    </div>
  )
}
