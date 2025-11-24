import React from "react";
import styled from "styled-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const queryClient = new QueryClient();

const apolloClient = new ApolloClient({
  uri:  ,
  cache: new InMemoryCache(),
});

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

function App() {
  const columnDefs = [{ field: "make" }, { field: "model" }, { field: "price" }];
  const rowData = [
    { make: "Toyota", model: "Celica", price: 35000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
  ];
  return (
    <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={queryClient}>
        <Wrapper className="bg-gray-100">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">
            React 초기 세팅
          </h1>

          <Button variant="contained" className="mb-4">
            MUI
          </Button>

          <div className="ag-theme-alpine w-1/2 h-48">
            <AgGridReact rowData={rowData} columnDefs={columnDefs} />
          </div>
        </Wrapper>
      </QueryClientProvider>
    </ApolloProvider>
  );
}
export default App;
