import axios from 'axios'

let token = sessionStorage.getItem("token");

let httpService = axios.create({
  headers: {
    "x-access-token": token
  }
});

export {
  httpService
}
