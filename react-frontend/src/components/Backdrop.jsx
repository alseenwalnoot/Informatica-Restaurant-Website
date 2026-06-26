import { Box } from "@chakra-ui/react"

export default function Backdrop({ children }) {
  return (
    <Box w="100vw" h="100vh" position="relative" overflow="hidden" bg="black">
      <Box
        position="absolute"
        top={0} left={0} w="100%" h="100%"
        bgImage="url('/bg_no_logo.png')"
        bgPosition="center"
        bgRepeat="repeat"
        zIndex={0}
      />
      <Box
        position="absolute"
        top={0} left={0} w="100%" h="100%"
        bg="rgba(0,0,0,0.4)"
        zIndex={1}
      />
      <Box position="relative" zIndex={2} w="100%" h="100%">
        {children}
      </Box>
    </Box>
  )
}