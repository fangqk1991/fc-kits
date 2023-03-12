# Backend Kit
* Read [《写一个 Node 后端应用》](https://fqk.io/web-dev-backend-app/) for more details

## Installation
```
# Use npm
npm install @fangcha/backend-kit

# Or use yarn
yarn add @fangcha/backend-kit
```

## Usage
```
import { FangchaApp } from '@fangcha/backend-kit'

const app = new FangchaApp({
  ……
})
app.launch()
```

OR

```
import { WebApp } from '@fangcha/backend-kit/lib/router'

const app = new WebApp({
  ……
})
app.launch()
```
