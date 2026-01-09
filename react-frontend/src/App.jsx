
import { Box, Flex, Image, Center, VStack, Text, Button, Icon, Tabs, Spacer, HStack, Separator } from "@chakra-ui/react"
//import DishCard from "./components/DishCard"
//import MenuGallery from "./components/MenuGallery"
import HoverMenu from "./components/HoverText"
import MenuView from "./components/MenuView"
import OrderView from "./components/OrderView"
import { motion, useMotionValue, useTransform, useSpring, animate } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { MoveRight, Minus } from "lucide-react"
const MotionBox = motion(Box)
const MotionText = motion(Text)
const MotionImage = motion(Image)
const MotionIcon = motion.create(Icon)
export default function App() {
  const [currentView, setCurrentView] = useState("home")
  const progress = useMotionValue(0)
  const smooth = useSpring(progress, { stiffness: 200, damping: 30 })

  const bg1Scale = useTransform(smooth, [0, 1], [1, 1.05])
  const bg2Scale = useTransform(smooth, [1, 0], [1.05, 1])
  const bg1Opacity = useTransform(smooth, [0, 1], [1, 0])
  const bg2Opacity = useTransform(smooth, [0, 1], [0, 1])

  const textX = useTransform(smooth, [0, 1], [0, -200])
  const imgX = useTransform(smooth, [0, 1], [0, 800])

  const iconBaseX = useTransform(smooth, [0, 1], ["0%", "20%"])
const iconWiggle = useMotionValue(0)

  const textOpacity = useTransform(smooth, [0, 1], [1, 0])

  const containerRef = useRef(null)
  const touchStartX = useRef(null)
  const internal = useRef({ value: 0 })
  const currentViewRef = useRef("home")
  useEffect(() => {
  const controls = animate(iconWiggle, [0, 10, 0, 2, 0], {
    duration: 1.6,
    ease: "easeInOut",
    repeat: Infinity,
    repeatDelay: 2,
  })

  return () => controls.stop()
}, [])
  const iconX = useTransform(
  [iconBaseX, iconWiggle],
  ([base, wiggle]) => `calc(${base} + ${wiggle}px)`
)
  useEffect(() => {
  currentViewRef.current = currentView 
}, [currentView])
  useEffect(() => {
  const el = containerRef.current
  if (!el) return

  if (currentView !== "home") return

  const onWheel = (e) => {
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

  el.addEventListener("wheel", onWheel, { passive: true })
  el.addEventListener("touchstart", onTouchStart, { passive: true })
  el.addEventListener("touchmove", onTouchMove, { passive: true })
  el.addEventListener("touchend", onTouchEnd, { passive: true })

  return () => {
    el.removeEventListener("wheel", onWheel)
    el.removeEventListener("touchstart", onTouchStart)
    el.removeEventListener("touchmove", onTouchMove)
    el.removeEventListener("touchend", onTouchEnd)
  }
}, [currentView])



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
        bgImage="url('/bg_no_logo.png')"
        //bgSize="cover"
        
        bgPosition="center"
        bgRepeat="repeat"
        style={{ scale: bg1Scale, opacity: bg1Opacity }}
      />
      


      <MotionBox
        position="absolute"
        top={0}
        left={0}
        w="100%"
        h="100%"
        bgImage="url('/bg_no_logo.png')"
        //bgSize="cover"
        bgPosition="center"
        bgRepeat="repeat"
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
          
        

      </MotionBox>
      <Box
  position="absolute"
  left="50%"
  top="50%"
  transform="translate(-50%, -50%)"
  w="100%"
  maxW="1200px"
  px="6"
  display="flex"
  alignItems="center"
  justifyContent="space-between"
>
  {/* LEFT: logo + text */}
  <MotionBox
    style={{ x: textX, opacity: textOpacity }}
    display="flex"
    flexDir="column"
      alignItems="flex-start"
    gap="6"
  >
    

    <MotionText
      fontFamily="'SF Pro Display Bold'"
    fontWeight="900"
    fontSize={["4xl", "5xl", "6xl", "7xl"]}
    color="#131313ff"
    textAlign="center"
  >
    Good. Food. <br /> Delivered. <br /> <Separator/> PrestigeOpulent<Center><MotionIcon style={{x: iconX}}size="8xl" color="gray"><MoveRight size={120} strokeWidth={1.5}/></MotionIcon></Center>
  </MotionText>
  </MotionBox>

  {/* RIGHT: hero image */}
  <MotionImage
    src="/hamburger_cheese_onion.png"
    style={{ x: imgX, opacity: textOpacity }}
    maxW="45vw"
    maxH="70vh"
    objectFit="contain"
    pointerEvents="none"
  />
  
</Box>



      {currentView === "menu" && (
  <MenuView onClose={() => setCurrentView("home")} />
)}
      {currentView === "order" && <OrderView />}
      
    </Box>

    
  )
}
