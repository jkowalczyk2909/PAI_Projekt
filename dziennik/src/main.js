import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

import "@/assets/style.css"

router.beforeEach((to, from, next) => {
  if (typeof to.meta.protected !== "undefined"){
    if (to.meta.protected && localStorage.user_id)
    next();
    else if (to.meta.protected && !localStorage.user_id)
    next('/logout');
    else
    next();
  } 
  else
  next();
});

new Vue({
  render: h => h(App),
  router: router
}).$mount('#app')
