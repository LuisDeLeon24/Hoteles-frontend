import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
    getIncome,
    getUserCount,
    getRoomCount,
    getTodayR,
    getmonthlyIncome,
    getmonthlyStats,
    getTreemap
} from "../../services";

export const useStats = () => {
    // Estados existentes
    const [todayR, setTodayR] = useState(0);
    const [isTodayRFetching, setIsTodayRFetching] = useState(false);
    const [roomCount, setRoomCount] = useState(0);
    const [isRoomFetching, setIsRoomFetching] = useState(false);
    const [income, setIncome] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [isFetching, setIsFetching] = useState(false);
    const [monthlyReservations, setMonthlyReservations] = useState([]);
    const [monthlyIncome, setMonthlyIncome] = useState([]);

    // Estado para treemap
    const [eventsTreemap, setEventsTreemap] = useState(null);
    const [isTreemapFetching, setIsTreemapFetching] = useState(false);

    // Función para obtener datos del treemap
    const fetchTreemap = async () => {
        setIsTreemapFetching(true);
        const response = await getTreemap();
        setIsTreemapFetching(false);

        if (response?.error) {
            console.error('Error al obtener datos del treemap:', response);
            toast.error(response.msg || 'Error al obtener datos del treemap');
            return;
        }

        if (response?.data) {
            setEventsTreemap(response.data);
        }
    };

    const fetchRoomCount = async () => {
        setIsRoomFetching(true);
        const response = await getRoomCount();
        setIsRoomFetching(false);

        if (response?.error) {
            console.error('Error al obtener cantidad de habitaciones:', response);
            toast.error(response.msg || 'Error al obtener cantidad de habitaciones');
            return;
        }

        setRoomCount(response.data.availableRooms);
    };

    const fetchToday = async () => {
        setIsTodayRFetching(true);
        const response = await getTodayR();
        setIsTodayRFetching(false);

        if (response?.error) {
            console.error('Error al obtener la cantidad de reservas:', response);
            toast.error(response.msg || 'Error al obtener cantidad de reservas');
            return;
        }

        setTodayR(response.data.reservationsThisMonth);
    };

    const fetchIncome = async () => {
        setIsFetching(true);
        const response = await getIncome();
        setIsFetching(false);

        if (response?.error) {
            console.error('Error al obtener ingresos:', response);
            toast.error(response.msg || 'Error al obtener ingresos');
            return;
        }

        setIncome(response.data.totalIncome);
    };

    const fetchUserCount = async () => {
        const response = await getUserCount();

        if (response?.error) {
            console.error('Error al obtener cantidad de usuarios:', response);
            toast.error(response.msg || 'Error al obtener cantidad de usuarios');
            return;
        }

        setUserCount(response.data.totalUsers);
    };

    const fetchMonthlyStats = async () => {
        const response = await getmonthlyStats();
        if (response?.error) {
            console.error('Error al obtener estadísticas mensuales de reservas:', response);
            toast.error(response.msg || 'Error al obtener estadísticas mensuales');
            return;
        }

        setMonthlyReservations(response.data.reservationsPerMonth);
    };

    const fetchMonthlyIncome = async () => {
        const response = await getmonthlyIncome();
        if (response?.error) {
            console.error('Error al obtener estadísticas mensuales de ingresos:', response);
            toast.error(response.msg || 'Error al obtener estadísticas de ingresos');
            return;
        }

        setMonthlyIncome(response.data.incomePerMonth);
    };

    // Cargar todo al montar
    useEffect(() => {
        fetchToday();
        fetchRoomCount();
        fetchIncome();
        fetchUserCount();
        fetchMonthlyStats();
        fetchMonthlyIncome();
        fetchTreemap(); // Cargar datos del treemap
    }, []);

    return {
        todayR,
        roomCount,
        income,
        userCount,
        monthlyReservations,
        monthlyIncome,
        eventsTreemap,
        isTreemapFetching,
        isFetching,
        refetchIncome: fetchIncome,
        refetchUserCount: fetchUserCount,
        refetchTreemap: fetchTreemap
    };
};
