import { Box, Text, Center, Carousel, useCarousel } from "@chakra-ui/react"
import { useEffect, useState } from "react";
/*
const items = [
  { title: "Carbonara", desc: "Creamy sauce, pancetta, egg." },
  { title: "Bolognese", desc: "Slow cooked meat & tomato." },
  { title: "Pesto", desc: "Fresh basil, garlic, pine nuts." },
  { title: "Alfredo", desc: "Butter, parmesan, rich flavor." },
  { title: "Arrabiata", desc: "Garlic & chili heat." },
]
  */
async function getMealstest(f, t) {
  const res = await fetch("/api/getmeals/1-6");
  return await res.json();
}

export default function MenuView() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getMealstest().then(setData);
  }, []);

  const carousel = useCarousel({
    slideCount: data ? data.ret_count : 0
  });

  if (!data) return null;
  console.log(data);
  return (
    <Box>

      {/* LEFT GLASS PANEL */}
      <Box
        position="absolute"
        top="3%"
        left="2%"
        w="25%"
        h="94%"
        bg="rgba(22,22,22,0.45)"
        backdropFilter="blur(12px)"
        borderRadius="16px"
        p="32px"
        color="white"
      >
        <Center>
          <Text
            position="absolute"
            top="2%"
            fontFamily="'SF Pro Display Bold'"
            fontSize="6xl"
            fontWeight="900"
          >
            Menu.desc
          </Text>
        </Center>

        <Center>
          <Text
            position="absolute"
            top="12%"
            fontFamily="'SF Pro Display Bold'"
            fontSize="3xl"
            fontWeight="900"
          >
            Pasta's
          </Text>
        </Center>
        <Box 
          position="absolute" 
          top="37.5%" 
          left="5%" 
          w="90%" // ← set size 
          h="60%" // ← set size 
          bg="rgba(22, 22, 22, 0.45)" // dark translucent overlay 
          backdropFilter="blur(12px)" // ← this is the REAL background blur
          borderRadius="11px" //
          p="32px" 
          color="white"/>
      </Box>

      {/* RIGHT GLASS BOX WITH CAROUSEL */}
      <Box
        position="absolute"
        top="3%"
        left="30%"          // ← shifts it next to panel
        w="65%"             // ← bigger box for carousel
        h="94%"
        bg="rgba(22,22,22,0.45)"
        backdropFilter="blur(12px)"
        borderRadius="16px"
        p="32px"
        color="white"
      >
        <Carousel.RootProvider value={carousel} w="100%" h="100%">
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
                  <Text fontSize="5xl" mb="4">{it.name}</Text>
                  <Text fontSize="xl" opacity={0.75} textAlign="center">
                    {it.description}
                  </Text>
                </Box>
              </Carousel.Item>
            ))}
          </Carousel.ItemGroup>

          {/* Only page indicators */}
          <Carousel.Control justifyContent="center" mt="6">
            <Carousel.Indicators />
          </Carousel.Control>
        </Carousel.RootProvider>
      </Box>

    </Box>
  )
}
