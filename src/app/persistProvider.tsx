"use client";

import { ReactNode } from "react";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import store, { persistor } from "@/redux/store"; 

export default function PersistProvider({ children }: { children: ReactNode }) {
  console.log("Persistor: ", persistor); 
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
