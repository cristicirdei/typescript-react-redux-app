require('dotenv').config();
const axios = require('axios');
const API_KEY = process.env.REACT_APP_API_FOOTBALL_KEY;
console.log('key', API_KEY);

const client = axios.create({ baseURL: 'https://v3.football.api-sports.io', headers: { 'x-apisports-key': API_KEY } });

client.get('/teams', { params: { league: 39, season: 2023 } })
  .then(res => { console.log('status', res.status, 'count', res.data.response.length); console.log(res.data.response[0]); })
  .catch(err => { console.error('error', err.response ? err.response.data : err.message); });
