import React, { useState } from 'react';
import {
    Box,
    Button,
    Stack,
    Text,
    Flex,
    Badge,
    useColorModeValue,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ReservationCard = ({ 
    reservation, 
    onEdit, 
    onDelete, 
    user, 
    roomNumber, 
    formatDateTime 
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [editDates, setEditDates] = useState({
        initDate: null,
        endDate: null,
    });

    const cardBg = useColorModeValue('white', 'gray.800');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const handleEditClick = () => {
        setEditDates({
            initDate: new Date(reservation.initDate),
            endDate: new Date(reservation.endDate),
        });
        onOpen();
    };

    const handleSaveEdit = async () => {
        try {
            await onEdit(reservation._id, {
                ...reservation,
                initDate: editDates.initDate.toISOString(),
                endDate: editDates.endDate.toISOString(),
            });
            onClose();
        } catch (err) {
            console.error('Error al editar:', err);
        }
    };

    const handleDeleteClick = () => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta reservación?')) {
            onDelete(reservation._id);
        }
    };

    return (
        <>
            <Box
                bg={cardBg}
                p={6}
                borderRadius="xl"
                shadow="md"
                border="1px"
                borderColor="blue.100"
                _hover={{
                    shadow: "lg",
                    transform: "translateY(-2px)",
                    borderColor: "blue.200"
                }}
                transition="all 0.2s"
            >
                <Flex justify="space-between" align="start" flexDirection={['column', 'row']}>
                    <Stack spacing={3} flex={1}>
                        <Flex align="center">
                            <Badge colorScheme="blue" variant="solid" px={3} py={1} borderRadius="full">
                                Habitación {reservation.room?.numberRoom || roomNumber}
                            </Badge>
                        </Flex>

                        <Stack spacing={2}>
                            <Flex align="center">
                                <Text fontWeight="medium" color="gray.600" minW="60px">
                                    Usuario:
                                </Text>
                                <Text color="blue.700" fontWeight="medium">
                                    {reservation.user?.email || user?.email || reservation.user}
                                </Text>
                            </Flex>

                            <Flex align="center">
                                <Text fontWeight="medium" color="gray.600" minW="60px">
                                    Desde:
                                </Text>
                                <Text color="green.600" fontWeight="medium">
                                    {formatDateTime(reservation.initDate)}
                                </Text>
                            </Flex>

                            <Flex align="center">
                                <Text fontWeight="medium" color="gray.600" minW="60px">
                                    Hasta:
                                </Text>
                                <Text color="orange.600" fontWeight="medium">
                                    {formatDateTime(reservation.endDate)}
                                </Text>
                            </Flex>
                        </Stack>
                    </Stack>

                    <Stack direction={['row', 'column']} spacing={2} mt={[4, 0]}>
                        <Button
                            colorScheme="blue"
                            variant="outline"
                            size="sm"
                            leftIcon={<EditIcon />}
                            onClick={handleEditClick}
                            _hover={{ bg: "blue.50" }}
                        >
                            Editar
                        </Button>
                        <Button
                            colorScheme="red"
                            variant="outline"
                            size="sm"
                            leftIcon={<DeleteIcon />}
                            onClick={handleDeleteClick}
                            _hover={{ bg: "red.50" }}
                        >
                            Eliminar
                        </Button>
                    </Stack>
                </Flex>
            </Box>

            {/* Modal de edición */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Editar Fechas de Reservación</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack spacing={4}>
                            <Box>
                                <Text fontWeight="medium" mb={2}>Fecha de Inicio</Text>
                                <DatePicker
                                    selected={editDates.initDate}
                                    onChange={(date) =>
                                        setEditDates({ ...editDates, initDate: date, endDate: null })
                                    }
                                    dateFormat="dd/MM/yyyy"
                                    minDate={today}
                                    className="chakra-input css-1c6z3sa"
                                    style={{ width: '100%' }}
                                />
                            </Box>
                            <Box>
                                <Text fontWeight="medium" mb={2}>Fecha de Fin</Text>
                                <DatePicker
                                    selected={editDates.endDate}
                                    onChange={(date) => setEditDates({ ...editDates, endDate: date })}
                                    dateFormat="dd/MM/yyyy"
                                    minDate={
                                        editDates.initDate
                                            ? new Date(editDates.initDate.getTime() + 86400000)
                                            : today
                                    }
                                    className="chakra-input css-1c6z3sa"
                                    style={{ width: '100%' }}
                                    disabled={!editDates.initDate}
                                />
                            </Box>
                        </Stack>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button
                            colorScheme="blue"
                            onClick={handleSaveEdit}
                            isDisabled={!editDates.initDate || !editDates.endDate}
                        >
                            Guardar Cambios
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ReservationCard;