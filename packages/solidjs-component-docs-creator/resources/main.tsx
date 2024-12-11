/* @refresh reload */
import { render } from 'solid-js/web';

import type { Component } from 'solid-js';
import { Route, Router } from '@solidjs/router';

import routes from './routes';
import Sidebar from './sidebar';

import Nav from './nav';

import './main.css';

const RouterWrapper = props => {
  return (
    <>
      <Sidebar items={routes} />
      <Nav />
      <div class="container-markdown">
        <div style={{ padding: '20px' }}>{props.children}</div>
      </div>
    </>
  );
};

const App: Component = () => {
  return (
    <Router>
      <Route path="/" component={RouterWrapper}>
        {routes}
      </Route>
    </Router>
  );
};

export default App;

render(() => <App />, document.getElementById('root') as HTMLElement);
