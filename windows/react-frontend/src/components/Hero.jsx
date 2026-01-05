function Hero() {
  return (
    <Box textAlign="center" p={10} bg="black" color="gold">
      <Heading fontSize="4xl">Michelin to Your Door</Heading>
      <Text fontSize="xl" mt={4}>
        Experience gourmet dining without leaving home
      </Text>
      <Button mt={6} size="lg" bg="gold" color="black" _hover={{ bg: "yellow.400" }}>
        Order Now
      </Button>
    </Box>
  );
}