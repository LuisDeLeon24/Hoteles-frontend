import { useState, useEffect } from "react";
import { getHotels as getHotelsRequest } from "../../services/api";
import toast from "react-hot-toast";

export const useHotels = () => {
    const [hotels, setHotels] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState(null);

    const fetchHotels = async () => {
        setIsFetching(true);
        setError(null);

        try {
            const hotelsData = await getHotelsRequest();

            if (hotelsData.error) {
                const errorMessage = hotelsData.e?.response?.data.message || 'Error al obtener hoteles';
                toast.error(errorMessage);
                setError(errorMessage);
            } else if (hotelsData?.data?.hotels) {
                setHotels(hotelsData.data.hotels);
            } else {
                const unexpectedError = 'La respuesta de la API no contiene el array de hoteles esperado.';
                toast.error(unexpectedError);
                setError(unexpectedError);
            }
        } catch (e) {
            const networkError = e.message || 'Error de red al conectar con la API.';
            toast.error(networkError);
            setError(networkError);
            console.error("Error en useHotels:", e);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchHotels();
    }, []);

    return {
        hotels,
        fetchHotels,
        isFetching,
        error
    };
};
