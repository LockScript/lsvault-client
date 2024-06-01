import { isAuthenticated } from "@/lib/auth";
import axios from "axios";

const userBase = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users`;
const vaultBase = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/vault`;

export function loginUser(payload: { hashedPassword: string; email: string }) {
    return axios
        .post<{ salt: string; vault: string }>(`${userBase}/login`, payload, {
            withCredentials: true,
        })
        .then((res) => res.data)
}

/**
 * Sends a POST request to register a new user.
 * @param {Object} payload - The payload containing hashed password and email.
 * @param {string} payload.hashedPassword - The hashed password for the new user.
 * @param {string} payload.email - The email for the new user.
 * @returns {Promise<{ salt: string; vault: string }>} - A promise resolving to the response data.
 */
export function registerUser(payload: {
    hashedPassword: string;
    email: string;
}) {
    return axios
        .post<{ salt: string; vault: string }>(userBase, payload, {
            withCredentials: true,
        })
        .then((res) => res.data);
}

/**
* Sends a PUT request to save the user's vault.
* @param {Object} params - Parameters for saving the vault.
* @param {string} params.encryptedVault - The encrypted vault data to be saved.
* @returns {Promise<any>} - A promise resolving to the response data.
*/
export function saveVault({ encryptedVault }: { encryptedVault: string }) {
    return axios
        .put(vaultBase, { encryptedVault }, { withCredentials: true })
        .then((res) => res.data);
}

/**
 * Sends a PUT request to update the user's email.
 * @param {Object} payload - The payload containing the new email.
 * @param {string} payload.newEmail - The new email for the user.
 * @returns {Promise<any>} - A promise resolving to the response data.
 */
export function updateEmail(payload: { newEmail: string }) {
    return axios
        .put(`${userBase}/email`, payload, { withCredentials: true })
        .then((res) => res.data);
}

/**
 * Sends a PUT request to update the user's password.
 * @param {Object} payload - The payload containing the new password.
 * @param {string} payload.newPassword - The new password for the user.
 * @returns {Promise<any>} - A promise resolving to the response data.
 */
export function updatePassword(payload: { newPassword: string }) {
    return axios
        .put(`${userBase}/password`, payload, { withCredentials: true })
        .then((res) => res.data);
}

/**
 * Sends a POST request to upload user settings.
 * @param {string} userId - The user's ID.
 * @param {Object} settings - The user settings object.
 * @returns {Promise<any>} - A promise resolving to the response data.
 */
export function uploadUserSettings(userId: string, settings: { [key: string]: string }) {
    const requestBody = {
        userId,
        settings
    };

    return axios
        .post(`${userBase}/settings`, requestBody, { withCredentials: true })
        .then((res) => res.data);
}

export function validateUser(userId: string, password: string) {
    const requestBody = {
        userId,
        password
    }

    return axios
        .post(`${userBase}/validate`, requestBody, { withCredentials: true })
}

export async function getUserSettings(userId: string) {
    try {
        if (isAuthenticated()) {
            const response = await axios.get(`${userBase}/settings/${userId}`);
            const userSettings = response.data;
            return userSettings;
        } else {
            return { autoLock: "false"}
        }
    } catch (error) {
        console.error(`Failed to fetch user settings: ${error}`);
        throw error;
    }
}