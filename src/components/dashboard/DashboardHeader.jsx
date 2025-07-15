import { Box, Heading, Text, Button, Flex } from '@chakra-ui/react';
import { FaCalendarCheck } from 'react-icons/fa';

const DashboardHeader = () => {
  return (
    <Flex justify="space-between" align="center" mb={6} wrap="wrap" gap={4}>
      <Box>
        <Heading size="lg" mb={1} color="brand.400">Panel Principal</Heading>
        <Text color="gray.500">
          Bienvenido de nuevo, Admin. Aquí está el resumen de hoy.
        </Text>
      </Box>
      <Button colorScheme="brand" size="md" leftIcon={<FaCalendarCheck />} boxShadow="sm">
        Nueva Reserva
      </Button>
    </Flex>
  );
};

export default DashboardHeader;