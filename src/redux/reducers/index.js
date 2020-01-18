import { combineReducers } from "redux";
import appUserReducer from "./appUserReducer";
import moduleReducer from "./moduleReducer";
import shiftReducer from "./shiftReducer";
import clientReducer from "./clientReducer";
import itemQuantityReducer from "./itemQuantityReducer";
import warehouseReducer from "./warehouseReducer";
import companyReducer from "./companyReducer";

export default combineReducers({ appUserReducer, moduleReducer, shiftReducer,
    clientReducer, itemQuantityReducer, warehouseReducer, companyReducer});