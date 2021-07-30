import React, { lazy, memo, Suspense } from 'react';
import ErrorBoundary from './Components/ErrorBoundary';
import Loader from './Components/Loader';
import './style.css';

const Header = lazy(() => import('./Components/Header'));

const App = memo(() => (
  <ErrorBoundary>
    <Suspense fallback={<Loader />}>
      <Header /> React Boom App
    </Suspense>
  </ErrorBoundary>
));

export default App;
