"use client";
import React, { useState } from "react";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "nprogress/nprogress.css";
import { message } from "antd";
import AntdAppWrapper from "./AntdWrapper";

function ReactQueryProvider({ children }: React.PropsWithChildren) {
  const [client] = useState(
    new QueryClient({
      queryCache: new QueryCache({
        onError: (error) => {
          console.log(error);
          message.error(error as any);
        },
      }),
    })
  );

  return (
    <QueryClientProvider client={client}>
      <AntdAppWrapper>{children}</AntdAppWrapper>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default ReactQueryProvider;
