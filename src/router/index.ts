import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw, RouteMeta } from "vue-router";

import { BasicLayout, UserLayout } from "@/layout";
import SettingsLayout from "@/views/Account/settings/index.vue";

// const files = import.meta.glob('./../views/Account/center/*.vue');
// console.log(files)

export const constantRouterMap: RouteRecordRaw[] = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    // hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/User/Login/index.vue'),
      },
      // {
      //   path: 'register',
      //   name: 'register',
      //   component: () => import('@/views/User/Register')
      // },
      // {
      //   path: 'register-result',
      //   name: 'registerResult',
      //   component: () => import('@/views/user/RegisterResult')
      // },
      // {
      //   path: 'recover',
      //   name: 'recover',
      //   component: undefined
      // }
    ]
  },

  {
    path: '/404',
    component: () => import('@/views/Exception/404.vue')
  }
]

// function getModules() {
//   const components = import.meta.glob('@/views/**/*.vue')
//   return components
// }
// function getComponents() {
//   const components = import.meta.globEager('@/views/**/*.vue')
//   return components
// }

// console.log(getModules(), getComponents())

interface ITreeRoute {
  path: string;
  component: string;
  meta?: {[key: string]: string};
  children?: ITreeRoute[]
}

export function tree2Routes(treeData: ITreeRoute): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = []

  return routes
}

export const routes: RouteRecordRaw[] = [
  ...constantRouterMap,
  {
    path: "/",
    component: BasicLayout,
    meta: {
      icon: "HeartOutlined",
      title: "default",
    },
    redirect: '/analysis',
    children: [
      {
        path: "/analysis",
        meta: {
          icon: "HeartOutlined",
          title: "Analysis",
          buttons: ['新增', '删除', '修改']
        },
        component: () => import("@/views/Dashboard/Analysis/index.vue"),
      },
      {
        path: "/testWork",
        meta: {
          icon: "HeartOutlined",
          title: "TestWork",
        },
        component: () => import("@/views/Dashboard/TestWork/index.vue"),
      },
    ],
  },
  {
    path: "/form",
    name: 'form',
    component: BasicLayout,
    meta: {
      icon: "FormOutlined",
      title: "form",
    },
    redirect: '/form/basic-form',
    children: [
      {
        path: "/form/basic-form",
        name: "BasicForm",
        meta: {
          icon: "",
          title: "BasicForm",
        },
        component: () => import("@/views/Form/basicForm/index.vue"),
      },
      {
        path: "/form/step-form",
        name: "StepForm",
        meta: {
          icon: "",
          title: "StepForm",
        },
        component: () => import("@/views/Form/stepForm/index.vue"),
      },
      {
        path: "/form/advanced-form",
        name: "AdvancedForm",
        meta: {
          icon: "",
          title: "AdvancedForm",
        },
        component: () => import("@/views/Form/advancedForm/index.vue"),
      },
    ],
  },
  {
    path: "/list",
    name: 'list',
    component: BasicLayout,
    meta: {
      icon: "TableOutlined",
      title: "list",
    },
    redirect: '/list/search-table',
    children: [
      {
        path: "/list/search-table",
        name: "SearchTable",
        meta: {
          icon: "",
          title: "SearchTable",
        },
        component: () => import("@/views/List/SearchTable/index.vue"),
      },
      {
        path: "/list/basic-list",
        name: "BasicList",
        meta: {
          icon: "",
          title: "BasicList",
        },
        component: () => import("@/views/List/BasicList/index.vue"),
      },
      // {
      //   path: "/form/advanced-form",
      //   name: "AdvancedForm",
      //   meta: {
      //     icon: "",
      //     title: "AdvancedForm",
      //   },
      //   component: () => import("@/views/Form/advancedForm/index.vue"),
      // },
    ],
  },
  {
    path: "/account",
    name: 'account',
    component: BasicLayout,
    meta: {
      icon: "UserOutlined",
      title: "account",
    },
    // redirect: '/account/center',
    children: [
      {
        path: "/account/center",
        name: "center",
        meta: {
          icon: "",
          title: "center",
        },
        component: () => import("@/views/Account/center/index.vue"),
      },
      {
        path: "/account/settings",
        name: "settings",
        meta: {
          icon: "",
          title: "settings",
        },
        component: SettingsLayout,
        redirect: '/account/settings/base',
        children: [
          {
            path: '/account/settings/base',
            name: "BaseSettings",
            component: () => import("@/views/Account/settings/BaseSetting.vue"),
            meta: {
              // hidden: true,
              title: "基本设置",
            }
          },
          {
            path: '/account/settings/security',
            name: "SecuritySettings",
            component: () => import("@/views/Account/settings/Security.vue"),
            meta: {
              hidden: true,
              title: "安全设置",
            }
          },
          {
            path: '/account/settings/binding',
            name: "BindingSettings",
            component: () => import("@/views/Account/settings/Binding.vue"),
            meta: {
              hidden: true,
              title: '账户绑定'
            }
          },
          {
            path: '/account/settings/notification',
            name: "NotificationSettings",
            component: () => import("@/views/Account/settings/Notification.vue"),
            meta: {
              hidden: true,
              title: '新消息通知'
            }
          },
        ]
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: {
      hidden: true,
    }
    // hidden: true,
  }
];

export default createRouter({
  history: createWebHistory(),
  routes: routes,
});
