// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import classNames from "classnames";

import { useHttp } from "../../hooks/http.hook";
import { filtersFetching, filtersFetched, filtersFetchingError, activeFilterChanged } from "../../actions";
import Spinner from "../spinner/Spinner";


const HeroesFilters = () => {

    const {filters, filtersLoadingStatus, activeFilter} = useSelector(state => state);
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
                    {/* <button className="btn btn-outline-dark active">Все</button>
                    <button className="btn btn-danger">Огонь</button>
                    <button className="btn btn-primary active">Вода</button>
                    <button className="btn btn-success">Ветер</button>
                    <button className="btn btn-secondary active">Земля</button> */}
                    {btnGroup}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;