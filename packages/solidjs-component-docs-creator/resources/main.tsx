/* @refresh reload */
import { render } from 'solid-js/web';

import type { Component } from 'solid-js';
import { Router, useRoutes } from 'solid-app-router';

import routes from './routes';
import Sidebar from './sidebar';

import Nav from './nav';

import './main.css';

const App: Component = () => {
  const Routes = useRoutes(routes);
  return (
    <div>
      <Router>
        <Sidebar items={routes} />
        <Nav />
        <div className="container-markdown">
          <div style={{ padding: '20px' }}>
            <Routes />
          </div>
        </div>
      </Router>
    </div>
  );
};

export default App;

render(() => <App />, document.getElementById('root') as HTMLElement);
