/**
 * path: 菜单路径
 * name: 菜单名
 * fullName： 菜单全名
 * component： 对应的组件
 * authority：菜单权限值，除可通用的菜单，其他菜单需设置值
 *  【customer_relations_manager 为管理员权限，拥有所有菜单权限】
 * hideInMenu： 是否展示在左侧菜单栏
 * icon： 左侧菜单栏图标
 * routes: 菜单的子菜单路由
 */

const RouteWatcher = '../layouts/RouteWatcher';
const routes = [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/TabLayout',
            flatMenu: true, // lift sub-routes up to top
            routes: [
              {
                path: '/',
                redirect: '/welcome',
                wrappers: [RouteWatcher],
              },
              {
                path: '/welcome',
                name: 'welcome',
                icon: 'smile',
                component: './HomePage',
                fullName: 'menu.welcome',
                wrappers: [RouteWatcher],
              },
              // 客户
              {
                path: '/customer',
                name: 'customer',
                icon: 'ContactsOutlined',
                authority: ['customer_relations_manager', 'customer_relations_menu_customers'],
                routes: [
                  {
                    path: '/customer/list',
                    name: 'list',
                    component: './Customer/CustomerList',
                    authority: ['customer_relations_manager', 'customer_relations_page_customers_list'],
                    fullName: 'menu.customer.list',
                    wrappers: [RouteWatcher],
                  },
                  {
                    path: '/customer/myCustomerlist',
                    name: 'myCustomerlist',
                    component: './Customer/MyCustomer',
                    authority: ['customer_relations_manager', 'customer_relations_page_my_customers'],
                    fullName: 'menu.customer.myCustomerlist',
                    wrappers: [RouteWatcher],
                  },
                  {
                    path: '/customer/customerAssignment',
                    name: 'customerAssignment',
                    component: './Customer/CustomerAssignment',
                    authority: ['customer_relations_manager', 'customer_relations_page_customers_assignment'],
                    fullName: 'menu.customer.customerAssignment',
                    wrappers: [RouteWatcher],
                  },
                  {
                    path: '/customer/customerDetails/:type(all|mine)/:id',
                    name: 'customerDetails',
                    component: './Customer/CustomerDetails',
                    authority: ['customer_relations_manager', 'customer_relations_page_customers_details'],
                    fullName: 'menu.customer.customerDetails',
                    wrappers: [RouteWatcher],
                    hideInMenu: true,
                  },
                ],
              },
              // 报表
              {
                path: '/reports',
                name: 'reports',
                icon: 'FileTextOutlined',
                authority: ['customer_relations_manager', 'customer_relations_menu_reports'],
                routes: [
                  {
                    path: '/reports/salesReports',
                    name: 'salesReports',
                    component: './Reports/SalesReports',
                    authority: ['customer_relations_manager', 'customer_relations_page_sales_reports'],
                    fullName: 'menu.reports.salesReports',
                    wrappers: [RouteWatcher],
                  },
                  {
                    path: '/reports/usersReports',
                    name: 'usersReports',
                    component: './Reports/UsersReports',
                    authority: ['customer_relations_manager', 'customer_relations_page_users_reports'],
                    fullName: 'menu.reports.usersReports',
                    wrappers: [RouteWatcher],
                  },
                  {
                    path: '/reports/inquiryReports',
                    name: 'inquiryReports',
                    component: './Reports/InquiryReports',
                    authority: ['customer_relations_manager', 'customer_relations_page_inquiry_reports'],
                    fullName: 'menu.reports.inquiryReports',
                    wrappers: [RouteWatcher],
                  },
                  {
                    path: '/reports/dataAuthorization',
                    name: 'dataAuthorization',
                    component: './Reports/DataAuthorization',
                    authority: ['customer_relations_manager', 'customer_relations_page_data_authorization'],
                    fullName: 'menu.reports.dataAuthorization',
                    wrappers: [RouteWatcher],
                  },
                  {
                    path: '/reports/authorization/add',
                    name: 'addAuthorization',
                    component: './Reports/AuthorizationDetail',
                    authority: ['customer_relations_manager', 'customer_relations_page_data_authorization_add'],
                    fullName: 'menu.reports.addAuthorization',
                    wrappers: [RouteWatcher],
                    hideInMenu: true,
                  },
                  {
                    path: '/reports/authorization/edit/:id/:uid?',
                    name: 'editAuthorization',
                    component: './Reports/AuthorizationDetail',
                    authority: ['customer_relations_manager', 'customer_relations_page_data_authorization_edit'],
                    fullName: 'menu.reports.editAuthorization',
                    wrappers: [RouteWatcher],
                    hideInMenu: true,
                  },
                ],
              },
              // 审批
              {
                path: '/approval',
                name: 'approval',
                icon: 'AuditOutlined',
                authority: ['customer_relations_manager', 'customer_relations_menu_approval'],
                routes: [
                  {
                    path: '/approval/myApplication',
                    name: 'myApplication',
                    component: './Approval',
                    authority: ['customer_relations_manager', 'customer_relations_page_approval_my_apply'],
                    fullName: 'menu.approval.myApplication',
                    wrappers: [RouteWatcher],
                  },
                  {
                    path: '/approval/myApproval',
                    name: 'myApproval',
                    component: './Approval',
                    authority: ['customer_relations_manager', 'customer_relations_page_approval_my_audit'],
                    fullName: 'menu.approval.myApproval',
                    wrappers: [RouteWatcher],
                  },
                  {
                    path: '/approval/myFinished',
                    name: 'myFinished',
                    component: './Approval',
                    authority: ['customer_relations_manager', 'customer_relations_page_approval_my_finished'],
                    fullName: 'menu.approval.myFinished',
                    wrappers: [RouteWatcher],
                  },
                  {
                    path: '/approval/all',
                    name: 'all',
                    component: './Approval',
                    authority: ['customer_relations_manager', 'customer_relations_page_approval_all'],
                    fullName: 'menu.approval.all',
                    wrappers: [RouteWatcher],
                  },
                ],
              },
              {
                path: '/exception/403',
                component: './403',
              },
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];

export default routes;
