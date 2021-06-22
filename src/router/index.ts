import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw, RouteMeta } from "vue-router";

import { BasicLayout, UserLayout } from "@/layout";

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
        component: () => import(/* webpackChunkName: "user" */ '@/views/User/Login/index.vue')
      },
      // {
      //   path: 'register',
      //   name: 'register',
      //   component: () => import(/* webpackChunkName: "user" */ '@/views/User/Register')
      // },
      // {
      //   path: 'register-result',
      //   name: 'registerResult',
      //   component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
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
      icon: "AppstoreAddOutlined",
      title: "default",
    },
    redirect: '/analysis',
    children: [
      {
        path: "/analysis",
        meta: {
          icon: "",
          title: "Analysis",
          buttons: ['新增', '删除', '修改']
        },
        component: () => import("@/views/Dashboard/Analysis/index.vue"),
      },
      {
        path: "/testWork",
        meta: {
          icon: "",
          title: "TestWork",
        },
        component: () => import("@/views/Dashboard/TestWork.vue"),
      },
    ],
  },
  {
    path: "/form",
    component: BasicLayout,
    meta: {
      icon: "FormOutlined",
      title: "form",
    },
    redirect: '/form/basicForm',
    children: [
      {
        path: "/form/basicForm",
        meta: {
          icon: "",
          title: "basicForm",
        },
        component: () => import("@/views/Form/basicForm.vue"),
      },
      {
        path: "/form/stepForm",
        meta: {
          icon: "",
          title: "stepForm",
        },
        component: () => import("@/views/Form/stepForm.vue"),
      },
    ],
  },
  {
    path: "/account",
    component: BasicLayout,
    meta: {
      icon: "UserOutlined",
      title: "user",
    },
    redirect: '/account/center',
    children: [
      {
        path: "/account/center",
        meta: {
          icon: "",
          title: "center",
        },
        component: () => import("@/views/Account/center/index.vue"),
      },
      {
        path: "/account/settings",
        meta: {
          icon: "",
          title: "settings",
        },
        component: () => import("@/views/Account/settings/index.vue"),
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
