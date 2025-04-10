'use client';

import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; 

interface JwtPayload {
  id_user: string; 
}
export const Decode: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token"); 

    if (token) {
      try {
        const actualToken = token.startsWith("Bearer ") ? token.slice(7) : token;

        const decoded: JwtPayload = jwtDecode<JwtPayload>(actualToken); 

        setUserId(decoded.id_user);
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  console.log(userId)
  console.log(localStorage.getItem("token"));

  return (
    <div>
      <h1>Welcome!</h1>
      {userId ? <p>Your ID: {userId}</p> : <p>No user ID found</p>}
    </div>
  );
};
