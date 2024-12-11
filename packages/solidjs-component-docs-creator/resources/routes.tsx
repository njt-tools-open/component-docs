import { JSXElement } from "solid-js";

import PageIntroduction from '../pages/get-start/introduction.md';
import PageButton from '../pages/component/button.md';

function NotFound(): JSXElement {
  return <div>404</div>;
}
const routes = [
  {
    name: "Get Start",
    path: "/get-start",
    children: [
      {
        name: "Introduction",
        path: "/introduction",
        component: PageIntroduction,
        component: () => PageIntroduction
      },
    ],
  },
  {
    name: "Component",
    path: "/component",
    children: [
      {
        name: "Button",
        path: "/button",
        component: PageButton,
        component: () => PageButton
      },
    ],
  },
  {
    name: "NotFound",
    path: "*all",
    noSidebar: true,
    component: () => <NotFound />,
  },
];
export default routes;
