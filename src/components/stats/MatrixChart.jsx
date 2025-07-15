import React from "react";
import { Box, SimpleGrid, Text, Tooltip, useBreakpointValue } from "@chakra-ui/react";

// Datos de ejemplo: matriz cuadrada (satisfacción de 0 a 1)
const satisfactionData = [
  [1, 0.8, 0.3, 0.5],
  [0.8, 1, 0.4, 0.6],
  [0.3, 0.4, 1, 0.7],
  [0.5, 0.6, 0.7, 1],
];

// Nombres de variables/factores
const factors = ["Calidad", "Precio", "Atención", "Ambiente"];

function colorScale(value) {
  const alpha = 0.2 + 0.8 * value;
  return `rgba(29, 78, 216, ${alpha})`;
}

export default function SatisfactionMatrix() {
  // Tamaños adaptativos para texto y celdas según breakpoint
  const cellHeight = useBreakpointValue({ base: "100%", md: "40px" });
  const fontSize = useBreakpointValue({ base: "xs", md: "sm" });
  const maxWidth = useBreakpointValue({ base: "100%", md: "600px" });

  return (
    <Box
      maxW={maxWidth}
      mx="auto"
      p={{ base: 2, md: 4 }}
      bg="white"
      borderRadius="md"
      boxShadow="md"
      overflowX="auto" // Permite scroll horizontal en móviles
    >
      <Text fontSize={{ base: "lg", md: "xl" }} mb={4} fontWeight="bold" textAlign="center">
        Satisfacción de nuestros clientes
      </Text>

      <SimpleGrid
        columns={factors.length + 1}
        spacing={1}
        textAlign="center"
        minChildWidth={{ base: "60px", md: "auto" }}
        // Alternativa para grid adaptativo: 
        // gridTemplateColumns={{ base: `repeat(${factors.length + 1}, minmax(60px, 1fr))`, md: "auto" }}
      >
        <Box></Box>
        {factors.map((f) => (
          <Box key={f} fontWeight="semibold" fontSize={fontSize} whiteSpace="nowrap">
            {f}
          </Box>
        ))}

        {satisfactionData.map((row, i) => (
          <React.Fragment key={i}>
            <Box fontWeight="semibold" fontSize={fontSize} alignSelf="center" whiteSpace="nowrap">
              {factors[i]}
            </Box>

            {row.map((value, j) => (
              <Tooltip key={j} label={`Satisfacción: ${(value * 100).toFixed(0)}%`} openDelay={300}>
                <Box
                  bg={colorScale(value)}
                  height={cellHeight}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color={value > 0.5 ? "white" : "black"}
                  fontSize={fontSize}
                  fontWeight="bold"
                  border="1px solid #ccc"
                  userSelect="none"
                  whiteSpace="nowrap"
                  minW="40px"
                  px={1}
                >
                  {(value * 100).toFixed(0)}%
                </Box>
              </Tooltip>
            ))}
          </React.Fragment>
        ))}
      </SimpleGrid>
    </Box>
  );
}
