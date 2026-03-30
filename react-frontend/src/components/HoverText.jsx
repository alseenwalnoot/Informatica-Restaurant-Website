import { Box, Button, HStack, IconButton, Text, VStack, Flex, Spacer, SimpleGrid, Image } from "@chakra-ui/react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import "leaflet/dist/leaflet.css"
import { Suspense } from "react"
const menuItems = [
  {
    title: "Cheese Burger",
    desc: "Burger with some meat",
    image: "hamburger_cheese_onion.png",
  },
  {
    title: "Pasta Bolgonese",
    desc: "Pasta pizza yesyes itali",
    image: "pasta.png",
  },
  {
    title: "Steak with Potatoes",
    desc: "Grilled steak with Potatoes as side",
    image: "steak_potatoes.png",
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

const HomeView = ({ views }) => {
  const [index, setIndex] = useState(0)
  const location = LOCATIONS[index]

  const prev = () =>
    setIndex(i => (i - 1 + LOCATIONS.length) % LOCATIONS.length)

  const next = () =>
    setIndex(i => (i + 1) % LOCATIONS.length)

  const [activeView, setActiveView] = useState("menuPreview")
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
          p={0} onClick={() => { setDirection(1); setActiveView("menuPreview") }}>
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
  h={activeView === "map" ? "60vh" : "auto"}   // 👈
  minH="200px"
  right="4%"
  position="absolute"
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
            position={activeView === "map" ? "absolute" : "relative"}  // 👈
      inset={activeView === "map" ? 0 : undefined}               // 👈
      w="100%"
      h={activeView === "map" ? "100%" : "auto"} 
            bg="rgba(22,22,22,0.45)"
            backdropFilter="blur(12px)"
            p="20px"
            display="flex"
            flexDirection="column"
          >
            {activeView === "map" && (
              <Flex direction="column" h="100%">
                <Flex align="center" justify="space-between" mb="12px" flexShrink={0}>
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
                  style={{ width: "100%", flex: 1, minHeight: 0 }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {LOCATIONS.map(loc => (
                    <Marker key={loc.name} position={loc.coords}>
                      <Popup>{loc.name}</Popup>
                    </Marker>
                  ))}
                  <FlyToLocation coords={location.coords} />
                </MapContainer>
              </Flex>
            )}

            {activeView === "menuPreview" && (
              <VStack>
                <HStack gap="10px" width="100%">
                  {menuItems.map((item, i) => (
                    <Box
                      key={i}
                      flex="1"
                      minW={0}
                      minH={0}
                      bg="rgba(255,255,255,0.06)"
                      borderRadius="24px"
                      maxH="100%"
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      textAlign="center"
                    > <Image src={item.image}/>
                    <VStack>
                      <Spacer/>
                      <Text fontSize={{ base: "1xl", md: "1xl", lg: "1xl" }}
          fontWeight="900"
          fontFamily="'SF Pro Display Bold'"
          color="#E6E6E6">{item.title}</Text>
                      <Text fontSize={{ base: "1xl" }}
          fontWeight="900"
          fontFamily="'SF Pro Display Bold'"
          color="#E6E6E6" p="1">{item.desc}</Text>
                    </VStack>
                    
                    </Box>
                  ))}
                </HStack>
                <Button
                  alignSelf="stretch"
                  borderRadius="16px"
                  //py="18px"
                  fontWeight="900"
                  bg="rgba(129, 201, 214, 0.66)"
                  color="white"
                  _hover={{ opacity: 0.0 }}
                  onClick={views.menu}
                >
                  Menu →
                </Button>
              </VStack>
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