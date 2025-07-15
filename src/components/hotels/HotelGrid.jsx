import { SimpleGrid, Box, Text, Center, Spinner } from '@chakra-ui/react';
import { HotelCard } from './HotelCard';

export const HotelGrid = ({ hotels, isLoading, error }) => {
  if (error) {
    return (
      <Center py={10}>
        <Text color="red.500" fontSize="lg">
          Error al cargar los hoteles: {error}. Por favor, intente nuevamente.
        </Text>
      </Center>
    );
  }

  if (isLoading) {
    return (
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={5} p={5}>

      </SimpleGrid>
    );
  }

  // Importante: asegúrate de que 'hotels' es un array antes de intentar '.length'
  if (!hotels || hotels.length === 0) {
    return (
      <Center py={10}>
        <Text fontSize="lg">No hay hoteles disponibles en este momento.</Text>
      </Center>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={5} p={5}>
      {hotels.map((hotel) => (
        // *** CAMBIO CLAVE AQUÍ: usar hotel._id para la key ***
        <HotelCard key={hotel._id} hotel={hotel} />
      ))}
    </SimpleGrid>
  );
};