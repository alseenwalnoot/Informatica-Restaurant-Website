import { Text, Box, RadioGroup } from "@chakra-ui/react"
import { useRef, useEffect, useState } from "react"
const errmsg = {
  meals:
    [{ id: -1, category: "NONE", name: "API Returned 404, maybe it is not running?", description: "Error", price: 404, image: "" }], ret_count: 1
}
async function getOrder(orderId) {
  try {
    const res = await fetch(`http://localhost:8000/api/order/${orderId}`);
    if (!res.ok) return errmsg;
    const json = await res.json();
    return json ?? errmsg;
  } catch {
    return errmsg;
  }
}

export default function PaymentView({orderId}) {
    const [order, setOrder] = useState(errmsg);
    useEffect(() => {
        getOrder(orderId).then(setOrder);
      }, []);
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
            <Text>Name: {order.name}</Text>
            <Text>Email: {order.email}</Text>
            <Text>Address: {order.city}, {order.street}, {order.postcode}</Text>
            <RadioGroup.Root>
                <RadioGroup.Item>
                    <RadioGroup.ItemHiddenInput />
                    <RadioGroup.ItemIndicator />
                    <RadioGroup.ItemText>Yes?</RadioGroup.ItemText>
                </RadioGroup.Item>
            </RadioGroup.Root>
        </Box>
    )
}