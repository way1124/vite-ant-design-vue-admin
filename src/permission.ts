import router from "./router";
import { state } from "@/store";

// 全局前置守卫 按照创建顺序调用 守卫是异步执行的
router.beforeEach((to, from, next) => {
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
