import { Card, CardHeader, CardBody, Heading, List, ListItem, ListIcon, Flex, Box, Text, Badge, Skeleton, useColorModeValue } from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';

const UpcomingEventsCard = ({ events, isLoading }) => {
  const formatDateTime = (isoDate) => {
    try {
      const date = new Date(isoDate);
      if (!isoDate || isNaN(date.getTime())) return "Fecha inválida";

      const formattedDate = date.toLocaleDateString('es-ES');
      const formattedTime = date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      });

      return `${formattedDate} ${formattedTime}`;
    } catch (error) {
      return "Fecha inválida";
    }
  };

  return (
    <Card bg={useColorModeValue('white', 'gray.700')} boxShadow="sm" borderRadius="lg" overflow="hidden" h="full">
      <CardHeader pb={0}>
        <Heading size="md" fontWeight="semibold" color="brand.400">
          Próximos Eventos
        </Heading>
      </CardHeader>
      <CardBody>
        <Skeleton isLoaded={!isLoading} fadeDuration={1}>
          <List spacing={3}>
            {events.map((event) => (
              <ListItem key={event._id} p={3} bg="gray.50" borderRadius="md">
                <Flex justify="space-between" align="flex-start">
                  <Box>
                    <Flex align="center">
                      <ListIcon as={FaCheckCircle} color="green.500" />
                      <Text fontWeight="medium" color={useColorModeValue('gray.800', 'gray.600')} >{event.description}</Text>
                    </Flex>
                    <Text fontSize="sm" color="gray.500" ml={6}>
                      {event.hotel.HotelName}
                    </Text>
                  </Box>
                  <Box textAlign="right">
                    <Badge colorScheme="blue" mb={1}>{formatDateTime(event.date)}</Badge>
                    <Text fontSize="xs" color="gray.500">
                      Registrado {formatDateTime(event.createdAt)}
                    </Text>
                  </Box>
                </Flex>
              </ListItem>
            ))}
          </List>
        </Skeleton>
      </CardBody>
    </Card>
  );
};

export default UpcomingEventsCard;