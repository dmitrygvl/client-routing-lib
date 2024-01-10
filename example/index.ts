import { Router, IArgs } from '../src/router';

const createRender =
  (content: string) =>
  (...args: IArgs[]) => {
    console.log(`${content} args=${JSON.stringify(args)}`);
    (<HTMLElement>document.getElementById('root')).innerHTML = `${content}`;
  };

const drawInfo =
  (content: string) =>
  (...args: IArgs[]) => {
    console.log(`${content} args=${JSON.stringify(args)}`);
  };

const createLogger =
  (content: string) =>
  (...args: IArgs[]) => {
    console.log(`${content} args=${JSON.stringify(args)}`);
  };

const connectHooks = (router: Router, mode: 'hash' | 'history') => {
  let prefix = PREFIX;

  if (PRODUCTION && mode === 'hash') {
    prefix = '';
  }

  router.on(new RegExp(`^${prefix}/$`), {
    onEnter: createRender(`/`),
    onLeave: createLogger(`[onLeave] /`),
  });
  const unsubscribe = router.on((path) => path === `${prefix}/contacts`, {
    onEnter: createRender(`/contacts`),
    onBeforeEnter: drawInfo(`[onBeforeEnter] /contacts`),
  });
  router.on(`${prefix}/about`, {
    onEnter: createRender(`/about`),
    onLeave: createLogger(`[onLeave] /about`),
  });
  router.on(`${prefix}/about/us`, {
    onEnter: createRender(`/about/us`),
  });
  router.on(new RegExp(`^${prefix}/login$`), {
    onEnter: createRender(`/login`),
    onBeforeEnter: drawInfo(`[onBeforeEnter] /login`),
  });

  const contacts = document.getElementById('contacts');

  const handleClickContacts = (e: Event) => {
    e.preventDefault();

    setTimeout(() => {
      unsubscribe();
      console.log(
        `Unsubscribed from executing hooks when clicking on the '/contacts' link`,
      );
    }, 0);

    contacts?.removeEventListener('click', handleClickContacts);
  };

  contacts?.addEventListener('click', handleClickContacts);
};

const connectRouter = (mode: 'hash' | 'history') => {
  const nav = document.getElementById('nav') as HTMLElement;
  const root = document.getElementById('root') as HTMLElement;

  nav.style.display = 'flex';
  root.style.display = '';

  connectHooks(new Router(mode), mode);
};

window.addEventListener('load', () => {
  const links = document.querySelectorAll(
    '[data-name=terms]',
  ) as NodeListOf<HTMLAnchorElement>;

  links.forEach((link) =>
    link.addEventListener('click', () => {
      if (link.dataset.id === 'history') {
        if (PRODUCTION) {
          document.querySelectorAll('a').forEach((ref) => {
            ref.href = PREFIX + ref.pathname;
          });
        }
      }

      connectRouter(link.dataset.id as 'hash' | 'history');

      links.forEach((a) => {
        a.remove();
      });
    }),
  );
});
