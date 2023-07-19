import io from 'socket.io-client';

//const baseURL = 'http://localhost:5000'
export const clientIo = io('https://ecommerce.elafglass.com',{
    transports: ["websocket", "polling"],
    withCredentials: true,
  })
// export const clientIo = io(baseURL,{
//   transports: ["websocket", "polling"],
//   withCredentials: true,
// })
