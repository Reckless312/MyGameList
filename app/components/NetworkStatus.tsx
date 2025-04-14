'use client'

import {useEffect } from 'react';
import {useStatus} from "@/app/components/ApplicationStatusContext";

export default function NetworkStatus() {
    const {isServerUp, isNetworkUp, ChangeNetworkStatus, ChangeServerStatus} = useStatus() || {};
    useEffect(() => {
        const checkNetworkStatus = async () => {
            try {
                await fetch('https://api.ipify.org?format=json', {
                    method: 'GET',
                    cache: 'no-store',
                    mode: 'no-cors'
                });
                ChangeNetworkStatus?.(true);
            } catch (error) {
                ChangeNetworkStatus?.(false);
            }
        };

        const checkServerStatus = async () =>{
            try {
                await fetch('http://localhost:8080/api/games')
                ChangeServerStatus?.(true);
            } catch (e) {
                ChangeServerStatus?.(false);
            }
        }

        const networkInterval = setInterval(checkNetworkStatus, 5000);
        const serverInterval = setInterval(checkServerStatus, 5000);

        return () => {
            clearInterval(networkInterval);
            clearInterval(serverInterval);
        }
    }, []);

    if (!isServerUp) {
        return <div className="component-down">Server down!</div>;
    }

    if (!isNetworkUp) {
        return <div className="component-down">Network down!</div>;
    }
    return null;
}