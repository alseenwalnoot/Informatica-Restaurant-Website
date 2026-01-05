import { motion } from "framer-motion"
import { Box, Image, Text, Button } from "@chakra-ui/react"

const MotionBox = motion.create(Box) // instead of motion(Box)

export default function DishCard({ name, price, img }) {
  return (
    <MotionBox 
      whileHover={{ scale: 1.01 }} 
      p={1} 
      borderWidth="1px" 
      borderRadius="lg"
      boxShadow="md"
    >
      <Image src={img} alt={name} borderRadius="md" />
      <Text mt={2} fontWeight="bold">{name}</Text>
      <Text color="gray.500">${price}</Text>
      <Button mt={3} colorScheme="red" size="sm">Add to Cart</Button>
    </MotionBox>
  )
}
