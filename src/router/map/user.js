export default {
  name: 'user',
  path: 'user',
  component: () => import('@/views/user/index'),
  children: [
    {
      name: 'user-list',
      path: 'user-list',
      component: () => import('@/views/user/user-list/index'),
    },
    {
      name: 'play-times',
      path: 'play-times',
      component: () => import('@/views/user/play-times/index'),
    },
    {
      name: 'MemberSignIn',
      path: 'MemberSignIn',
      component: () => import('@/views/user/MemberSignIn/index'),
    },
    {
      name: 'wallet',
      path: 'wallet',
      component: () => import('@/views/user/wallet/index'),
    },
    {
      name: 'WithdrawList',
      path: 'WithdrawList',
      component: () => import('@/views/user/WithdrawList/index'),
    },
    {
      name: 'AgentConfig',
      path: 'AgentConfig',
      component: () => import('@/views/user/AgentConfig/index'),
    },
    {
      name: 'AgentTree',
      path: 'AgentTree',
      component: () => import('@/views/user/AgentTree/index'),
    },
  ],
};
