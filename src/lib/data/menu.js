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
    name: 'Products', // desktop: link, mobile: button
    url: '/products', // ...only desktop
    id: 8,
    submenu: [
      { name: 'All products', url: '/products', id: 9 }, // only mobile - make part of submenu
      { name: 'Cabinets', url: '/products/cabinets', id: 10 },
      { name: 'Worktops', url: '/products/worktops', id: 11 },
      { name: 'Handles and knobs', url: '/products/handles-and-knobs', id: 12 },
      { name: 'Sinks and taps', url: '/products/sinks-and-taps', id: 13 },
      { name: 'Appliances', url: '/products/appliances', id: 14 }
    ]
  },
  { name: 'Contact', url: '/contact', id: 15 }
]