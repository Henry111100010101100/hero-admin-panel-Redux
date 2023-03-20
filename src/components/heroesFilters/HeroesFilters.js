import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import classNames from "classnames";

import { useHttp } from "../../hooks/http.hook";
import { filtersFetching, filtersFetched, filtersFetchingError, activeFilterChanged } from "../../actions";
import Spinner from "../spinner/Spinner";


const HeroesFilters = () => {

    const {filters, filtersLoadingStatus, activeFilter} = useSelector(state => state.filters);
    const {request} = useHttp();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(filtersFetching());
        request("http://localhost:3001/filters")
            .then(data => dispatch(filtersFetched(data)))
            .catch(() => dispatch(filtersFetchingError()))

        // eslint-disable-next-line
    }, []);

    if (filtersLoadingStatus === 'loading') {
        return <Spinner/>;
    } else if (filtersLoadingStatus === 'error') {
        return <div className="text-center mt-5">Ошибка при загрузке фильтров</div>
    }

    const renderFiltersButtons = (arr) => {
        if (arr.length === 0) {
            return <div className="text-center mt-5">К сожалению, фильтры не прогрузились, попробуйте перезагрузить страницу</div>
        }

        return arr.map(({id, name, label, classes}) => {
            const btnClasses = classNames(classes, {
                'active': activeFilter === name
            })
            return <button 
                    key={id}
                    name={name} 
                    className={btnClasses} 
                    onClick={() => dispatch(activeFilterChanged(name))}>
                        {label}
                    </button>
        })
    }

    const btnGroup = renderFiltersButtons(filters);

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {btnGroup}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;