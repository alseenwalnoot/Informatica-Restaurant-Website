const imageModules = import.meta.glob("../assets/menu/*.{jpg,png,jpeg}", { eager: true })
const allImages = Object.values(imageModules).map((mod) => mod.default)

import { Box, Image, SimpleGrid, VStack, Text, Button, HStack, Card } from "@chakra-ui/react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

const MotionBox = motion.create(Box)

function extractNumber(path) {
  const match = path.match(/(\d+)/)  // find first group of digits
  return match ? match[0] : null
}

export default function MenuGallery() {
  const [images, setImages] = useState(allImages.slice(0, 12))
  const [selected, setSelected] = useState(null)
  const loadMore = () => {
  const start = images.length
  const more = Array.from({ length: 5 }, (_, i) => {
    const index = (start + i) % allImages.length
    return allImages[index]
  })
  setImages(prev => [...prev, ...more])
}
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    if (scrollHeight - scrollTop <= clientHeight + 1000) {
      loadMore()
    }
  }

  const openCard = (idx) => {
    setSelected({ idx, src: images[idx] })
    document.body.style.overflow = "hidden"
  }

  const closeCard = () => {
    setSelected(null)
    document.body.style.overflow = ""
  }

  return (
    <Box overflowY="auto" h="100vh" onScroll={handleScroll} >
      <SimpleGrid columns={[2, null, 3]} spacing={3}>
        {images.map((src, i) => (
          <Box key={i} as="button" onClick={() => openCard(i)} overflow="hidden"  _hover={{ transform: "scale(1.02)" }} transition="0.18s" borderRadius="md" p={2}>
            <Image key={i} src={src} w="100%" h="100%"/>
          </Box>
        ))}
      </SimpleGrid>

      {selected && (
        <Box position="fixed" top={0} left={0} right={0} bottom={0} zIndex={60} display="flex" alignItems="center" justifyContent="center" bg="rgba(0,0,0,0.45)" onClick={(e) => { if (e.target === e.currentTarget) closeCard() }}>
          <MotionBox initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.18 }} width={{ base: "92%", md: "640px" }} position="relative">
            <Card.Root width="100%" borderRadius="md" variant="subtle">
              <Image src={selected.src} alt="Place.Holder" borderTopLeftRadius="md" borderTopRightRadius="md" objectFit="cover" w="100%" h={{ base: "220px", md: "320px" }} />
              <Card.Body gap="3" p={4}>
                <VStack align="start" spacing={1}>
                  <Card.Title>Place.Holder</Card.Title>
                  <Card.Description fontSize="sm" color="gray.600">
                    A chef-crafted dish with premium ingredients. Delivered fresh and plated with care.
                  </Card.Description>
                </VStack>
              </Card.Body>
              <Card.Footer justifyContent="space-between" px={4} py={3}>
                
                <Text fontWeight="semibold" fontSize="lg">$Place.Holder</Text>
                <HStack spacing={3}>
                  <Button variant="ghost" onClick={closeCard}>Close</Button>
                  <Button colorScheme="teal">Order</Button>
                </HStack>
              </Card.Footer>
            </Card.Root>
          </MotionBox>
        </Box>
      )}


      {/*
      <SimpleGrid columns={[2, null, 3]} spacing={3}>
        {images.map((src, i) => (
          <Box
            key={i}
            as="button"
            onClick={() => console.log("Clicked image", i, src, extractNumber(src))} // "53060")}
            overflow="hidden"
            _hover={{ transform: "scale(1.01)" }}
            transition="0.2s"
          >
          <Image key={i} src={src}  />
          </Box>
        ))}
      </SimpleGrid>
      */}
    </Box>
  )
}
