import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Profile from '../views/Profile.vue';
import AdminPage from '../views/AdminPage.vue';
import ModeratorPage from '../views/ModeratorPage.vue';
import UserPage from '../views/UserPage.vue';
import LeagueHistory from '../views/LeagueHistory.vue';
import Logout from '../views/Logout.vue';
import ActiveTournaments from '../views/ActiveTournaments.vue';
import PlayerSelectionPage from '../views/PlayerSelectionPage.vue';
import TournamentLeaderBoard from '../views/TournamentLeaderBoard.vue';
import UserActiveTeams from '../views/UserActiveTeams.vue';
import UserPastTeams from '../views/UserPastTeams.vue';
import Settings from '../views/Settings.vue';
import ForgotPassword from '../views/ForgotPassword.vue';
import PageNotFound from '../views/PageNotFound.vue';
import Rules from '../views/Rules.vue';

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
    path: '/league-history',
    component: LeagueHistory,
  },
  {
    path: '/user/:id',
    component: UserPage,
  },
  {
    path: '/logout',
    component: Logout,
  },
  {
    path: '/active-tournaments',
    component: ActiveTournaments,
  },
  {
    path: '/tournament/:id/player-selection',
    component: PlayerSelectionPage,
  },
  {
    path: '/tournament/:id/leaderboard',
    component: TournamentLeaderBoard,
  },
  {
    path: '/active-teams',
    component: UserActiveTeams,
  },
  {
    path: '/past-teams',
    component: UserPastTeams,
  },
  {
    path: '/settings',
    component: Settings,
  },
  {
    path: '/forgot-password',
    component: ForgotPassword,
  },
  {
    path: '/rules',
    component: Rules,
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
