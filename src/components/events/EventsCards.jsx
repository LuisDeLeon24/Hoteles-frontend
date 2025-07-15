import {
    Box,
    Image,
    Flex,
    Badge,
    Tag,
    TagLabel,
    Heading,
    Text,
    HStack,
    Button,
    Spinner,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    VStack,
    Divider,
    Icon,
    Container,
    Grid,
    GridItem,
    Avatar,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    useColorModeValue,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    DrawerCloseButton,
    Input,
    Textarea,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Select
} from "@chakra-ui/react"
import {
    CalendarIcon,
    TimeIcon,
    InfoIcon,
    CheckCircleIcon,
    WarningIcon
} from "@chakra-ui/icons"
import {
    FiMapPin,
    FiUsers,
    FiCalendar,
    FiClock,
    FiTag,
    FiHome
} from "react-icons/fi"
import { fetchHotelImage } from "../../utils/imageService";
import { useState, useEffect } from "react";

const EventsCards = (events) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [loadingImage, setLoadingImage] = useState(true);
    const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
    const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();

    // Color mode values
    const cardBg = useColorModeValue("white", "gray.700");
    const modalBg = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.600", "gray.300");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const gradientBg = useColorModeValue(
        "linear(to-r, teal.400, blue.500)",
        "linear(to-r, teal.600, blue.700)"
    );

    useEffect(() => {
        const getImage = async () => {
            const url = await fetchHotelImage(events.events._id);
            setImageUrl(url);
            setLoadingImage(false);
        };
        getImage();
    }, [events.events._id]);

    const formatDate = (isoDate) => {
        try {
            const date = new Date(isoDate);
            if (!isoDate || isNaN(date.getTime())) return "Fecha inválida";

            const formattedDate = date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });

            return `${formattedDate}`;
        } catch (error) {
            return "Fecha inválida";
        }
    };

    const formatTime = (isoDate) => {
        try {
            const date = new Date(isoDate);
            if (!isoDate || isNaN(date.getTime())) return 'Fecha invalida';

            const formattedTime = date.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
            })

            return `${formattedTime}`
        } catch (error) {
            return 'Fecha invalida'
        }
    }

    const formatFullDateTime = (isoDate) => {
        try {
            const date = new Date(isoDate);
            if (!isoDate || isNaN(date.getTime())) return "Fecha inválida";

            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };

            return date.toLocaleDateString('es-ES', options);
        } catch (error) {
            return "Fecha inválida";
        }
    };

    const getStatusIcon = (state) => {
        return state === "Confirmado" ? CheckCircleIcon : WarningIcon;
    };

    const getStatusColor = (state) => {
        return state === "Confirmado" ? "green" : "yellow";
    };

    return (
        <>
            <Box
                key={events.events._id}
                bg={cardBg}
                borderRadius="lg"
                overflow="hidden"
                boxShadow="lg"
                transition="all 0.3s ease"
                _hover={{
                    transform: "translateY(-4px)",
                    boxShadow: "xl"
                }}
            >
                {loadingImage ? (
                    <Flex h="160px" align="center" justify="center">
                        <Spinner size="xl" color="teal.500" />
                    </Flex>
                ) : (
                    <Image
                        src={imageUrl}
                        alt={events.events.title}
                        h="160px"
                        w="100%"
                        objectFit="cover"
                    />
                )}

                <Box p={5}>
                    <Flex justify="space-between" align="center" mb={2}>
                        <Badge
                            colorScheme={getStatusColor(events.events.state)}
                            px={2}
                            py={1}
                            borderRadius="md"
                            variant="solid"
                        >
                            {events.events.state === "Confirmado" ? "Confirmado" : "Pendiente"}
                        </Badge>
                        <Tag size="sm" colorScheme="blue" borderRadius="full">
                            <TagLabel>{events.events.type}</TagLabel>
                        </Tag>
                    </Flex>

                    <Heading size="md" mt={2} mb={2}>{events.events.title}</Heading>

                    <Text fontSize="sm" color={textColor} noOfLines={2} mb={3}>
                        {events.events.description}
                    </Text>

                    <Flex justify="space-between" align="center">
                        <HStack>
                            <CalendarIcon color="teal.400" />
                            <Text fontSize="sm">{formatDate(events.events.date)}</Text>
                        </HStack>
                        <HStack>
                            <TimeIcon color="teal.400" />
                            <Text fontSize="sm">{formatTime(events.events.date)}</Text>
                        </HStack>
                        <Text fontSize="sm" fontWeight="bold">
                            {events.events.attend} asistentes
                        </Text>
                    </Flex>

                    <Text mt={2} fontSize="sm" color={textColor}>
                        Salon: {events.events.room.NumberRoom}
                    </Text>

                    <Button
                        mt={4}
                        bgGradient={gradientBg}
                        color="white"
                        size="sm"
                        w="full"
                        onClick={onModalOpen}
                        _hover={{
                            bgGradient: useColorModeValue(
                                "linear(to-r, teal.500, blue.600)",
                                "linear(to-r, teal.700, blue.800)"
                            ),
                            transform: "translateY(-1px)"
                        }}
                        transition="all 0.2s"
                    >
                        Ver detalles
                    </Button>
                </Box>
            </Box>

            {/* Modal Sofisticado */}
            <Modal
                isOpen={isModalOpen}
                onClose={onModalClose}
                size="2xl"
                motionPreset="slideInBottom"
            >
                <ModalOverlay
                    bg="blackAlpha.300"
                    backdropFilter="blur(10px) hue-rotate(20deg)"
                />
                <ModalContent
                    bg={modalBg}
                    borderRadius="xl"
                    overflow="hidden"
                    boxShadow="2xl"
                    border="1px"
                    borderColor={borderColor}
                >
                    {/* Header con imagen de fondo */}
                    <Box position="relative">
                        {imageUrl && (
                            <Image
                                src={imageUrl}
                                alt={events.events.title}
                                h="200px"
                                w="100%"
                                objectFit="cover"
                                filter="brightness(0.7)"
                            />
                        )}
                        <Box
                            position="absolute"
                            top="0"
                            left="0"
                            right="0"
                            bottom="0"
                            bgGradient="linear(to-t, blackAlpha.600, transparent)"
                        />
                        <VStack
                            position="absolute"
                            bottom="4"
                            left="6"
                            align="start"
                            spacing="2"
                        >
                            <HStack>
                                <Badge
                                    colorScheme={getStatusColor(events.events.state)}
                                    px={3}
                                    py={1}
                                    borderRadius="full"
                                    variant="solid"
                                    fontSize="sm"
                                >
                                    <Icon as={getStatusIcon(events.events.state)} mr={1} />
                                    {events.events.state === "Confirmado" ? "Confirmado" : "Pendiente"}
                                </Badge>
                                <Tag colorScheme="blue" size="md" borderRadius="full">
                                    <Icon as={FiTag} mr={1} />
                                    <TagLabel>{events.events.type}</TagLabel>
                                </Tag>
                            </HStack>
                            <Heading color="white" size="lg" textShadow="2px 2px 4px rgba(0,0,0,0.6)">
                                {events.events.title}
                            </Heading>
                        </VStack>
                        <ModalCloseButton
                            color="white"
                            bg="blackAlpha.600"
                            borderRadius="full"
                            _hover={{ bg: "blackAlpha.800" }}
                        />
                    </Box>

                    <ModalBody p={6}>
                        <VStack spacing={6} align="stretch">
                            {/* Descripción */}
                            <Box>
                                <HStack mb={3}>
                                    <Icon as={InfoIcon} color="teal.500" />
                                    <Heading size="md">Descripción</Heading>
                                </HStack>
                                <Text color={textColor} lineHeight="1.6">
                                    {events.events.description}
                                </Text>
                            </Box>

                            <Divider />

                            {/* Grid de información */}
                            <Grid templateColumns="1fr 1fr" gap={6}>
                                <GridItem>
                                    <VStack align="start" spacing={4}>
                                        {/* Fecha y Hora */}
                                        <Stat>
                                            <HStack>
                                                <Icon as={FiCalendar} color="teal.500" />
                                                <StatLabel fontSize="md" fontWeight="semibold" color='teal.500' >
                                                    Fecha y Hora
                                                </StatLabel>
                                            </HStack>
                                            <StatNumber fontSize="lg" color="teal.300">
                                                {formatDate(events.events.date)}
                                            </StatNumber>
                                            <StatHelpText fontSize="md">
                                                <Icon as={FiClock} mr={1} />
                                                {formatTime(events.events.date)}
                                            </StatHelpText>
                                        </Stat>

                                        {/* Ubicación */}
                                        <Stat>
                                            <HStack>
                                                <Icon as={FiMapPin} color="purple.500" />
                                                <StatLabel fontSize="md" fontWeight="semibold" color='purple.500' >
                                                    Ubicación
                                                </StatLabel>
                                            </HStack>
                                            <StatNumber fontSize="lg" color="purple.300">
                                                Salón {events.events.room.NumberRoom}
                                            </StatNumber>
                                        </Stat>
                                    </VStack>
                                </GridItem>

                                <GridItem>
                                    <VStack align="start" spacing={4}>
                                        {/* Asistentes */}
                                        <Stat>
                                            <HStack>
                                                <Icon as={FiUsers} color="blue.500" />
                                                <StatLabel fontSize="md" fontWeight="semibold" color='blue.500' >
                                                    Asistentes
                                                </StatLabel>
                                            </HStack>
                                            <StatNumber fontSize="lg" color="blue.300">
                                                {events.events.attend}
                                            </StatNumber>
                                            <StatHelpText>personas confirmadas</StatHelpText>
                                        </Stat>

                                        {/* ID del Evento */}
                                        <Box>
                                            <Text fontSize="sm" color={textColor} mb={1}>
                                                ID del Evento
                                            </Text>
                                            <Text
                                                fontSize="xs"
                                                fontFamily="mono"
                                                bg={useColorModeValue("gray.100", "gray.700")}
                                                p={2}
                                                borderRadius="md"
                                                color={textColor}
                                            >
                                                {events.events._id}
                                            </Text>
                                        </Box>
                                    </VStack>
                                </GridItem>
                            </Grid>

                            {/* Información adicional en tarjeta destacada */}
                            <Box
                                bg={useColorModeValue("gray.50", "gray.700")}
                                p={4}
                                borderRadius="lg"
                                border="1px"
                                borderColor={borderColor}
                            >
                                <HStack justify="space-between">
                                    <VStack align="start" spacing={1}>
                                        <Text fontSize="sm" color={textColor}>
                                            Fecha completa del evento
                                        </Text>
                                        <Text fontWeight="semibold" color={useColorModeValue('gray.800', 'gray.200')} >
                                            {formatFullDateTime(events.events.date)}
                                        </Text>
                                    </VStack>
                                    <Avatar
                                        bg="teal.500"
                                        icon={<Icon as={FiHome} fontSize="1.5rem" />}
                                    />
                                </HStack>
                            </Box>
                        </VStack>
                    </ModalBody>

                    <ModalFooter bg={useColorModeValue("gray.50", "gray.700")}>
                        <HStack spacing={3}>
                            <Button
                                variant="ghost"
                                onClick={onModalClose}
                                _hover={{ bg: useColorModeValue("gray.100", "gray.600") }}
                            >
                                Cerrar
                            </Button>
                            <Button
                                bgGradient={gradientBg}
                                color="white"
                                _hover={{
                                    bgGradient: useColorModeValue(
                                        "linear(to-r, teal.500, blue.600)",
                                        "linear(to-r, teal.700, blue.800)"
                                    )
                                }}
                                onClick={onDrawerOpen}
                            >
                                Gestionar Evento
                            </Button>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            {/* Sidebar para gestionar evento */}
            <Drawer
                isOpen={isDrawerOpen}
                placement="left"
                onClose={onDrawerClose}
                size="lg"
            >
                <DrawerOverlay
                    bg="blackAlpha.400"
                    backdropFilter="blur(10px)"
                />
                <DrawerContent
                    bg={modalBg}
                    color={useColorModeValue('gray.800', 'white')}
                    boxShadow="dark-lg"
                    borderLeft="4px solid"
                    borderColor="teal.400"
                    maxH='100vh'
                >
                    <DrawerCloseButton
                        bg={useColorModeValue("white", "gray.700")}
                        borderRadius="full"
                        boxShadow="md"
                        _hover={{
                            bg: useColorModeValue("gray.100", "gray.600"),
                            transform: "scale(1.1)"
                        }}
                        transition="all 0.2s"
                        zIndex={10}
                    />

                    {/* Header Premium con Gradiente */}
                    <Box
                        bgGradient={gradientBg}
                        color="white"
                        py={8}
                        px={6}
                        position="relative"
                        overflow="hidden"
                    >
                        {/* Elementos decorativos de fondo */}
                        <Box
                            position="absolute"
                            top="-60px"
                            right="-60px"
                            width="120px"
                            height="120px"
                            borderRadius="full"
                            bg="whiteAlpha.100"
                            opacity={0.7}
                        />
                        <Box
                            position="absolute"
                            bottom="-40px"
                            left="-40px"
                            width="80px"
                            height="80px"
                            borderRadius="full"
                            bg="whiteAlpha.100"
                            opacity={0.5}
                        />

                        <VStack align="start" spacing={3} position="relative" zIndex={2}>
                            <HStack spacing={3}>
                                <Avatar
                                    bg="whiteAlpha.300"
                                    icon={<Icon as={FiTag} fontSize="1.5rem" />}
                                    size="md"
                                />
                                <VStack align="start" spacing={0}>
                                    <Text fontSize="lg" fontWeight="bold" letterSpacing="wide">
                                        Gestionar Evento
                                    </Text>
                                    <Text fontSize="sm" opacity={0.9}>
                                        Editar detalles y configuración
                                    </Text>
                                </VStack>
                            </HStack>

                            <Box
                                bg="whiteAlpha.200"
                                px={4}
                                py={2}
                                borderRadius="full"
                                mt={2}
                            >
                                <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                                    {events.events.title}
                                </Text>
                            </Box>
                        </VStack>
                    </Box>

                    <DrawerBody px={6} py={8} overflow='auto' >
                        <VStack spacing={8} align="stretch">
                            {/* Título del Evento */}
                            <Box>
                                <HStack mb={4} spacing={3}>
                                    <Box
                                        bg="teal.50"
                                        p={2}
                                        borderRadius="lg"
                                        color="teal.600"
                                    >
                                        <Icon as={FiTag} fontSize="1.2rem" />
                                    </Box>
                                    <VStack align="start" spacing={0}>
                                        <Text fontWeight="bold" fontSize="md" color="teal.600">
                                            Título del Evento
                                        </Text>
                                        <Text fontSize="xs" color={textColor}>
                                            Nombre principal del evento
                                        </Text>
                                    </VStack>
                                </HStack>
                                <Input
                                    defaultValue={events.events.title}
                                    placeholder="Ingresa el título del evento"
                                    size="lg"
                                    borderRadius="xl"
                                    borderWidth="2px"
                                    borderColor={useColorModeValue("gray.200", "gray.600")}
                                    _focus={{
                                        borderColor: "teal.400",
                                        boxShadow: "0 0 0 3px rgba(56, 178, 172, 0.1)"
                                    }}
                                    bg={useColorModeValue("gray.50", "gray.700")}
                                    _hover={{
                                        borderColor: "teal.300"
                                    }}
                                    transition="all 0.2s"
                                />
                            </Box>

                            {/* Descripción */}
                            <Box>
                                <HStack mb={4} spacing={3}>
                                    <Box
                                        bg="blue.50"
                                        p={2}
                                        borderRadius="lg"
                                        color="blue.600"
                                    >
                                        <Icon as={InfoIcon} fontSize="1.2rem" />
                                    </Box>
                                    <VStack align="start" spacing={0}>
                                        <Text fontWeight="bold" fontSize="md" color="blue.600">
                                            Descripción
                                        </Text>
                                        <Text fontSize="xs" color={textColor}>
                                            Detalles y información adicional
                                        </Text>
                                    </VStack>
                                </HStack>
                                <Textarea
                                    defaultValue={events.events.description}
                                    placeholder="Describe los detalles del evento..."
                                    rows={4}
                                    borderRadius="xl"
                                    borderWidth="2px"
                                    borderColor={useColorModeValue("gray.200", "gray.600")}
                                    _focus={{
                                        borderColor: "blue.400",
                                        boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.1)"
                                    }}
                                    bg={useColorModeValue("gray.50", "gray.700")}
                                    _hover={{
                                        borderColor: "blue.300"
                                    }}
                                    resize="vertical"
                                    transition="all 0.2s"
                                />
                            </Box>

                            {/* Grid para Fecha y Asistentes */}
                            <Grid templateColumns="1fr 1fr" gap={6}>
                                {/* Fecha y Hora */}
                                <GridItem>
                                    <Box>
                                        <HStack mb={4} spacing={3}>
                                            <Box
                                                bg="purple.50"
                                                p={2}
                                                borderRadius="lg"
                                                color="purple.600"
                                            >
                                                <Icon as={FiCalendar} fontSize="1.2rem" />
                                            </Box>
                                            <VStack align="start" spacing={0}>
                                                <Text fontWeight="bold" fontSize="md" color="purple.600">
                                                    Fecha
                                                </Text>
                                                <Text fontSize="xs" color={textColor}>
                                                    Día y hora
                                                </Text>
                                            </VStack>
                                        </HStack>
                                        <Input
                                            type="datetime-local"
                                            defaultValue={new Date(events.events.date).toISOString().slice(0, 16)}
                                            size="lg"
                                            borderRadius="xl"
                                            borderWidth="2px"
                                            borderColor={useColorModeValue("gray.200", "gray.600")}
                                            _focus={{
                                                borderColor: "purple.400",
                                                boxShadow: "0 0 0 3px rgba(128, 90, 213, 0.1)"
                                            }}
                                            bg={useColorModeValue("gray.50", "gray.700")}
                                            _hover={{
                                                borderColor: "purple.300"
                                            }}
                                            transition="all 0.2s"
                                        />
                                    </Box>
                                </GridItem>

                                {/* Número de Asistentes */}
                                <GridItem>
                                    <Box>
                                        <HStack mb={4} spacing={3}>
                                            <Box
                                                bg="orange.50"
                                                p={2}
                                                borderRadius="lg"
                                                color="orange.600"
                                            >
                                                <Icon as={FiUsers} fontSize="1.2rem" />
                                            </Box>
                                            <VStack align="start" spacing={0}>
                                                <Text fontWeight="bold" fontSize="md" color="orange.600">
                                                    Asistentes
                                                </Text>
                                                <Text fontSize="xs" color={textColor}>
                                                    Número de personas
                                                </Text>
                                            </VStack>
                                        </HStack>
                                        <NumberInput
                                            defaultValue={events.events.attend}
                                            min={1}
                                            max={1000}
                                            size="lg"
                                        >
                                            <NumberInputField
                                                borderRadius="xl"
                                                borderWidth="2px"
                                                borderColor={useColorModeValue("gray.200", "gray.600")}
                                                _focus={{
                                                    borderColor: "orange.400",
                                                    boxShadow: "0 0 0 3px rgba(251, 146, 60, 0.1)"
                                                }}
                                                bg={useColorModeValue("gray.50", "gray.700")}
                                                _hover={{
                                                    borderColor: "orange.300"
                                                }}
                                                transition="all 0.2s"
                                            />
                                            <NumberInputStepper>
                                                <NumberIncrementStepper
                                                    borderColor={useColorModeValue("gray.200", "gray.600")}
                                                    _hover={{
                                                        bg: useColorModeValue("orange.50", "gray.600"),
                                                        color: "orange.500"
                                                    }}
                                                    transition="all 0.2s"
                                                />
                                                <NumberDecrementStepper
                                                    borderColor={useColorModeValue("gray.200", "gray.600")}
                                                    _hover={{
                                                        bg: useColorModeValue("orange.50", "gray.600"),
                                                        color: "orange.500"
                                                    }}
                                                    transition="all 0.2s"
                                                />
                                            </NumberInputStepper>
                                        </NumberInput>
                                    </Box>
                                </GridItem>
                            </Grid>

                            {/* Estado del Evento */}
                            <Box>
                                <HStack mb={4} spacing={3}>
                                    <Box
                                        bg="green.50"
                                        p={2}
                                        borderRadius="lg"
                                        color="green.600"
                                    >
                                        <Icon as={getStatusIcon(events.events.state)} fontSize="1.2rem" />
                                    </Box>
                                    <VStack align="start" spacing={0}>
                                        <Text fontWeight="bold" fontSize="md" color="green.600">
                                            Estado del Evento
                                        </Text>
                                        <Text fontSize="xs" color={textColor}>
                                            Estado actual de confirmación
                                        </Text>
                                    </VStack>
                                </HStack>
                                <Select
                                    defaultValue={events.events.state}
                                    size="lg"
                                    borderRadius="xl"
                                    borderWidth="2px"
                                    borderColor={useColorModeValue("gray.200", "gray.600")}
                                    _focus={{
                                        borderColor: "green.400",
                                        boxShadow: "0 0 0 3px rgba(72, 187, 120, 0.1)"
                                    }}
                                    bg={useColorModeValue("gray.50", "gray.700")}
                                    _hover={{
                                        borderColor: "green.300"
                                    }}
                                    transition="all 0.2s"
                                >
                                    <option value="Confirmado">✅ Confirmado</option>
                                    <option value="Pendiente">⏳ Pendiente</option>
                                </Select>
                            </Box>

                            {/* Tarjeta de Información del Salón */}
                            <Box
                                bg={useColorModeValue("gradient.50", "gray.700")}
                                bgGradient={useColorModeValue(
                                    "linear(135deg, gray.50 0%, blue.50 100%)",
                                    "linear(135deg, gray.700 0%, gray.600 100%)"
                                )}
                                p={6}
                                borderRadius="2xl"
                                border="1px"
                                borderColor={borderColor}
                                boxShadow="md"
                                position="relative"
                                overflow="hidden"
                            >
                                {/* Elemento decorativo */}
                                <Box
                                    position="absolute"
                                    top="-20px"
                                    right="-20px"
                                    width="40px"
                                    height="40px"
                                    borderRadius="full"
                                    bg={useColorModeValue("blue.100", "gray.600")}
                                    opacity={0.5}
                                />

                                <HStack justify="space-between" align="center">
                                    <VStack align="start" spacing={2}>
                                        <HStack spacing={2}>
                                            <Icon as={FiMapPin} color="red.500" fontSize="1.2rem" />
                                            <Text fontSize="sm" fontWeight="bold" color="red.500">
                                                Ubicación del Evento
                                            </Text>
                                        </HStack>
                                        <Text fontWeight="bold" fontSize="xl">
                                            Salón {events.events.room.NumberRoom}
                                        </Text>
                                        <HStack spacing={4}>
                                            <Text fontSize="sm" color={textColor}>
                                                ID: {events.events._id.slice(-8)}
                                            </Text>
                                            <Badge
                                                colorScheme={getStatusColor(events.events.state)}
                                                borderRadius="full"
                                                px={2}
                                            >
                                                {events.events.state}
                                            </Badge>
                                        </HStack>
                                    </VStack>
                                    <Avatar
                                        bg="red.500"
                                        icon={<Icon as={FiHome} fontSize="1.8rem" />}
                                        size="xl"
                                        boxShadow="lg"
                                    />
                                </HStack>
                            </Box>
                        </VStack>
                    </DrawerBody>

                    <DrawerFooter
                        borderTopWidth="1px"
                        borderTopColor={borderColor}
                        bg={useColorModeValue("gray.50", "gray.700")}
                        px={6}
                        py={6}
                    >
                        <HStack spacing={4} w="full" justify="flex-end">
                            <Button
                                variant="outline"
                                onClick={onDrawerClose}
                                size="lg"
                                borderRadius="xl"
                                borderWidth="2px"
                                borderColor={useColorModeValue("gray.300", "gray.500")}
                                _hover={{
                                    bg: useColorModeValue("gray.100", "gray.600"),
                                    borderColor: useColorModeValue("gray.400", "gray.400"),
                                    transform: "translateY(-2px)",
                                    boxShadow: "lg"
                                }}
                                transition="all 0.2s"
                                px={8}
                            >
                                Cancelar
                            </Button>
                            <Button
                                bgGradient={gradientBg}
                                color="white"
                                size="lg"
                                borderRadius="xl"
                                _hover={{
                                    bgGradient: useColorModeValue(
                                        "linear(to-r, teal.500, blue.600)",
                                        "linear(to-r, teal.700, blue.800)"
                                    ),
                                    transform: "translateY(-2px)",
                                    boxShadow: "xl"
                                }}
                                transition="all 0.2s"
                                leftIcon={<Icon as={CheckCircleIcon} />}
                                px={8}
                                boxShadow="lg"
                            >
                                Guardar Cambios
                            </Button>
                        </HStack>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default EventsCards