import axios from "./axios";

const setAuthToken = (token: string) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    // set a default header that lets the server know these requests are from the {serviceName} service
    axios.defaults.headers.common["X-Service-Name"] = "admin";
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export default setAuthToken;
