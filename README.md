<h1 align="center">Client routing library</h1>

<p align="center">
<img alt="Badge" src="https://github.com/dmitrygvl/client-routing-lib/actions/workflows/sanity-check.yml/badge.svg" />
</p>

## Getting Started

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