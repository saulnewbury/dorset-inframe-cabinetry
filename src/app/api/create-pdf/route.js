import PDFDocument from 'pdfkit'
import {
  baseUnitStyles,
  wallUnitStyles,
  tallUnitStyles
} from '@/model/itemStyles'

export async function POST(request) {
  const formData = await request.formData()
  const files = await Promise.all(
    formData.getAll('files').map((file) => file.arrayBuffer())
  )
  const model = JSON.parse(formData.get('model'))
  const document = new PDFDocument({
    size: 'A4',
    layout: 'portrait',
    autoFirstPage: false
  })
  const docDate = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
  let pageNumber = 1

  document.info.Title = 'Order Summary ' + docDate

  document.on('pageAdded', () => {
    // New page added to PDF document
    document.fontSize(9).text(`Page ${pageNumber++}`, {
      align: 'right'
    })
  })

  try {
    fillDocument()
    const buffers = []
    for await (const chunk of document) {
      buffers.push(chunk)
    }
    const pdfBuffer = Buffer.concat(buffers)
    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="order-summary.pdf"',
        'Content-Length': pdfBuffer.length.toString()
      }
    })
  } catch (error) {
    console.error('Error creating PDF:', error)
    return new Response('Failed to create PDF', { status: 500 })
  }

  async function fillDocument() {
    // Add title page
    document.addPage()
    document
      .fontSize(16)
      .text('Order Summary - ' + docDate, { align: 'center' })
    document.fontSize(12)
    document.moveDown()
    document.text(
      'Please be advised that the prices shown are estimates only and may vary based on final design choices.'
    )
    document.moveDown()

    if (files.length > 0) {
      const w = 595 - 144 // A4 width minus margins
      const h = (w * 2160) / 3840 // Adjust for aspect ratio
      document.image(files[0], 72, document.y, {
        width: w,
        align: 'center',
        valign: 'center'
      })
      document.rect(72, document.y, w, h).stroke('gray')
      document.y += h + 16
    }

    // Add other images
    if (files.length > 1) {
      document.text('Additional images:')
      document.moveDown()
      const w = 595 - 144 // A4 width minus margins
      const h = (w * 2160) / 3840 // Adjust for aspect ratio
      files.slice(1).forEach((file, index) => {
        if (document.y + h > document.page.height - 72) {
          document.addPage()
        }
        document.image(file, 72, document.y, {
          width: w,
          align: 'center',
          valign: 'center'
        })
        document.y += h + 12
      })
    }

    // Add details of model units
    if (model.units.length > 0) {
      document.addPage()
      document.fontSize(16).text('Model Units')
      document.moveDown()
      document.fontSize(12)
      const detail = new Map()
      model.units.forEach((unit) => {
        const key = `${unit.type}-${unit.variant}-${unit.style}-${unit.width}`
        if (!detail.has(key)) {
          detail.set(key, { count: 0, unit })
        }
        detail.get(key).count += 1
      })
      const totalPrice = model.units.reduce(
        (total, item) => total + getUnitPrice(item),
        0
      )
      document.table({
        rowStyles: (i) => {
          return i < 1 || i >= detail.size
            ? { border: [0, 0, 1, 0], borderColor: 'black' }
            : { border: [0, 0, 0.5, 0], borderColor: '#aaa' }
        },
        columnStyles: [
          '*',
          { width: 100, align: { x: 'center' } },
          { width: 30, align: { x: 'center' } },
          { width: 50, align: { x: 'right' } },
          { width: 70, align: { x: 'right' } }
        ],
        data: [['Name', 'Size (WxD)', 'Qty', 'Unit', 'Price']].concat(
          [...detail.values()].map(({ count, unit }) =>
            getUnitInfo(unit, count)
          ),
          [
            [
              { colSpan: 4, text: 'Total', align: { x: 'right' } },
              `£${totalPrice.toFixed(2)}`
            ]
          ]
        )
      })
    }

    document.end()
  }
}

function getUnitInfo(unit, count) {
  let inf = null
  let depth = 0
  switch (unit.type) {
    case 'base':
      inf = baseUnitStyles[unit.variant]?.find((s) => s.id === unit.style)
      depth = unit.style.includes('shallow') ? 282 : 573
      break
    case 'wall':
      inf = wallUnitStyles.find((s) => s.sizes.includes(+unit.width))
      depth = 300
      break
    case 'tall':
      inf = tallUnitStyles[unit.variant]?.find((s) => s.id === unit.style)
      depth = 573
      break
    case 'appliance':
      return ['Appliance ' + unit.code, '', count, '£tbd', '']
    default:
      inf = null
  }
  const size = `${(+unit.width / 10).toFixed(1)}cm x ${(depth / 10).toFixed(
    1
  )}cm`
  if (!inf) return [unit.style, size, count, '£unknown', '-']
  const price = inf.prices[inf.sizes.indexOf(+unit.width)] ?? 'unknown'
  return [
    unit.finish
      ? inf.title + ' (' + unit.finish.map((f) => f[0] + ': ' + f[1]) + ')'
      : inf.title,
    size,
    count,
    `£${price.toFixed(2)}`,
    `£${(price * count).toFixed(2)}`
  ]
}

function getUnitPrice(unit) {
  let inf = null
  switch (unit.type) {
    case 'base':
      inf = baseUnitStyles[unit.variant]?.find((s) => s.id === unit.style)
      break
    case 'wall':
      inf = wallUnitStyles.find((s) => s.sizes.includes(+unit.width))
      break
    case 'tall':
      inf = tallUnitStyles[unit.variant]?.find((s) => s.id === unit.style)
      break
    case 'appliance':
      return 0 // Appliances are handled separately
    default:
      inf = null
  }
  if (!inf) return 0
  const price = inf.prices[inf.sizes.indexOf(+unit.width)] ?? 0
  return price
}
