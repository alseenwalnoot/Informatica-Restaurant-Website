import { IconButton, Flex, Box, Text, AbsoluteCenter, Center, Carousel, useCarousel, Icon, CloseButton, Button, VStack, HStack, Input, Spacer } from "@chakra-ui/react"
import { ArrowLeftToLine, ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState, useRef } from "react";

const errmsg = {
  meals:
    [{ id: -1, category: "NONE", name: "API Returned 404, maybe it is not running?", description: "Error", price: 404, image: "" }], ret_count: 1
}
async function getMealstest() {
  try {
    const res = await fetch("http://localhost:8000/api/getmeals/1-105");
    if (!res.ok) return errmsg;
    const json = await res.json();
    return json ?? errmsg;
  } catch {
    return errmsg;
  }
}
async function getMeals(from, to) {
  try {
    const res = await fetch('http://localhost:8000/api/getmeals/${from}-${to}');
    if (!res.ok) return errmsg;
    const json = await res.json();
    return json ?? errmsg;
  } catch {
    return errmsg;
  }
}

const compactInput = {
  size: "xs",
  variant: "flushed",
  py: "0",
  minH: "24px",
  fontSize: "sm",
}


function AdditionBox() {
  return (
    <Box w="9.5dvw" h="10dvh" borderRadius="10px" bg="rgba(255, 255, 255, 1)" color="white"></Box>
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

 
  const mealsPerSlide = 6
  const slides = []
  const [currentSlide, setCurrentSlide] = useState(0)
  for (let i = 0; i < data.meals.length; i += mealsPerSlide) {
    slides.push(data.meals.slice(i, i + mealsPerSlide))
  }

// Then derive category from current slide only:
  const category = (slides[currentSlide] ?? [])
    .map(m => m.category)
    .filter(Boolean)
    .map(c => c.trim())
    .filter((v, i, a) => a.indexOf(v) === i)
    .map(c => c.charAt(0).toUpperCase() + c.slice(1).toLowerCase())
    .join(" & ")
    if (!data) return null;


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
            fontSize={["2xl", "3xl", "4xl", "5xl", "6x1"]}
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
            fontSize={["1xl", "1xl"]}
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
          color="white"
          display="flex"
          flexDir="column"
        >
          <Box flex="1" overflowY="auto" p="16px" className="no-scrollbar">
            <Text
              fontFamily="'SF Pro Display Bold'"
              fontSize="lg"
              fontWeight="900"
              mb="2"
            >
              Additions
            </Text>

            <Flex gap="2" mb="4">
              <VStack spacing="2">
                <AdditionBox />
                <AdditionBox />
              </VStack>
              <VStack spacing="2">
                <AdditionBox />
                <AdditionBox />
              </VStack>
            </Flex>

            <Text
              fontFamily="'SF Pro Display Bold'"
              fontSize="lg"
              fontWeight="900"
              mb="2"
            >
              Delivery Address
            </Text>

            <VStack spacing="1" align="stretch">
              {[
                ["Your Name", ""],
                ["Email", "someone@gmail.com"],
                ["City", "Rotterdam, NL"],
                ["Street", "Lijnbaan, 432"],
                ["Post Code", "3024AB"],
              ].map(([label, placeholder]) => (
                <HStack key={label} spacing="2">
                  <Text
                    w="90px"
                    fontFamily="'SF Pro Display Bold'"
                    fontSize="sm"
                    fontWeight="900"
                    whiteSpace="nowrap"
                  >
                    {label}
                  </Text>

                  <Input
                    flex="1"
                    size="xs"
                    variant="flushed"
                    placeholder={placeholder}
                    py="0"
                    minH="24px"
                    fontSize="sm"
                    colorPalette="gray"
                  />
                </HStack>
              ))}
            </VStack>
          </Box>

          <Box p="12px">
            <Button
              w="100%"
              h="36px"
              borderRadius="12px"
              bg="rgba(129, 201, 214, 0.66)"
              color="white"
              fontWeight="700"
            >
              Pay
            </Button>
          </Box>
        </Box>

      </Box>

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
        <Carousel.Root allowMouseDrag slideCount={slides.length} w="100%" h="100%" onPageChange={(details) => setCurrentSlide(details.page)}>
          <Carousel.ItemGroup h="100%">
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
                        <IconButton
                          variant="plain"
                          color="rgba(129, 201, 214, 0.66)"
                          /*onClick={() => decQty(it.id)}*/
                        >
                          <ChevronLeft />
                        </IconButton>

                        <Box
                          bg="rgba(22,22,22,0.45)"
                          backdropFilter="blur(12px)"
                          borderRadius="6px"
                          px="12px"
                          py="6px"
                        >
                          <Text>0</Text>

                        </Box>

                        <IconButton
                          variant="plain"
                          color="rgba(129, 201, 214, 0.66)"
                          /*onClick={() => incQty(it.id)}*/
                        >
                          <ChevronRight />
                        </IconButton>

                        <Button
                          w="40%"
                          h="36px"
                          borderRadius="12px"
                          bg="rgba(129, 201, 214, 0.66)"
                          color="white"
                          onClick={() => console.log(category)}
                        >
                          Add
                        </Button>
                      </HStack>
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


