import { createApp } from 'vue'
import Antd from 'ant-design-vue';
import App from './App.vue'

import 'ant-design-vue/dist/antd.css';

import icons from "./icons";
import store from './store';
import router from "./router";
import "./permission";

import "./mock";

createApp(App).use(Antd).use(icons).use(store).use(router).mount('#app')
