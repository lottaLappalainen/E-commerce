import { Routes } from '@angular/router';

import { HomePageComponent } from './components/home-page/home-page.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { LoginComponent } from './features/auth/login/login.component';
import { ProductsComponent } from './features/product/products/products.component';
import { ProductDetailsComponent } from './features/product/product-details/product-details.component';
import { CartComponent } from './features/cart/cart/cart.component';
import { OrdersComponent } from './features/order/orders/orders.component';
import { OrderDetailsComponent } from './features/order/order-details/order-details.component';
import { ModifyProductComponent } from './features/product/modify-product/modify-product.component';
import { UsersComponent } from './features/users/users/users.component';
import { UserDetailsComponent } from './features/users/user-details/user-details.component';
import { UserModifyComponent } from './features/users/user-modify/user-modify.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:productId', component: ProductDetailsComponent },
  { path: 'products/:productId/modify', component: ModifyProductComponent },
  { path: 'cart', component: CartComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'orders/:orderId', component: OrderDetailsComponent },
  { path: 'users', component: UsersComponent },
  { path: 'users/:userId', component: UserDetailsComponent },
  { path: 'users/:userId/modify', component: UserModifyComponent },
];