// MapaInteractivo.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Input,
  IconButton,
  VStack,
  useToast,
  List,
  ListItem,
  Text,
  Spinner
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function ChangeView({ coords }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, 13);
  }, [coords, map]);
  return null;
}

export default function MapaInteractivo() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [coords, setCoords] = useState([14.6349, -90.5069]);
  const [placeName, setPlaceName] = useState('');
  const toast = useToast();

  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5`);
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  // debounce effect
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchSuggestions(searchTerm);
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const handleSelectPlace = (place) => {
    const { lat, lon, display_name } = place;
    setCoords([parseFloat(lat), parseFloat(lon)]);
    setPlaceName(display_name);
    setSuggestions([]);
    setSearchTerm(display_name); // Para que el input refleje la elección
  };

  const handleSearch = () => {
    if (suggestions.length > 0) {
      handleSelectPlace(suggestions[0]);
    } else {
      toast({
        title: 'No se encontró el lugar.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box position="relative" height="500px" width="100%">
      <VStack
            spacing={2}
            position="absolute"
            top={4}
            right={4} // <--- AQUÍ el cambio
            zIndex={1000}
            bg="white"
            p={3}
            borderRadius="md"
            boxShadow="lg"
            width="300px"
      >
        <Box position="relative" width="100%">
          <Input
            placeholder="Buscar lugar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          {isLoading && (
            <Spinner size="sm" position="absolute" top="10px" right="10px" />
          )}
          {suggestions.length > 0 && (
            <List
              position="absolute"
              top="100%"
              left={0}
              right={0}
              bg="white"
              border="1px solid #ccc"
              borderRadius="md"
              mt={1}
              zIndex={1001}
              maxHeight="150px"
              overflowY="auto"
              boxShadow="md"
            >
              {suggestions.map((place, index) => (
                <ListItem
                  key={index}
                  p={2}
                  cursor="pointer"
                  _hover={{ bg: 'gray.100' }}
                  onClick={() => handleSelectPlace(place)}
                >
                  <Text fontSize="sm">{place.display_name}</Text>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
        <IconButton
          icon={<SearchIcon />}
          onClick={handleSearch}
          colorScheme="blue"
          aria-label="Buscar"
          width="100%"
        />
      </VStack>

      <MapContainer center={coords} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView coords={coords} />
        <Marker position={coords}>
          <Popup>{placeName || 'Ubicación seleccionada'}</Popup>
        </Marker>
      </MapContainer>
    </Box>
  );
}
