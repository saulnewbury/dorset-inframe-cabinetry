import { DragControls, Html } from '@react-three/drei'
import { forwardRef, useContext, useMemo, useRef, useState } from 'react'
import { MathUtils, Matrix4, Vector3 } from 'three'
import clsx from 'clsx'

import { ModelContext } from '@/model/context'
import { doorStyles, windowStyles } from '@/model/itemStyles'

import Arch from './Arch'
import Door from './Door'
import Window from './Window'
import ItemInfo from './ItemInfo'

import { useAppState } from '@/appState'

import { wh, wt } from '@/const'

// Drag handle for openings:
import dragHandle from '@/assets/icons/general-handle.svg'

import { hoverMaterial } from '@/materials'

import ic_delete from '@/assets/icons/trash.svg'

const itemStyles = {
  door: doorStyles,
  window: windowStyles,
  arch: []
}

export default function Opening(props) {
  const { type, id, width, offset, len, mitre, hover, onDrag, onHover } = props
  const { is3D } = useAppState()
  const [, dispatch] = useContext(ModelContext)
  const [dragging, setDragging] = useState(false)
  const [position, setPosition] = useState(offset)
  const drag = useRef()
  const info = useRef()

  const showHandle = dragging || (hover?.type === type && hover.id === id)
  const spaceBefore = Math.max(offset - width / 2 - mitre.ts / 2, 0)
  const spaceAfter = Math.max(len - offset - width / 2 - mitre.te / 2, 0)

  const matrix = useMemo(() => new Matrix4(), [showHandle])

  return is3D ? (
    <Content {...props} />
  ) : (
    <>
      <DragControls
        ref={drag}
        autoTransform={false}
        matrix={matrix}
        axisLock='y'
        onDragStart={dragStart}
        onDrag={moveOpening}
        onDragEnd={dragEnd}
      >
        <>
          <group position={[offset - len / 2, wh + 0.11, 0]}>
            <mesh
              material={hoverMaterial}
              rotation-x={Math.PI / -2}
              onPointerOver={(ev) => onHover(ev, true)}
              onPointerOut={(ev) => onHover(ev, false)}
              userData={{ type, id }}
            >
              <planeGeometry args={[width, wt * 2]} />
            </mesh>
            {dragging && (
              <Html>
                <p>{position.toFixed(2)}</p>
              </Html>
            )}
            {showHandle && (
              <Html center className='pointer-events-none'>
                <img
                  src={dragHandle.src}
                  alt=''
                  className='size-6 max-w-none'
                  style={{ translate: '-1px 1px' }}
                />
              </Html>
            )}
          </group>
          <Content {...props} onClick={showInfo} />
        </>
      </DragControls>
      <InfoPanel ref={info} {...props} />
    </>
  )

  /**
   * Callback for 'click' event on 2D opening. Shows information about the
   * item, with option to delete.
   */
  function showInfo(ev) {
    if (ev.delta < 2) info.current.show()
  }

  /**
   * Callback for 'drag start' event. Checks that the event is meant for this
   * component (and not its parent) and then starts the drag process.
   */
  function dragStart() {
    if (!showHandle) return
    onDrag(true) // lock hover
    setDragging(true)
  }

  /**
   * Callback to handle 'drag' event. Calculates the movement in 'wall'
   * coordinates and then clamps it to the x direction. Also limits movement
   * to between the ends of the wall.
   */
  function moveOpening(lm) {
    if (!dragging) return
    const v = new Vector3().setFromMatrixPosition(lm)
    const r = new Matrix4()
      .extractRotation(drag.current.parent.matrixWorld)
      .invert()
    v.applyMatrix4(r)
    v.y = v.z = 0
    v.x = MathUtils.clamp(v.x, -spaceBefore, spaceAfter)
    setPosition(v.x + offset)
    matrix.setPosition(v)
  }

  /**
   * Callback to handle 'drag end' event. Updates the model to reposition the
   * opening and then resets, ready for another drag.
   */
  function dragEnd() {
    if (!dragging) return
    const v = new Vector3().setFromMatrixPosition(matrix)
    dispatch({ id: 'moveOpening', item: id, offset: offset + v.x })
    matrix.copy(new Matrix4())
    onDrag(false)
    setDragging(false)
  }
}

/**
 * Renders each type of opening via a suitable child component.
 */
function Content(props) {
  switch (props.type) {
    case 'door':
      return <Door {...props} />
    case 'window':
      return <Window {...props} />
    default:
      return <Arch {...props} />
  }
}

/**
 * Component to display details of the current opening.
 */
const InfoPanel = forwardRef((props, ref) => {
  const [, dispatch] = useContext(ModelContext)

  const [side, opens] = (props.option || ':').split(':')
  const style = itemStyles[props.type].find((s) => s.id === props.style)
  const type = props.type[0].toUpperCase() + props.type.slice(1)

  return (
    <ItemInfo ref={ref}>
      <div className={clsx(style && 'flex gap-5 items-start')}>
        {style && <img src={style.image.src} alt='' className='w-12' />}
        <div>
          <p>Item: {type}</p>
          {style && <p>Style: {style.title}</p>}
          {opens ? (
            <p>
              Handle: {side}; opens {opens}
            </p>
          ) : (
            props.option && <p>Height: {props.option}</p>
          )}
          <p>Width: {props.width}m</p>
        </div>
      </div>
      <p className='text-right'>
        <button onClick={deleteItem}>
          <img src={ic_delete.src} alt='Delete' className='size-4' />
        </button>
      </p>
    </ItemInfo>
  )
  /**
   * Callback to delete an opening when the trash icon is clicked.
   */
  function deleteItem() {
    dispatch({ id: 'deleteOpening', item: props.id })
  }
})

InfoPanel.displayName = 'InfoPanel'
