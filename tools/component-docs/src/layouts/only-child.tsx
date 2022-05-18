import { JSXElement } from 'solid-js';

function OnlyChild(props: { children?: any }): JSXElement {
  return <div>{props.children}</div>;
}

export default OnlyChild;
