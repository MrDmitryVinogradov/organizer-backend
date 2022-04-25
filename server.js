const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const cors = require('@koa/cors');
const serve = require('koa-static');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const mount = require('koa-mount');

const app = new Koa();
const upload = multer({ dest: './public',
});

const messages = [
  {
    timestamp: 1650368364392,
    value: '1',
    id: 'l262pnxl',
    isFavorite: true
  },
  {
    timestamp: 1650368377283,
    value: "2",
    id: 'l262pxvn',
    isFavorite: true,
    position: { latitude: 55.6927823, longtitude: 37.6586602 }
  },
  {
    timestamp: 1650368402266,
    value: '3',
    id: 'l262qh5m',
    isFavorite: false,
    position: { latitude: 55.6927819, longtitude: 37.6586549 }
  },
  {
    timestamp: 1650368416928,
    value: '4',
    id: 'l262qsgw',
    isFavorite: false,
    position: { latitude: 55.6927819, longtitude: 37.6586549 }
  },
  {
    timestamp: 1650368428786,
    value: '5',
    id: 'l262r1mb',
    isFavorite: false,
    position: null
  },
  {
    timestamp: 1650368940678,
    value: '6',
    id: 'l26320li',
    isFavorite: true,
    position: null
  },
  {
    timestamp: 1650368949578,
    value: '7',
    id: 'l26327gq',
    isFavorite: false,
    position: { latitude: 55.692784, longtitude: 37.6586581 }
  },
  {
    timestamp: 1650368958072,
    value: '8',
    id: 'l2632e0o',
    isFavorite: false,
    position: { latitude: 55.692784, longtitude: 37.6586581 }
  },
];

app.use(koaBody({
  urlencoded: true,
  multipart: true,
  json: true,
  formidable: { uploadDir: './public' },
}));

app.use(
  cors({
    origin: '*',
    credentials: true,
    'Access-Control-Allow-Origin': true,
    allowMethods: ['GET', 'POST', 'DELETE', 'PUT', 'DELETE'],
  }));

app.use(serve('./public'));

const router = new Router();

router.get('/all', async (ctx) => {
  ctx.response.body = messages;
  ctx.response.status = 200;
})

router.post('/new', async (ctx) => {
  messages.push(JSON.parse(ctx.request.body));
  ctx.response.body = 'ok';
  ctx.response.status = 200;
});

router.post('/addtofavs', async (ctx) => {
  const index = messages.findIndex(element => element.id == JSON.parse(ctx.request.body).id);
  messages[index].isFavorite = JSON.parse(ctx.request.body).isFavorite;
  console.log(messages[index]);
  ctx.response.status = 200;
  ctx.response.body = 'ok';
});

router.post('/upload', async (ctx) => {
  const file = ctx.request.files;
  messages.forEach((message) => {
    if (message.id === file.value.name) {
      message.path = file.value.path.replace('public/', '');
      console.log(message);
    }
  });
  ctx.response.status = 200;
  ctx.response.body = 'ok';
});
  
app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback())
console.log('server started');
server.listen(port);
