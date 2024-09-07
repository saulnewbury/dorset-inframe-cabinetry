export const menu = [
  {
    name: 'About',
    url: '/about',
    submenu: [
      {
        name: 'Materials', // desktop: link, mobile: button
        url: '/about/materials', // ...only desktop
        flyout: [
          { name: 'All materials', url: '/about/materials' }, // only mobile - make part of submenu
          { name: 'MDF', url: '/about/materials/mdf' },
          { name: 'MFC', url: '/about/materials/mfc' }
        ]
      },
      { name: 'Inframe cabinetry', url: '/about/inframe-cabinetry' }
    ]
  },
  { name: 'Kitchen planner', url: '/kitchen-planner' },
  {
    name: 'Products', // desktop: link, mobile: button
    url: '/products', // ...only desktop
    submenu: [
      { name: 'All products', url: '/products' }, // only mobile - make part of submenu
      { name: 'Cabinets', url: '/products/cabinets' },
      { name: 'Worktops', url: '/products/worktops' },
      { name: 'Handles and knobs', url: '/products/handles-and-knobs' },
      { name: 'Sinks and taps', url: '/products/sinks-and-taps' },
      { name: 'Appliances', url: '/products/appliances' }
    ]
  },
  { name: 'Contact', url: '/contact' }
]
