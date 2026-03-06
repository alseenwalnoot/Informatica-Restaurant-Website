import { useRef, useState } from "react"
import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"

function DishModel({ url }) {
  const { scene } = useGLTF(url)
  const ref = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.2
      ref.current.rotation.z = 0.1
      if (hovered) {
        ref.current.rotation.x = Math.sin(Date.now() * 0.0002) * 0.1
      } else {
        ref.current.rotation.x = 0
      }
    }
  })

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={hovered ? 1.1 : 1}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    />
  )
}

export default DishModel