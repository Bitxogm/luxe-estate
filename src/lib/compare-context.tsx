"use client";

import React, { createContext, useContext, useReducer, useEffect, useState } from "react";
import type { Property } from "@prisma/client";
import { notify } from "@/lib/toast";

interface CompareState {
  properties: Property[];
}

type CompareAction =
  | { type: "INIT"; payload: Property[] }
  | { type: "ADD_PROPERTY"; payload: Property }
  | { type: "REMOVE_PROPERTY"; payload: string }
  | { type: "CLEAR_ALL" };

function compareReducer(state: CompareState, action: CompareAction): CompareState {
  switch (action.type) {
    case "INIT":
      return { properties: action.payload };
    case "ADD_PROPERTY":
      if (state.properties.some((p) => p.id === action.payload.id)) {
        return state;
      }
      if (state.properties.length >= 3) {
        return state;
      }
      const added = [...state.properties, action.payload];
      localStorage.setItem("luxe_compare", JSON.stringify(added));
      return { properties: added };
    case "REMOVE_PROPERTY":
      const removed = state.properties.filter((p) => p.id !== action.payload);
      localStorage.setItem("luxe_compare", JSON.stringify(removed));
      return { properties: removed };
    case "CLEAR_ALL":
      localStorage.removeItem("luxe_compare");
      return { properties: [] };
    default:
      return state;
  }
}

interface CompareContextType {
  properties: Property[];
  addProperty: (property: Property) => void;
  removeProperty: (id: string) => void;
  clearAll: () => void;
  isSelected: (id: string) => boolean;
  isInitialized: boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(compareReducer, { properties: [] });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("luxe_compare");
      if (stored) {
        dispatch({ type: "INIT", payload: JSON.parse(stored) });
      }
    } catch (e) {
      console.error("Error loading comparison state:", e);
    }
    setIsInitialized(true);
  }, []);

  function addProperty(property: Property) {
    if (state.properties.some((p) => p.id === property.id)) {
      return;
    }
    if (state.properties.length >= 3) {
      notify.error("Max 3 properties");
      return;
    }
    dispatch({ type: "ADD_PROPERTY", payload: property });
  }

  function removeProperty(id: string) {
    dispatch({ type: "REMOVE_PROPERTY", payload: id });
  }

  function clearAll() {
    dispatch({ type: "CLEAR_ALL" });
  }

  function isSelected(id: string) {
    return state.properties.some((p) => p.id === id);
  }

  return (
    <CompareContext.Provider
      value={{
        properties: state.properties,
        addProperty,
        removeProperty,
        clearAll,
        isSelected,
        isInitialized,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
