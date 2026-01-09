import { IconButton, Flex, Box, Text, AbsoluteCenter, Center, Carousel, useCarousel, Icon, CloseButton, Button, VStack, HStack, Spacer } from "@chakra-ui/react"
import {ArrowLeftToLine, ChevronLeft, ChevronRight} from "lucide-react"
import { useEffect, useState, useRef } from "react";
/*
const items = [
  { title: "Carbonara", desc: "Creamy sauce, pancetta, egg." },
  { title: "Bolognese", desc: "Slow cooked meat & tomato." },
  { title: "Pesto", desc: "Fresh basil, garlic, pine nuts." },
  { title: "Alfredo", desc: "Butter, parmesan, rich flavor." },
  { title: "Arrabiata", desc: "Garlic & chili heat." },
]
  */
const errmsg =  { meals:
  [{ id: -1, category: "NONE", name: "API Returned 404, maybe it is not running?", description: "Error", price: 404, image: "" }], ret_count: 1 }
async function getMealstest() {
  try {
    const res = await fetch("http://localhost:8000/api/getmeals/1-50");
    if (!res.ok) return errmsg;
    const json = await res.json();
    return json ?? errmsg;
  } catch {
    return errmsg;
  }
}


function AdditionBox() {
  return(
    <Box          // ← shifts it next to panel
        w="9.5dvw" h="10dvh" borderRadius="10px" bg="rgba(255, 255, 255, 1)" color="white"></Box>
  )
}

export default function MenuView({ onClose }) {
  const [data, setData] = useState(errmsg);

  useEffect(() => {
    getMealstest().then(setData);
  }, []);

  const carousel = useCarousel({
    slideCount: data ? data.ret_count : 0
  });

const category = data.meals
  .map(m => m.category)
  .filter(Boolean)
  .map(c => c.trim())
  .filter((v, i, a) => a.indexOf(v) === i)
  .map(c => c.charAt(0).toUpperCase() + c.slice(1).toLowerCase())
  .join(" & ")

  if (!data) return null;

  const mealsPerSlide = 6
  const slides = []

  for (let i = 0; i < data.meals.length; i += mealsPerSlide) {
    slides.push(data.meals.slice(i, i + mealsPerSlide))
  }


  return (
    <Box>
      <Box
        position="absolute"
        top="3%"
        left="2%"
        w="25%"
        h="94%"
        bg="rgba(22,22,22,0.45)"
        backdropFilter="blur(12px)"
        borderRadius="18px"
        p="20px"
        color="white"
      >
      <CloseButton variant="ghost" size={["vdw", "1vdw", "2vdw"]} colorPalette="gray" aria-label="Close" onClick={onClose}>
        <ArrowLeftToLine />
      </CloseButton>
        <Center>
          <Text
            position="absolute"
            top="2%"
            fontFamily="'SF Pro Display Bold'"
            fontSize={["2xl", "3xl","4xl", "5xl", "6x1"]}
            fontWeight="900"
          >
            Our Menu
          </Text>
        </Center>

        <Center>
          <Text
            position="absolute"
            top="12%"
            fontFamily="'SF Pro Display Bold'"
            fontSize={["1xl", "2xl"]}
            fontWeight="900"
          >
            {category}
          </Text>
        </Center>
        <Box 
          position="absolute" 
          top="37.5%" 
          left="5%" 
          w="91%"
          h="60%"
          bg="rgba(22, 22, 22, 0.45)"
          backdropFilter="blur(12px)"
          borderRadius="18px" 
          p="20px" 
          color="white">
            <Text 
              fontFamily="'SF Pro Display Bold'"
              fontSize={["1xl", "2xl"]}
              fontWeight="900"
              >Additions
            </Text>
              <Flex gap="2.5">
                <VStack><AdditionBox/>
              <AdditionBox/></VStack>
              <VStack><AdditionBox/>
              <AdditionBox/></VStack>
            </Flex>
            <Text
              fontFamily="'SF Pro Display Bold'"
              fontSize={["1xl", "2xl"]}
              fontWeight="900"
              >Delivery Address
            </Text>
           <Button 
            w="100%"
            h="5%"
            borderRadius="12px" 
            bg="rgba(129, 201, 214, 0.66)" 
            p="20px" 
            color="white">Pay</Button>
          </Box>
      </Box>

      {/* RIGHT GLASS BOX WITH CAROUSEL */}
      <Box
  position="absolute"
  top="3%"
  left="28%"
  w="70%"
  h="94%"
  bg="rgba(22,22,22,0.45)"
  backdropFilter="blur(12px)"
  borderRadius="18px"
  p="12px"
  color="white"
>
  <Carousel.Root allowMouseDrag slideCount={slides.length} w="100%" h="100%">
    <Carousel.ItemGroup snapAlign="start"h="100%">
      {slides.map((slide, slideIndex) => (
        <Carousel.Item key={slideIndex} index={slideIndex}>
          <Box
            w="100%"
            h="100%"
            display="grid"
            gridTemplateColumns="repeat(3, 1fr)"
            gridTemplateRows="repeat(2, 1fr)"
            gap="24px"
          >
            {slide.map((it, i) => (
              <Box
                key={i}
                bg="rgba(255,255,255,0.06)"
                rounded="16px"
                p="20px"
                display="flex"
                flexDir="column"
                justifyContent="space-between"
              >
                <Box>
                  <Text fontSize="xl" fontWeight="700" mb="2">
                    {it.name}
                  </Text>
                  <Text fontSize="md" opacity={0.75}>
                    {it.description}
                  </Text>
                </Box>
                <HStack>
                <Text fontSize="md" fontWeight="800" >
                  €{it.price}
                </Text>
                <IconButton variant="plain" color="rgba(129, 201, 214, 0.66)"><ChevronLeft /></IconButton>
                <Box position="relative"

                
        bg="rgba(22,22,22,0.45)"
        backdropFilter="blur(12px)"
        borderRadius="6px"
        p="13px"
        color="white"></Box>
                <IconButton variant="plain" color="rgba(129, 201, 214, 0.66)"><ChevronRight /></IconButton>
                
                <Button 
                  w="40%"
                  h="5%"
                  borderRadius="12px" 
                  bg="rgba(129, 201, 214, 0.66)" 
                  p="20px" 
                  color="white">Add</Button></HStack>
              </Box>
            ))}
          </Box>
        </Carousel.Item>
      ))}
    </Carousel.ItemGroup>

    <Carousel.Control justifyContent="center" mt="6">
      <Carousel.Indicators />
    </Carousel.Control>
  </Carousel.Root>
</Box>

    </Box>
  )
}


