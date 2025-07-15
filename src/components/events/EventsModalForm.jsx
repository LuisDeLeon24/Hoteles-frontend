import { useState, useEffect, memo } from "react";
import { useHotels } from "../../shared/hooks/useHotels";
import { useEvents } from "../../shared/hooks";
import { useRooms } from "../../shared/hooks/useRooms";
import {
    TimeIcon,
    EditIcon,
    CloseIcon,
    CheckIcon,
    StarIcon,
    CalendarIcon
} from "@chakra-ui/icons";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Select,
    Textarea,
    Box,
    FormControl,
    FormLabel,
    Icon,
    Divider,
    Button,
    useColorModeValue,
    HStack,
    VStack,
    SimpleGrid,
    Input,
    Text
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

const MotionModalContent = motion(ModalContent);
const MotionFormControl = motion(FormControl);

export const EventsModalForm = memo(({ isOpen, onClose, onEventAdded }) => {
    const { addEvents, getEvents } = useEvents();
    const [minDateTime, setMinDateTime] = useState("");
    const { hotels } = useHotels();
    const { rooms } = useRooms();

    const [form, setForm] = useState({
        hotel: "",
        room: "",
        date: "",
        title: "",
        description: "",
        state: "",
        type: "",
        attend: ""
    });

    const bgColor = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.700", "white");
    const borderColor = useColorModeValue("gray.200", "gray.600");

    const handleCreateEvent = async () => {
        if (!form.state || form.state.trim() === '') {
            form.state = 'Pendiente';
        }
        const createdEvent = await addEvents(form);
        onEventAdded(createdEvent)
        setForm({
            hotel: '',
            room: '',
            date: '',
            title: '',
            description: '',
            state: '',
            type: '',
            attend: ''
        });
        onClose();
        location.reload();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const habitacionesDisponibles = rooms.filter(room => room.hotel.id === form.hotel);

    useEffect(() => {
        const now = new Date();
        now.setSeconds(0, 0); // Quita segundos y milisegundos
        const localISOTime = now.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
        setMinDateTime(localISOTime);
    }, []);

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <Modal isOpen={isOpen} onClose={onClose} size="2xl" closeOnOverlayClick={false}>
                        <ModalOverlay
                            backdropFilter="blur(10px) saturate(120%)"
                            bg="blackAlpha.400"
                        />
                        <MotionModalContent
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 100 }}
                            transition={{ duration: 0.35, ease: "easeInOut" }}
                            bg={bgColor}
                            color={textColor}
                            borderRadius="2xl"
                            border="1px solid"
                            borderColor={borderColor}
                            boxShadow="2xl"
                            overflow="hidden"
                            position="relative"
                        >
                            {/* Header con gradiente decorativo */}
                            <Box
                                position="absolute"
                                top="0"
                                left="0"
                                right="0"
                                height="4px"
                                bgGradient="linear(to-r, blue.400, purple.400, pink.400, orange.400)"
                            />

                            <ModalHeader pb={2}>
                                <HStack spacing={3} align="center">
                                    {/* Icono sin animaciones */}
                                    <Icon
                                        as={StarIcon}
                                        w={6}
                                        h={6}
                                        bgGradient="linear(to-r, blue.400, purple.500)"
                                        bgClip="text"
                                    />
                                    <VStack align="start" spacing={1}>
                                        <Text fontSize="xl" fontWeight="bold" bgGradient="linear(to-r, blue.600, purple.600)" bgClip="text">
                                            Crear Nuevo Evento
                                        </Text>
                                        <Text fontSize="sm" color="gray.500">
                                            Completa la información para tu evento
                                        </Text>
                                    </VStack>
                                </HStack>
                            </ModalHeader>

                            {/* Botón de cierre sin animaciones de framer-motion, pero con hover de Chakra */}
                            <ModalCloseButton />

                            <ModalBody py={6}>
                                <VStack spacing={6} align="stretch">
                                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                                        {/* Cada FormControl sin motion.div */}
                                        <MotionFormControl
                                            isRequired
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            <FormLabel fontWeight="semibold" color={textColor}>
                                                <HStack>
                                                    <EditIcon w={4} h={4} />
                                                    <Text>Título del evento</Text>
                                                </HStack>
                                            </FormLabel>
                                            <Input
                                                placeholder="Nombre del evento"
                                                name="title"
                                                value={form.title}
                                                onChange={handleChange}
                                                borderRadius="lg"
                                                borderColor={borderColor}
                                                _hover={{ borderColor: "blue.400", boxShadow: "0 0 0 1px blue.400" }}
                                                _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.1)" }}
                                                transition="all 0.2s"
                                            />
                                        </MotionFormControl>

                                        <MotionFormControl
                                            isRequired
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            <FormLabel fontWeight="semibold" color={textColor}>
                                                <HStack>
                                                    <CalendarIcon w={4} h={4} />
                                                    <Text>Fecha para el evento</Text>
                                                </HStack>
                                            </FormLabel>
                                            <Input
                                                type="datetime-local"
                                                name="date"
                                                min={minDateTime}
                                                value={form.date}
                                                onChange={handleChange}
                                                borderRadius="lg"
                                                borderColor={borderColor}
                                                _hover={{ borderColor: "purple.400", boxShadow: "0 0 0 1px purple.400" }}
                                                _focus={{ borderColor: "purple.500", boxShadow: "0 0 0 3px rgba(128, 90, 213, 0.1)" }}
                                                transition="all 0.2s"
                                            />
                                        </MotionFormControl>

                                        <MotionFormControl
                                            isRequired
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            <FormLabel fontWeight="semibold" color={textColor}>
                                                <HStack>
                                                    <Icon viewBox="0 0 24 24" w={4} h={4}>
                                                        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                                    </Icon>
                                                    <Text>Hotel</Text>
                                                </HStack>
                                            </FormLabel>
                                            <Select
                                                name="hotel"
                                                value={form.hotel}
                                                onChange={handleChange}
                                                placeholder="Selecciona un hotel"
                                                borderRadius="lg"
                                                borderColor={borderColor}
                                                _hover={{ borderColor: "pink.400", boxShadow: "0 0 0 1px pink.400" }}
                                                _focus={{ borderColor: "pink.500", boxShadow: "0 0 0 3px rgba(237, 100, 166, 0.1)" }}
                                                transition="all 0.2s"
                                            >
                                                {hotels.map((hotel) => (
                                                    <option key={hotel._id} value={hotel._id}>{hotel.name}</option>
                                                ))}
                                            </Select>
                                        </MotionFormControl>

                                        <MotionFormControl
                                            isRequired
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            <FormLabel fontWeight="semibold" color={textColor}>
                                                <HStack>
                                                    <Icon viewBox="0 0 24 24" w={4} h={4}>
                                                        <path fill="currentColor" d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H16c-.8 0-1.54.37-2 1l-3.72 5.58A1.5 1.5 0 0 0 11.5 16H16v6h4zm-12.5 0h3v-3h-3v3zm0-5h3v-3h-3v3zm0-5h3V9h-3v3z" />
                                                    </Icon>
                                                    <Text>Salón</Text>
                                                </HStack>
                                            </FormLabel>
                                            <Select
                                                name="room"
                                                value={form.room}
                                                onChange={handleChange}
                                                isDisabled={!form.hotel}
                                                placeholder="Selecciona un salón"
                                                borderRadius="lg"
                                                borderColor={borderColor}
                                                _hover={{ borderColor: "orange.400", boxShadow: "0 0 0 1px orange.400" }}
                                                _focus={{ borderColor: "orange.500", boxShadow: "0 0 0 3px rgba(251, 211, 141, 0.1)" }}
                                                transition="all 0.2s"
                                                opacity={!form.hotel ? 0.6 : 1}
                                            >
                                                {habitacionesDisponibles.map((room) => (
                                                    <option key={room._id} value={room._id}>{room.numberRoom}</option>
                                                ))}
                                            </Select>
                                        </MotionFormControl>

                                        <MotionFormControl
                                            isRequired
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            <FormLabel fontWeight="semibold" color={textColor}>
                                                <HStack>
                                                    <StarIcon w={4} h={4} />
                                                    <Text>Tipo de evento</Text>
                                                </HStack>
                                            </FormLabel>
                                            <Select
                                                name="type"
                                                value={form.type}
                                                onChange={handleChange}
                                                placeholder="Selecciona un tipo"
                                                borderRadius="lg"
                                                borderColor={borderColor}
                                                _hover={{ borderColor: "teal.400", boxShadow: "0 0 0 1px teal.400" }}
                                                _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 3px rgba(56, 178, 172, 0.1)" }}
                                                transition="all 0.2s"
                                            >
                                                <option value="Gala">🎭 Gala</option>
                                                <option value="Conferencia">🎤 Conferencia</option>
                                                <option value="Cultural">🎨 Cultural</option>
                                            </Select>
                                        </MotionFormControl>

                                        <MotionFormControl
                                            isRequired
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            <FormLabel fontWeight="semibold" color={textColor}>
                                                <HStack>
                                                    <Icon viewBox="0 0 24 24" w={4} h={4}>
                                                        <path fill="currentColor" d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H16c-.8 0-1.54.37-2 1l-3.72 5.58A1.5 1.5 0 0 0 11.5 16H16v6h4zm-12.5 0h3v-3h-3v3zm0-5h3v-3h-3v3zm0-5h3V9h-3v3z" />
                                                    </Icon>
                                                    <Text>Asistentes esperados</Text>
                                                </HStack>
                                            </FormLabel>
                                            <Input
                                                type="number"
                                                name="attend"
                                                value={form.attend}
                                                onChange={handleChange}
                                                placeholder="Número de asistentes"
                                                borderRadius="lg"
                                                borderColor={borderColor}
                                                _hover={{ borderColor: "cyan.400", boxShadow: "0 0 0 1px cyan.400" }}
                                                _focus={{ borderColor: "cyan.500", boxShadow: "0 0 0 3px rgba(103, 232, 249, 0.1)" }}
                                                transition="all 0.2s"
                                            />
                                        </MotionFormControl>
                                    </SimpleGrid>

                                    <Divider my={2} />

                                    <MotionFormControl
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <FormLabel fontWeight="semibold" color={textColor}>
                                            <HStack>
                                                <EditIcon w={4} h={4} />
                                                <Text>Descripción</Text>
                                            </HStack>
                                        </FormLabel>
                                        <Textarea
                                            name="description"
                                            value={form.description}
                                            onChange={handleChange}
                                            placeholder="Describe el evento"
                                            borderRadius="lg"
                                            borderColor={borderColor}
                                            _hover={{ borderColor: "indigo.400", boxShadow: "0 0 0 1px indigo.400" }}
                                            _focus={{ borderColor: "indigo.500", boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)" }}
                                            transition="all 0.2s"
                                            resize="vertical"
                                            minH="100px"
                                        />
                                    </MotionFormControl>
                                </VStack>
                            </ModalBody>

                            <ModalFooter borderTop="1px solid" borderColor={borderColor} pt={6}>
                                <HStack spacing={3} w="full" justify="flex-end">
                                    <Button
                                        variant="ghost"
                                        onClick={onClose}
                                        leftIcon={<CloseIcon w={3} h={3} />}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        bgGradient="linear(to-r, blue.400, purple.500)"
                                        color="white"
                                        onClick={handleCreateEvent}
                                        leftIcon={<CheckIcon w={4} h={4} />}
                                        _hover={{
                                            background: "linear-gradient(to right, #3182ce, #805ad5)"
                                        }}
                                        boxShadow="lg"
                                    >
                                        Crear Evento
                                    </Button>
                                </HStack>
                            </ModalFooter>
                        </MotionModalContent>
                    </Modal>
                )}
            </AnimatePresence>
        </>
    );
});