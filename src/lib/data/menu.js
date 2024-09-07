export const menuDesk = [
  {
    name: 'About',
    url: '/about',
    submenu: [
      {
        name: 'Materials',
        url: '/about/materials',
        flyout: [
          { name: 'MDF', url: '/about/materials/mdf' },
          { name: 'MFC', url: '/about/materials/mfc' }
        ]
      },
      { name: 'Inframe cabinetry', url: '/about/inframe-cabinetry' }
    ]
  },
  { name: 'Kitchen planner', url: '/kitchen-planner' },
  {
    name: 'Products',
    url: '/products',
    submenu: [
      { name: 'Cabinets', url: '/products/cabinets' },
      { name: 'Worktops', url: '/products/worktops' },
      { name: 'Handles and knobs', url: '/products/handles-and-knobs' },
      { name: 'Sinks and taps', url: '/products/sinks-and-taps' }
    ]
  },
  { name: 'Contact', url: '/contact' }
]

export const menuMob = [
  {
    name: 'About',
    url: '/about'
  },
  {
    name: 'Materials',
    // url: '/about/materials',
    submenu: [
      { name: 'All materials', url: '/about/materials' },
      { name: 'MDF', url: '/about/materials/mdf' },
      { name: 'MFC', url: '/about/materials/mfc' }
    ]
  },
  { name: 'Inframe cabinetry', url: '/about/inframe-cabinetry' },
  { name: 'Kitchen planner', url: '/kitchen-planner' },
  {
    name: 'Products',
    // url: '/products',
    submenu: [
      { name: 'All products', url: '/products' },
      { name: 'Cabinets', url: '/products/cabinets' },
      { name: 'Worktops', url: '/products/worktops' },
      { name: 'Handles and knobs', url: '/products/handles-and-knobs' },
      { name: 'Sinks and taps', url: '/products/sinks-and-taps' }
    ]
  },
  { name: 'Contact', url: '/contact' }
]
