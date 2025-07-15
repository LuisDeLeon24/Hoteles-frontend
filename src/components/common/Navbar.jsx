import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  useDisclosure,
  Stack,
  Text,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  Container,
  Divider,
  useColorMode,
  useColorModeValue
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, ChevronDownIcon, BellIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import { FaHotel, FaCalendarCheck, FaCalendarAlt, FaUserCircle, FaHome, FaBell, FaBellSlash } from 'react-icons/fa';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserContext } from '../../context/UserContext'; 
import { logout } from '../../shared/hooks';

const Links = [
  { label: 'Inicio', path: '/Dashboard', icon: FaHome },
  { label: 'Hoteles', path: '/hotels', icon: FaHotel },
  { label: 'Reservas', path: '/reservas', icon: FaCalendarCheck },
  { label: 'Eventos', path: '/events', icon: FaCalendarAlt },
  { label: 'Perfil', path: '/perfil', icon: FaUserCircle },
];

const NavLink = ({ label, path, icon: Icon }) => (
  <Tooltip label={label} placement="bottom" hasArrow>
    <Button
      as={RouterLink}
      to={path}
      variant="ghost"
      color="white"
      _hover={{
        bg: 'brand.400',
        transform: 'translateY(-2px)',
        boxShadow: 'md'
      }}
      _active={{
        bg: 'brand.600',
      }}
      fontWeight="medium"
      transition="all 0.2s"
      px={4}
      borderRadius="lg"
      leftIcon={<Icon />}
    >
      {label}
    </Button>
  </Tooltip>
);

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const [notificationsActive, setNotificationsActive] = useState(false);
  const MotionBox = motion.div;
  const { user, refreshUser } = useContext(UserContext);

  const handleLogout = () => {
    logout();
    refreshUser();
  }


  return (
    <Box
      bg="brand.500"
      px={4}
      boxShadow="lg"
      position="sticky"
      top={0}
      zIndex={10}
      bgGradient="linear(to-r, brand.600, brand.500)"
    >
      <Container maxW="container.xl">
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          {/* Logo con efecto de brillo */}
          <RouterLink to="/">
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color="white"
              textShadow="0 0 5px rgba(255,255,255,0.3)"
              letterSpacing="tight"
              display="flex"
              alignItems="center"
            >
              <FaHotel style={{ marginRight: '8px' }} />
              Hotel<Text as="span" color="accent.500">Gest</Text>
            </Text>
          </RouterLink>

          {/* Icono hamburguesa en móviles con animación */}
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Abrir menú'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
            color="white"
            bg="brand.600"
            _hover={{
              bg: 'brand.400',
              transform: 'rotate(180deg)',
              transition: 'all 0.3s'
            }}
            transition="all 0.3s"
          />

          {/* Enlaces en desktop */}
          <HStack spacing={4} alignItems={'center'} display={{ base: 'none', md: 'flex' }}>
            {Links.map((link) => (
              <NavLink key={link.label} {...link} />
            ))}
          </HStack>

          {/* Sección derecha: notificaciones y perfil */}
          <HStack spacing={3}>
            <Tooltip label="Notificaciones" hasArrow>
              <IconButton
                variant="ghost"
                color="white"
                aria-label="Notificaciones"
                position="relative"
                onClick={() => setNotificationsActive(!notificationsActive)}
                _hover={{ bg: 'brand.400' }}
                w="40px" h="40px"
              >
                <AnimatePresence exitBeforeEnter>
                  {notificationsActive ? (
                    <MotionBox
                      key="bell-on"
                      initial={{ opacity: 0, scale: 0.7, rotate: -20 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.7, rotate: 20 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      style={{ position: 'absolute', transform: 'translate(-50%, -50%)' }}
                    >
                      <FaBell size={20} />
                      <Box
                        position="absolute"
                        top="2px"
                        right="2px"
                        bg="red.500"
                        borderRadius="full"
                        w="10px"
                        h="10px"
                        animation="pulse 2s infinite"
                      />
                    </MotionBox>
                  ) : (
                    <MotionBox
                      key="bell-off"
                      initial={{ opacity: 0, scale: 0.7, rotate: 20 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.7, rotate: -20 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      style={{ position: 'absolute', transform: 'translate(-50%, -50%)' }}
                    >
                      <FaBellSlash size={20} />
                    </MotionBox>
                  )}
                </AnimatePresence>
              </IconButton>
            </Tooltip>

            {/* Botón para cambiar de tema */}
            <Tooltip label={colorMode === 'light' ? 'Modo oscuro' : 'Modo claro'} hasArrow>
              <IconButton
                onClick={toggleColorMode}
                variant="ghost"
                color="white"
                _hover={{ bg: 'brand.400' }}
                aria-label="Cambiar tema"
                icon={
                  <AnimatePresence mode="wait" initial={false}>
                    {colorMode === 'light' ? (
                      <MotionBox
                        key="moon"
                        initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                        animate={{ rotate: 0, scale: 1, opacity: 1 }}
                        exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <MoonIcon />
                      </MotionBox>
                    ) : (
                      <MotionBox
                        key="sun"
                        initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
                        animate={{ rotate: 0, scale: 1, opacity: 1 }}
                        exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <SunIcon />
                      </MotionBox>
                    )}
                  </AnimatePresence>
                }
              />
            </Tooltip>

            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                color="white"
                _hover={{ bg: 'brand.400' }}
                _active={{ bg: 'brand.600' }}
              >
                <Flex align="center">
                  <Avatar size="sm" name="Usuario" bg="accent.500" mr={2} />
                  <Text display={{ base: 'none', md: 'block' }}>
                    {user?.username}
                  </Text>
                  <ChevronDownIcon ml={1} />
                </Flex>
              </MenuButton>

              <MenuList bg={useColorModeValue('gray.50', 'gray.700')}>
                <MenuItem
                  as={RouterLink}
                  to="/perfil"
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
                  color={useColorModeValue('black', 'white')}
                >
                  Mi Perfil
                </MenuItem>
                <MenuItem
                  as={RouterLink}
                  to="/configuracion"
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
                  color={useColorModeValue('black', 'white')}
                >
                  Configuración
                </MenuItem>
                <Divider />
                <MenuItem
                  as={RouterLink}
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
                  color={useColorModeValue('black', 'white')}
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </MenuItem>
              </MenuList>
            </Menu>

          </HStack>

        </Flex>

        {/* Enlaces en mobile con animación */}
        <Box
          pb={4}
          display={{ md: 'none' }}
          maxH={isOpen ? "500px" : "0px"}
          overflow="auto"
          transition="all 0.3s ease"
        >
          <Stack as={'nav'} spacing={2}>
            {Links.map((link) => (
              <NavLink key={link.label} {...link} />
            ))}
          </Stack>
        </Box>
      </Container>

      {/* Barra de progreso decorativa */}
      <Box
        h="3px"
        bgGradient="linear(to-r, accent.500, brand.300, accent.500)"
        w="100%"
      />
    </Box>
  );
}
