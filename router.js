"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const uuid_1 = require("uuid");
class Router {
    constructor(mode = 'history') {
        this.listeners = [];
        this.previousPath = null;
        this.init = () => {
            if (this.mode === 'history') {
                window.addEventListener('popstate', this.bindHandlePopState);
            }
            else if (this.mode === 'hash') {
                window.addEventListener('hashchange', this.bindHandleHashChange);
            }
            document.body.addEventListener('click', this.bindHandleClick);
        };
        this.unsubscribeAll = () => {
            if (this.mode === 'history') {
                window.removeEventListener('popstate', this.bindHandlePopState);
            }
            else if (this.mode === 'hash') {
                window.removeEventListener('hashchange', this.bindHandleHashChange);
            }
            document.body.removeEventListener('click', this.bindHandleClick);
        };
        this.getPath = () => this.mode === 'hash'
            ? window.location.hash === ''
                ? '/'
                : window.location.hash.slice(1)
            : window.location.pathname + window.location.search;
        this.handleListener = ({ match, hooks }, currentPath, state = {}, callHookOnLeave = false) => __awaiter(this, void 0, void 0, function* () {
            const argsState = Object.assign(Object.assign({}, state), Router.getQueryParams());
            const args = {
                currentPath,
                previousPath: this.previousPath,
                state: argsState,
            };
            if (callHookOnLeave &&
                this.previousPath &&
                Router.isMatch(match, this.previousPath) &&
                hooks.onLeave) {
                yield hooks.onLeave(args);
                return;
            }
            if (Router.isMatch(match, currentPath) && hooks.onBeforeEnter) {
                yield hooks.onBeforeEnter(args);
            }
            if (Router.isMatch(match, currentPath) && hooks.onEnter) {
                yield hooks.onEnter(args);
            }
        });
        this.handleAllListeners = (prevPath, path, state = {}) => {
            const prevListener = this.listeners.find((listener) => Router.isMatch(listener.match, prevPath));
            if (prevListener) {
                this.handleListener(prevListener, path, state, true);
            }
            const currentListener = this.listeners.find((listener) => Router.isMatch(listener.match, path));
            if (currentListener) {
                this.handleListener(currentListener, path, state);
            }
        };
        this.on = (match, hooks = {}) => {
            const id = (0, uuid_1.v4)();
            const listener = { id, match, hooks };
            this.listeners.push(listener);
            this.handleListener(listener, this.currentPath);
            return () => {
                this.listeners = this.listeners.filter((item) => item.id !== id);
            };
        };
        this.go = (url, state = {}) => {
            this.previousPath = this.currentPath;
            if (this.mode === 'hash') {
                window.location.hash = url;
            }
            else if (this.mode === 'history') {
                window.history.pushState(state, '', url);
            }
            this.currentPath = this.getPath();
            this.handleAllListeners(this.previousPath, this.currentPath, state);
        };
        this.handleClick = (event) => {
            var _a;
            if (!event.target.matches('a')) {
                return;
            }
            event.preventDefault();
            const url = (_a = event.target.getAttribute('href')) !== null && _a !== void 0 ? _a : '';
            this.go(url);
        };
        this.bindHandleClick = this.handleClick.bind(this);
        this.handlePopState = () => {
            this.previousPath = this.currentPath;
            this.currentPath = this.getPath();
            this.handleAllListeners(this.previousPath, this.currentPath, {});
        };
        this.bindHandlePopState = this.handlePopState.bind(this);
        this.handleHashChange = () => {
            if (this.currentPath === this.getPath()) {
                return;
            }
            this.previousPath = this.currentPath;
            this.currentPath = this.getPath();
            this.handleAllListeners(this.previousPath, this.currentPath, {});
        };
        this.bindHandleHashChange = this.handleHashChange.bind(this);
        this.mode = mode;
        this.currentPath = this.getPath();
        this.init();
    }
}
exports.Router = Router;
Router.isMatch = (match, path) => (match instanceof RegExp && match.test(path)) ||
    (typeof match === 'function' && match(path)) ||
    (typeof match === 'string' && match === path);
Router.getQueryParams = () => {
    const searchString = /\?(.+)$/.exec(window.location.href);
    if (!searchString) {
        return {};
    }
    return searchString[1]
        .split('&')
        .reduce((state, param) => {
        const [name, value] = param.split('=');
        state[name] = value;
        return state;
    }, {});
};
