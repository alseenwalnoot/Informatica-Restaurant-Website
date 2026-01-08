import { Box, Text, Center, Carousel, useCarousel, Icon, CloseButton, Button } from "@chakra-ui/react"
import {ArrowLeftToLine} from "lucide-react"
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
    const res = await fetch("http://localhost:8000/api/getmeals/1-6");
    if (!res.ok) return errmsg;
    const json = await res.json();
    return json ?? errmsg;
  } catch {
    return errmsg;
  }
}
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
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
      <CloseButton variant="subtle" size={["2xs", "xs", "sm"]} colorPalette="gray" aria-label="Close" onClick={onClose}>
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
          borderRadius="14px" //
          p="20px" 
          color="white">
           <Button 
            w="100%"
            h="15%"
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
        left="28%"          // ← shifts it next to panel
        w="70%"             // ← bigger box for carousel
        h="94%"
        bg="rgba(22,22,22,0.45)"
        backdropFilter="blur(12px)"
        borderRadius="18px"
        p="32px"
        color="white"
      >
        <Carousel.Root  slideCount={data.ret_count} w="100%" h="100%">
          <Carousel.ItemGroup h="100%">
            {data.meals.map((it, index) => (
              <Carousel.Item key={index} index={index}>
                <Box
                  w="100%"
                  h="100%"
                  p="24px"
                  rounded="lg"
                  display="flex"
                  flexDir="column"
                  justifyContent="center"
                  alignItems="center"
                  fontFamily="'SF Pro Display Bold'"
                  fontWeight="700"
                  fontSize="2xl"
                >
                  <Text fontSize={["1xl", "2xl","3xl", "4xl"]} mb="4">{it.name}</Text>
                  <Text fontSize="xl" opacity={0.75} textAlign="center">
                    {it.description}
                  </Text>
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


