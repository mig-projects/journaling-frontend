import React, { useContext, useEffect } from 'react';
import { Auth } from '@supabase/ui';
import { AuthContext } from '../../contexts/AuthContext';
import { createClient } from '@supabase/supabase-js';

const supabaseURL = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export default function Login() {
    const { session, supabase } = useContext(AuthContext);
    const [authSession, setAuthSession] = session;
    const [supaClient, setSupaClient] = supabase;


    useEffect(() => {
        if (!supaClient) {
            setSupaClient(createClient(supabaseURL, supabaseKey)
            )
        }
        else {
            supaClient.auth.getSession().then(({ data: { authSession } }) => {
                setAuthSession(authSession);
            });

            const { data: { subscription }, } = supaClient.auth.onAuthStateChange((_event, session) => {
                setAuthSession(authSession);
            })

            return () => subscription.unsubscribe()
        }
    }, [authSession, setAuthSession, setSupaClient, supaClient]);
    if (!supaClient) {
        return (<div>Connecting...</div>)
    } else {
        if (!session) {
            return <Auth supabaseClient={supaClient} />;
        } else {
            return <div>Logged in!</div>;
        }
    }
}