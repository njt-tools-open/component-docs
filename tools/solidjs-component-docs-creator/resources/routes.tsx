import { JSXElement } from 'solid-js';

function NotFound(): JSXElement {
  return <div>404</div>;
}

const routes = [
  {
    name: 'NotFound',
    path: '*all',
    noSidebar: true,
    component: NotFound,
  },
];

export default routes;
