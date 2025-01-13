import React, { lazy, memo, Suspense } from 'react';
import ErrorBoundary from './Components/ErrorBoundary';
import Loader from './Components/Loader';
import './style.css';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

const Header = lazy(() => import('./Components/Header'));

const App = memo(() => (
  <ErrorBoundary>
    <Suspense fallback={<Loader />}>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                Home Page<Link to={{ pathname: '/about' }}>About Page</Link>
              </div>
            }
          />
          <Route
            path="/about"
            element={
              <div>
                <div>About Page</div>
                <div>
                  <Link to={{ pathname: '/' }}>Home</Link>
                </div>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </Suspense>
  </ErrorBoundary>
));

export default App;
