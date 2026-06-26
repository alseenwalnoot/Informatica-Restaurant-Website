import { Text, Box, RadioGroup, HStack, Separator, VStack, Button, Spacer } from "@chakra-ui/react"
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
async function getOrderTotal(orderId) {
  const errmsg = null

  async function getOrder(orderId) {
    try {
      const res = await fetch(`http://localhost:8000/api/order/${orderId}`)
      if (!res.ok) return errmsg
      return (await res.json()) ?? errmsg
    } catch {
      return errmsg
    }
  }

  async function getMeal(mealId) {
    try {
      const res = await fetch(`http://localhost:8000/api/getmeal/${mealId}`)
      if (!res.ok) return errmsg
      return (await res.json()) ?? errmsg
    } catch {
      return errmsg
    }
  }

  const order = await getOrder(orderId)
  if (!order) return null

  const meals = await Promise.all(order.cart.map(id => getMeal(id)))
  if (meals.some(m => m === null)) return null

  return meals.reduce((sum, meal) => sum + meal.price, 0)
}

export default function PaymentView({ orderId }) {
  const [order, setOrder] = useState(errmsg)
  const [routeCoords, setRouteCoords] = useState(null)
  const [destCoords, setDestCoords] = useState(null)
  const [sending, setSending] = useState(false)
  const [deliveryFee, setDeliveryFee] = useState(0);
  

  const deliveryOptions = [
    { id: "1", label: "Normal", price: 0 },
    { id: "2", label: "Fast", price: 2.70 },
    { id: "3", label: "Express", price: 5.30 },
  ];

  useEffect(() => {
    getOrder(orderId).then(setOrder)
  }, [])

  const [total, setTotal] = useState(null)
  const finalTotal = total + deliveryFee; 
  useEffect(() => {
    getOrderTotal(orderId).then(setTotal)
  }, [orderId])
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
  

  const handlePay = async () => {
    setSending(true)
    try {
      const res = await fetch("/api/sendreceipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId })
      })
      const data = await res.json()
      if (data.ok) {
        window.location.href = data.tracking_url
      } else {
        console.error("Receipt failed:", data)
      }
    } catch (e) {
      console.error("Receipt error:", e)
    } finally {
      setSending(false)
    }
  }

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
    color="#dbceceea"
  >
    <HStack align="stretch" h="100%" gap={6}>
      
      {/* Left text */}
      <VStack align="start" justify="start" flex={1} gap={3}>
        <Text>Thanks for ordering at Prestige Opulent!<br/>Your order will get processed as fast as possible after you pay. After payment, check your e-mail inbox for a confirmation and a tracking link.</Text>
        <Text>Delivery to: {order.city}, {order.street}, {order.postcode}<br/>Estimated delivery time: 35 Minutes.</Text>
        <Separator />
        <Spacer/>
        <Text fontWeight="bold" mb="2">Delivery Speed</Text>
      <RadioGroup.Root 
        defaultValue="1" 
        onValueChange={(details) => {
          const opt = deliveryOptions.find(o => o.id === details.value);
          if (opt) setDeliveryFee(opt.price); // Simply updates the delivery addon
        }}
      >
        <HStack gap="6">
          {deliveryOptions.map((opt) => (
            <RadioGroup.Item key={opt.id} value={opt.id}>
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <HStack gap="1" display="inline-flex" alignItems="center">
                <RadioGroup.ItemText>{opt.label}</RadioGroup.ItemText>
                <Text as="span" fontSize="2xs" fontStyle="italic" opacity={0.65}>
                  (+ €{opt.price.toFixed(2)})
                </Text>
              </HStack>
            </RadioGroup.Item>
          ))}
        </HStack>
      </RadioGroup.Root>
        
        
        {orderId !== null && <Text>Order Number: {orderId}</Text>}

        <Button
          w="100%" h="36px" borderRadius="12px"
          bg="rgba(129, 201, 214, 0.66)"
          color="white" fontWeight="700"
          onClick={handlePay}
          loading={sending}
        >
          Pay{finalTotal !== null && <Text>€{finalTotal.toFixed(2)}</Text>}
        </Button>
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




