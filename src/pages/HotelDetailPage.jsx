// src/pages/HotelDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Spinner,
  Text,
  Center,
  Image,
  Stack,
  Heading,
  Badge,
  Flex,
  useColorModeValue,
  Divider,
  Button,
  Grid,
  GridItem,
  Card,
  CardBody,
  CardFooter,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { getHotelById } from '../services/api';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { FaMapMarkerAlt, FaStar, FaPhone, FaEnvelope, FaBed, FaUsers, FaCalendarAlt } from 'react-icons/fa';

const HotelDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getHotelById(id);
        if (response.success && response.hotel) {
          setHotel(response.hotel);
        } else {
          setError(response.msg || 'Hotel no encontrado.');
        }
      } catch (err) {
        setError('Error al cargar los detalles del hotel. Intente de nuevo más tarde.');
        console.error("Error fetching hotel details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchHotelDetails();
    }
  }, [id]);

  const handleReservation = (roomId, roomNumber) => {
    // Redirigir a la página de reservas con información de la habitación
    navigate('/reservas', {
      state: {
        roomId,
        roomNumber,
        hotelName: hotel.name,
        hotelId: hotel._id
      }
    });
  };

  if (isLoading) {
    return (
      <Center minH="calc(100vh - 64px)">
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center minH="calc(100vh - 64px)">
        <Alert status="error" maxW="md">
          <AlertIcon />
          {error}
        </Alert>
      </Center>
    );
  }

  if (!hotel) {
    return (
      <Center minH="calc(100vh - 64px)">
        <Text fontSize="xl">No se encontró información para este hotel.</Text>
      </Center>
    );
  }

  // Colores para el modo claro/oscuro
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const accentColor = useColorModeValue('brand.600', 'brand.400');
  const roomCardBg = useColorModeValue('gray.50', 'gray.600');

  const hotelImage = hotel.rooms && hotel.rooms.length > 0 && hotel.rooms[0].images && hotel.rooms[0].images.length > 0
    ? hotel.rooms[0].images[0]
    : 'https://via.placeholder.com/1200x600?text=Hotel+Image';

  const rating = hotel.category ? hotel.category.split(' ')[0] : 'N/A';
  const amenities = hotel.amenities || [];

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.800')}>
      <Navbar />
      <Flex height="calc(100vh - 64px)">
        <Sidebar />
        <Box p={6} flex="1" overflowY="auto">
          <Box
            bg={cardBg}
            borderRadius="lg"
            boxShadow="xl"
            overflow="hidden"
            p={6}
            maxW="7xl"
            mx="auto"
          >
            {/* Imagen principal del hotel */}
            <Image
              src={hotelImage}
              alt={hotel.name}
              objectFit="cover"
              height="400px"
              width="100%"
              borderRadius="md"
              mb={6}
            />

            {/* Información básica del hotel */}
            <Flex justify="space-between" align="flex-start" mb={4} flexDirection={['column', 'column', 'row']}>
              <Box mb={[4, 4, 0]}>
                <Heading as="h1" size="xl" color={textColor} mb={2}>
                  {hotel.name}
                </Heading>
                <Flex align="center" color="gray.500" mb={2}>
                  <FaMapMarkerAlt style={{ marginRight: '8px' }} />
                  <Text fontSize="md">{hotel.address || 'Ubicación no disponible'}</Text>
                </Flex>
                <Flex align="center" color="gray.500">
                  <FaStar style={{ marginRight: '8px', color: '#FFD700' }} />
                  <Text fontSize="md">{rating} Estrellas</Text>
                </Flex>
              </Box>
              <Box textAlign={['left', 'left', 'right']}>
                <Badge colorScheme="green" fontSize="lg" px={4} py={2} borderRadius="full">
                  {hotel.rooms?.length || 0} Habitaciones Disponibles
                </Badge>
              </Box>
            </Flex>

            <Text fontSize="md" color={useColorModeValue('gray.600', 'gray.300')} mb={6}>
              {hotel.description || 'Descripción detallada no disponible. Este hotel ofrece una estancia de lujo con todas las comodidades modernas, servicio excepcional y una ubicación inmejorable.'}
            </Text>

            <Divider mb={6} />

            {/* Información de contacto */}
            <Heading as="h2" size="lg" color={textColor} mb={4}>Contacto</Heading>
            <Stack spacing={3} mb={6}>
              <Flex align="center">
                <FaPhone style={{ marginRight: '8px', color: accentColor }} />
                <Text>{hotel.phone || 'Teléfono no disponible'}</Text>
              </Flex>
              <Flex align="center">
                <FaEnvelope style={{ marginRight: '8px', color: accentColor }} />
                <Text>{hotel.email || 'Correo no disponible'}</Text>
              </Flex>
            </Stack>

            {/* Servicios/Amenities */}
            {amenities.length > 0 && (
              <Box mb={6}>
                <Heading as="h3" size="md" color={textColor} mb={3}>Servicios</Heading>
                <Flex wrap="wrap">
                  {amenities.map((amenity, index) => (
                    <Badge key={index} colorScheme="teal" mr={2} mb={2} px={3} py={1}>
                      {amenity}
                    </Badge>
                  ))}
                </Flex>
              </Box>
            )}

            <Divider mb={6} />

            {/* Habitaciones Disponibles */}
            <Heading as="h2" size="lg" color={textColor} mb={6}>
              <Flex align="center">
                <FaBed style={{ marginRight: '12px', color: accentColor }} />
                Habitaciones Disponibles
              </Flex>
            </Heading>

            {hotel.rooms && hotel.rooms.length > 0 ? (
              <Grid templateColumns={['1fr', '1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']} gap={6}>
                {hotel.rooms.map((room) => (
                  <GridItem key={room._id}>
                    <Card bg={roomCardBg} borderRadius="lg" overflow="hidden" height="100%">
                      <CardBody>
                        <Stack spacing={3}>
                          {/* Imagen de la habitación si existe */}
                          {room.images && room.images.length > 0 && (
                            <Image
                              src={room.images[0]}
                              alt={`Habitación ${room.numberRoom}`}
                              height="200px"
                              objectFit="cover"
                              borderRadius="md"
                            />
                          )}

                          <Flex justify="space-between" align="center">
                            <Heading size="md" color={accentColor}>
                              Habitación {room.numberRoom}
                            </Heading>
                            <Badge colorScheme="blue" fontSize="sm" px={2} py={1}>
                              {room.category || 'Estándar'}
                            </Badge>
                          </Flex>

                          <Flex align="center" color="gray.600">
                            <FaUsers style={{ marginRight: '8px' }} />
                            <Text fontSize="sm">Capacidad: {room.capacity} personas</Text>
                          </Flex>

                          {room.amenities && room.amenities.length > 0 && (
                            <Box>
                              <Text fontSize="sm" fontWeight="bold" mb={1}>Servicios:</Text>
                              <Flex wrap="wrap">
                                {room.amenities.slice(0, 3).map((amenity, index) => (
                                  <Badge key={index} size="sm" colorScheme="gray" mr={1} mb={1}>
                                    {amenity}
                                  </Badge>
                                ))}
                                {room.amenities.length > 3 && (
                                  <Badge size="sm" colorScheme="gray" mr={1} mb={1}>
                                    +{room.amenities.length - 3} más
                                  </Badge>
                                )}
                              </Flex>
                            </Box>
                          )}

                          <Text fontSize="2xl" fontWeight="bold" color={accentColor}>
                            ${room.price?.$numberDecimal || room.price || '0'}
                            <Text as="span" fontSize="sm" color="gray.500" fontWeight="normal">
                              /noche
                            </Text>
                          </Text>
                        </Stack>
                      </CardBody>

                      <CardFooter pt={0}>
                        <Button
                          colorScheme="blue"
                          size="lg"
                          width="100%"
                          leftIcon={<FaCalendarAlt />}
                          onClick={() => handleReservation(room._id, room.numberRoom)}
                          _hover={{
                            transform: "translateY(-2px)",
                            shadow: "lg"
                          }}
                          transition="all 0.2s"
                        >
                          Reservar Ahora
                        </Button>
                      </CardFooter>
                    </Card>
                  </GridItem>
                ))}
              </Grid>
            ) : (
              <Box
                bg={roomCardBg}
                p={8}
                borderRadius="lg"
                textAlign="center"
                border="2px"
                borderStyle="dashed"
                borderColor="gray.300"
              >
                <Text fontSize="3xl" mb={4}>🏨</Text>
                <Text fontSize="lg" color="gray.600" mb={2}>
                  No hay habitaciones disponibles
                </Text>
                <Text color="gray.500" fontSize="sm">
                  Contacta al hotel para más información sobre disponibilidad
                </Text>
              </Box>
            )}
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default HotelDetailPage;