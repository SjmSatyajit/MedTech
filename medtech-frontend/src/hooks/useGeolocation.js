import { useState, useEffect } from 'react';

export function useGeolocation() {
  const [location, setLocation] = useState({ lat: 20.2961, lng: 85.8189 });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const detect = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
  };

  useEffect(() => { detect(); }, []);

  return { location, error, loading, detect };
}
