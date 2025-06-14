export const floorPatterns = [
  {
    id: 'checkers',
    svgProps: {
      shape: 'checkers',
      factor: 1.1,
      height: 66.67,
      width: 120
    },
    containerClasses: 'hover:scale-[1.1]',
    color: ['#ffffff', '#000000'],
    parity: true
  },
  {
    id: 'diagonal',
    svgProps: {
      shape: 'diagonal',
      factor: 1.1,
      height: 66.67,
      width: 117
    },
    containerClasses: 'mt-[0.8px] -ml-[5px] scale-[1.05] hover:scale-[1.1]',
    color: ['#ffffff', '#000000'],
    parity: true
  },
  {
    id: 'grid',
    svgProps: {
      shape: 'grid',
      factor: 1,
      height: 66.67,
      width: 108
    },
    containerClasses:
      'mt-[0.27rem] ml-[0.4rem] scale-[1.2] hover:scale-[1.5] hover:mt-[0.66rem] hover:ml-[0.52rem]',
    color: ['#ffffff']
  },
  {
    id: 'horizontal-lines',
    svgProps: {
      shape: 'horizontal-lines',
      factor: 1,
      height: 62,
      width: 107
    },

    containerClasses:
      'mt-[2.115px] ml-[0.4rem] scale-[1.2] hover:scale-[1.5] hover:mt-[0.66rem]',
    color: ['#ffffff']
  },
  {
    id: 'vertical-lines',
    svgProps: {
      shape: 'vertical-lines',
      factor: 1,
      height: 66.67,
      width: 108
    },
    containerClasses:
      'mt-[0.25rem] ml-[4px] scale-[1.15] hover:scale-[1.5] hover:ml-[6px] ',
    color: ['#ffffff']
  }
]
