import app from './api.js';
import request from 'supertest';

async function test() {
  let res;
  
  res = await request(app).get('/districts?province=Kigali');
  console.log('GET /districts?province=Kigali:', res.body.data.length);

  res = await request(app).get('/sectors?province=Kigali');
  console.log('GET /sectors?province=Kigali:', res.body.data.length, 'sectors found.');

  res = await request(app).get('/sectors');
  console.log('GET /sectors:', res.body.data.length, 'total sectors.');

  res = await request(app).get('/villages?province=Kigali&district=Gasabo');
  console.log('GET /villages?province=Kigali&district=Gasabo:', res.body.data.length, 'villages found.');
  
  process.exit(0);
}
test();
