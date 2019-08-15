export default {
  name: 'ad',
  path: 'ad',
  component: () => import('@/views/ad/index'),
  children: [
    {
      name: 'ad-info',
      path: 'ad-info',
      component: () => import('@/views/ad/ad-info/index'),
    }
  ],
};
