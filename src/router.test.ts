import { Router, IArgs } from './router/router';

const mockCreateRender = jest.fn();
const mockDrawInfo = jest.fn();
const mockCreateLogger = jest.fn();

const createRender =
  (content: string) =>
  (...args: IArgs[]) => {
    mockCreateRender(content, args);
    window.console.log(`${content} args=${JSON.stringify(args)}`);
    (<HTMLElement>document.getElementById('root')).innerHTML = `${content}`;
  };

const drawInfo =
  (content: string) =>
  (...args: IArgs[]) => {
    mockDrawInfo(content, args);
    window.console.log(`${content} args=${JSON.stringify(args)}`);
  };

const createLogger =
  (content: string) =>
  (...args: IArgs[]) => {
    mockCreateLogger(content, args);
    window.console.log(`${content} args=${JSON.stringify(args)}`);
  };

const sleep = (x: number) => new Promise((r) => setTimeout(r, x));

describe('Router', () => {
  beforeEach(() => {
    mockCreateRender.mockClear();
    mockDrawInfo.mockClear();
    mockCreateLogger.mockClear();

    document.body.innerHTML = `<a id="home" href="/">Home</a>
      <a id="contacts" href="/contacts">Contacts</a>
      <a id="about" href="/about">About</a>
      <article id="root"></article>`;
  });

  it('checking the default router connection', () => {
    const router = new Router();
    router.on(/^\/$/, {
      onEnter: createRender('/'),
    });

    expect(mockCreateRender).toHaveBeenCalledWith('/', [
      {
        currentPath: '/',
        previousPath: null,
        state: {},
      },
    ]);

    const root = document.getElementById('root');
    expect(root?.innerHTML).toBe(`/`);
  });

  ['history', 'hash'].forEach((mode) => {
    it(`checking router connection with ${mode} API`, async () => {
      const router = new Router(mode as 'history' | 'hash');

      router.on(/^\/$/, {
        onEnter: createRender('/'),
      });
      router.on((path) => path === '/contacts', {
        onEnter: createRender('/contacts'),
        onBeforeEnter: drawInfo('[info] contacts'),
        onLeave: createLogger('[leaving] contacts'),
      });
      router.on('/about', {
        onEnter: createRender('/about'),
        onLeave: createLogger('[leaving] /about'),
      });

      document.getElementById('contacts')?.click();
      await sleep(100);
      expect(mockCreateRender).toHaveBeenCalledWith(
        '/contacts',
        expect.anything(),
      );

      document.getElementById('about')?.click();
      await sleep(100);
      expect(mockCreateRender).toHaveBeenCalledWith(
        '/about',
        expect.anything(),
      );

      document.getElementById('home')?.click();
      await sleep(100);
      expect(mockCreateRender).toHaveBeenCalledWith('/', expect.anything());

      router.unsubscribeAll();
    });
  });
});

// const sleep = (x: number) => new Promise((r) => setTimeout(r, x));

// const createRender =
//   (content: string) =>
//   (...args: IArgs[]) => {
//     console.log(`${content} args=${JSON.stringify(args)}`);
//     (<HTMLElement>document.getElementById('root')).innerHTML = `${content}`;
//   };

// const drawInfo =
//   (content: string) =>
//   (...args: IArgs[]) => {
//     console.log(`${content} args=${JSON.stringify(args)}`);
//   };

// const createLogger =
//   (content: string) =>
//   (...args: IArgs[]) => {
//     console.log(`${content} args=${JSON.stringify(args)}`);
//   };

// describe('Router', () => {
//   beforeEach(() => {
//     document.body.innerHTML = `<a id="home" href="/">Home</a>
//    <a id="contacts" href="/contacts">Contacts</a>
//    <a id="about" href="/about">About</a>
//    <article id="root"></article>`;
//   });

//   it('checking the default router connection', () => {
//     const log = jest.spyOn(window.console, 'log');
//     const router = new Router();
//     const unsubscribe = router.on(/^\/$/, {
//       onEnter: createRender('/'),
//     });

//     expect(log).toHaveBeenCalledWith(
//       `/ args=[{"currentPath":"/","previousPath":null,"state":{}}]`,
//     );

//     const root = document.getElementById('root');

//     expect(root?.innerHTML).toBe(`/`);

//     unsubscribe();
//   });

//   ['history', 'hash'].forEach((str) => {
//     it(`checking router connection with ${str} API`, async () => {
//       const log = jest.spyOn(window.console, 'log');
//       const router = new Router(str as 'history' | 'hash');

//       router.on(/^\/$/, {
//         onEnter: createRender('/'),
//       });
//       router.on((path) => path === '/contacts', {
//         onEnter: createRender('/contacts'),
//         onBeforeEnter: drawInfo('[info] contacts'),
//         onLeave: createLogger('[leaving] contacts'),
//       });
//       router.on('/about', {
//         onEnter: createRender('/about'),
//         onLeave: createLogger('[leaving] /about'),
//       });

//       expect(log).toHaveBeenCalledTimes(1);

//       document.body.dispatchEvent(new window.Event('click'));

//       expect(log).toHaveBeenCalledTimes(1);

//       const root = document.getElementById('root');
//       const contacts = document.getElementById('contacts');

//       contacts?.click();

//       await sleep(100);

//       expect(root?.innerHTML).toBe(`/contacts`);
//       expect(log).toHaveBeenCalledTimes(3);

//       const about = document.getElementById('about');

//       about?.click();

//       await sleep(100);

//       expect(root?.innerHTML).toBe(`/about`);
//       expect(log).toHaveBeenCalledTimes(5);

//       const home = document.getElementById('home');

//       home?.click();

//       await sleep(100);

//       expect(root?.innerHTML).toBe(`/`);
//       expect(log).toHaveBeenCalledTimes(7);

//       router.unsubscribeAll();
//     });
//   });
// });
