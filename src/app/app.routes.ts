import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
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
        path: 'admin',
        component: AdminComponent,
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
                path: 'user',
                component: UserComponent,
                canActivate: [RoleGuard],
                data: { role: 1 } 
            },
            {
                path: 'role',
                component: RoleComponent,
                canActivate: [RoleGuard],
                data: { role: 1 } 
            },
            {
                path: 'permission',
                component: PermissionComponent,
                canActivate: [RoleGuard],
                data: { role: 1 } 
            },
            {
                path: 'material',
                component: MaterialComponent,
                canActivate: [RoleGuard],
                data: { role: 1 } 
            },
            {
                path: 'part',
                component: PartComponent,
                canActivate: [RoleGuard],
                data: { role: 1 } 
            },
            {
                path: 'supplier',
                component: SupplierComponent,
                canActivate: [RoleGuard],
                data: { role: 1 } 
            },
            {
                path: 'customer',
                component: CustomerComponent,
                canActivate: [RoleGuard],
                data: { role: 1 } 
            },
            {
                path: 'contact',
                component: ContactComponent
            },
            {
                path: 'accept-material',
                component: AcceptMaterialComponent
            },
            {
                path: 'list-material',
                component: ListMaterialComponent
            }
        ]
    },
    { path: 'forbidden', component: ForbiddenComponent },
];
