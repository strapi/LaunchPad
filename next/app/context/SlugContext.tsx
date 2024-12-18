"use client";

import React, { createContext, useContext, useReducer } from "react";

type State = {
  localizedSlugs: Record<string, string>;
};

type Action = {
  type: "SET_SLUGS";
  payload: Record<string, string>;
};

const SlugContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

const slugReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_SLUGS":
      return { ...state, localizedSlugs: action.payload };
    default:
      return state;
  }
};

export const SlugProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(slugReducer, { localizedSlugs: {} });

  return (
    <SlugContext.Provider value={{ state, dispatch }}>
      {children}
    </SlugContext.Provider>
  );
};

export const useSlugContext = () => {
  const context = useContext(SlugContext);
  if (!context) {
    throw new Error("useSlugContext must be used within a SlugProvider");
  }
  return context;
};
