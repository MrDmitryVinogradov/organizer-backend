const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const cors = require('@koa/cors');
const path = require('path');
const multer = require('multer');
const app = new Koa();


const notes = [
  {
    id: 'l262pnxl',
    content: 'Elit velit eiusmod qui cillum est'
  }
];

app.use(koaBody({
  urlencoded: true,
  multipart: true,
  json: true,
}));

app.use(
  cors({
    origin: '*',
    credentials: true,
    'Access-Control-Allow-Origin': true,
    allowMethods: ['GET', 'POST', 'DELETE', 'PUT', 'DELETE'],
  }));

const router = new Router();

router.get('/notes', async (ctx) => {
  ctx.response.body = notes;
  ctx.response.status = 200;
})

router.post('/notes', async (ctx) => {
  notes.push(JSON.parse(ctx.request.body));
  ctx.response.body = 'ok';
  ctx.response.status = 200;
});

router.delete('/notes/:id', async(ctx, next) => {
  const noteId = ctx.params.id;
  const index = notes.findIndex(o => o.id === noteId);
  if (index !== -1) {
      notes.splice(index, 1);
  }
  ctx.response.status = 204;
});

  
app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback())
console.log('server started');
server.listen(port);
