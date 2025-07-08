'use client'
import { useContext, useMemo, useState } from 'react'
import { ModelContext } from '@/model/context'
import { unitInfo } from '@/lib/helpers/unitInfo'

import Script from 'next/script'
import UnitRow from '@/components/UnitRow'
import ApplianceRow from '@/components/ApplianceRow'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import SubmitCartDialog from '@/components/SubmitCart'
import HeroText from '@/components/HeroText'

const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
const isRecaptcha = !!recaptchaSiteKey

export default function ViewCart() {
  const [showSubmit, setShowSubmit] = useState(false)
  const [model, dispatch] = useContext(ModelContext)
  const appliances = model.cart?.filter((u) => u.type === 'appliance') ?? []
  const hasCart = Array.isArray(model.cart) && model.cart.length > 0

  // Compute the list of items in the kitchen planner model. This is a memoized
  // value that will only change when the model changes.
  const units = useMemo(() => {
    const listItems = (model?.cart ?? []).filter((u) => u.type !== 'appliance')
    const items = new Map()
    listItems
      .map((u) => unitInfo(u))
      .forEach((item) => {
        const key = [
          item.info.category,
          item.info.desc,
          item.width,
          item.info.finish ? JSON.stringify(item.info.finish) : ''
        ].join('~')
        const detail = items.get(key)
        const multiple = detail ? detail.multiple + 1 : 1
        const total = multiple * item.info.price
        items.set(key, { ...(detail ?? item), multiple, total })
      })
    return Array.from(items.values())
  }, [model])

  const price = units.reduce((p, i) => p + i.total, 0)

  return (
    <>
      {isRecaptcha && (
        <Script
          src={`https://www.google.com/recaptcha/enterprise.js?render=${recaptchaSiteKey}`}
        />
      )}
      <HeroText markup={'Your Cart'} />
      <section className="gutter pb-[6rem]">
        {hasCart ? (
          <div className="gutter">
            <div className="text-base my-6">
              {units.map((item, idx) => (
                <UnitRow
                  item={item}
                  key={'unit-' + idx}
                  onAdd={() => addItem(item)}
                  onRemove={() => removeItem(item)}
                />
              ))}
              {appliances.map((item, idx) => (
                <ApplianceRow
                  item={item}
                  key={'appliance-' + idx}
                  onRemove={() => removeItem(item)}
                />
              ))}
              <div className="grid grid-cols-[8rem,1fr,4rem] items-center gap-x-4 mb-3 pb-3">
                <div></div>
                <div className="text-right">Estimated total:</div>
                <div className="font-bold text-right pr-2">£{price}</div>
              </div>
            </div>
            <p className="flex gap-6 justify-end">
              <Button primary onClick={() => setShowSubmit(true)}>
                Submit for quote
              </Button>
            </p>
          </div>
        ) : (
          <div className="indent">
            <p className="text-base ">
              Your cart is empty. Please add items to your cart before
              submitting.
            </p>
          </div>
        )}
        <SubmitCartDialog
          isOpen={showSubmit}
          onClose={() => setShowSubmit(false)}
        />
      </section>
      <Footer />
    </>
  )

  function addItem(item) {
    const { finish, ...unit } = item.unit
    dispatch({ id: 'addToCart', unit, finish })
  }

  function removeItem(item) {
    dispatch({ id: 'removeCartItem', item })
  }
}
