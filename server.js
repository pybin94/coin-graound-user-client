import express from 'express';
import cluster from "cluster";
import { cpus } from "os";

import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();
app.use(express.static(path.join(__dirname, "/public")));
app.use('/src/assets', express.static(path.join(__dirname, 'src', 'assets')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, "/public", "index.html"));
});

if (cluster.isMaster){
    console.log(`마스터 프로세스 아이디: ${process.pid}`);
    for (let i = 0; i < cpus().length; i += 1) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        cluster.fork();
    });

} else {
    app.listen(3111)
    console.log(`${process.pid}번 워커 실행`);
}