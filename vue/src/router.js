import { createRouter, createWebHistory } from 'vue-router';
import Content from './components/content.vue';
import ViewForm from './components/viewForm.vue';

const routes = [
  {
    path: '/content',
    name: 'Content',
    component: Content,
  },
  {
    path: '/view-form',
    name: 'ViewForm',
    component: ViewForm,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
