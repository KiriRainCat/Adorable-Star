import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'index', component: () => import('pages/IndexPage.vue') },
      { path: 'calendar', component: () => import('pages/CalendarPage.vue') },
      {
        path: 'data',
        children: [
          { path: '', component: () => import('pages/data/CoursePage.vue') },
          { path: 'course/:id', component: () => import('pages/data/CourseDetail.vue') },
          { path: 'assignment/:id', component: () => import('pages/data/AssignmentDetail.vue') },
        ],
      },
      { path: 'admin', component: () => import('pages/AdminPage.vue') },
    ],
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: 'register', component: () => import('pages/auth/RegisterPage.vue') },
      { path: 'login', component: () => import('pages/auth/LoginPage.vue') },
      { path: 'complete-info', component: () => import('pages/auth/InfoFormPage.vue') },
    ],
  },

  // Matches all path that does't match any page for 404
  { path: '/:catchAll(.*)*', component: () => import('pages/ErrorNotFound.vue') },
];

export default routes;
