import React from 'react';
/*
const Breadcrumbs = React.lazy(() => import('./views/Base/Breadcrumbs'));
const Cards = React.lazy(() => import('./views/Base/Cards'));
const Carousels = React.lazy(() => import('./views/Base/Carousels'));
*/

//NEWS
const Dashboard = React.lazy(()=>import('./views/Dashboard/Dashboard'));

//SHIFT
const Shift = React.lazy(() =>import('./views/Shift/Shift'));

//USER
const AppUserProfile = React.lazy(()=>import('./views/AppUserProfile/AppUserProfile'));
const AppUserForm = React.lazy(()=>import('./views/AppUserForm/AppUserForm'));
const AppUser = React.lazy(()=>import('./views/AppUser/AppUser'));
const EditAppUser = React.lazy(()=>import('./views/EditAppUser/EditAppUser'));

//CLIENT
const Client = React.lazy(()=>import('./views/Client/Client'));
const ClientProfile = React.lazy(()=>import('./views/ClientProfile/ClientProfile'));

//SUPPLIER
const Supplier = React.lazy(()=>import('./views/Supplier/Supplier'));
const SupplierProfile = React.lazy(()=>import('./views/SupplierProfile/SupplierProfile'));

//ITEMS
const ItemManager = React.lazy(()=>import('./views/ItemManager/ItemManager'));

//SALE
const Sale = React.lazy(()=>import('./views/Sale/Sale'));
const SaleProfile = React.lazy(()=>import('./views/SaleProfile/SaleProfile'));
const MakeSale = React.lazy(()=>import('./views/MakeSale/MakeSale'));
const MakeSaleForm = React.lazy(()=>import('./views/MakeSaleForm/MakeSaleForm'));

//PURCHASE
const Purchase = React.lazy(()=>import('./views/Purchase/Purchase'));
const PurchaseManager = React.lazy(()=>import('./views/PurchaseManager/PurchaseManager'));

//WAREHOUSE
const WarehouseTable = React.lazy(()=>import('./views/Warehouse/Warehouse'));
const Item = React.lazy(()=>import('./views/Item/Item'));
const WarehouseItemQuantityTransfer = React.lazy(()=>import('./views/WarehouseItemQuantityTransfer/WarehouseItemQuantityTransfer'));
//ADMINISTRATION
const Permits = React.lazy(() => import('./views/Administration/Permits'));
const AddFile = React.lazy(() => import('./views/Administration/AddFile'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
    { path: '/', exact: true, name: 'Home' },
    { path: '/Dashboard', name: 'Dashboard', component: Dashboard },
    /*
        { path: '/theme', exact: true, name: 'Theme', component: Colors },
    */

    //Shift - Caja
    { path: '/Shift', name: 'Shift', component: Shift },

    //AppUser - Usuarios
    { path:'/AppUser',name:'AppUser',component: AppUser},
    { path:'/AppUserForm',name:'AppUserForm',component: AppUserForm},
    { path:'/AppUserProfile',name:'AppUserProfile',component: AppUserProfile},
    { path:'/EditAppUser',name:'EditAppUser',component: EditAppUser},

    //Clientes - clientes
    { path:'/Client',name:'Client',component: Client},
    { path:'/ClientProfile',name:'ClientProfile',component: ClientProfile},

    //Supplier - proveedores
    { path:'/Supplier',name:'Supplier',component: Supplier},
    { path:'/SupplierProfile',name:'SupplierProfile',component: SupplierProfile},

    //ITEMS - Items
    { path:'/ItemManager',name:'ItemManager',component: ItemManager},

    //Warehouse - Almacenes

    { path:'/Warehouse',name:'Warehouse',component: WarehouseTable},
    { path:'/Item',name:'Item',component: Item},
    { path:'/WarehouseItemQuantityTransfer',name:'WarehouseTransfer',component: WarehouseItemQuantityTransfer},

    //Sale - sale
    { path:'/MakeSale',name:'MakeSale',component: MakeSale},
    { path:'/Sale',name:'Sale',component: Sale},
    { path:'/SaleProfile',name:'SaleProfile',component: SaleProfile},
    { path:'/MakeSaleForm',name:'MakeSaleForm',component: MakeSaleForm},

    //Purchase - compras
    { path:'/Purchase',name:'Purchase',component: Purchase},
    { path:'/PurchaseManager',name:'PurchaseManager',component: PurchaseManager},

    //Administration - Administracion

    { path:'/Permisos',name:'Permits',component: Permits},
    { path:'/AgregarArchivo',name:'AddFile',component: AddFile}

];

export default routes;
