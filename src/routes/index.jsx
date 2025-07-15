import { elements } from 'chart.js';
import { lazy } from 'react';


const Dashboard = lazy(() => import('../pages/Dasboard'));
const Login = lazy(() => import('../pages/Auth'))
const EventsPage = lazy(() => import('../pages/EventsPage'));
const HotelPage = lazy(()=>import ('../pages/HotelsPage'))
const HotelDetailPage = lazy(()=>import('../pages/HotelDetailPage.jsx'))
const ReservationPage = lazy(() => import("../components/reservations/ReservationPage.jsx")); 
const Stats = lazy(() => import('../pages/Stats.jsx'));

const routes = [
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/Dashboard',
    element: <Dashboard />
  },
  {
    path: '/events',
    element: <EventsPage />
  },
  {
    path: '/hotels',
    element: <HotelPage/>
  },
  {

    path: '/hotels/:id',
    element: <HotelDetailPage />
  }, 
  {
    path: "/reservas",
    element: <ReservationPage />, 
  },
  {
    path: "/stats",
    element: <Stats />
  }
];

export default routes;
