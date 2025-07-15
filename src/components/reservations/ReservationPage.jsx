import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useReservations from '../../shared/hooks/useReservation';
import {
    Box,
    Button,
    Spinner,
    Stack,
    Text,
    Container,
    Flex,
    Badge,
    Icon,
    useColorModeValue,
    Divider,
    Alert,
    AlertIcon,
    Card,
    CardBody,
    CardHeader,
    Heading
} from '@chakra-ui/react';
import { CalendarIcon, TimeIcon, ArrowBackIcon } from '@chakra-ui/icons';
import DatePicker from 'react-datepicker';
import { UserContext } from '../../context/UserContext';
import ReservationGrid from './ReservationGrid';
import 'react-datepicker/dist/react-datepicker.css';

const ReservationPage = () => {
    const { reservations, loading, error, createReservation, editReservation, removeReservation } = useReservations();
    const { user } = useContext(UserContext);
    const location = useLocation();
    const navigate = useNavigate();

    const roomInfo = location.state || {};
    const { roomId, roomNumber, hotelName, hotelId, roomPrice } = roomInfo;

    const [newReservation, setNewReservation] = useState({
        room: roomId || '',
        user: '',
        initDate: null,
        endDate: null
    });

    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [reservationError, setReservationError] = useState(null);

    useEffect(() => {
        if (user?.id || user?._id) {
            setNewReservation((prev) => ({
                ...prev,
                user: user.id || user._id,
            }));
        }
    }, [user]);

    useEffect(() => {
        if (roomId) {
            setNewReservation(prev => ({
                ...prev,
                room: roomId
            }));
        }
    }, [roomId]);

    const handleCreate = async () => {
        setReservationError(null);
        if (!newReservation.initDate || !newReservation.endDate) {
            setReservationError('Por favor, selecciona las fechas de inicio y fin para la reserva.');
            return;
        }
        if (!newReservation.room) {
            setReservationError('No se ha seleccionado una habitación válida. Regresa a la página del hotel.');
            return;
        }

        const formattedReservation = {
            ...newReservation,
            initDate: newReservation.initDate.toISOString(),
            endDate: newReservation.endDate.toISOString(),
            room: roomId
        };

        try {
            await createReservation(formattedReservation);
            setShowSuccessAlert(true);
            setReservationError(null);

            setNewReservation({
                room: roomId || '',
                user: user?.id || user?._id,
                initDate: null,
                endDate: null
            });

            setTimeout(() => {
                setShowSuccessAlert(false);
            }, 3000);
        } catch (err) {
            console.error('Error creating reservation:', err);
            setReservationError(err.msg || 'Hubo un error al crear la reservación. Intenta de nuevo.');
        }
    };

    const handleEdit = async (reservationId, updatedData) => {
        try {
            await editReservation(reservationId, updatedData);
        } catch (err) {
            console.error('Error editing reservation:', err);
        }
    };

    const handleDelete = async (reservationId) => {
        try {
            await removeReservation(reservationId);
        } catch (err) {
            console.error('Error deleting reservation:', err);
        }
    };

    const formatDateTime = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString('es-ES');
    };

    const calculateNights = () => {
        if (newReservation.initDate && newReservation.endDate) {
            const diffTime = Math.abs(newReservation.endDate - newReservation.initDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
        }
        return 0;
    };

    const calculateTotalPrice = () => {
        if (roomPrice && newReservation.initDate && newReservation.endDate) {
            const nights = calculateNights();
            const price = parseFloat(roomPrice.$numberDecimal || roomPrice);
            return (price * nights).toFixed(2);
        }
        return '0.00';
    };

    const goBack = () => {
        navigate(-1);
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const cardBg = useColorModeValue('white', 'gray.800');
    const headerBg = useColorModeValue('blue.600', 'blue.700');

    if (loading) return (
        <Flex justify="center" align="center" minH="100vh" bg={bgColor}>
            <Stack align="center" spacing={4}>
                <Spinner size="xl" color="blue.500" thickness="4px" />
                <Text color="blue.600" fontSize="lg">Cargando reservaciones...</Text>
            </Stack>
        </Flex>
    );

    return (
        <Box minH="100vh" bg={bgColor}>
            <Box bg={headerBg} color="white" py={6} shadow="lg">
                <Container maxW="6xl">
                    <Flex align="center" justify="space-between">
                        <Stack spacing={1}>
                            <Flex align="center">
                                <Button
                                    variant="ghost"
                                    color="white"
                                    leftIcon={<ArrowBackIcon />}
                                    onClick={goBack}
                                    mr={4}
                                    _hover={{ bg: "whiteAlpha.200" }}
                                >
                                    Volver
                                </Button>
                                <Text fontSize="3xl" fontWeight="bold">
                                    🏨 Sistema de Reservaciones
                                </Text>
                            </Flex>
                            <Text fontSize="md" opacity={0.9}>
                                Bienvenido, {user?.email}
                            </Text>
                            {hotelName && (
                                <Text fontSize="sm" opacity={0.8}>
                                    Hotel: {hotelName}
                                </Text>
                            )}
                        </Stack>
                        <Badge colorScheme="blue" variant="solid" px={3} py={1} borderRadius="full">
                            {reservations?.length || 0} Reservaciones
                        </Badge>
                    </Flex>
                </Container>
            </Box>

            <Container maxW="6xl" py={8}>
                {showSuccessAlert && (
                    <Alert status="success" mb={6} borderRadius="md">
                        <AlertIcon />
                        ¡Reservación creada exitosamente!
                    </Alert>
                )}

                {reservationError && (
                    <Alert status="error" mb={6} borderRadius="md">
                        <AlertIcon />
                        {reservationError}
                    </Alert>
                )}

                {roomNumber && hotelName && roomId ? (
                    <Card bg="blue.50" borderColor="blue.200" border="1px" mb={6}>
                        <CardHeader pb={2}>
                            <Heading size="md" color="blue.700">
                                Habitación Seleccionada
                            </Heading>
                        </CardHeader>
                        <CardBody pt={0}>
                            <Stack spacing={2}>
                                <Text><strong>Hotel:</strong> {hotelName}</Text>
                                <Text><strong>Número de Habitación:</strong> {roomNumber}</Text>
                                {roomPrice && (
                                    <Text>
                                        <strong>Precio por Noche:</strong> Q{parseFloat(roomPrice.$numberDecimal || roomPrice).toFixed(2)}
                                    </Text>
                                )}
                                <Badge colorScheme="blue" width="fit-content">
                                    Información pre-cargada
                                </Badge>
                            </Stack>
                        </CardBody>
                    </Card>
                ) : (
                    <Alert status="warning" mb={6} borderRadius="md">
                        <AlertIcon />
                        No se ha seleccionado una habitación. Por favor, regresa a la página del hotel para elegir una.
                    </Alert>
                )}

                {/* Formulario de nueva reservación */}
                <Box bg={cardBg} p={6} borderRadius="xl" shadow="lg" mb={8} border="1px" borderColor="blue.100">
                    <Stack spacing={4}>
                        <Flex align="center" mb={2}>
                            <Icon as={CalendarIcon} color="blue.500" boxSize={5} mr={2} />
                            <Text fontSize="xl" fontWeight="bold" color="blue.700">
                                Nueva Reservación
                            </Text>
                        </Flex>

                        <Divider />

                        <Stack spacing={4}>
                            <Box>
                                <Text mb={2} fontSize="sm" fontWeight="medium" color="gray.600">
                                    Usuario (Usuario actual)
                                </Text>
                                <Text
                                    p={3}
                                    borderRadius="md"
                                    bg="blue.50"
                                    borderColor="blue.200"
                                    border="1px"
                                    color="blue.700"
                                    fontWeight="medium"
                                >
                                    {user?.email || 'Cargando...'}
                                </Text>
                            </Box>

                            <Flex gap={4} flexDirection={['column', 'row']}>
                                <Box flex={1}>
                                    <Text mb={2} fontSize="sm" fontWeight="medium" color="gray.600">
                                        Fecha de Inicio
                                    </Text>
                                    <DatePicker
                                        selected={newReservation.initDate}
                                        onChange={(date) => {
                                            setNewReservation({ ...newReservation, initDate: date, endDate: null });
                                            setReservationError(null);
                                        }}
                                        placeholderText="Seleccionar fecha de inicio"
                                        dateFormat="dd/MM/yyyy"
                                        minDate={today}
                                        className="chakra-input css-1c6z3sa"
                                        style={{ width: '100%' }}
                                    />
                                </Box>

                                <Box flex={1}>
                                    <Text mb={2} fontSize="sm" fontWeight="medium" color="gray.600">
                                        Fecha de Fin
                                    </Text>
                                    <DatePicker
                                        selected={newReservation.endDate}
                                        onChange={(date) => {
                                            setNewReservation({ ...newReservation, endDate: date });
                                            setReservationError(null);
                                        }}
                                        placeholderText="Seleccionar fecha de fin"
                                        dateFormat="dd/MM/yyyy"
                                        minDate={newReservation.initDate ? new Date(newReservation.initDate.getTime() + (24 * 60 * 60 * 1000)) : today}
                                        className="chakra-input css-1c6z3sa"
                                        style={{ width: '100%' }}
                                        disabled={!newReservation.initDate}
                                    />
                                </Box>
                            </Flex>

                            {newReservation.initDate && newReservation.endDate && (
                                <Box bg="green.50" p={4} borderRadius="md" border="1px" borderColor="green.200">
                                    <Text fontSize="sm" fontWeight="bold" color="green.700" mb={2}>
                                        Resumen de la Reservación:
                                    </Text>
                                    <Stack spacing={1} fontSize="sm">
                                        <Text><strong>Noches:</strong> {calculateNights()}</Text>
                                        <Text><strong>Check-in:</strong> {formatDateTime(newReservation.initDate)}</Text>
                                        <Text><strong>Check-out:</strong> {formatDateTime(newReservation.endDate)}</Text>
                                        <Text fontWeight="bold" fontSize="md">
                                            <strong>Precio Total:</strong> Q{calculateTotalPrice()}
                                        </Text>
                                    </Stack>
                                </Box>
                            )}

                            <Button
                                colorScheme="blue"
                                size="lg"
                                onClick={handleCreate}
                                leftIcon={<CalendarIcon />}
                                _hover={{
                                    transform: "translateY(-2px)",
                                    shadow: "lg"
                                }}
                                transition="all 0.2s"
                                isDisabled={!newReservation.initDate || !newReservation.endDate || !newReservation.room || !user}
                            >
                                Confirmar Reservación
                            </Button>
                        </Stack>
                    </Stack>
                </Box>

                {error && (
                    <Alert status="error" mb={6} borderRadius="md">
                        <AlertIcon />
                        Error del sistema: {error}
                    </Alert>
                )}

                {/* Grid de reservaciones */}
                <Box>
                    <Flex align="center" mb={6}>
                        <Icon as={TimeIcon} color="blue.500" boxSize={5} mr={2} />
                        <Text fontSize="xl" fontWeight="bold" color="blue.700">
                            Mis Reservaciones
                        </Text>
                    </Flex>

                    <ReservationGrid
                        reservations={reservations}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        user={user}
                        roomNumber={roomNumber}
                        formatDateTime={formatDateTime}
                    />
                </Box>
            </Container>
        </Box>
    );
};

export default ReservationPage;