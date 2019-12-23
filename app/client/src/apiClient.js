import axios from 'axios';

const BASE_URI = 'http://localhost:5000';

const client = axios.create({
 baseURL: BASE_URI,
 json: true
});

class APIClient {
 constructor() {
 }

 createBarcode(barcode) {
   return this.perform('post', '/api/barcodes', barcode);
 }

 deleteBarcode(barcode) {
   return this.perform('delete', '/api/barcode/${barcode.id}');
 }

 getBarcodes() {
   return this.perform('get', '/api/barcodes');
 }

 async perform (method, resource, data) {
   return client({
     method,
     url: resource,
     data,
   }).then(resp => {
     return resp.data ? resp.data : [];
   });
 }
}

export default APIClient;