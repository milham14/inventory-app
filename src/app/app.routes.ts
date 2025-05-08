  import { Routes } from '@angular/router';
  import { LoginComponent } from './components/login/login.component';
  import { ScopeComponent } from './components/scope/scope.component';
  import { DashboardComponent } from './components/dashboard/dashboard.component';
  import { AcceptMaterialComponent } from './components/material/accept-material/accept-material.component';
  import { ListMaterialComponent } from './components/material/list-material/list-material.component';
  import { ContactComponent } from './components/contact/contact.component';
  import { UserComponent } from './components/data/user/user.component';
  import { RoleComponent } from './components/data/role/role.component';
  import { PermissionComponent } from './components/data/permission/permission.component';
  import { MaterialComponent } from './components/data/material/material.component';
  import { PartComponent } from './components/data/part/part.component';
  import { SupplierComponent } from './components/data/supplier/supplier.component';
  import { CustomerComponent } from './components/data/customer/customer.component';
  import { authGuard } from './components/auth/auth.guard';
  import { ForbiddenComponent } from './forbidden/forbidden.component';
  import { RoleGuard } from './components/auth/role.guard';
  import { ListSupplierComponent } from './components/material/list-supplier/list-supplier.component';
  import { SembadaInComponent } from './components/data/subcont/sembada/sembada-in/sembada-in.component';
  import { NotFoundComponent } from './not-found/not-found.component';
  import { SembadaOutComponent } from './components/data/subcont/sembada/sembada-out/sembada-out.component';
  import { BkuInComponent } from './components/data/subcont/bku/bku-in/bku-in.component';
import { BkuOutComponent } from './components/data/subcont/bku/bku-out/bku-out.component';

  export const routes: Routes = [
      {
          path: '',
          component: LoginComponent
      },
      {
          path: 'login',
          component: LoginComponent
      },
      {
          path: 'scope',
          component: ScopeComponent,
          canActivate:[authGuard],
          children: [
              {
                  path: '',
                  component: DashboardComponent
              },
              {
                  path: 'dashboard',
                  component: DashboardComponent
              },
              {
                path: 'contact',
                component: ContactComponent
              },
              {
                  path: 'master',
                  children: [
                      {
                          path: 'user',
                          component: UserComponent,
                          canActivate: [RoleGuard],
                          data: {
                              permissions: [
                                'view.user',
                                'create.user',
                                'edit.user',
                                'delete.user'
                              ]
                            }
                      },
                      {
                          path: 'role',
                          component: RoleComponent,
                          canActivate: [RoleGuard],
                          data: {
                              permissions: [
                                'view.role',
                                'create.role',
                                'edit.role',
                                'delete.role'
                              ]
                            }
                      },
                      {
                          path: 'permission',
                          component: PermissionComponent,
                          canActivate: [RoleGuard],
                          data: {
                              permissions: [
                                'view.permission',
                                'create.permission',
                                'edit.permission',
                                'delete.permission'
                              ]
                            }
                      },
                      {
                          path: 'material',
                          component: MaterialComponent,
                          canActivate: [RoleGuard],
                          data: {
                              permissions: [
                                'view.material',
                                'create.material',
                                'edit.material',
                                'delete.material'
                              ]
                            }
                      },
                      {
                          path: 'part',
                          component: PartComponent,
                          canActivate: [RoleGuard],
                          data: {
                              permissions: [
                                'view.part',
                                'create.part',
                                'edit.part',
                                'delete.part'
                              ]
                            }
                      },
                      {
                          path: 'supplier',
                          component: SupplierComponent,
                          canActivate: [RoleGuard],
                          data: {
                              permissions: [
                                'view.supplier',
                                'create.supplier',
                                'edit.supplier',
                                'delete.supplier'
                              ]
                            }
                      },
                      {
                          path: 'customer',
                          component: CustomerComponent,
                          canActivate: [RoleGuard],
                          data: {
                              permissions: [
                                'view.customer',
                                'create.customer',
                                'edit.customer',
                                'delete.customer'
                              ]
                            }
                      }
                  ]
              },
              {
                path: 'material',
                children: [
                {
                    path: 'accept-material',
                    component: AcceptMaterialComponent
                },
                {
                    path: 'list-material',
                    component: ListMaterialComponent
                },
                {
                    path: 'list-supplier',
                    component: ListSupplierComponent
                },
                ]
              },
              {
                  path: 'sembada-in',
                  component: SembadaInComponent
              },
              {
                path: 'sembada-out',
                component: SembadaOutComponent
              },
              {
                path: 'bku-in',
                component: BkuInComponent
              },
              {
                path: 'bku-out',
                component: BkuOutComponent
              }
          ]
      
      },
      { path: 'forbidden', component: ForbiddenComponent },
      { path: '**', component: NotFoundComponent }
  ];
