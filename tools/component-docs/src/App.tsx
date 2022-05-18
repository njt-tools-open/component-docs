import type { Component } from 'solid-js';
import { Router, useRoutes } from 'solid-app-router';

import routes from './routes';
import Sidebar from './layouts/sidebar';

import styles from './App.module.css';
import Nav from './layouts/nav';

const App: Component = () => {
  const Routes = useRoutes(routes);
  return (
    <div class={styles.App}>
      <Router>
        <Sidebar items={routes} />
        <Nav />
        <div style={{ 'padding-top': '78px', 'padding-left': '240px' }}>
          <div style={{ padding: '20px' }}>
            <Routes />
          </div>
        </div>
      </Router>
    </div>
  );
};

export default App;
