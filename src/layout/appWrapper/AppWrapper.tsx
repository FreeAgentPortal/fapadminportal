"use client";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import io from "socket.io-client";
import { useUser } from "@/state/auth";
import { useSocketStore } from "@/state/socket";
import useApiHook from "@/hooks/useApi";

type Props = {
  children: React.ReactNode;
};
const AppWrapper = (props: Props) => {
  const queryClient = useQueryClient();
  //Set up state
  const searchParams = useSearchParams();
  const token = searchParams.get("token") as string;
  const { data: loggedInData, isLoading: userIsLoading } = useUser(token);
  const { data: selectedProfile } = useApiHook({
    method: "GET",
    key: ["profile", "admin"],
    url: `/admin/profile/${loggedInData?.profileRefs["admin"]}`,
    enabled: !!loggedInData?.profileRefs["admin"],
  });
  //Set up socket connection
  const { socket, isConnecting, setSocket, setIsConnecting } = useSocketStore((state: any) => state);

  useEffect(() => {
    if (process.env.API_URL) {
      setIsConnecting(true);
      const socket = io(
        process.env.NODE_ENV === "development" ? "http://localhost:5000" : process.env.API_URL.replace("/api/v1", "")
      );
      socket.on("connect", () => {
        setIsConnecting(false);
        setSocket(socket);
      });
      return () => {
        socket.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    //If there is a user and a socket connection, setup a setup event with the user data

    if (socket && isConnecting) {
      // Listen for user updates
      socket.emit("setup", loggedInData);
      socket.on("updateUser", () => {
        queryClient.invalidateQueries(["user"] as any);
      });
    }

    // if selectedProfile is null or role is not admin, dispatch the token, logout and redirect
    // alert user that they are not authorized to access the admin portal
    if (!selectedProfile || selectedProfile?.payload?.role !== "admin") {
      alert("You are not authorized to access this portal.");
      // Dispatch logout action and redirect
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket, selectedProfile]);

  return <>{props.children}</>;
};

export default AppWrapper;
