// src/components/hotels/HotelCard.jsx
import {
  Box,
  Image,
  Text,
  Stack,
  Badge,
  Button,
  Flex,
  useColorModeValue,
  Icon,
  HStack,
  VStack,
  Container,
  Divider,
} from '@chakra-ui/react';
import { FaStar, FaMapMarkerAlt, FaWifi, FaParking, FaSwimmingPool } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export const HotelCard = ({ hotel }) => {
  const navigate = useNavigate();
  
  // Colores más sofisticados
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const subtitleColor = useColorModeValue('gray.600', 'gray.300');
  const priceColor = useColorModeValue('blue.600', 'blue.300');
  const ratingBg = useColorModeValue(
    'linear(to-r, purple.500, pink.500)', 
    'linear(to-r, purple.400, pink.400)'
  );
  const starColor = useColorModeValue('yellow.400', 'yellow.300');
  const shadowColor = useColorModeValue(
    'rgba(0, 0, 0, 0.1)', 
    'rgba(255, 255, 255, 0.1)'
  );

  const handleViewDetails = () => {
    navigate(`/hotels/${hotel._id}`);
  };

  const getStarRating = (categoryString) => {
    const match = categoryString.match(/\d+/);
    return match ? Number(match[0]) : 0;
  };

  const renderStars = (rating) => {
    const filledStars = Math.floor(rating);
    const hasHalfStar = rating - filledStars >= 0.5;
    const totalStars = 5;

    return (
      <HStack spacing={1}>
        {[...Array(totalStars)].map((_, i) => (
          <Icon
            as={FaStar}
            key={i}
            color={i < filledStars ? starColor : 'gray.300'}
            boxSize={3}
            opacity={i < filledStars || (hasHalfStar && i === filledStars) ? 1 : 0.3}
            filter={i < filledStars ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' : 'none'}
          />
        ))}
      </HStack>
    );
  };

  // Iconos para amenidades populares
  const getAmenityIcon = (amenity) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi') || amenityLower.includes('internet')) return FaWifi;
    if (amenityLower.includes('parking') || amenityLower.includes('estacionamiento')) return FaParking;
    if (amenityLower.includes('pool') || amenityLower.includes('piscina')) return FaSwimmingPool;
    return null;
  };

  const hotelImage =
    hotel.rooms?.[0]?.images?.[0] ||
    'https://via.placeholder.com/400x250?text=Hotel+Image';

  const pricePerNight =
    hotel.rooms?.[0]?.price?.$numberDecimal || '120';

  const ratingDisplay = hotel.category
    ? hotel.category.split(' ')[0]
    : '4.5';

  return (
    <MotionBox
      whileHover={{ 
        y: -8,
        boxShadow: `0 20px 40px ${shadowColor}`,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      overflow="hidden"
      borderRadius="2xl"
      bg={cardBg}
      boxShadow={`0 4px 20px ${shadowColor}`}
      mb={6}
      position="relative"
      border="1px solid"
      borderColor={useColorModeValue('gray.100', 'gray.700')}
      _hover={{
        borderColor: useColorModeValue('purple.200', 'purple.600'),
      }}
    >
      {/* Imagen del hotel con overlay gradient */}
      <Box height="250px" overflow="hidden" position="relative">
        <Image
          src={hotelImage}
          alt={String(hotel.name)}
          objectFit="cover"
          width="100%"
          height="100%"
          transition="transform 0.6s ease"
          _hover={{ transform: 'scale(1.08)' }}
        />
        
        {/* Gradient overlay para mejor legibilidad */}
        <Box
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          height="40%"
          bgGradient="linear(to-t, blackAlpha.600, transparent)"
        />
        
        {/* Badge de rating mejorado */}
        <Flex
          position="absolute"
          top="12px"
          right="12px"
          bgGradient={ratingBg}
          color="white"
          px={3}
          py={2}
          borderRadius="full"
          align="center"
          fontWeight="bold"
          fontSize="sm"
          boxShadow="0 4px 12px rgba(0,0,0,0.15)"
          backdropFilter="blur(10px)"
        >
          <Icon as={FaStar} mr={1} boxSize={3} />
          {String(ratingDisplay)}
        </Flex>

        {/* Badge de precio en la imagen */}
        <Box
          position="absolute"
          bottom="12px"
          left="12px"
          bg="whiteAlpha.900"
          color="gray.800"
          px={3}
          py={1}
          borderRadius="full"
          fontWeight="bold"
          fontSize="sm"
          backdropFilter="blur(10px)"
          boxShadow="0 4px 12px rgba(0,0,0,0.1)"
        >
          ${String(pricePerNight)}/noche
        </Box>
      </Box>

      {/* Contenido de la card */}
      <VStack p={6} spacing={4} align="stretch">
        {/* Título y ubicación */}
        <VStack align="stretch" spacing={2}>
          <Text
            fontWeight="800"
            fontSize="xl"
            color={textColor}
            noOfLines={1}
            letterSpacing="-0.5px"
          >
            {String(hotel.name)}
          </Text>

          <HStack color={subtitleColor} spacing={2}>
            <Icon as={FaMapMarkerAlt} boxSize={3} />
            <Text fontSize="sm" fontWeight="500">
              {String(hotel.address || 'Ubicación no disponible')}
            </Text>
          </HStack>
        </VStack>

        {/* Rating con estrellas */}
        {hotel.category && (
          <HStack spacing={3}>
            {renderStars(getStarRating(hotel.category))}
            <Text fontSize="sm" color={subtitleColor} fontWeight="500">
              {hotel.category}
            </Text>
          </HStack>
        )}

        {/* Descripción */}
        <Text
          fontSize="sm"
          color={subtitleColor}
          noOfLines={2}
          lineHeight="1.6"
        >
          {String(
            hotel.description ||
              'Este hotel ofrece una experiencia de lujo con todas las comodidades modernas y un servicio excepcional.'
          )}
        </Text>

        {/* Amenidades con iconos */}
        {hotel.amenities && hotel.amenities.length > 0 && (
          <Box>
            <HStack spacing={2} wrap="wrap">
              {hotel.amenities.slice(0, 3).map((amenity, index) => {
                const IconComponent = getAmenityIcon(amenity);
                return (
                  <Badge
                    key={index}
                    colorScheme="purple"
                    variant="subtle"
                    borderRadius="full"
                    px={3}
                    py={1}
                    fontSize="xs"
                    fontWeight="600"
                    display="flex"
                    alignItems="center"
                  >
                    {IconComponent && <Icon as={IconComponent} mr={1} boxSize={3} />}
                    {String(amenity)}
                  </Badge>
                );
              })}
              
              {hotel.amenities.length > 3 && (
                <Badge 
                  colorScheme="gray" 
                  variant="subtle"
                  borderRadius="full"
                  px={3}
                  py={1}
                  fontSize="xs"
                  fontWeight="600"
                >
                  +{hotel.amenities.length - 3} más
                </Badge>
              )}
            </HStack>
          </Box>
        )}

        <Divider borderColor={useColorModeValue('gray.200', 'gray.600')} />

        {/* Footer con precio y botón */}
        <Flex justify="space-between" align="center">
          <VStack align="start" spacing={0}>
            <Text fontSize="xs" color={subtitleColor} fontWeight="500">
              Desde
            </Text>
            <HStack spacing={1}>
              <Text fontWeight="800" fontSize="2xl" color={priceColor}>
                ${String(pricePerNight)}
              </Text>
              <Text fontSize="sm" color={subtitleColor}>
                /noche
              </Text>
            </HStack>
          </VStack>
          
          <Button
            onClick={handleViewDetails}
            bgGradient="linear(to-r, purple.500, pink.500)"
            color="white"
            size="md"
            borderRadius="full"
            px={6}
            fontWeight="600"
            _hover={{
              bgGradient: "linear(to-r, purple.600, pink.600)",
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(138, 43, 226, 0.3)',
            }}
            _active={{
              transform: 'translateY(0px)',
            }}
            transition="all 0.3s ease"
          >
            Ver detalles
          </Button>
        </Flex>
      </VStack>
    </MotionBox>
  );
};