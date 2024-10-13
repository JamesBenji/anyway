// for global state
"use client";
import { useUser } from "@clerk/nextjs";
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface iSocketContext {}

export const SocketContext = createContext<iSocketContext | null>(null);

export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);

  //   isSocketConnected methods
  const onConnect = () => setIsSocketConnected(true);
  const onDisconnect = () => setIsSocketConnected(false);

  console.log({isSocketConnected});
  

  // initializing a socket (from the client-side)
  useEffect(() => {
    /* new socket is created whenever the user changes */
    const newSocket = io();
    // ^ since next-js and socket.io are using the same server, no url need be passed
    setSocket(newSocket);

    // clean-up function; disconnect socket from new socket
    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (socket === null) return;

    if (socket.connected) {
      onConnect();
    }

    // event listeners
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    // unsubscribing from the listeners
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [socket]);

  return <SocketContext.Provider value={{}}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (context === null) {
    throw new Error(
      "useSocket must be used within the SocketContextProvider. This usage is violating the requirement. Move this code to any components wrapped by the SocketContextProvider"
    );
  }

  return context;
};
