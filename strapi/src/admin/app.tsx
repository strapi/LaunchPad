import type { StrapiApp } from '@strapi/strapi/admin';
import { Information } from '@strapi/icons';

export default {
  config: {
    locales: [],
  },
  bootstrap(app: StrapiApp) {},
  register(app: StrapiApp) {
    if (process.env.STRAPI_ADMIN_IS_DEMO === 'true') {
      if ('widgets' in app) {
        // @ts-ignore
        app.widgets.register({
          icon: Information,
          title: {
            id: 'demo.widget.title',
            defaultMessage: 'Welcome to LaunchPad',
          },
          component: async () => {
            const component = await import('./components/DemoWidget');
            return component.default;
          },
          id: 'demo-launchpad-widget',
        });
      }
    }
  },
};
