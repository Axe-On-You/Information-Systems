import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchGroups = createAsyncThunk(
    'groups/fetchGroups',
    async (_, { getState }) => {
        const { page, size, sortBy, asc, filters } = getState().groups;
        const params = new URLSearchParams({ page, size, sortBy, asc });

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== '') params.append(key, value);
        });

        const response = await api.get(`/study-groups?${params.toString()}`);
        return response.data;
    }
);

export const fetchPersons = createAsyncThunk(
    'groups/fetchPersons',
    async () => {
        const response = await api.get('/persons');
        return response.data;
    }
);

const initialState = {
    data: [],
    persons: [],
    total: 0,
    page: 1,
    size: 10,
    sortBy: 'id',
    asc: true,
    filters: {},
    status: 'idle',
    notification: { open: false, message: '', severity: 'info' }
};

const groupSlice = createSlice({
    name: 'groups',
    initialState,
    reducers: {
        setPagination: (state, action) => {
            state.page = action.payload.page;
            state.size = action.payload.size;
        },
        setSorting: (state, action) => {
            if (state.sortBy === action.payload) {
                state.asc = !state.asc;
            } else {
                state.sortBy = action.payload;
                state.asc = true;
            }
        },
        setFilter: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
            state.page = 1;
        },
        clearAllFilters: (state) => {
            state.filters = {};
            state.page = 1;
        },
        showNotification: (state, action) => {
            state.notification = {
                open: true,
                message: action.payload.message,
                severity: action.payload.severity || 'info'
            };
        },
        hideNotification: (state) => {
            state.notification.open = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGroups.fulfilled, (state, action) => {
                state.data = action.payload.data;
                state.total = action.payload.total;
            })
            .addCase(fetchPersons.fulfilled, (state, action) => {
                state.persons = action.payload;
            });
    }
});

export const { setPagination, setSorting, setFilter, clearAllFilters, showNotification, hideNotification } = groupSlice.actions;
export default groupSlice.reducer;