import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	items: [],
	userId: null, 
}

const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		setUserId(state, action) {
			state.userId = action.payload;
		},
		addItem(state, action) {
			const item = action.payload;
			const existingItem = state.items.find(
				(i) => i._id === item._id && i.userId === state.userId,
			);

			if (existingItem) {
				existingItem.quantity = (existingItem.quantity || 0) + 1; 
			} else {
				state.items.push({ ...item, userId: state.userId, quantity: 1 }); 
			}

			localStorage.setItem("cart", JSON.stringify(state.items));
		},

		removeItem(state, action) {
			const { _id } = action.payload;
			state.items = state.items.filter((item) => item._id !== _id);
			localStorage.setItem("cart", JSON.stringify(state.items));
		},
		removeItemsByUserId(state) {
			state.items = state.items.filter((item) => item.userId !== state.userId);
			localStorage.setItem("cart", JSON.stringify(state.items));
		},
	},
});

export const { addItem, removeItem, setUserId, removeItemsByUserId } =
	cartSlice.actions;

export default cartSlice.reducer;
