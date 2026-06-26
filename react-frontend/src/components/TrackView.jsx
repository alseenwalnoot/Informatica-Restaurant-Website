import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { Box, Text, VStack, Separator, HStack } from "@chakra-ui/react"
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet"
import Backdrop from "./Backdrop"

const RESTAURANT = {
  name: "Prestige Opulent",
  coords: [51.9225, 4.47917],
}

async function geocodeAddress(address) {
  const url =
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`

  const res = await fetch(url, {
    headers: { "Accept-Language": "en" }
  })

  const data = await res.json()

  if (!data.length) return null

  return [
    parseFloat(data[0].lat),
    parseFloat(data[0].lon)
  ]
}

async function fetchRoute(from, to) {
  const url =
    `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`

  const res = await fetch(url)
  const data = await res.json()

  if (data.code !== "Ok") return null

  return data.routes[0].geometry.coordinates.map(
    ([lng, lat]) => [lat, lng]
  )
}

function FitBounds({ coords }) {
  const map = useMap()

  useEffect(() => {
    if (coords?.length) {
      map.fitBounds(coords, {
        padding: [40, 40]
      })
    }
  }, [coords])

  return null
}

export default function TrackView() {
  const [routeCoords, setRouteCoords] = useState(null)
  const [destCoords, setDestCoords] = useState(null)
  const { postcode, orderId } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`http://localhost:8000/api/track/${postcode}/${orderId}`)
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(setData)
      .catch(() => setError("Order not found or postcode doesn't match."))
  }, [])
  
  useEffect(() => {
    if (!data?.order?.street) return

    const address =
        `${data.order.street}, ${data.order.postcode}, ${data.order.city}`

    geocodeAddress(address).then(dest => {
        if (!dest) return

        setDestCoords(dest)
        fetchRoute(RESTAURANT.coords, dest)
        .then(setRouteCoords)
    })
    }, [data])
  return (
    <Backdrop>
        <Box display="flex" alignItems="center" justifyContent="center" w="100%" h="100%">
      <Box
  display="flex"
  alignItems="center"
  justifyContent="center"
  w="100%"
  h="100%"
>
  <HStack
    align="stretch"
    gap={6}
    w="80%"
    h="70%"
  >
    <Box
      flex={1}
      bg="rgba(22,22,22,0.45)"
      backdropFilter="blur(12px)"
      color="#dbceceea"
      borderRadius="18px"
      p="40px"
    >
      {error && <Text color="red.300">{error}</Text>}

      {data && (
        <VStack align="start" gap={3}>
          <Text
            fontSize="3xl"
            fontWeight="900"
            fontFamily="'SF Pro Display Bold'"
          >
            Order #{data.order.id}
          </Text>

          <Text color="gray.400">
            {data.order.street}, {data.order.postcode}, {data.order.city}
          </Text>

          <Separator />

          {data.meals.map((m, i) => (
            <Text key={i}>
              {m.name} — €{m.price.toFixed(2)}
            </Text>
          ))}

          <Separator />

          <Text fontWeight="700">
            Total: €{data.total.toFixed(2)}
          </Text>

          <Text color="gray.400" fontSize="sm">
            Ordered at {data.order.created_at} — 15 Minutes to go.
          </Text>
        </VStack>
      )}

      {!data && !error && <Text>Loading...</Text>}
    </Box>

    <Box
      flex={1.3}
      borderRadius="18px"
      overflow="hidden"
      bg="rgba(22,22,22,0.45)"
      backdropFilter="blur(12px)"
    >
      <MapContainer
        center={RESTAURANT.coords}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={RESTAURANT.coords}>
          <Popup>{RESTAURANT.name}</Popup>
        </Marker>

        {destCoords && (
          <Marker position={destCoords}>
            <Popup>
              {data.order.street}, {data.order.city}
            </Popup>
          </Marker>
        )}

        {routeCoords && (
          <>
            <Polyline
              positions={routeCoords}
              color="#3b82f6"
              weight={4}
              opacity={0.8}
            />

            <FitBounds coords={routeCoords} />
          </>
        )}
      </MapContainer>
    </Box>
  </HStack>
</Box>
      </Box>
    </Backdrop>
  )
}