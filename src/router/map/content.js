export default {
  name: 'content',
  path: 'content',
  component: () => import('@/views/content/index'),
  children: [
    {
      name: 'live-config',
      path: 'live-config',
      component: () => import('@/views/content/live-config/index'),
    },
    {
      name: 'video-config',
      path: 'video-config',
      component: () => import('@/views/content/video-config/index'),
    },
    {
      name: 'picture-config',
      path: 'picture-config',
      component: () => import('@/views/content/picture-config/index'),
    },
    {
      name: 'novel-config',
      path: 'novel-config',
      component: () => import('@/views/content/novel-config/index'),
    },
  ],
};
