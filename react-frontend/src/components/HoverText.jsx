import {
  Box,
  Button,
  HStack,
  IconButton,
  Text,
  VStack,
  Flex,
  Spacer,
  SimpleGrid
} from "@chakra-ui/react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import "leaflet/dist/leaflet.css"
import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Stage, useGLTF } from "@react-three/drei"
import  DishModel from "./3DMenuPreview"
const menuItems = [
  {
    title: "Chicken Burger",
    desc: "Crispy Chicken Patty with melted cheese",
    model: "/models/ChickenBurger.glb",
  },
  {
    title: "Korean BBQ Chicken Wings",
    desc: "Korean Chicken Wings",
    model: "/models/KoreanChickenBBQWings.glb",
  },
  {
    title: "Pepperoni Pizza",
    desc: "Tasty crispy pizza",
    model: "/models/PepperoniPizza.glb",
  },
]
import { motion, AnimatePresence } from "framer-motion"

const MotionBox = motion(Box)

const variants = {
  initial: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.45, ease: "easeInOut" }
  },
  exit: (direction) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    transition: { duration: 0.35, ease: "easeInOut" }
  })
}

const LOCATIONS = [
  { name: "Schiedam", coords: [51.9167, 4.3986] },
  { name: "Rotterdam", coords: [51.9244, 4.4777] },
  { name: "Delft", coords: [52.0116, 4.3571] },
  { name: "Epstein's gooncave", coords: [51.9055206802406, 4.403329838541286] }
]

const FlyToLocation = ({ coords }) => {
  const map = useMap()

  useEffect(() => {
    map.flyTo(coords, map.getZoom(), {
      duration: 0.6,
      easeLinearity: 0.25,
    })
  }, [coords])

  return null
}

const HomeView = () => {
  const [index, setIndex] = useState(0)
  const location = LOCATIONS[index]

  const prev = () =>
    setIndex(i => (i - 1 + LOCATIONS.length) % LOCATIONS.length)

  const next = () =>
    setIndex(i => (i + 1) % LOCATIONS.length)

  const [activeView, setActiveView] = useState("map")
  const [direction, setDirection] = useState(1)

  return (
    <Flex
      w="100vw"
      h="100vh"
      px={{ base: 6, md: 16 }}
      py={{ base: 10, md: 16 }}
      align="center"
      justify="space-between"
      position="relative"
    >
      {/* LEFT SIDE MENU */}
      <VStack
        align="flex-start"
        spacing={{ base: 6, md: 8 }}
        maxW="400px"
        pl={{ base: 4, md: 12 }}
      >

        <Button variant="ghost"
          fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
          fontWeight="900"
          fontFamily="'SF Pro Display Bold'"
          color="#E6E6E6"
          _hover={{ bg: "transparent", textDecoration: "underline" }}
          p={0} onClick={() => { setDirection(1); setActiveView("menu") }}>
          Menu
        </Button>

        <Button variant="ghost"
          fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
          fontWeight="900"
          fontFamily="'SF Pro Display Bold'"
          color="#E6E6E6"
          _hover={{ bg: "transparent", textDecoration: "underline" }}
          p={0} onClick={() => { setDirection(1); setActiveView("order") }}>
          Order
        </Button>

        <Button variant="ghost"
          fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
          fontWeight="900"
          fontFamily="'SF Pro Display Bold'"
          color="#E6E6E6"
          _hover={{ bg: "transparent", textDecoration: "underline" }}
          p={0} onClick={() => { setDirection(1); setActiveView("map") }}>
          Locations
        </Button>
        <Box h="40px" />
        <Button variant="ghost"
          fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
          fontWeight="900"
          fontFamily="'SF Pro Display Bold'"
          color="#E6E6E6"
          _hover={{ bg: "transparent", textDecoration: "underline" }}
          p={0} onClick={() => { setDirection(1); setActiveView("about") }}>
          About →
        </Button>
        <Box h="40px" />
      </VStack>
      <Box
        w={{ base: "80%", md: "45%" }}
        h={{ base: "55vh", md: "70vh" }}
        position="relative"
        overflow="hidden"
        borderRadius="20px"
      >
        <AnimatePresence custom={direction} mode="wait">
          <MotionBox
            key={activeView}
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            position="absolute"
            inset={0}
            bg="rgba(22,22,22,0.45)"
            backdropFilter="blur(12px)"
            p="20px"
            display="flex"
            flexDirection="column"
          >
            {activeView === "map" && (
              <>
                <Flex align="center" justify="space-between" mb="12px">
                  <Text
                    fontFamily="'SF Pro Display Bold'"
                    fontWeight="900"
                    fontSize="2xl"
                    color="#E6E6E6"
                  >
                    Locations
                  </Text>

                  <HStack spacing="2">
                    <IconButton
                      onClick={prev}
                      size="sm"
                      borderRadius="10px"
                      bg="rgba(0,0,0,0.6)"
                      color="white"
                      _hover={{ bg: "rgba(0,0,0,0.75)" }}
                    >
                      <ChevronLeft />
                    </IconButton>

                    <IconButton
                      onClick={next}
                      size="sm"
                      borderRadius="10px"
                      bg="rgba(0,0,0,0.6)"
                      color="white"
                      _hover={{ bg: "rgba(0,0,0,0.75)" }}
                    >
                      <ChevronRight />
                    </IconButton>
                  </HStack>
                </Flex>
                <MapContainer
                  center={location.coords}
                  zoom={13}
                  zoomControl
                  style={{ width: "100%", height: "100%" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {LOCATIONS.map(loc => (
                    <Marker key={loc.name} position={loc.coords}>
                      <Popup>{loc.name}</Popup>
                    </Marker>
                  ))}
                  <FlyToLocation coords={location.coords} />
                </MapContainer>
              </>
            )}

            {activeView === "menu" && (
              <Box color="white" fontSize="2xl" fontWeight="900">
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing="6" px="4" py="8">
  {menuItems.map((item, i) => (
    <Box
      key={i}
      bg="rgba(255,255,255,0.07)"
      borderRadius="20px"
      p="4"
      textAlign="center"
    >
      <Box h="200px">
        <Canvas camera={{ position: [0, 0, 3] }}>
          <Suspense fallback={null}>
            <Stage intensity={0.5}>
              <DishModel url={item.model} />
            </Stage>
            <OrbitControls enableZoom={false} enablePan={false} />
          </Suspense>
        </Canvas>
      </Box>
      <Text fontSize="xl" fontWeight="bold" mt="4">
        {item.title}
      </Text>
      <Text opacity={0.7} fontSize="md">
        {item.desc}
      </Text>
    </Box>
  ))}
</SimpleGrid>
              </Box>
            )}

            {activeView === "order" && (
              <Box color="white" fontSize="2xl" fontWeight="900">
                Order Content
              </Box>
            )}

            {activeView === "about" && (
              <Box color="white" fontSize="2xl" fontWeight="900">
                About Content
              </Box>
            )}

          </MotionBox>
        </AnimatePresence>
      </Box>
    </Flex>
  )
}

export default HomeView