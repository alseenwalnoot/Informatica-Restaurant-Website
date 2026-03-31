import { Text, Box, RadioGroup, HStack, Separator, VStack } from "@chakra-ui/react"
import { useRef, useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet"

// Fixed origin — a local McDonald's (or whatever you want)
const RESTAURANT = {
  name: "McDonald's",
  coords: [51.9225, 4.47917], // Rotterdam city center-ish, swap for yours
}

// Geocode an address string to [lat, lng] via Nominatim
async function geocodeAddress(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
  const res = await fetch(url, { headers: { "Accept-Language": "en" } })
  const data = await res.json()
  if (!data.length) return null
  return [parseFloat(data[0].lat), parseFloat(data[0].lon)]
}

// Fetch a driving route between two [lat,lng] points via OSRM
async function fetchRoute(from, to) {
  const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`
  const res = await fetch(url)
  const data = await res.json()
  if (data.code !== "Ok") return null
  // OSRM returns [lng, lat], Leaflet wants [lat, lng]
  return data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng])
}

// Fit the map bounds to show the full route
function FitBounds({ coords }) {
  const map = useMap()
  useEffect(() => {
    if (coords?.length) map.fitBounds(coords, { padding: [40, 40] })
  }, [coords])
  return null
}

const errmsg = {
  meals: [{ id: -1, category: "NONE", name: "API Returned 404", description: "Error", price: 404, image: "" }],
  ret_count: 1
}

async function getOrder(orderId) {
  try {
    const res = await fetch(`http://localhost:8000/api/order/${orderId}`)
    if (!res.ok) return errmsg
    return (await res.json()) ?? errmsg
  } catch {
    return errmsg
  }
}

export default function PaymentView({ orderId }) {
  const [order, setOrder] = useState(errmsg)
  const [routeCoords, setRouteCoords] = useState(null)
  const [destCoords, setDestCoords] = useState(null)

  useEffect(() => {
    getOrder(orderId).then(setOrder)
  }, [])

  // Once we have the address fields, geocode + fetch route
  useEffect(() => {
    if (!order.street) return
    const address = `${order.street}, ${order.postcode}, ${order.city}`
    geocodeAddress(address).then(dest => {
      if (!dest) return
      setDestCoords(dest)
      fetchRoute(RESTAURANT.coords, dest).then(setRouteCoords)
    })
  }, [order])

  return (
  <Box
    position="absolute"
    top="15%"
    left="15%"
    w="70%"
    h="70%"
    bg="rgba(22,22,22,0.45)"
    backdropFilter="blur(12px)"
    borderRadius="18px"
    p="20px"
    color="white"
  >
    <HStack align="stretch" h="100%" gap={6}>
      
      {/* Left: text + delivery options */}
      <VStack align="start" justify="start" flex={1} gap={3}>
        <Text>Name: {order.name}</Text>
        <Text>Email: {order.email}</Text>
        <Text>Address: {order.city}, {order.street}, {order.postcode}</Text>
        <Separator />
        <Text>Delivery</Text>
        <RadioGroup.Root defaultValue="1">
          <HStack gap="6">
            {["Normal", "Fast", "Express"].map((label, i) => (
              <RadioGroup.Item key={i} value={String(i + 1)}>
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText>{label}</RadioGroup.ItemText>
              </RadioGroup.Item>
            ))}
          </HStack>
        </RadioGroup.Root>
      </VStack>

      {/* Right: map */}
      <Box flex={2} borderRadius="12px" overflow="hidden">
        <MapContainer
          center={RESTAURANT.coords}
          zoom={13}
          style={{ width: "100%", height: "100%" }}
          zoomControl
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={RESTAURANT.coords}>
            <Popup>{RESTAURANT.name}</Popup>
          </Marker>
          {destCoords && (
            <Marker position={destCoords}>
              <Popup>{order.street}, {order.city}</Popup>
            </Marker>
          )}
          {routeCoords && (
            <>
              <Polyline positions={routeCoords} color="#3b82f6" weight={4} opacity={0.8} />
              <FitBounds coords={routeCoords} />
            </>
          )}
        </MapContainer>
      </Box>

    </HStack>
  </Box>

  )
}