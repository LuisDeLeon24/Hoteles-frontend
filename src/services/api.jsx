import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://hoteles-backend-xla7.onrender.com/HotelManagement/v1',
    timeout: 5000
});

apiClient.interceptors.request.use(

    (config) => {
        const useUserDetails = localStorage.getItem('user');

        if (useUserDetails) {
            const token = JSON.parse(useUserDetails).token
            config.headers['x-token'] = token;
            config.headers['x-token'] = token;
        }

        return config;
    },
    response => response,
    error => {
        if (error.response?.status === 401) {
            window.dispatchEvent(new Event('token-expired'));
        }
        return Promise.reject(error);
    }
)

export const login = async (data) => {
    try {
        return await apiClient.post('/auth/login', data)
    } catch (e) {
        const msg = e.response?.data?.msg || 'Error desconocido';
        return {
            error: true,
            msg,
            e,
        };
    }
}

export const register = async (data) => {
    try {
        const res = await apiClient.post('/auth/register', data);

        return {
            success: true,
            status: res.status,
            data: res.data
        };
    } catch (e) {
        const msg = e.response?.data?.msg || 'Uknow error'
        return {
            error: true,
            msg,
            e
        }
    }
}

export const getHotels = async() => {
    try {
        return await apiClient.get('/hotel')
    } catch (e) {
        const msg = e.response?.data?.msg || 'Unknow error'
        return {
            error: true,
            msg,
            e
        }
    }
}

export const getEvents = async() => {
    try {
        return await apiClient.get('/event/getEvent')
    } catch (e) {
        const msg = e.response?.data?.msg || 'Unknow error'
        return {
            error: true,
            msg,
            e
        }
    }
}

export const saveEvents = async(data) => {
    try {
        return await apiClient.post('/event/', data)
    } catch (e) {
        const msg = e.reponse?.data?.msg || e.response?.error
        return {
            error: true,
            msg,
            e
        }
    }
}

export const getReservation = async () => {
    try {
        return await apiClient.get('/reservation')
    } catch (e) {
        const msg = e.response?.data?.msg || 'Error desconocido';
        return {
            error: true,
            msg,
            e,
        };
    }

}

export const saveReservation = async (data) => {
    try {
        return await apiClient.post('/reservation', data)
    } catch (e) {
        const msg = e.response?.data?.msg || 'Error desconocido';
        return {
            error: true,
            msg,
            e,
        };
    }
}

export const updateReservation = async (id, data) => {
    try {
        return await apiClient.put(`/reservation/${id}`, data)
    } catch (e) {
        const msg = e.response?.data?.msg || 'Error desconocido';
        return {
            error: true,
            msg,
            e,
        };
    }
}

export const deleteReservation = async (id, body) => {
    try {
        return await apiClient.delete(`/reservation/${id}`, { data: body });
    } catch (e) {
        const msg = e.response?.data?.msg || 'Error desconocido';
        return {
            error: true,
            msg,
            e,
        };
    }
};

// src/services/api.js - Función getHotelById (la versión ideal)
export const getHotelById = async (id) => {
    try {
        const res = await apiClient.get(`/hotel/${id}`);
        // Esto espera que tu backend devuelva { success: true, hotel: {...} }
        return { success: true, hotel: res.data.hotel }; 
    } catch (e) {
        const msg = e.response?.data?.msg || 'Error desconocido al obtener el hotel';
        return {
            success: false,
            error: true,
            msg,
            e
        };
    }
};

export const getRooms = async() => {
    try {
        return await apiClient.get('/room/getRooms')
    } catch (e) {
        const msg = e.response?.data?.msg || 'Unknow error';
        return {
            success: false,
            error: true,
            msg,
            e
        }
    }
}

export const getIncome = async() => {
    try {
        return await apiClient.get('/invoice/income')
    } catch (e) {
        const msg = e.response?.data?.msg || 'Error with income';
        return {
            error: true,
            msg,
            e
        }
    }
}

export const getUserCount = async() => {
    try {
        return await apiClient.get('/user/usercount')
    } catch (e) {
        const msg = e.response?.data?.msg || 'Error with user count';
        return {
            error: true,
            msg,
            e
        }
    }
}

export const getRoomCount = async () => {
    try {
        return await apiClient.get('/room/getRoomsA')
    } catch (e) {
        const msg = e.response?.data?.msg || 'Error with Rooms count';
        return {
            error: true,
            msg,
            e
        }
    }
}

export const getTodayR = async () => {
    try {
        return await apiClient.get('/reservation/today')
    } catch (e) {
        const msg = e.response?.data?.msg || 'Error with todays reservations';
        return {
            error: true,
            msg,
            e
        }
    }
}

export const getmonthlyIncome = async () => {
    try {
        return await apiClient.get('/invoice/moonthlyincome')
    } catch (e) {
        const msg = e.response?.data?.msg || 'Error with montly income';
        return {
            error: true,
            msg,
            e
        }
    }
}

export const getmonthlyStats = async () => {
    try {
        return await apiClient.get('/reservation/Stats')
    } catch (e) {
        const msg = e.response?.data?.msg || 'Error with montly stats';
        return {
            error: true,
            msg,
            e
        }
    }
}

export const getTreemap = async () => {
    try {
        return await apiClient.get('/event/getEventsTreemap')
    } catch (e) {
        const msg = e.response?.data?.msg || 'Error the treemap data';
        return {
            error: true,
            msg,
            e
        }
    }
}