# node-app-error
An error class contains statusCode, extras.

## Installation
```
npm install @fangcha/app-error
```

## Usage
In Node.js:

```
const AppError = require('@fangcha/app-error')
...
// somewhere you want to throw an exception.
throw new AppError(message, statusCode, extras)
```
