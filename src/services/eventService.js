import api from './api';

export const getEvents = async () => {
    try {
        const response = await api.get('/events');
        return response.data;
    } catch (error) {
        throw new Error('Error fetching events: ' + error.message);
    }
};

export const createEvent = async (eventData) => {
    try {
        const response = await api.post('/events', eventData);
        return response.data;
    } catch (error) {
        throw new Error('Error creating event: ' + error.message);
    }
};

export const updateEvent = async (eventId, eventData) => {
    try {
        const response = await api.put(`/events/${eventId}`, eventData);
        return response.data;
    } catch (error) {
        throw new Error('Error updating event: ' + error.message);
    }
};

export const deleteEvent = async (eventId) => {
    try {
        await api.delete(`/events/${eventId}`);
    } catch (error) {
        throw new Error('Error deleting event: ' + error.message);
    }
};