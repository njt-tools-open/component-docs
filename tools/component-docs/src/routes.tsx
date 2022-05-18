import { JSXElement } from 'solid-js';
import CodeIcon from '@suid/icons-material/Code';
import RocketLaunchIcon from '@suid/icons-material/RocketLaunch';
import PageComponentIntroduction from './pages/get-start/introduction';
import PageComponentTheme from './pages/get-start/theme';
import PageComponentButton from './pages/components/button/document.md';
import PageComponentInput from './pages/components/input';

function NotFound(): JSXElement {
  return <div>404</div>;
}

const routes = [
  {
    name: 'Get Start',
    path: '/get-start',
    nav: true,
    icon: <RocketLaunchIcon fontSize="small" />,
    children: [
      {
        name: 'Introduction',
        path: '/introduction',
        component: PageComponentIntroduction,
      },
      {
        name: 'Theme',
        path: '/theme',
        component: PageComponentTheme,
      },
    ],
  },
  {
    name: 'Component',
    path: '/component',
    nav: true,
    icon: <CodeIcon fontSize="small" />,
    children: [
      {
        name: 'Button',
        path: '/button',
        component: PageComponentButton,
      },
    ],
  },
  {
    name: 'NotFound',
    path: '*all',
    component: NotFound,
  },
];

export default routes;
