import {
  Box,
  Button,
  HStack,
  IconButton,
  Text,
  VStack,
  Flex
} from "@chakra-ui/react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import "leaflet/dist/leaflet.css"

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
      >
        {["Menu", "Order", "Locations"].map(label => (
          <Button
            key={label}
            variant="ghost"
            fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
            fontWeight="900"
            fontFamily="'SF Pro Display Bold'"
            color="#E6E6E6"
            _hover={{ bg: "transparent", textDecoration: "underline" }}
            p={0}
          >
            {label}
          </Button>
        ))}

        <Box h="40px" />

        <Button
          variant="ghost"
          fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
          fontWeight="900"
          fontFamily="'SF Pro Display Bold'"
          color="#E6E6E6"
          _hover={{ bg: "transparent", textDecoration: "underline" }}
          p={0}
        >
          About →
        </Button>
      </VStack>

      {/* RIGHT SIDE MAP CARD */}
      <Box
        w={{ base: "100%", md: "45%" }}
        h={{ base: "55vh", md: "70vh" }}
        bg="rgba(22,22,22,0.45)"
        backdropFilter="blur(12px)"
        borderRadius="20px"
        p="20px"
        display="flex"
        flexDirection="column"
        position="relative"
      >
        {/* Header */}
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

        {/* Map wrapper */}
        <Box
          flex="1"
          borderRadius="14px"
          overflow="hidden"
        >
          <MapContainer
            center={location.coords}
            zoom={13}
            zoomControl
            style={{ width: "100%", height: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {LOCATIONS.map(loc => (
              <Marker key={loc.name} position={loc.coords}>
                <Popup>{loc.name}</Popup>
              </Marker>
            ))}

            <FlyToLocation coords={location.coords} />
          </MapContainer>
        </Box>

        {/* Location overlay */}
        <Box
          position="absolute"
          bottom="20px"
          left="50%"
          transform="translateX(-50%)"
          px="14px"
          py="6px"
          bg="rgba(0,0,0,0.6)"
          borderRadius="10px"
          backdropFilter="blur(8px)"
          pointerEvents="none"
        >
          <Text fontWeight="600" fontSize="sm">
            {location.name}
          </Text>
          <Text fontSize="xs" opacity={0.8}>
            {location.coords[0].toFixed(4)}, {location.coords[1].toFixed(4)}
          </Text>
        </Box>
      </Box>
    </Flex>
  )
}

export default HomeView