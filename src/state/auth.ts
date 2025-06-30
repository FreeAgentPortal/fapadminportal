import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "@/utils/axios";
import setAuthToken from "@/utils/setAuthToken";
import User from "@/types/User";

// make a react query hook to get the user data from the server
const fetchUserData = async (token?: string) => {
  const { data } = await axios.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.payload;
};

const updateUser = async (data: any) => {
  const { data: userData } = await axios.put("/agent", data);
  return userData;
};

export const useUser = (token?: string, onSuccess?: () => void, onError?: () => void): UseQueryResult<User, Error> => {
  if (typeof window !== "undefined" && !token) {
    token = localStorage.getItem("token") as string;
  }

  const query = useQuery({
    queryKey: ["user"],
    queryFn: () => fetchUserData(token),
    staleTime: Infinity,
    meta: {
      errorMessage: "An error occurred while fetching user data",
    },
    // cacheTime: Infinity,
    enabled: !!token,
  });
  if (query.isError) {
    localStorage.removeItem("token");
    if (onError) onError();
  }
  // save user and token in local storage
  if (query.data && token) {
    localStorage.setItem("token", token);
    setAuthToken(token);
  }

  return query;
};

export const logout = (redirect?: boolean) => {
  localStorage.removeItem("token");
  if (redirect) {
    window.location.href = `${process.env.AUTH_URL}?logout=true&redirect=http://${window.location.hostname}:${window.location.port}`;
  } else {
    window.location.href = `${process.env.AUTH_URL}?logout=true`;
  }
};
