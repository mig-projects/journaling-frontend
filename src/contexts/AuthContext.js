import React, { useState, createContext } from 'react';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [supabase, setSupabase] = useState(null);


    return (
        <AuthContext.Provider value={{ session: [session, setSession], supabase: [supabase, setSupabase] }}>
            {children}
        </AuthContext.Provider>
    );
}
