import {
  LineBasicMaterial,
  MeshBasicMaterial,
  MeshStandardMaterial
} from 'three'

export const wallMaterial = new MeshStandardMaterial({ color: 0xc8c8c8 })
export const doorMaterial = new MeshBasicMaterial({ color: 'white' })
export const windowMaterial = new MeshBasicMaterial({ color: 0x73a9ff })
export const archMaterial = new MeshBasicMaterial({ color: 0xbb75d7 })
export const linesMaterial = new LineBasicMaterial({ color: 'lightgray' })

export const hoverMaterial = new MeshStandardMaterial({
  color: 0x00ff00,
  transparent: true,
  opacity: 0
})
