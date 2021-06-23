import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import router from "./router";
import { state } from "@/store";

NProgress.configure({     
  easing: 'ease',  // 动画方式    
  speed: 500,  // 递增进度条的速度    
  showSpinner: false, // 是否显示加载ico    
  trickleSpeed: 200, // 自动递增间隔    
  minimum: 0.3 // 初始化时的最小百分比
})

// 全局前置守卫 按照创建顺序调用 守卫是异步执行的
router.beforeEach((to, from, next) => {
  NProgress.start();
  // to 指的是我们即将要到达的路由
  // from 是指正在离开的路由
  // 
  // console.log(useState())
  const { user, token } = state

  if (to.name !== 'login' &&  user.status !== 'ok') {
    if (token) {
      next('/')
    } else {
      next({ name: 'login' })
    }
  } else {
    next()
  }
})

router.afterEach(() => {  
  // 在即将进入新的页面组件前，关闭掉进度条
  NProgress.done()
})
