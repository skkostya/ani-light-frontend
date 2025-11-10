import type React from 'react';
import { lazy } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router';

import AppProvider from './providers/app.provider';
import Layout from './providers/layout';
import { ROUTES } from './shared/constants';
import NotFound from './shared/widgets/errors/404';

const TelegramAuth = lazy(() => import('./pages/TelegramAuth/TelegramAuth'));
const Login = lazy(() => import('./pages/Login/Login'));
const Register = lazy(() => import('./pages/Register/Register'));
const Catalog = lazy(() => import('./pages/Catalog/Catalog'));
const Anime = lazy(() => import('./pages/Anime/Anime'));
const AnimeEpisodes = lazy(() => import('./pages/AnimeEpisodes/AnimeEpisodes'));
const WatchList = lazy(() => import('./pages/WatchList/WatchList'));
const WantList = lazy(() => import('./pages/WantList/WantList'));
const Favorites = lazy(() => import('./pages/Favorites/Favorites'));
const History = lazy(() => import('./pages/History/History'));
const Profile = lazy(() => import('./pages/Profile/Profile'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppProvider />,
    children: [
      {
        path: '/:lang',
        children: [
          {
            path: ROUTES.login,
            element: <Login />
          },
          {
            path: ROUTES.register,
            element: <Register />
          },
          {
            path: ROUTES.authTelegram,
            element: <TelegramAuth />
          },
          {
            element: <Layout />,
            children: [
              {
                path: ROUTES.catalog,
                element: <Catalog />
              },
              {
                path: ROUTES.anime(),
                element: <Anime />
              },
              {
                path: ROUTES.animeEpisodes(),
                element: <AnimeEpisodes />
              },
              {
                path: ROUTES.watchList,
                element: <WatchList />
              },
              {
                path: ROUTES.wantList,
                element: <WantList />
              },
              {
                path: ROUTES.favorites,
                element: <Favorites />
              },
              {
                path: ROUTES.history,
                element: <History />
              },
              {
                path: ROUTES.profile,
                element: <Profile />
              },
              {
                path: '*',
                element: (
                  <div className="app-router-not-found">
                    <NotFound />
                  </div>
                )
              }
            ]
          }
        ]
      }
    ]
  }
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
