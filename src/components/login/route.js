const Login = resolve => require(['./login.vue'], resolve);

export default [
  { path: "/login", component: Login  }
]