export const menu = [
  {
    name: 'About',
    url: '/about',
    id: 1,
    submenu: [
      {
        name: 'Materials', // desktop: link, mobile: button
        url: '/about/materials', // ...only desktop
        id: 2,
        flyout: [
          { name: 'All materials', url: '/about/materials', id: 3 }, // only mobile - make part of submenu
          { name: 'MDF', url: '/about/materials/mdf', id: 4 },
          { name: 'MFC', url: '/about/materials/mfc', id: 5 }
        ]
      },
      { name: 'Inframe cabinetry', url: '/about/inframe-cabinetry', id: 6 }
    ]
  },
  { name: 'Kitchen planner', url: '/kitchen-planner', id: 7 },
  {
    name: 'Our cabinets',
    url: '/our-cabinets',
    id: 19,
    submenu: [
      { name: 'All cabinets', url: '/our-cabinets', id: 20 },
      { name: 'Base cabinets', url: '/our-cabinets?category=base', id: 16 },
      { name: 'Tall cabinets', url: '/our-cabinets?category=tall', id: 17 },
      { name: 'Wall cabinets', url: '/our-cabinets?category=wall', id: 18 }
    ]
  },
  {
    name: 'Products', // desktop: link, mobile: button
    url: '/products', // ...only desktop
    id: 8,
    submenu: [
      { name: 'All products', url: '/products', id: 9 }, // only mobile - make part of submenu
      { name: 'Worktops', url: '/products/worktops', id: 11 },
      { name: 'Handles and knobs', url: '/products/handles-and-knobs', id: 12 },
      { name: 'Sinks and taps', url: '/products/sinks-and-taps', id: 13 },
      { name: 'Appliances', url: '/products/appliances', id: 14 },
      {
        name: 'Storage accessories',
        url: '/products/storage-accessories',
        id: 15
      }
    ]
  },
  { name: 'Contact', url: '/contact', id: 15 }
]

export const plannerMenu = [
  {
    name: 'Define your space',
    url: '/kitchen-planner/define-your-space'
  },
  { name: 'Make it yours', url: '/kitchen-planner/make-it-yours' },
  { name: 'Bring it to life', url: '/kitchen-planner/bring-to-life' }
]
