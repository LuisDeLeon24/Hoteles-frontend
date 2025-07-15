import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getRooms as getRoomsRequest } from "../../services";

export const useRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [isFetching, setIsFetching] = useState(false);

    const getRooms = async () => {
        setIsFetching(true);
        const roomData = await getRoomsRequest();
        setIsFetching(false);

        if (roomData?.error) {
            console.error('Error al obtener clientes: ', roomData);
            return
        }

        setRooms(roomData?.data.rooms)

    }

    useEffect(() => {
        getRooms();
    }, [])


    return {
        rooms,
        getRooms,
        isFetching
    }
}

