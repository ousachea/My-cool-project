import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _79a28109 = () => interopDefault(import('../pages/Gold.vue' /* webpackChunkName: "pages/Gold" */))
const _3bd71f8b = () => interopDefault(import('../pages/MPG.vue' /* webpackChunkName: "pages/MPG" */))
const _d5994a4a = () => interopDefault(import('../pages/Temperature.vue' /* webpackChunkName: "pages/Temperature" */))
const _62584699 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/Gold",
    component: _79a28109,
    name: "Gold"
  }, {
    path: "/MPG",
    component: _3bd71f8b,
    name: "MPG"
  }, {
    path: "/Temperature",
    component: _d5994a4a,
    name: "Temperature"
  }, {
    path: "/",
    component: _62584699,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
