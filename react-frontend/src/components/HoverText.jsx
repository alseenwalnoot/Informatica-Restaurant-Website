import { Box, Button, HStack, IconButton, Text, Spacer } from "@chakra-ui/react"
import { motion, AnimatePresence } from "framer-motion"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import { ChevronLeft, ChevronRight, Icon } from "lucide-react"
import { useState, useEffect } from "react"
import "leaflet/dist/leaflet.css"
const MotionButton = motion.create(Button)
const MotionText = motion.create(Text)

const LOCATIONS = [
  {
    name: "Schiedam",
    coords: [51.9167, 4.3986],
  },
  {
    name: "Rotterdam",
    coords: [51.9244, 4.4777],
  },
  {
    name: "Delft",
    coords: [52.0116, 4.3571],
  },
  {
    name: "Epstein's gooncave",
    coords: [51.9055206802406, 4.403329838541286],
  }
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

const HomeView = ({ items }) => {
  const [index, setIndex] = useState(0)
  const location = LOCATIONS[index]

  const prev = () =>
    setIndex((i) => (i - 1 + LOCATIONS.length) % LOCATIONS.length)

  const next = () =>
    setIndex((i) => (i + 1) % LOCATIONS.length)
  return (
    <Box position="relative" w="100%" h="100%">
      
          <Button
            fontFamily="'SF Pro Display Bold'"
            fontWeight="900"
            fontSize="6xl"
            position="absolute"
            top={items[0].top}
            left={items[0].left}
            onClick={console.log("wtf ")}
            color="#E6E6E6"
            bg="rgba(255,255,255,0)">{items[0].label}
          </Button>

      <Button
        fontFamily="'SF Pro Display Bold'"
        fontWeight="900"
        fontSize="6xl"
        position="absolute"
        top="80%"
        left="18%"
        color="#E6E6E6"
        bg="rgba(255,255,255,0)"
        onClick={() => window.open("https://github.com/alseenwalnoot/Informatica-Restaurant-Website", "_blank")} > About 🠊 </Button>

      <Box
        position="absolute"
        top="15%"
        right="10%"
        w="40%"
        h="70%"
        bg="rgba(22,22,22,0.45)"
        backdropFilter="blur(12px)"
        borderRadius="18px"
        p="12px"
        overflow="hidden"
        zIndex={1}
      >
        <HStack>
          <Text fontFamily="'SF Pro Display Bold'"
            fontWeight="900"
            fontSize="2xl"
            color="#E6E6E6" p="3px">Locations</Text>
          <IconButton
            onClick={prev}
            position="absolute"
            //bottom="18px"
            right="10%"
            size="sm"
            borderRadius="10px"
            bg="rgba(0,0,0,0.6)"
            color="white"
            _hover={{ bg: "rgba(0,0,0,0.75)" }}
            zIndex={1100}
            p="3px"
          ><ChevronLeft /></IconButton>

          {/* Right button */}
          <IconButton

            onClick={next}
            position="absolute"
            //bottom="18px"
            right="3%"
            size="sm"
            borderRadius="10px"
            bg="rgba(0,0,0,0.6)"
            color="white"
            _hover={{ bg: "rgba(0,0,0,0.75)" }}
            zIndex={1100}
            p="3px"
          ><ChevronRight />
          </IconButton>
        </HStack>
        <MapContainer
          center={location.coords}
          zoom={13}
          zoomControl
          borderRadius="18px"
          style={{ borderRadius: "10px", p: "2px", width: "100%", height: "98%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution=""
          />

          {LOCATIONS.map((loc) => (
            <Marker key={loc.name} position={loc.coords}>
              <Popup>{loc.name}</Popup>
            </Marker>
          ))}

          <FlyToLocation coords={location.coords} />
        </MapContainer>

        {/* Top overlay (location name / coords) */}
        <Box
          position="absolute"
          top="13%"
          left="50%"
          transform="translateX(-50%)"
          px="14px"
          py="6px"
          bg="rgba(0,0,0,0.55)"
          borderRadius="10px"
          backdropFilter="blur(8px)"
          pointerEvents="none"
          zIndex={1100}

        >
          <Text fontWeight="600" fontSize="sm">
            {location.name}
          </Text>
          <Text fontSize="xs" opacity={0.8}>
            {location.coords[0].toFixed(4)}, {location.coords[1].toFixed(4)}
          </Text>
        </Box>


      </Box>

    </Box >)
}
export default HomeView;