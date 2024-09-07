const text =
  'Where it comes to inframe cabinetry in kitchens and bathrooms, Moisture Resistant MDF (MR MDF) and Melamine Faced Chipboard (MFC) are our materials of choice, being are highly versatile, cost effective, and eco friendly.'

import Section from './Section'
export default function Intro() {
  return (
    <Section>
      <p>{text}</p>
      {text}
    </Section>
  )
}
