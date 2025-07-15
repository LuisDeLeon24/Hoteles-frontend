import { Card, CardHeader, CardBody, Flex, Heading, Button, Stack, Divider, Text, Badge, Box, Skeleton, useColorModeValue } from '@chakra-ui/react';

const RecentBookingsCard = ({ hotels, isLoading }) => {
  return (
    <Card bg={useColorModeValue('white', 'gray.700')} boxShadow="sm" borderRadius="lg" overflow="hidden">
      <CardHeader pb={0}>
        <Flex justify="space-between" align="center">
          <Heading size="md" fontWeight="semibold" color="brand.400">
            Hoteles
          </Heading>
          <Button variant="ghost" colorScheme="brand" size="sm">
            Ver todos
          </Button>
        </Flex>
      </CardHeader>
      <CardBody>
        <Skeleton isLoaded={!isLoading} fadeDuration={1}>
          <Stack spacing={4} divider={<Divider />}>
            {hotels.map((hotel, index) => (
              <Flex key={hotel._id} align="center" justify="space-between">
                <Box>
                  <Text fontWeight="medium">{hotel.name}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {hotel.category} • {hotel.address} • {hotel.phone}
                  </Text>
                </Box>
                <Stack direction="row" align="center" spacing={3}>
                  <Badge colorScheme="green" borderRadius="full" px={2}>
                    #:
                  </Badge>

                  <Text fontWeight="medium" color="gray.500" fontSize="sm">
                    {index + 1}
                  </Text>
                </Stack>
              </Flex>
            ))}
          </Stack>
        </Skeleton>
      </CardBody>
    </Card>
  );
};

export default RecentBookingsCard;