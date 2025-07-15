import { useState, useEffect } from 'react';
import { getReservation, saveReservation, updateReservation, deleteReservation } from '../../services';

const useReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchReservations = async () => {
        setLoading(true);
        try {
            const response = await getReservation();
            setReservations(response.data.reservations);
        } catch (err) {
            setError(err.response?.data?.msg || 'Error loading reservations');
        } finally {
            setLoading(false);
        }
    };

    const createReservation = async (data) => {
        try {
            const response = await saveReservation(data);
            setReservations([...reservations, response.data.reservation]);
        } catch (err) {
            setError(err.response?.data?.msg || 'Error creating reservation');
        }
    };

    const editReservation = async (id, data) => {
        try {
            const response = await updateReservation(id, data);
            setReservations(reservations.map(res => res._id === id ? response.data.reservation : res));
        } catch (err) {
            setError(err.response?.data?.msg || 'Error updating reservation');
        }
    };

    const removeReservation = async (id) => {
        try {
            await deleteReservation(id);
            setReservations(reservations.filter(res => res._id !== id));
        } catch (err) {
            setError(err.response?.data?.msg || 'Error deleting reservation');
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    return { reservations, loading, error, createReservation, editReservation, removeReservation };
};

export default useReservations;
