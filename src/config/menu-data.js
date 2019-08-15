export default [
  {
    name: '系统设置',
    path: 'system',
    icon: 'icon_lgdbs_system',
    children: [
      {
        name: '数据字典',
        path: 'data-setting',
        children: [
          {
            name: '内容分类',
            path: 'data-type',
          },
          {
            name: 'User',
            path: 'data-user',
          },
          {
            name: 'AD',
            path: 'data-ad',
          },
        ],
      },
      {
        name: '分类设置',
        path: 'type-setting',
        children: [
          {
            name: '视频分类',
            path: 'video-type',
          },
          {
            name: '小说分类',
            path: 'novel-type',
          },
          {
            name: '图片分类',
            path: 'picture-type',
          }
        ],
      },
      {
        name: '公告列表',
        path: 'notice-setting'
      },
      {
        name: '站点设置',
        path: 'www-setting'
      },
      {
        name: '模版设置',
        path: 'template-setting'
      },
      {
        name: '支付设置',
        path: 'PayPlatformConfig'
      },
      {
        name: '客服设置',
        path: 'contact'
      }
    ],
  },

  {
    name: '内容管理',
    path: 'content',
    icon: 'icon_lgdbs_game',
    children: [
      {
        name: '平台管理',
        path: 'live-config',
      },
      {
        name: '视频管理',
        path: 'video-config',
      },
      {
        name: '图片管理',
        path: 'picture-config',
      },
      {
        name: '小说管理',
        path: 'novel-config',
      },
    ],
  },

  {
    name: '广告管理',
    path: 'ad',
    icon: 'icon_lgdbs_finance',
    children: [
      {
        name: '广告列表',
        path: 'ad-info'
      }
    ],
  },

  {
    name: '用户管理',
    path: 'user',
    icon: 'icon_lgdbs_user',
    children: [
      {
        name: '用户列表',
        path: 'user-list',
      },
      {
        name: '播放次数管理',
        path: 'play-times',
      },
      {
        name: '用户签到管理',
        path: 'MemberSignIn',
      },
      {
        name: '用户钱包管理',
        path: 'wallet',
      },
      {
        name: '提现列表',
        path: 'WithdrawList',
      },
      {
        name: '代理等级管理',
        path: 'AgentConfig',
      },
      {
        name: '代理等级结构',
        path: 'AgentTree',
      },
    ],
  },

  {
    name: '活动管理',
    path: 'activities',
    icon: 'icon_lgdbs_operation',
    children: [
      {
        name: '日常活动',
        path: 'activity',
      },
      {
        name: '推广活动',
        path: 'extension'
      },
    ],
  },
];
