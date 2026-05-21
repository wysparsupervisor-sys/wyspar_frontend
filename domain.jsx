const HOST = "localhost"; //makes it easier when i wanna view on my phone. Simply change host to pc ip 
const isProduction = process.env.NODE_ENV === "production";

export const FRONTEND_URL = isProduction ? "https://www.wyspar.com" : `http://${HOST}:3000`;
export const BACKEND_URL = isProduction ? "https://api.wyspar.com" : `http://${HOST}:5000`;
export const MEDIA_GET_URL = isProduction ? "https://cdn.wyspar.com" : `http://${HOST}:8333/media`;