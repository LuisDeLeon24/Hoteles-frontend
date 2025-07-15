import { useState, useEffect } from "react";
import { 
    getEvents as getEventsRequest,
    saveEvents as saveEventsRequest
} from "../../services/api";
import toast from "react-hot-toast";

export const useEvents = () => {
    const [event, setEvent] = useState([]);
    const [isFetching, setIsFetching] = useState(false);

    const getEvents = async() => {
        setIsFetching(true);

        const eventsData = await getEventsRequest();

        setIsFetching(false);

        if(eventsData.error){
            toast.error(eventsData.e?.response?.data || 'Error to get events' )
            return;
        }

        const eventsDataMsg = eventsData?.data?.hotel;

        setEvent(eventsDataMsg);
    }

    useEffect(() => {
        getEvents();
    }, [])

    const addEvents = async(newEvent) => {
        const result = await saveEventsRequest(newEvent);

        if(result?.error) {
            console.log(result);
            
            return toast.error(result.msg || 'No se pudo guardar el evento' )
        }

        toast.success('Evento guardado con exito!');

        await getEvents();
    }

    return {
        event,
        getEvents,
        addEvents,
        isFetching
    }
}