const ToolsInfo = resolve => require(['../tools-info'], resolve);

export default [
  { path: "/admin/tools-info", component: ToolsInfo,meta: { requireAdmin: "true" }  }
]