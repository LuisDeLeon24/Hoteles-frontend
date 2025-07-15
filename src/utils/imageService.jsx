import axios from 'axios';

const PEXELS_API_KEY = 'n09YFD0T52J4Tsk8yUPxieVo5HXNmHTmYQqQ1rW4uQAvNxET5gH2GtBQ';
const PEXELS_API_URL = 'https://api.pexels.com/v1/search';

export const fetchHotelImage = async (eventId) => {
  try {
    const response = await axios.get(PEXELS_API_URL, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
      params: {
        query: 'gala',
        per_page: 50,
      },
    });

    const images = response.data.photos;
    if (images.length === 0) return null;

    // Utiliza el hash del ID del evento para seleccionar una imagen específica
    const index = hashCode(eventId) % images.length;
    return images[index].src.large;
  } catch (error) {
    console.error('Error al obtener la imagen:', error);
    return null;
  }
};

// Función para generar un hash a partir del ID del evento
const hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};
