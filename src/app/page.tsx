'use client'

import React from "react";
import { LandingPage } from "./components/siswa/landingPage";
import { LandingAdmin } from "./components/admin/landingAdmin";

export default function Home() {

  const user = localStorage.getItem("user");

  if (user) {
    const userRole = JSON.parse(user).role;
    console.log(userRole);
    if (userRole === "siswa") {
      return (
        <LandingPage />
      )
    } else if (userRole === "admin_stan") {
      return (
        <LandingAdmin />
      )
    }
  }

  return (
    <div>
      
    </div>
  );
}
