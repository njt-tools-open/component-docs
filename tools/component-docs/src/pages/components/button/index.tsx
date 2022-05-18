import { JSXElement } from 'solid-js';
import Document from './document.md';

function Page(): JSXElement {
  return <div innerHTML={Document} />;
}

export default Page;
