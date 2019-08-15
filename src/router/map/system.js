export default {
  path: 'system',
  name: 'system',
  component: () => import('@/views/system/index'),
  children: [
    {
      path: 'data-setting',
      name: 'data-setting',
      component: () => import('@/views/system/data-setting/index'),
      children: [
        {
          name: 'data-type',
          path: 'data-type',
          component: () =>
            import('@/views/system/data-setting/data-type/index'),
        },
        {
          name: 'data-user',
          path: 'data-user',
          component: () =>
            import('@/views/system/data-setting/data-user/index'),
        },
        {
          name: 'data-ad',
          path: 'data-ad',
          component: () =>
            import('@/views/system/data-setting/data-ad/index'),
        },
      ],
    },
    {
      path: 'type-setting',
      name: 'type-setting',
      component: () => import('@/views/system/type-setting/index'),
      children: [
        {
          name: 'video-type',
          path: 'video-type',
          component: () =>
            import('@/views/system/type-setting/video-type/index'),
        },
        {
          name: 'novel-type',
          path: 'novel-type',
          component: () =>
            import('@/views/system/type-setting/novel-type/index'),
        },
        {
          name: 'picture-type',
          path: 'picture-type',
          component: () =>
            import('@/views/system/type-setting/picture-type/index'),
        },
      ],
    },
    {
      name: 'notice-setting',
      path: 'notice-setting',
      component: () => import('@/views/system/notice-setting/index'),
    },
    {
      name: 'www-setting',
      path: 'www-setting',
      component: () => import('@/views/system/www-setting/index'),
    },
    {
      name: 'template-setting',
      path: 'template-setting',
      component: () => import('@/views/system/template-setting/index'),
    },
    {
      name: 'PayPlatformConfig',
      path: 'PayPlatformConfig',
      component: () => import('@/views/system/PayPlatformConfig/index'),
    },
    {
      name: 'contact',
      path: 'contact',
      component: () => import('@/views/system/contact/index'),
    },
    
  ],
};
