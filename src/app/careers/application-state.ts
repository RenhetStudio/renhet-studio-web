export type ApplicationState = {
  status: "idle" | "success" | "error";
  message: string;
  errors?: Record<string, string[]>;
};

export const initialApplicationState: ApplicationState = {
  status: "idle",
  message: "",
};
