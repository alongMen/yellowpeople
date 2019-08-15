export default {
  name: 'activities',
  path: 'activities',
  component: () => import('@/views/activities/index'),
  children: [
    {
      name: 'activity',
      path: 'activity',
      component: () => import('@/views/activities/activity/index'),
    },
    {
      name: 'extension',
      path: 'extension',
      component: () => import('@/views/activities/extension/index'),
    }
  ],
};
