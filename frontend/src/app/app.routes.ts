import { Routes } from '@angular/router';

import { AppLayout } from './layout/app-layout';

import { Dashboard } from './pages/dashboard/dashboard';
import { Customers } from './pages/customers/customers';
import { Products } from './pages/products/products';
import { Suppliers } from './pages/suppliers/suppliers';
import { PurchaseOrders } from './pages/purchase-orders/purchase-orders';
import { Bom } from './pages/bom/bom';
import { Invoices } from './pages/invoices/invoices';
import { Payments } from './pages/payments/payments';

export const routes: Routes = [
  {
    path: '',
    component: AppLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'customers', component: Customers },
      { path: 'products', component: Products },
      { path: 'suppliers', component: Suppliers },
      { path: 'purchase-orders', component: PurchaseOrders },
      { path: 'boms', component: Bom },
      { path: 'invoices', component: Invoices },
      { path: 'payments', component: Payments }
    ]
  }
];