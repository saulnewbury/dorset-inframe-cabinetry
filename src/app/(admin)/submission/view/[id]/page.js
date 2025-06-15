import { prisma } from '@/lib/database'
import {
  baseUnitStyles,
  tallUnitStyles,
  wallUnitStyles
} from '@/model/itemStyles'

import ModelView from './ModelView'

export default async function Submission({ params }) {
  const { id } = params
  if (!id) return { notFound: true }

  // Fetch the submission details from the database.
  const submission = await prisma.submission.findUnique({
    where: { id },
    include: {
      model: {
        select: {
          email: true
        }
      }
    }
  })

  if (!submission)
    return (
      <div className="pt-32 gutter">
        <h1 className="text-2xl font-bold">Submission not found</h1>
        <p>The submission with ID {id} could not be found.</p>
        <p>Please check the ID and try again.</p>
        <p>If you believe this is an error, please contact support.</p>
      </div>
    )

  const dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  const model = JSON.parse(submission.modelData)
  const units = new Map()
  model.units
    .concat(model.cart.filter((u) => ['base', 'wall', 'tall'].includes(u.type)))
    .forEach((unit) => {
      const list = units.get(unit.style) || []
      const entry = list.find((u) => u.width === unit.width)
      if (entry) {
        entry.count += 1
      } else {
        const inf = getInfo(unit)
        const { id, pos, rotation, ...rest } = unit
        list.push({
          ...rest,
          ...inf,
          count: 1
        })
      }
      units.set(unit.style, list)
    })
  const sortedUnits = Array.from(units.values())
    .flat()
    .sort((a, b) => a.name.localeCompare(b.name) || a.width - b.width)
  const appliances = model.cart.filter((u) => u.type === 'appliance')

  function getInfo(unit) {
    let inf
    switch (unit.type) {
      case 'base':
        inf = baseUnitStyles[unit.variant]?.find((opt) => opt.id === unit.style)
        break
      case 'wall':
        inf = wallUnitStyles.find((opt) => opt.sizes.includes(+unit.width))
        break
      case 'tall':
        inf = tallUnitStyles[unit.variant]?.find((opt) => opt.id === unit.style)
        break
      default:
        inf = null
    }
    const p = inf?.sizes.findIndex((w) => w === +unit.width) ?? -1
    return {
      name:
        (inf?.title ?? titleCase(`${unit.style} unit ${unit.variant}`)) +
        (unit.finish ? ` (${unit.finish.map((f) => f[1]).join(', ')})` : ''),
      price: inf?.prices[p] ?? 0
    }
  }

  function titleCase(str) {
    return str[0].toLocaleUpperCase() + str.slice(1).toLocaleLowerCase()
  }

  return (
    <>
      <div className="pt-32 gutter">
        <h1 className="text-2xl font-bold">Submission Details</h1>
        <p>
          From: {submission.model.email} -{' '}
          {submission.submitted.toLocaleDateString(undefined, dateOptions)}
        </p>
        <p>Timeframe: {submission.timeframe}</p>
        <p>Postcode: {submission.postcode}</p>
        <h2 className="text-xl font-bold my-4">Units</h2>
        <table className="[&_td]:px-4 [&_th]:px-4">
          <thead>
            <tr className="[&>th]:font-bold">
              <th>Type</th>
              <th>Width</th>
              <th>Qty</th>
              <th>@ Unit</th>
              <th className="text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {sortedUnits.map((unit) => (
              <tr key={unit.style + unit.width}>
                <td>{unit.name}</td>
                <td>{unit.width}mm</td>
                <td className="text-right">{unit.count}</td>
                <td className="text-right">£{unit.price.toFixed(2)}</td>
                <td className="text-right">
                  £{(unit.price * unit.count).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4" className="text-right">
                &nbsp;
              </td>
              <td className="border-t-[3px] border-darkGrey border-double">
                &nbsp;
              </td>
            </tr>
            <tr>
              <td colSpan="4" className="text-right">
                Estimated total:
              </td>
              <td className="text-right font-bold">
                £
                {sortedUnits
                  .reduce((acc, unit) => acc + unit.count * unit.price, 0)
                  .toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
        {appliances.length > 0 && (
          <>
            <h2 className="text-xl font-bold my-4">Appliances</h2>
            <ul>
              {appliances.map((appliance, n) => (
                <li key={n}>{appliance.code}</li>
              ))}
            </ul>
          </>
        )}
      </div>
      {model.units.length > 0 && (
        <div className="gutter relative h-screen">
          <ModelView model={model} />
        </div>
      )}
    </>
  )
}
