import React from 'react';
import {
    Box,
    Stack,
    Text,
    useColorModeValue
} from '@chakra-ui/react';
import ReservationCard from './ReservationCard';

const ReservationGrid = ({ 
    reservations, 
    onEdit, 
    onDelete, 
    user, 
    roomNumber, 
    formatDateTime 
}) => {
    const cardBg = useColorModeValue('white', 'gray.800');

    if (!reservations || reservations.length === 0) {
        return (
            <Box
                bg={cardBg}
                p={12}
                borderRadius="xl"
                textAlign="center"
                border="2px"
                borderStyle="dashed"
                borderColor="blue.200"
            >
                <Text fontSize="4xl" mb={4}>📅</Text>
                <Text fontSize="lg" color="gray.600" mb={2}>
                    No tienes reservaciones aún
                </Text>
                <Text color="gray.500">
                    Crea tu primera reservación usando el formulario de arriba
                </Text>
            </Box>
        );
    }

    return (
        <Stack spacing={4}>
            {reservations.map((reservation) => (
                <ReservationCard
                    key={reservation._id}
                    reservation={reservation}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    user={user}
                    roomNumber={roomNumber}
                    formatDateTime={formatDateTime}
                />
            ))}
        </Stack>
    );
};

export default ReservationGrid;