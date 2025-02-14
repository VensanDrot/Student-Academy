import React from "react";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Routes from "./routes";
import { ThemeProvider } from "@gravity-ui/uikit";

const App = () => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Routes />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
