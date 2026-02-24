import { Canvas } from "@react-three/fiber"
import { OrbitControls, Stage, useGLTF } from "@react-three/drei"
import { useRef, useState } from "react"


function DishModel({ url }) {
  const { scene } = useGLTF(url)
  const ref = useRef()
  const [hovered, setHovered] = useState(false)

  return (
    <primitive
      object={scene}
      ref={ref}
      scale={hovered ? 1.1 : 1}
      rotation={[0, 0, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      // continuous Y rotation
      animate={{ rotation: [0, Math.PI * 2, 0] }}
    />
  )
}
export default DishModel