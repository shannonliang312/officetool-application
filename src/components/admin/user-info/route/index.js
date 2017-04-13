const UserInfo = resolve => require(['../user-info'], resolve);

export default [
  { path: "/admin/users-info", component: UserInfo  }
]