// src/pages/HotelsPage.jsx
import React, { useEffect } from 'react';
import { Box, Heading, Center, Text, useColorModeValue, Flex } from '@chakra-ui/react';
import { HotelGrid } from '../components/hotels/HotelGrid'; // Importa HotelGrid
import { useHotels } from '../shared/hooks/useHotels'; // Tu hook para obtener hoteles
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';

const HotelsPage = () => {
  // Aquí usas el hook para obtener la lista de hoteles
  // Asegúrate de que useHotels devuelva { hotels, isLoading, error } como un array de hoteles
  const { hotels, isFetching, error } = useHotels();

  // Puedes añadir un useEffect si necesitas hacer algo cuando los hoteles se carguen,
  // pero para solo mostrarlos, no es estrictamente necesario aquí.

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.800')} overflow='hidden' >
      <Navbar />
      <Flex height="calc(100vh - 64px)">
        <Sidebar />
        <Box p={6} flex="1" overflowY="auto">
          <Heading as="h1" size="xl" mb={6} color={useColorModeValue('gray.800', 'white')}>
            Nuestros Hoteles
          </Heading>
          {/* Aquí pasamos los hoteles, el estado de carga y el error al HotelGrid */}
          <HotelGrid hotels={hotels} isLoading={isFetching} error={error} />
        </Box>
      </Flex>
    </Box>
  );
};

export default HotelsPage; // Exporta por defecto, crucial para lazy loading