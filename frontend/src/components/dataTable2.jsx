import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { refreshTokenIfNeeded } from './authUtils'; // 
import { mainAddress } from './app.jsx'; 
import axios from "axios";
import { TextField, Select, MenuItem, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, Paper, CircularProgress, TableSortLabel, ThemeProvider } from '@mui/material';
import "../styles/dataTable.scss"
import { theme } from './muiUtil';
import { useSearchParams } from 'react-router-dom';


export const getData = async({path, params, dispatch, setLoading, setData, setTotalPages, setTotalCount, page_size})=>{
    setLoading(true);
    try{
        await refreshTokenIfNeeded(dispatch)
        const response = await axios.get(`${mainAddress+path}`,{
            params:{ 
                ...params,
                page_size: page_size===10? undefined: page_size 
            },
            withCredentials: true
        })
        setData(response.data.results)
        setTotalCount===undefined?  undefined:parseInt(setTotalCount(response.data.count));
        setTotalPages===undefined?  undefined:setTotalPages(Math.ceil(response.data.count / page_size));
    }catch(error){
        if (error.response && error.response.status === 403) {
            return <Navigate to="/forbidden" replace />;
        }
        setData([])
    }finally{
        setLoading(false)
    }
}

function UniversalTable({columns, path, params, dispatch, pageSize = 10, defaultSortField='id', defaultSortOrder='asc', resetParamsKey=null,
                        canAdd=false, actionOnAdd=undefined, 
                        canSearch=false}){
    
    const query = useQuery();
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
    const [rowsPerPage, setRowsPerPage] = useState(Number(query.get('rowsPerPage')) || pageSize);
    const [sortField, setSortField] = useState(query.get('sortField') || defaultSortField);
    const [sortOrder, setSortOrder] = useState(query.get('sortOrder') || defaultSortOrder);
    const [searchField, setSearchField] = useState(query.get('searchField') || '');
    const [searchText, setSearchText] =  useState(query.get('searchValue') || '');
    const [searchValue, setSearchValue] = useState(query.get('searchValue') || '');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    
    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const fetchData = async () => {
        await getData({
            path: path,
            params:{
                ...params,
                page:page,
                sortField: sortField===''? undefined: sortField,
                sortOrder: sortOrder==='asc'? undefined: sortOrder,
                searchField: searchField === '' ? undefined : searchField,
                searchValue: searchValue === '' ? undefined : searchValue,
            },
            dispatch: dispatch,
            setLoading: setLoading,
            setData: setData,
            setTotalCount: setTotalCount,
            setTotalPages: setTotalPages,
            page_size: rowsPerPage
        })
    };
    
    useEffect(() => {
        const urlparams = new URLSearchParams();
        if (params){
            Object.entries(params).forEach(([key, value])=>{
            if (value){
                urlparams.set(key, value)
            }
        })}
        urlparams.set('page', page);
        rowsPerPage===10?undefined:urlparams.set('rowsPerPage', rowsPerPage);
        sortField==='id'&&sortOrder==='asc'?undefined:urlparams.set('sortField', sortField);
        sortOrder==='asc'?undefined:urlparams.set('sortOrder', sortOrder);
        if (searchField) urlparams.set('searchField', searchField);
        if (searchValue) urlparams.set('searchValue', searchValue);
        navigate({ search: urlparams.toString() }, { replace: true });
        fetchData();
        
    }, [page, rowsPerPage, sortField, sortOrder, params, searchValue]);

    const handleAddClick = ()=>{
        if (actionOnAdd){
            actionOnAdd()
        }else{
            navigate('new', {state:{from: location.pathname+location.search}})
        }
        
    }
    const handleRowClick =(row)=>{
        navigate(`${row.id}`, {state:{from: location.pathname+location.search}})
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage+1);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };
    
    const handleSort = (field) => {
        const isAsc = sortField === field && sortOrder === 'asc';
        setSortOrder(isAsc ? 'desc' : 'asc');
        setSortField(field);
    };
    const handleSearch = () => {
        console.log('4')
        setSearchValue(searchText)
        setPage(1);  // При новом поиске возвращаемся на первую страницу
    };
    const handleSearchCancel = async ()=>{
        console.log('5')
        setPage(1);
        setSearchText('')
        setSearchValue('')
        setSearchField('')
    }

    return(<ThemeProvider theme={theme}>
        <Paper>
                {canSearch&&
                <div className="table">
                    {canAdd&&<div className="addButton">
                            <Button variant="contained" color="primary" onClick={handleAddClick}>
                                {/*<AddIcon/>*/}
                                Добавить
                            </Button>
                        </div>}
                    <div className="searchdiv">
                        
                        <Select
                            value={searchField}
                            onChange={(e) => setSearchField(e.target.value)}
                            displayEmpty
                        >
                            <MenuItem value="" disabled>
                                Поле для поиска
                            </MenuItem>
                            {columns.map((column) => (
                                <MenuItem key={column.field} value={column.field}>
                                    {column.header}
                                </MenuItem>
                            ))}
                        </Select>
                        <TextField
                            label="Поиск"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            disabled={searchField===''? true:false}
                        />
                        <Button variant="contained" onClick={handleSearch} disabled={searchText!=''?false:true}>
                            Искать
                        </Button>
                        <Button variant="contained" onClick={handleSearchCancel} disabled={searchValue!=''?false:true}>
                            Сбросить
                        </Button>
                        
                    </div>
                    
                </div>}    
               
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.field}
                                    className={windowWidth <= column.hideWhenWidth ? 'hidden-column' : ''}
                                    sortDirection={sortField === column.field ? sortOrder : false}
                                >
                                    <TableSortLabel
                                        active={sortField === column.field}
                                        direction={sortField === column.field ? sortOrder : 'asc'}
                                        onClick={() => handleSort(column.field)}
                                    >
                                        {column.header}
                                    </TableSortLabel>
                                </TableCell>
                                
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((row, index) => (
                                <TableRow 
                                    key={index}
                                    className="table-row-hover"
                                    style={{ 
                                        backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'white', // Чередуем цвета строк
                                        cursor: 'pointer',
                                    }}
                                    onClick={()=>handleRowClick(row)}
                                    /*onClick={() => window.open(`/path/${row.id}`, '_blank')} */ // это на случай если в новой вкладке будет результативнее открывать все это 
                                >
                                    {columns.map((column) => (
                                        <TableCell key={column.field}
                                        className={windowWidth <= column.hideWhenWidth ? 'hidden-column' : ''}
                                        
                                        style={{}}
                                        >{column.maxLength!=undefined?
                                            row[column.field].length>column.maxLength?`${row[column.field].slice(0,column.maxLength)}...`:row[column.field]
                                            :row[column.field]}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                        
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page-1}
                onPageChange={handleChangePage}
                labelRowsPerPage={"Строк на страницу"} 
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    </ThemeProvider>
    )
}

export default UniversalTable