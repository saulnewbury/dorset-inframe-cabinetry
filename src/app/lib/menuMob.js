export const menuMob = [
  {
    name: 'About',
    url: '/about'
  },
  {
    name: 'Materials',
    url: '/about/materials',
    submenu: [
      { name: 'All materials', url: '/about/materials' },
      { name: 'MDF', url: '/about/materials/mdf' },
      { name: 'MFC', url: '/about/materials/mfc' }
    ]
  },
  { name: 'Inframe cabinetry', url: 'inframe-cabinetry' },
  { name: 'Kitchen planner', url: '/kitchen-planner' },
  {
    name: 'Products',
    url: '/products',
    submenu: [
      { name: 'All products', url: '/products' },
      { name: 'Cabinets', url: '/products/cabinets' },
      { name: 'Worktops', url: '/products/worktops' },
      { name: 'Handles and nobs', url: '/products/handles-and-nobs' },
      { name: 'Sinks and taps', url: '/products/sinks-and-taps' }
    ]
  },
  { name: 'Contact', url: '/contact' }
]
