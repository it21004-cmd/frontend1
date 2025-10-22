// environment.js
const config = {
  development: {
    API_URL: 'http://localhost:5000',
  },
  production: {
    API_URL: 'https://backend1-4sym.onrender.com',
  }
};

export default config[process.env.NODE_ENV || 'development'];