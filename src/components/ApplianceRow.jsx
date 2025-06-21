/**
 * Renders a row for an appliance. No price or image; just a code.
 */

export default function ApplianceRow({ item }) {
  return (
    <div className="grid grid-cols-[8rem,1fr,4rem] items-center gap-x-4 mb-3 pb-3 border-b-[1px] border-solid border-[#c7c7c7]">
      <div></div>
      <div>
        <div>Appliance</div>
        <div>{item.code}</div>
      </div>
      <div className="font-bold text-right pr-2">£tbd</div>
    </div>
  )
}
