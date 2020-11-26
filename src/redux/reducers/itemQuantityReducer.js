import {SET_ITEM_QUANTITY, SET_ITEM_QUANTITY_CODE } from "../actionTypes";

const initialState = {
    itemQuantityHashMap: {},
    itemQuantityCode: {},
	nameItemHashMap: {},
	itemNameArray: []
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_ITEM_QUANTITY: {
            //console.log("The content to be updated: ",action);
            const itemQuantityHashMap = action.payload;
            //console.log("Current appUser ",idAppUser);
            return {
                ...state,
                itemQuantityHashMap: itemQuantityHashMap
            };
        }
        case SET_ITEM_QUANTITY_CODE:{
            //console.log("The content to be updated: ",action);
	        //console.log('payload: ',action.payload);
            const {itemQuantityCode, nameItemHashMap, itemNameArray} = action.payload;
            //console.log("Current appUser ",idAppUser);
            return {
                ...state,
                itemQuantityCode: itemQuantityCode,
	            nameItemHashMap: nameItemHashMap,
	            itemNameArray: itemNameArray
            };
        }
        default:
            return state;
    }
}
