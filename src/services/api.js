import axios from 'axios';

const API_BASE_URL = 'https://api.virtualcareerfair.com'; // Replace with your actual API base URL

// Function to fetch all career fairs
export const fetchCareerFairs = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/career-fairs`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching career fairs: ' + error.message);
    }
};

// Function to fetch a specific career fair by ID
export const fetchCareerFairById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/career-fairs/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching career fair: ' + error.message);
    }
};

// Function to register for a career fair
export const registerForCareerFair = async (fairId, userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/career-fairs/${fairId}/register`, userData);
        return response.data;
    } catch (error) {
        throw new Error('Error registering for career fair: ' + error.message);
    }
};

// Function to fetch user profile
export const fetchUserProfile = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching user profile: ' + error.message);
    }
};

// Function to update user profile
export const updateUserProfile = async (userId, profileData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/users/${userId}`, profileData);
        return response.data;
    } catch (error) {
        throw new Error('Error updating user profile: ' + error.message);
    }
};