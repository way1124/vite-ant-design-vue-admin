import { createApp } from 'vue'
import Antd from 'ant-design-vue';
import App from './App.vue'

import 'ant-design-vue/dist/antd.less';
import './global.less';

import icons from "./icons";
import store from './store';
import router from "./router";
import "./permission";

import "./mock";

createApp(App).use(store).use(Antd).use(icons).use(router).mount('#app')
