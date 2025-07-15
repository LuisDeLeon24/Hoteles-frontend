import { Box, Flex, SimpleGrid, Grid, useColorModeValue, GridItem, Text ,Stack} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import StatsCard from '../components/dashboard/StatsCard';
import { FaCalendarCheck, FaBed, FaUsers, FaMoneyBillWave } from 'react-icons/fa';
import { useHotels } from '../shared/hooks/useHotels';
import { useEvents } from '../shared/hooks/useEvents';
import { useStats } from '../shared/hooks/useStats';
import Chatbot from '../components/dashboard/ChatBot';
import DashboardCharts from '../components/dashboard/Grafic';
import MapaInteractivo from '../components/stats/Map';
import TreemapChart from '../components/stats/TreeMap';
import SatisfactionMatrix from '../components/stats/MatrixChart';


const data = {
  "name": "Eventos",
        "children": [
            {
                "children": [
                    {
                        "name": "Confirmado",
                        "value": 2
                    }
                ],
                "name": "Gala"
            },
            {
                "children": [
                    {
                        "name": "Pendiente",
                        "value": 4
                    }
                ],
                "name": "Conferencia"
            },
            {
                "children": [
                    {
                        "name": "Pendiente",
                        "value": 3
                    }
                ],
                "name": "Cultural"
            }
        ]
    };


const Dashboard = () => {

  const { income, userCount, roomCount,todayR,eventsTreemap} = useStats();

  const dashboardData = {

  stats: [
    { label: 'Reservas del mes', value: todayR, change: 12, icon: FaCalendarCheck, color: 'blue' },
    { label: 'Disponibilidad', value: roomCount, change: 3, icon: FaBed, color: 'green' },
    { label: 'Clientes', value: userCount, change: -5, icon: FaUsers, color: 'purple' },
    { label: 'Ingresos', value: income, prefix: '$', change: 18, icon: FaMoneyBillWave, color: 'orange' }
  ],
  upcomingEvents: [
    { name: 'Conferencia Médica', date: '15/05/2025', attendees: 120, room: 'Salón Diamante' },
    { name: 'Boda Rodríguez-Martínez', date: '18/05/2025', attendees: 85, room: 'Salón Platino' },
    { name: 'Seminario Empresarial', date: '20/05/2025', attendees: 50, room: 'Sala Ejecutiva' }
  ]
};

  const [isLoading, setIsLoading] = useState(true);

  const { hotels, getHotels, isFetching } = useHotels();

  const { event } = useEvents();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.800')} overflow="hidden">
        <Navbar />
        <Flex height="calc(100vh - 64px)">
          <Sidebar />

          {/* Contenedor principal: stats + bookings + events */}
          <Box
            p={6}
            flex="1 1 auto"
            overflowY="auto"
            maxWidth={{ base: '100%', lg: '75%' }}
          >
            <DashboardHeader />

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={8}>
              {dashboardData.stats.map((stat, index) => (
                <StatsCard key={index} stat={stat} isLoading={isLoading} />
              ))}
            </SimpleGrid>

            <Box
                bg="white"
                borderRadius="md"
                boxShadow="md"
                p={4}
                mb={6}  // aumenta el margen inferior
            >
                <TreemapChart data={data} width={600} height={400} />
            </Box>

            <Box
                bg="white"
                borderRadius="md"
                boxShadow="md"
                p={4}
            >
                <MapaInteractivo />
            </Box>

            <Box
                bg="white"
                borderRadius="md"
                boxShadow="md"
                p={4}
            >
                <SatisfactionMatrix  />
            </Box>
          </Box>

          {/* Sidebar derecho para gráficas - aquí usas tu componente */}
          <Box
            w={{ base: '100%', lg: '25%' }}
            p={3}
            boxShadow="md"
            display="flex"
            flexDirection="column"
          >
            <DashboardCharts />
          </Box>
        </Flex>
      </Box>
      <Chatbot />

    </>
  );
};

export default Dashboard;
