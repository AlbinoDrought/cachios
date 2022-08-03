import axios from 'axios';
import cachios from 'cachios';

(async () => {
  const axiosInstance = axios.create({});
  const cachiosInstance = cachios.create(axiosInstance);

  const resp = await cachiosInstance.get('http://localhost');
  console.log(resp.data);
})();
