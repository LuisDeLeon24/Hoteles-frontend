import React from 'react';
import {
    Chart as ChartJS,
    LineElement, PointElement, CategoryScale, LinearScale,
    ArcElement, Tooltip, Legend, RadarController, RadialLinearScale,
    PolarAreaController, Filler
} from 'chart.js';
import { Radar, PolarArea, Pie, Line } from 'react-chartjs-2';
import { Box, Text, VStack, useColorModeValue, Heading, Flex, Select, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { useStats } from '../../shared/hooks/useStats';
import  GlobeD3 from '../stats/WorldTour';

ChartJS.register(
    LineElement, PointElement, CategoryScale, LinearScale,
    ArcElement, Tooltip, Legend, RadarController, RadialLinearScale,
    PolarAreaController, Filler
);

const DashboardCharts = () => {
    const {
        income, userCount, roomCount, todayR,
        monthlyIncome, monthlyReservations
    } = useStats();

    const labelColor = useColorModeValue('#1A202C', '#EDF2F7');
    const gridColor = useColorModeValue('rgba(0, 0, 0, 0.06)', 'rgba(255, 255, 255, 0.1)');
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.400');

    const stats = [
        { label: 'Reservas Hoy', value: todayR, change: 12, icon: 'FaCalendarCheck', color: 'blue' },
        { label: 'Ocupación', value: roomCount, suffix: '%', change: 3, icon: 'FaBed', color: 'green' },
        { label: 'Clientes', value: userCount, change: -5, icon: 'FaUsers', color: 'purple' },
    ];

    const dataPie = {
        labels: stats.map(s => s.label),
        datasets: [{
            label: 'Distribución valores',
            data: stats.map(s => s.value),
            backgroundColor: ['#3182CE', '#38A169', '#805AD5', '#DD6B20'],
            borderColor: ['#3182CE', '#38A169', '#805AD5', '#DD6B20'],
            borderWidth: 2,
            hoverOffset: 20,
        }],
    };

    const dataPolar = {
        labels: stats.map(s => s.label),
        datasets: [{
            label: 'Cambio (%)',
            data: stats.map(s => Math.abs(s.change)),
            backgroundColor: ['rgba(49, 130, 206, 0.7)', 'rgba(56, 161, 105, 0.7)', 'rgba(128, 90, 213, 0.7)', 'rgba(221, 107, 32, 0.7)'],
            borderColor: ['#3182CE', '#38A169', '#805AD5', '#DD6B20'],
            borderWidth: 1,
        }],
    };

    const monthlyData = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [
            {
                label: 'Reservas',
                data: monthlyReservations,
                borderColor: '#3182CE',
                backgroundColor: 'rgba(49, 130, 206, 0.2)',
                tension: 0.4,
                fill: true,
            },
            {
                label: 'Ingresos',
                data: monthlyIncome,
                borderColor: '#DD6B20',
                backgroundColor: 'rgba(221, 107, 32, 0.1)',
                tension: 0.4,
                fill: true,
            }
        ],
    };

    const optionsLine = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: labelColor,
                    font: { size: 11 },
                    padding: 20,
                    boxWidth: 12
                },
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleFont: { size: 13 },
                bodyFont: { size: 12 },
                padding: 10,
                cornerRadius: 8
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: gridColor },
                ticks: { color: labelColor, font: { size: 10 } }
            },
            x: {
                grid: { display: false },
                ticks: { color: labelColor, font: { size: 10 } }
            }
        },
        animation: {
            duration: 1500,
            easing: 'easeOutQuart'
        }
    };

    return (
        <VStack spacing={6} align="stretch" h="full">
           

            <Tabs variant="soft-rounded" colorScheme="brand" size="sm">
                <TabList mb={4}>
                    <Tab>Gráficas</Tab>
                    <Tab>Tendencias</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <VStack spacing={6} align="stretch">
                            <Box p={4} bg={cardBg} borderRadius="xl" borderWidth="1px" borderColor={borderColor} h="250px">
                                <Text fontSize="sm" fontWeight="medium" mb={4} color={textColor}>Cambio Porcentual</Text>
                                <Box h="200px">
                                    <PolarArea data={dataPolar} />
                                </Box>
                            </Box>

                            <Box p={4} bg={cardBg} borderRadius="xl" borderWidth="1px" borderColor={borderColor} h="250px">
                                <Text fontSize="sm" fontWeight="medium" mb={4} color={textColor}>Distribución de Valores</Text>
                                <Box h="200px">
                                    <Pie data={dataPie} />
                                </Box>
                            </Box>
                        </VStack>
                    </TabPanel>

                    <TabPanel>
                        <Box p={4} bg={cardBg} borderRadius="xl" borderWidth="1px" borderColor={borderColor} h="510px">
                            <Text fontSize="sm" fontWeight="medium" mb={4} color={textColor}>Tendencia Mensual</Text>
                            <Box h="450px">
                                <Line data={monthlyData} options={optionsLine} />
                            </Box>
                        </Box>
                    </TabPanel>
                </TabPanels>
            </Tabs>
            <GlobeD3 />
        </VStack>
    );
};

export default DashboardCharts;

