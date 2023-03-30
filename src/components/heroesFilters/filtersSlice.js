import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";

const filtersAdapter = createEntityAdapter();

const initialState = filtersAdapter.getInitialState({
    filtersLoadingStatus: 'idle',
    activeFilter: 'all'
})

export const filtersFetch = createAsyncThunk(
    'filters/filtersFetch',
    async() => {
        const {request} = useHttp();
        return await request("http://localhost:3001/filters");
    }
);

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        activeFilterChanged: (state, action) => {
            state.activeFilter = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(filtersFetch.pending, state => {
                state.filtersLoadingStatus = 'loading';
            })
            .addCase(filtersFetch.fulfilled, (state, action) => {
                state.filtersLoadingStatus = 'idle';
                filtersAdapter.setAll(state, action.payload);
            })
            .addCase(filtersFetch.rejected, state => {
                state.filtersLoadingStatus = 'error';
            })
            .addDefaultCase(() => {})
    }
})

const {actions, reducer} = filtersSlice;

export default reducer;

export const {
    filtersFetching,
    filtersFetched,
    filtersFetchingError,
    activeFilterChanged
} = actions;

export const {selectAll} = filtersAdapter.getSelectors(state => state.filters);

