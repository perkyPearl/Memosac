import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
export { UserContext };