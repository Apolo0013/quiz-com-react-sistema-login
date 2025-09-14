import { createContext } from "react";
import { type typeContextGlobal } from "./types/ContextLogin";

export const InfoContext = createContext<typeContextGlobal | null>(null);