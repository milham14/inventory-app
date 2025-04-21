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
                component: UserComponent
            },
            {
                path: 'role',
                component: RoleComponent
            },
            {
                path: 'permission',
                component: PermissionComponent
            },
            {
                path: 'material',
                component: MaterialComponent
            },
            {
                path: 'part',
                component: PartComponent
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
];
