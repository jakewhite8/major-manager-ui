import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Profile from '../views/Profile.vue';
import AdminPage from '../views/AdminPage.vue';
import ModeratorPage from '../views/ModeratorPage.vue';
import UserPage from '../views/UserPage.vue';
import Logout from '../views/Logout.vue';
import JoinTournament from '../views/JoinTournament.vue';
import TournamentPlayerSeclection from '../views/TournamentPlayerSeclection.vue';
import PageNotFound from '../views/PageNotFound.vue';


Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/home',
    component: Home,
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/register',
    component: Register,
  },
  {
    path: '/profile',
    component: Profile,
  },
  {
    path: '/admin',
    component: AdminPage,
  },
  {
    path: '/mod',
    component: ModeratorPage,
  },
  {
    path: '/user',
    component: UserPage,
  },
  {
    path: '/logout',
    component: Logout,
  },
  {
    path: '/join-tournament',
    component: JoinTournament,
  },
  {
    path: '/tournament-player-selection',
    component: TournamentPlayerSeclection,
  },
  {
    path: '*',
    component: PageNotFound,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

// router.beforeEach((to, from, next) => {
//   const publicPages = ['/login', '/register', '/home', '/'];
//   const authRequired = !publicPages.includes(to.path);
//   const loggedIn = localStorage.getItem('user');
//   if (authRequired && !loggedIn) {
//     next('/login');
//   } else {
//     next();
//   }
// });

export default router;
