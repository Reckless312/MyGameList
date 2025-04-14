'use client'

import React, {createContext, useState, useContext, ReactNode} from "react";

type ApplicationStatusType = {
    isNetworkUp : boolean;
    isServerUp : boolean;
    ChangeNetworkStatus : (newStatus: boolean) => void;
    ChangeServerStatus : (newStatus: boolean) => void;
}

const ApplicationContext = createContext<ApplicationStatusType | undefined>(undefined);

export function ApplicationStatusProvider({children}: {children: ReactNode}) {
    const [isNetworkUp, setIsNetworkUp] = useState(true);
    const [isServerUp, setIsServerUp] = useState(true);

    const ChangeNetworkStatus = (newStatus: boolean) => {setIsNetworkUp(newStatus)}
    const ChangeServerStatus = (newStatus: boolean) => {setIsServerUp(newStatus)}

    return (
        <ApplicationContext.Provider value={{isNetworkUp, isServerUp, ChangeNetworkStatus, ChangeServerStatus}}>
            {children}
        </ApplicationContext.Provider>
    );
}

export function useStatus() {
    const context = useContext(ApplicationContext);
    if (!context) {
        console.error("useStatus must be used within a ApplicationProvider");
    }
    return context;
}