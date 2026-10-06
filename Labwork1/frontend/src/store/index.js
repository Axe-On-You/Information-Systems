import { configureStore } from '@reduxjs/toolkit';
import groupReducer from './groupSlice';

export const store = configureStore({
    reducer: {
        groups: groupReducer
    }
});