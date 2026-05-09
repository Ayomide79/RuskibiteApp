// context/ReservationContext.js
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReservationContext = createContext();

const RESERVATIONS_KEY = '@ruskibites_reservations';

export const ReservationProvider = ({ children }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = useCallback(async () => {
    try {
      const json = await AsyncStorage.getItem(RESERVATIONS_KEY);
      if (json) {
        const parsed = JSON.parse(json);
        setReservations(parsed);
      } else {
        setReservations([]);
      }
    } catch (e) {
      console.error('Error loading reservations:', e);
      setReservations([]);
    }
    setLoading(false);
  }, []);

  const saveReservations = async (newReservations) => {
    setReservations(newReservations);
    try {
      await AsyncStorage.setItem(RESERVATIONS_KEY, JSON.stringify(newReservations));
    } catch (e) {
      console.error('Error saving reservations:', e);
    }
  };

  const addReservation = async (reservationData) => {
    const newReservation = {
      id: Date.now().toString(),
      ...reservationData,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    
    const updated = [newReservation, ...reservations];
    await saveReservations(updated);
    return newReservation;
  };

  const cancelReservation = async (reservationId) => {
    const updated = reservations.map(r => 
      r.id === reservationId ? { ...r, status: 'cancelled' } : r
    );
    await saveReservations(updated);
  };

  const deleteReservation = async (reservationId) => {
    const updated = reservations.filter(r => r.id !== reservationId);
    await saveReservations(updated);
  };

  // Fixed date comparison - compare dates without time
  const getUpcomingReservations = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return reservations.filter(r => {
      if (r.status !== 'confirmed') return false;
      const resDate = new Date(r.date);
      resDate.setHours(0, 0, 0, 0);
      return resDate >= today;
    });
  }, [reservations]);

  const getPastReservations = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return reservations.filter(r => {
      const resDate = new Date(r.date);
      resDate.setHours(0, 0, 0, 0);
      return r.status === 'completed' || resDate < today;
    });
  }, [reservations]);

  if (loading) return null;

  return (
    <ReservationContext.Provider value={{
      reservations,
      reservationsCount: reservations.length,
      addReservation,
      cancelReservation,
      deleteReservation,
      getUpcomingReservations,
      getPastReservations,
      loadReservations, // Exposed for manual refresh
    }}>
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservations = () => useContext(ReservationContext);