import { VStack, HStack, Text, Input, Button, Box } from "@chakra-ui/react"
import { useEffect, useState, useRef, setForm, setField } from "react";
export default function DeliveryForm({ onSubmit, submitRef }) {
  const [form, setForm] = useState({
    name: '', email: '', city: '', street: '', postcode: ''
  })
  const setField = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))

  submitRef.current = () => onSubmit(form)

  return (
    <VStack spacing="1" align="stretch">
      {[
        ["Your Name",  "name",     ""],
        ["Email",      "email",    "someone@gmail.com"],
        ["City",       "city",     "Rotterdam, NL"],
        ["Street",     "street",   "Lijnbaan, 432"],
        ["Post Code",  "postcode", "3024AB"],
      ].map(([label, key, placeholder]) => (
        <HStack key={label} spacing="2">
          <Text w="90px" fontFamily="'SF Pro Display Bold'" fontSize="sm" fontWeight="900" whiteSpace="nowrap">
            {label}
          </Text>
          <Input
            flex="1" size="xs" variant="flushed"
            placeholder={placeholder}
            value={form[key]}
            onChange={setField(key)}
            py="0" minH="24px" fontSize="sm" colorPalette="gray"
          />
        </HStack>
      ))}
    </VStack>
  )
}