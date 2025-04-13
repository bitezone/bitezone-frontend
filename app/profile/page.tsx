"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  [key: string]: unknown;
}

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      setError("Access token not found. Please log in.");
      setLoading(false);
      return;
    }
    console.log("Acess token is " + accessToken)
    axios.get<User>('http://localhost:8000/api/auth/user/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => {
      setUser(response.data);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Failed to fetch user:", error);
    //   setError("Failed to load profile.");
    //   setLoading(false);
      
      // If token expired, try using refresh token
    //   const refreshToken = localStorage.getItem('refreshToken');
    //   if (refreshToken) {
    //     handleTokenRefresh(refreshToken);
    //   }
    });
  }, []);

  const handleTokenRefresh = (refreshToken: string) => {
    axios.post('http://localhost:8000/api/auth/token/refresh/', {
      refresh: refreshToken
    })
    .then(response => {
      // Save the new access token
      localStorage.setItem('accessToken', response.data.access);
      
      // Try the request again with the new token
      const newAccessToken = response.data.access;
      axios.get<User>('http://localhost:8000/api/auth/user/', {
        headers: {
          Authorization: `Bearer ${newAccessToken}`,
        },
      })
      .then((response) => {
        setUser(response.data);
        setLoading(false);
        setError(null);
      })
      .catch(error => {
        console.error("Failed to fetch user after token refresh:", error);
        setError("Session expired. Please log in again.");
      });
    })
    .catch(error => {
      console.error("Failed to refresh token:", error);
      setError("Session expired. Please log in again.");
      // Clear stored tokens as they are invalid
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    });
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>User Profile</h1>
      {user && (
        <ul>
          <li><strong>Username:</strong> {user.username}</li>
          <li><strong>Email:</strong> {user.email}</li>
          {user.first_name && <li><strong>First Name:</strong> {user.first_name}</li>}
          {user.last_name && <li><strong>Last Name:</strong> {user.last_name}</li>}
          {user.id && <li><strong>User ID:</strong> {user.id}</li>}
          {/* Display any other user properties you need */}
        </ul>
      )}
    </div>
  );
};

export default ProfilePage;