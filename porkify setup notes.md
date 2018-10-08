
# package.json

---

{
  "name": "forkify",
  "version": "1.0.0",
  "description": "forkify app dev",
  "main": "index.js",
  "scripts": {
    "dev": "webpack --mode development",
    "build": "webpack --mode production",
    "deb": "babel-node src/js/index.js",
    "dtest": "babel-node debugtest.js",
    "start": "webpack-dev-server --mode development --watch-content-base --open"
  },
  "author": "Mach Aurora",
  "license": "ISC",
  "devDependencies": {
    "@babel/cli": "^7.0.0",
    "@babel/core": "^7.0.0",
    "@babel/node": "^7.0.0",
    "@babel/preset-env": "^7.0.0",
    "babel-loader": "^8.0.2",
    "babel-preset-env": "^1.7.0",
    "eslint": "^5.5.0",
    "eslint-config-airbnb-base": "^13.1.0",
    "eslint-plugin-import": "^2.14.0",
    "html-webpack-plugin": "^3.2.0",
    "webpack": "^4.17.1",
    "webpack-cli": "^3.1.0",
    "jsdom": "^12.0.0",
    "webpack-dev-server": "^3.1.7"
  },
  "dependencies": {
    "axios": "^0.18.0",
    "babel-polyfill": "^6.26.0"
  }
}

---

# .babelrc - presets

---

{
    "presets": [
        ["@babel/preset-env", {
            "targets": {
                "browsers": [
                    "last 5 versions",
                    "ie >= 8"
                ]
            }
        }]
    ]
}

---

# launch.json

---

{
    "type": "node",
    "request": "attach",
    "name": "Debug with Babel CLI",
    "program": "${workspaceFolder}/src/js/index.js",
    "runtimeExecutable": "${workspaceRoot}/node_modules/.bin/babel-node",
    "cwd": "${workspaceRoot}"
},

---

