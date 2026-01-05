
import { Box, Flex, Image, Center, VStack, Text, Button, useBreakpointValue, Tabs, Spacer } from "@chakra-ui/react"
//import DishCard from "./components/DishCard"
//import MenuGallery from "./components/MenuGallery"
import HoverMenu from "./components/HoverText"
import MenuView from "./components/MenuView"
import OrderView from "./components/OrderView"
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion"
import { useRef, useEffect, useState } from "react"

const MotionBox = motion(Box)
const MotionText = motion(Text)

export default function App() {
  const [currentView, setCurrentView] = useState("home")
  const progress = useMotionValue(0)
  const smooth = useSpring(progress, { stiffness: 200, damping: 30 })

  const bg1Scale = useTransform(smooth, [0, 1], [1, 1.05])
  const bg2Scale = useTransform(smooth, [0, 1], [1.05, 1])
  const bg1Opacity = useTransform(smooth, [0, 1], [1, 0])
  const bg2Opacity = useTransform(smooth, [0, 1], [0, 1])
  const textX = useTransform(smooth, [0, 1], ["0%", "-50%"])
  const textOpacity = useTransform(smooth, [0, 1], [1, 0])

  const containerRef = useRef(null)
  const touchStartX = useRef(null)
  const internal = useRef({ value: 0 })
  const currentViewRef = useRef("home")
  useEffect(() => {
  currentViewRef.current = currentView
}, [currentView])

  useEffect(() => {
  const el = containerRef.current
  if (!el) return

  const onWheel = (e) => {
    const cv = currentViewRef.current
    console.log(cv)

    if (cv !== "home") {
      progress.set(100)
      return
    }

    e.preventDefault()
    const delta = e.deltaY || e.deltaX
    const step = delta * 0.0012
    let next = internal.current.value + step
    if (next < 0) next = 0
    if (next > 1) next = 1
    internal.current.value = next
    progress.set(next)
  }

  const onTouchStart = (e) => {
    touchStartX.current = e.touches?.[0]?.clientX ?? null
  }

  const onTouchMove = (e) => {
    if (touchStartX.current === null) return
    const x = e.touches?.[0]?.clientX ?? 0
    const delta = touchStartX.current - x
    const step = delta * 0.0015
    let next = internal.current.value + step
    if (next < 0) next = 0
    if (next > 1) next = 1
    internal.current.value = next
    progress.set(next)
    touchStartX.current = x
  }

  const onTouchEnd = () => {
    touchStartX.current = null
  }

  el.addEventListener("wheel", onWheel, { passive: false })
  el.addEventListener("touchstart", onTouchStart, { passive: true })
  el.addEventListener("touchmove", onTouchMove, { passive: false })
  el.addEventListener("touchend", onTouchEnd, { passive: true })

  return () => {
    el.removeEventListener("wheel", onWheel)
    el.removeEventListener("touchstart", onTouchStart)
    el.removeEventListener("touchmove", onTouchMove)
    el.removeEventListener("touchend", onTouchEnd)
  }
}, [])


  const items = [
      { label: "Menu", hoverText: "Pasta's\n Burgers\n Steakes\n Sides", top: "30%", left: "18%", onClick: () => setCurrentView("menu") },
      { label: "Order", hoverText: "Track\n Info", top: "38%", left: "18%", onClick: () => setCurrentView("order") },
      { label: "Locations", hoverText: "Pickup\n Dine-In", top: "46%", left: "18%", onClick: () => setCurrentView("locations") },
    ]

  return (
    <Box
      ref={containerRef}
      w="100vw"
      h="100vh"
      position="relative"
      overflow="hidden"
      bg="black"
      touchAction="none"
    >
      <MotionBox
        position="absolute"
        top={0}
        left={0}
        w="100%"
        h="100%"
        bgImage="url('/bg1.png')"
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
        style={{ scale: bg1Scale, opacity: bg1Opacity }}
      />
      <MotionBox
        position="absolute"
        top={0}
        left={0}
        w="100%"
        h="100%"
        bgImage="url('/bg2.png')"
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
        style={{ scale: bg2Scale, opacity: bg2Opacity }}
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          w="100%"
          h="100%"
          bg="rgba(0,0,0,0.4)"  // 0.4 = 40% darkness
        />
        {currentView === "home" && <HoverMenu items={items} /> }
          
        
        {/*<HoverText text="Order" top="38%" left="18%"></HoverText>*/}
        
      </MotionBox>

      <MotionText
        fontFamily="'SF Pro Display Bold'"
        fontWeight="900"
        fontSize="7xl"
        position="absolute"
        top="38%"
        left="11.33%"
        transform="translate(-50%, -50%)"
        color="#161616"
        style={{ x: textX, opacity: textOpacity }}
      >
        Good. Food. <br /> Delivered.
      </MotionText>

      {currentView === "menu" && <MenuView />}
      {currentView === "order" && <OrderView />}
    </Box>
  )
}
