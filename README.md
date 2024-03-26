<h1 align="center">Client routing library</h1>

<p align="center">
<img alt="Badge" src="https://github.com/dmitrygvl/client-routing-lib/actions/workflows/sanity-check.yml/badge.svg" />
</p>

## Getting Started

A simple client routing library with support hash API and history API.

Typing

```bash
export interface IArgs {
    currentPath: string;
    previousPath: string | null;
    state: Record<string, any>;
}
export type IState = Record<string, any>;
export type IMatch = RegExp | string | ((path: string) => boolean);
export type IHook = (...args: IArgs[]) => Promise<any> | any;
export interface IHooks {
    onEnter?: IHook;
    onLeave?: IHook;
    onBeforeEnter?: IHook;
}
export interface IListener {
    id: string;
    match: IMatch;
    hooks: IHooks;
}
export interface IRouter {
    on: (match: IMatch, hooks?: IHooks) => () => void;
    go: (url: string, state: IState) => void;
    unsubscribeAll: () => void;
}
declare class Router implements IRouter {
    private listeners;
    private previousPath;
    private currentPath;
    private mode;
    constructor(mode?: "history" | "hash");
    static isMatch: (match: IMatch, path: string) => boolean;
    static getQueryParams: () => IState;
    private init;
    unsubscribeAll: () => void;
    private getPath;
    private handleListener;
    private handleAllListeners;
    on: (match: IMatch, hooks?: IHooks) => (() => void);
    go: (url: string, state?: IState) => void;
    private handleClick;
    private bindHandleClick;
    private handlePopState;
    private bindHandlePopState;
    private handleHashChange;
    private bindHandleHashChange;
}
```

## Using

```bash
const router = new Router();

router.on("/", {
  onEnter: () => {
    // your code
  },
  // other hooks
});
```

## License <a name="license"></a>

[![MIT License][license-shield]][license-url]

[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
