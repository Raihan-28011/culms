import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:5170/api/",
  // timeout: 3000,
});
