import { useState, useEffect } from "react";
import Navbar from "../components/common/Navbar";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  IconButton,
  VStack,
  HStack,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useDisclosure,
  Input,
  Tooltip,
  useColorModeValue,
  SimpleGrid,
  Tag,
  Grid,
  useToast,
} from "@chakra-ui/react";
import {
  CalendarIcon,
  AddIcon,
  InfoOutlineIcon,
  StarIcon
} from "@chakra-ui/icons";
import Sidebar from "../components/common/Sidebar";
import ChatBot from "../components/dashboard/ChatBot";
import { EventsModalForm } from "../components/events/EventsModalForm";
import { useEvents } from "../shared/hooks/useEvents";
import { Events } from "../components/events/Events";

const EventsPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filter, setFilter] = useState("todos");
  const [view, setView] = useState("cards");
  const [searchTerm, setSearchTerm] = useState("");
  const { event } = useEvents();
  const [events, setEvents] = useState([]);


  const eventosFiltrados = event.filter(evento => {
    if (filter !== "todos" && evento.state !== filter) return false;
    if (searchTerm && !evento.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleEventAdded = (newEvent) => {  
    setEvents(prev => [...prev, newEvent]);
  };

  // Obtener estadísticas
  const getEstadisticas = () => {
    const hoy = new Date();
    const hoyStr = hoy.toISOString().split("T")[0]; // "YYYY-MM-DD"

    const eventosHoy = event.filter(e => {
      const eventoFecha = new Date(e.date).toISOString().split("T")[0];
      return eventoFecha === hoyStr;
    }).length;

    const salonesUnicos = [...new Set(event.map(e => e.salon))].length;
    const totalAsistentes = event.reduce((sum, e) => sum + e.attend, 0);

    return { eventosHoy, salonesUnicos, totalAsistentes };
  };


  const stats = getEstadisticas();

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.900")} >
      <Navbar />
      <Flex>
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <Box flex="1" p={6} overflow="auto" maxH="calc(100vh - 80px)">
          {/* Header con búsqueda */}
          <Flex justify="space-between" align="center" mb={6} wrap="wrap" gap={4}>
            <Heading size="lg" bgGradient="linear(to-r, teal.400, blue.500)" bgClip="text">
              Gestor de Eventos
            </Heading>

            <HStack spacing={4} color={useColorModeValue('dark', 'white')}>
              <Input
                placeholder="Buscar evento..."
                w="250px"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                bg={useColorModeValue("white", "gray.700")}
              />
              <Tooltip label="Crear Evento" placement="top">
                <IconButton
                  aria-label="Nuevo Evento"
                  icon={<AddIcon />}
                  onClick={onOpen}
                  colorScheme="teal"
                  size="md"
                />
              </Tooltip>
            </HStack>
          </Flex>

          {/* Tarjetas de estadísticas */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8} color={useColorModeValue('black', 'white')} >
            <Stat
              bg={useColorModeValue("white", "gray.700")}
              p={5}
              borderRadius="xl"
              boxShadow="md"
              borderLeft="4px solid"
              borderLeftColor="blue.400"
            >
              <StatLabel display="flex" alignItems="center">
                <CalendarIcon mr={2} /> Eventos hoy
              </StatLabel>
              <StatNumber fontSize="3xl">{stats.eventosHoy}</StatNumber>
              <StatHelpText>+1 desde ayer</StatHelpText>
            </Stat>

            <Stat
              bg={useColorModeValue("white", "gray.700")}
              p={5}
              borderRadius="xl"
              boxShadow="md"
              borderLeft="4px solid"
              borderLeftColor="purple.400"
            >
              <StatLabel display="flex" alignItems="center">
                <InfoOutlineIcon mr={2} /> Salones reservados
              </StatLabel>
              <StatNumber fontSize="3xl">{stats.salonesUnicos}</StatNumber>
              <StatHelpText>83% ocupación</StatHelpText>
            </Stat>

            <Stat
              bg={useColorModeValue("white", "gray.700")}
              p={5}
              borderRadius="xl"
              boxShadow="md"
              borderLeft="4px solid"
              borderLeftColor="green.400"
            >
              <StatLabel display="flex" alignItems="center">
                <StarIcon mr={2} /> Total asistentes
              </StatLabel>
              <StatNumber fontSize="3xl">{stats.totalAsistentes}</StatNumber>
              <StatHelpText>↑ 12% este mes</StatHelpText>
            </Stat>
          </SimpleGrid>

          {/* Filtros y vistas */}
          <Flex justify="space-between" align="center" mb={6} color={useColorModeValue('black', 'white')} >
            <HStack spacing={4}>
              <Text fontWeight="bold">Filtrar por:</Text>
              <HStack spacing={2}>
                <Button
                  size="sm"
                  colorScheme={filter === "todos" ? "teal" : "gray"}
                  onClick={() => setFilter("todos")}
                >
                  Todos
                </Button>
                <Button
                  size="sm"
                  colorScheme={filter === "Confirmado" ? "green" : "gray"}
                  onClick={() => setFilter("Confirmado")}
                >
                  Confirmados
                </Button>
                <Button
                  size="sm"
                  colorScheme={filter === "Pendiente" ? "yellow" : "gray"}
                  onClick={() => setFilter("Pendiente")}
                >
                  Pendientes
                </Button>
              </HStack>
            </HStack>

            <HStack>
              <Tooltip label="Vista de tarjetas" placement="top">
                <IconButton
                  aria-label="Vista de tarjetas"
                  icon={<Grid />}
                  size="sm"
                  colorScheme={view === "cards" ? "blue" : "gray"}
                  onClick={() => setView("cards")}
                />
              </Tooltip>
              <Tooltip label="Vista de lista" placement="top">
                <IconButton
                  aria-label="Vista de lista"
                  icon={<HamburgerIcon />}
                  size="sm"
                  colorScheme={view === "list" ? "blue" : "gray"}
                  onClick={() => setView("list")}
                />
              </Tooltip>
            </HStack>
          </Flex>

          {/* Eventos - Vista de tarjetas */}
          {view === "cards" && (
            <Events events={eventosFiltrados} />
          )}

          {/* Eventos - Vista de lista */}
          {view === "list" && (
            <VStack spacing={4} align="stretch" mb={8}>
              {eventosFiltrados.map((evento) => (
                <Flex
                  key={evento.id}
                  bg={useColorModeValue("white", "gray.700")}
                  p={4}
                  borderRadius="lg"
                  boxShadow="md"
                  justify="space-between"
                  align="center"
                  transition="transform 0.2s"
                  _hover={{ transform: "translateX(4px)", bg: useColorModeValue("gray.50", "gray.600") }}
                >
                  <Flex align="center">
                    <Box
                      bg={evento.estado === "confirmado" ? "green.500" : "yellow.500"}
                      w={3}
                      h={3}
                      borderRadius="full"
                      mr={4}
                    />
                    <Box>
                      <Heading size="sm">{evento.nombre}</Heading>
                      <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.300")}>
                        {evento.salon} • {evento.fecha.split('-')[2]}/{evento.fecha.split('-')[1]} • {evento.hora}
                      </Text>
                    </Box>
                  </Flex>

                  <HStack spacing={4}>
                    <Tag size="sm" colorScheme="blue">{evento.tipo}</Tag>
                    <Text fontSize="sm" fontWeight="bold">{evento.asistentes} asistentes</Text>
                    <Button size="sm" colorScheme="teal" variant="outline">Ver</Button>
                  </HStack>
                </Flex>
              ))}
            </VStack>
          )}
        </Box>
      </Flex>
      <EventsModalForm
        isOpen={isOpen}
        onClose={onClose}
        onEventAdded={handleEventAdded}
      />
      {/* ChatBot Asistente */}
      <ChatBot />
    </Box>
  );
};

// Icono para la vista de lista (hamburger)
const HamburgerIcon = () => (
  <Box>
    <Box as="span" display="block" w="16px" h="2px" bg="currentColor" mb="3px" />
    <Box as="span" display="block" w="16px" h="2px" bg="currentColor" mb="3px" />
    <Box as="span" display="block" w="16px" h="2px" bg="currentColor" />
  </Box>
);

export default EventsPage;  
