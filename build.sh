#!/bin/bash

npm run build
pm2 delete user-client
pm2 --name "user-client" --time --output ~/.pm2/logs/user-client/out.log --error ~/.pm2/logs/user-client/error.log start server.js