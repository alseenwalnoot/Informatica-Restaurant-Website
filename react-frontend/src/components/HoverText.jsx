import { Box, Button, Text } from "@chakra-ui/react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

const MotionButton = motion(Button)
const MotionText = motion(Text)



const HoverMenu = ({ items }) => {
  // index of hovered item or null
  const [hovered, setHovered] = useState(null)


  // tweak this to match the height of the hover text (px)
  const SHIFT_PX = 135

  // configuration for each item: label, hover text, absolute top/left


  return (
    <Box position="relative" w="100%" h="100%">
      {items.map((it, i) => {
        const shouldShiftDown = hovered !== null && i > hovered
        return (
          <Box
            key={it.label}
            position="absolute"
            top={it.top}
            left={it.left}
            transform="translateY(-50%)"
          >
            <MotionButton
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onClick={it.onClick}
              fontFamily="'SF Pro Display Bold'"
              fontWeight="900"
              fontSize="6xl"
              color="#E6E6E6"
              bg="transparent"
              _hover={{ bg: "transparent" }}
              _active={{ bg: "transparent" }}
              animate={{ y: shouldShiftDown ? SHIFT_PX : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
            >
              {it.label}
            </MotionButton>

            <Box position="relative" height={`${SHIFT_PX}px`} mt="2" left="20%">
              <AnimatePresence>
                {hovered === i && (
                  <MotionText
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22 }}
                    fontFamily="'SF Pro Display'"
                    fontWeight="600"
                    fontSize="2xl"
                    color="#E6E6E6"
                    whiteSpace="pre-line"
                  >
                    {it.hoverText}
                  </MotionText>
                )}
              </AnimatePresence>
            </Box>
          </Box>
        )
      })}
      <Button
        fontFamily="'SF Pro Display Bold'"
        fontWeight="900"
        fontSize="6xl"
        position="absolute"
        top="80%"
        left="18%"
        color="#E6E6E6"
        bg="rgba(255,255,255,0)"
        onClick={() => window.open("https://github.com/alseenwalnoot/Informatica-Restaurant-Website", "_blank")}
      >
        About 🠊
      </Button>

    </Box>
  )
}

export default HoverMenu; 