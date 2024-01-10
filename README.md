<h1 align="center">Client routing library</h1>

<p align="center">
<img alt="Badge" src="https://github.com/dmitrygvl/client-routing-lib/actions/workflows/sanity-check.yml/badge.svg" />
</p>

## Getting Started

Install @client-routing-lib with [`npm`](https://www.npmjs.com/package/client-routing-lib):

```bash
npm install client-routing-lib
```

Using

```bash
const router = new Router();

router.on("/", {
  onEnter: () => {
    // your code
  },
  // other hooks
});
```
