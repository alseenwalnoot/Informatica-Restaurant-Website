import { Box, Text } from "@chakra-ui/react"

export default function OrderView() {
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
      <Text fontSize="5xl" fontWeight="900">Order</Text>
      <Text mt={4}>For extensive tracking, enter your order number and postcode below.</Text>
      <Input
        flex="1" size="xs" variant="flushed"
        placeholder={placeholder}
        value={form[key]}
        onChange={setField(key)}
        py="0" minH="24px" fontSize="sm" colorPalette="gray"
      />
    </Box>
  )
}
