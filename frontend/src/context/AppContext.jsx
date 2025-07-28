/**
 * Contexto de la aplicación que proporciona estados y funciones globales.
 */
import { createContext, useEffect, useState } from "react";
import { AppConstants } from "../util/constants";
import { toast } from 'react-toastify';
import axios from 'axios';

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    axios.defaults.withCredentials = true;

    const backendURL = AppConstants.BACKEND_URL;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(false);

    /**
     * Obtiene los datos del usuario desde el backend.
     */
    const getUserData = async () => {
        try {
            const response = await axios.get(`${backendURL}/profile`);
            if (response.status === 200) {
                setUserData(response.data);
            } else {
                toast.error("Unable to retrieve the profile.")
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    /**
     * Verifica el estado de autenticación del usuario contra el backend.
     */
    const getAuthState = async () => {
        try {
            const response = await axios.get(`${backendURL}/is-authenticated`);
            if (response.status === 200 & response.data === true) {
                setIsLoggedIn(true);
                await getUserData();
            } else {
                setIsLoggedIn(false);
            }
        } catch (error) {
            if (error.response) {
                const msg = error.response.data?.message || "Authentication check failed";
                toast.error(msg);
            } else {
                toast.error(error.message);
            }
            setIsLoggedIn(false);
        }
    }

    useEffect(() => {
        getAuthState();
    }, []);

    const contextValue = {
        backendURL,
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        getUserData
    };

    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    )
}