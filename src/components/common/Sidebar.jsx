import { useState, useEffect } from 'react';
import {
  VStack,
  Box,
  Link,
  IconButton,
  Flex,
  Text,
  Tooltip,
  Heading,
  Divider,
  useColorModeValue,
  Badge
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  FaChevronLeft,
  FaChevronRight,
  FaHotel,
  FaBed,
  FaCalendarAlt,
  FaChartBar,
  FaUsers,
  FaCog,
  FaQuestionCircle
} from 'react-icons/fa';
import { useSpring, useTransition, animated, config } from '@react-spring/web';

const AnimatedBox = animated(Box);
const AnimatedText = animated(Text);

const sidebarItems = [
  {
    label: 'Hoteles',
    path: '/admin/hotels',
    icon: FaHotel,
    description: 'Gestión de propiedades'
  },
  {
    label: 'Habitaciones',
    path: '/admin/rooms',
    icon: FaBed,
    description: 'Control de disponibilidad'
  },
  {
    label: 'Reportes',
    path: '/admin/reports',
    icon: FaChartBar,
    description: 'Estadísticas y análisis'
  },
  {
    label: 'Usuarios',
    path: '/admin/users',
    icon: FaUsers,
    description: 'Administración de personal'
  }
];

const secondaryItems = [
  { label: 'Configuración', path: '/admin/settings', icon: FaCog },
  { label: 'Ayuda', path: '/admin/help', icon: FaQuestionCircle }
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const bgGradient = useColorModeValue(
    'linear(to-b, gray.50, brand.50)',
    'linear(to-b, gray.800, brand.900)'
  );

  const activeBg = useColorModeValue('brand.100', 'brand.700');
  const activeColor = useColorModeValue('brand.700', 'white');
  const hoverBg = useColorModeValue('brand.50', 'brand.800');
  const hoverColor = useColorModeValue('brand.600', 'white');
  const bgLinks = useColorModeValue('gray.600', 'white');

  const sidebarSpring = useSpring({
    width: isCollapsed ? 70 : 250,
    padding: isCollapsed ? 8 : 16,
    config: config.gentle
  });

  const fadeIn = useSpring({
    opacity: isLoaded ? 1 : 0,
    transform: isLoaded ? 'scale(1)' : 'scale(0.95)',
    config: config.gentle
  });

  return (
    <AnimatedBox
      style={sidebarSpring}
      bgGradient={bgGradient}
      h="100vh"
      boxShadow="0 0 10px rgba(0,0,0,0.05)"
      borderRight="1px solid"
      borderColor="gray.200"
      position="relative"
      overflow='hidden'
      css={{
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: useColorModeValue('brand.200', 'brand.700'),
          borderRadius: '24px',
        },
      }}
    >
      <animated.div style={fadeIn}>
        <Flex direction="column" h="full" justify="space-between">
          <Box>
            <Flex justify={isCollapsed ? "center" : "space-between"} align="center" mb={6}>
              {!isCollapsed && (
                <Heading
                  size="sm"
                  color="brand.500"
                  fontWeight="semibold"
                  letterSpacing="tight"
                >
                  Panel de control
                </Heading>
              )}
              <Tooltip label={isCollapsed ? "Expandir" : "Colapsar"} placement="right" hasArrow>
                <IconButton
                  aria-label="Toggle Sidebar"
                  icon={isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  size="sm"
                  variant="ghost"
                  color="brand.500"
                  _hover={{ bg: hoverBg, transform: 'scale(1.1)' }}
                  transition="all 0.2s"
                />
              </Tooltip>
            </Flex>

            <Divider mb={4} borderColor="gray.200" />

            <VStack align="stretch" spacing={isCollapsed ? 4 : 2}>
              {sidebarItems.map((item) => {
                const isActive = location.pathname === item.path;
                const showDescription = !isCollapsed && hoveredItem === item.path && item.description;

                const transitions = useTransition(showDescription ? [item] : [], {
                  from: { opacity: 0, transform: 'translateY(-5px)' },
                  enter: { opacity: 1, transform: 'translateY(0px)' },
                  leave: { opacity: 0, transform: 'translateY(-5px)' },
                  config: config.gentle
                });

                return (
                  <Tooltip
                    key={item.path}
                    label={isCollapsed ? `${item.label}${item.description ? ` - ${item.description}` : ''}` : ''}
                    placement="right"
                    hasArrow
                  >
                    <Box
                      position="relative"
                      onMouseEnter={() => setHoveredItem(item.path)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      {isActive && (
                        <Box
                          position="absolute"
                          left="0"
                          top="0"
                          bottom="0"
                          w="4px"
                          bg="accent.500"
                          borderRightRadius="md"
                        />
                      )}

                      <Link
                        as={RouterLink}
                        to={item.path}
                        w="100%"
                        display="flex"
                        alignItems="center"
                        p={3}
                        borderRadius="lg"
                        bg={isActive ? activeBg : 'transparent'}
                        color={isActive ? activeColor : bgLinks}
                        fontWeight={isActive ? "semibold" : "medium"}
                        _hover={{
                          bg: hoverBg,
                          color: hoverColor,
                          transform: 'translateX(2px)'
                        }}
                        transition="all 0.3s ease"
                      >
                        <Box
                          as={item.icon}
                          mr={isCollapsed ? 0 : 3}
                          ml={isCollapsed ? 1 : 0}
                          w={5}
                          h={5}
                          color={isActive ? 'brand.500' : bgLinks}
                        />
                        {!isCollapsed && (
                          <Flex justify="space-between" width="100%" align="center">
                            <Text>{item.label}</Text>
                            {item.notifications && (
                              <Badge colorScheme="red" borderRadius="full" px={2}>
                                {item.notifications}
                              </Badge>
                            )}
                          </Flex>
                        )}

                        {isCollapsed && item.notifications && (
                          <Badge
                            colorScheme="red"
                            borderRadius="full"
                            position="absolute"
                            top="0"
                            right="0"
                            transform="translate(30%, -30%)"
                            w="18px"
                            h="18px"
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            p={0}
                          >
                            {item.notifications}
                          </Badge>
                        )}
                      </Link>

                      {transitions((style, i) =>
                        i && (
                          <animated.div style={style}>
                            <Text
                              fontSize="xs"
                              color="gray.500"
                              pl={11}
                              pb={1}
                            >
                              {i.description}
                            </Text>
                          </animated.div>
                        )
                      )}
                    </Box>
                  </Tooltip>
                );
              })}
            </VStack>
          </Box>

          <Box mt={8}>
            <Divider mb={4} borderColor="gray.200" />
            <VStack align="stretch" spacing={isCollapsed ? 4 : 2}>
              {secondaryItems.map((item) => (
                <Tooltip key={item.path} label={isCollapsed ? item.label : ''} placement="right" hasArrow>
                  <Link
                    as={RouterLink}
                    to={item.path}
                    w="100%"
                    display="flex"
                    alignItems="center"
                    p={2}
                    borderRadius="md"
                    color={useColorModeValue('gray.600', 'white')}
                    _hover={{
                      bg: hoverBg,
                      color: hoverColor
                    }}
                    transition="all 0.3s ease"
                  >
                    <Box
                      as={item.icon}
                      mr={isCollapsed ? 0 : 3}
                      ml={isCollapsed ? 1 : 0}
                      w={4}
                      h={4}
                    />
                    {!isCollapsed && <Text fontSize="sm">{item.label}</Text>}
                  </Link>
                </Tooltip>
              ))}
            </VStack>
          </Box>
        </Flex>
      </animated.div>
    </AnimatedBox>
  );
};

export default Sidebar;
