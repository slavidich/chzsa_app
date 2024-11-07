import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { refreshTokenIfNeeded } from './authUtils'; // 
import { mainAddress } from './app.jsx'; 
import axios from "axios";
import { TextField, Select, MenuItem, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,Box, TablePagination, Paper, CircularProgress, TableSortLabel, ThemeProvider, IconButton, OutlinedInput } from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import "../styles/dataTable.scss"
import { EditableField, theme } from './muiUtil';
import { useSearchParams } from 'react-router-dom';
import WhiteBox from './WhiteBox.jsx'
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import SortIcon from '@mui/icons-material/Sort';


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

function TablePaginationActions(props){
    const {count, page, rowsPerPage, onPageChange} = props

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };
    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };
    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };
    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
    return (
        <div style={{ flexShrink: 0, marginLeft: 16 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                <FirstPageIcon />
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                <KeyboardArrowLeft />
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                <KeyboardArrowRight />
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                <LastPageIcon />
            </IconButton>
        </div>
    );
}
function UniversalTable({columns, path, params, dispatch, pageSize = 10, defaultSortField='id', defaultSortOrder='asc',
                        canAdd=false, actionOnAdd=undefined, 
                        canSearch=false, collapseWidth=740, rowname=''}){
    columns = columns.filter(item=> item!==null)
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    //тут получаем значения из url 
    
    const page = Number(searchParams.get('page')) || 1;
    const rowsPerPage = Number(searchParams.get('rowsPerPage')) || pageSize;
    const sortField = searchParams.get('sortField') || defaultSortField;
    const sortOrder = searchParams.get('sortOrder') || defaultSortOrder;
    const searchField = searchParams.get('searchField') || '';
    const searchValue = searchParams.get('searchValue') || '';

    const [searchText, setSearchText] = useState(searchValue)
    const [searchFieldInput, setSearchField] = useState(searchField)
    
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
        fetchData();
    }, [searchParams]); // Зависимость от searchParams

    const updateUrlParams = (newParams) => {
        const currentParams = Object.fromEntries(searchParams);
        const updatedParams = { ...currentParams };
    
        Object.entries(newParams).forEach(([key, value]) => {
            if (value === undefined) {
                delete updatedParams[key];
            } else {
                updatedParams[key] = value;
            }
        });
    
        setSearchParams(updatedParams);
    };
    const handleAddClick = ()=>{
        if (actionOnAdd){
            actionOnAdd()
        }else{
            navigate('new', {state:{from: location.pathname+location.search}})
        }
        
    }
    const handleRowClick =(row)=>{
        //navigate(`${row.id}`, {state:{from: location.pathname+location.search}})
        navigate(`${row.id}`)
    }

    const handleChangePage = (event, newPage) => {
        updateUrlParams({page:newPage+1});
    };
    
    const handleChangeRowsPerPage = (event) => {
        const rowsPerPage = parseInt(event.target.value, 10)
        updateUrlParams({rowsPerPage:rowsPerPage===10?undefined:rowsPerPage, page:1})
    };
    
    const handleSort = (field) => {
        const isAsc = sortField === field && sortOrder === 'asc';
        updateUrlParams({sortOrder:isAsc ? 'desc' : undefined, sortField:field==='id'?undefined:field})
    };
    const handleSearch = () => {
        updateUrlParams({searchValue:searchText, page:1, searchField:searchFieldInput})

    };
    const handleSearchCancel = async ()=>{
        updateUrlParams({searchField:undefined, searchValue:undefined, page:1})
        setSearchText('')
        setSearchField('')
    }

    return(
    <ThemeProvider theme={theme}>
        {windowWidth<collapseWidth?
            <>
            <div className="filters">
                <Paper sx={{
                    display: 'flex',
                    flexDirection: 'column'
                }}>     
                        <div className='buttonadd'>
                        {canAdd&&
                        <Button variant="contained" color="primary" onClick={handleAddClick}>
                            Добавить
                        </Button>
                        }
                        </div>
                        
                        <div className='searchdiv'>
                        <h3>Поиск</h3>
                        <Select
                            value={searchFieldInput}
                            onChange={(e) => setSearchField(e.target.value)}
                            displayEmpty
                            sx={{minWidth:'100%',display:'flex',textAlign:'center', justifyContent:'center', alignItems:'center'}}
                        >
                        <MenuItem sx={{minWidth:'100%',display:'flex',textAlign:'center', justifyContent:'center', alignItems:'center'}}value='' disabled>
                            Выберите поле для поиска
                        </MenuItem>
                        {columns.map((column, index) => (
                            <MenuItem key={index} sx={{minWidth:'100%',display:'flex',textAlign:'center', justifyContent:'center', alignItems:'center'}}  value={column.field}>
                                {column.header}
                            </MenuItem>
                        ))}
                        </Select>
                        <div className='search'>
                            <OutlinedInput
                                
                                placeholder="Поиск"
                                
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                disabled={searchFieldInput===''? true:false}
                            />
                            <Button variant="contained" onClick={handleSearch} disabled={searchText!=''?false:true}>
                                <SearchIcon/>
                            </Button>
                            <Button variant="contained" onClick={handleSearchCancel} disabled={searchValue!=''?false:true}>
                                <SearchOffIcon/>
                            </Button>
                        </div>
                        </div>
                        <div className="sort">
                            <h3>Сортировка</h3>
                            <div>
                                <Select 

                                    value={sortField}
                                    onChange={(e)=> handleSort(e.target.value)}
                                    sx={{display:'flex', justifyContent:'center'}}
                                >
                                    {columns.map((column, index) => (
                                        <MenuItem key={index} sx={{display:'flex',textAlign:'center', justifyContent:'center', alignItems:'center'}}  value={column.field}>
                                            {column.header}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <Button variant="contained" className='' onClick={()=>updateUrlParams({sortOrder:sortOrder==='asc'? 'desc':undefined})}>
                                    <SortIcon  className={`sortsvg ${sortOrder==='asc'?'':'reverse'}`}/>
                                </Button>
                            </div>
                        </div>
                              
                </Paper>
                <div className='mobilepagination'>
                            
                            <TablePaginationActions
                                count={totalCount}
                                page={page-1}
                                rowsPerPage={10}
                                onPageChange={handleChangePage}
                            />
                        </div>     
            </div>
            {loading&&<div className='mobileloading'><CircularProgress /></div>}
            {!loading&&(<div className='items'>
                                        
                {data.map((row, index)=>{
                    
                    return(
                        <WhiteBox  key={index} headerText={`${rowname} ID:${row['id']}`} className='item'>
                            {columns.map((column, index)=>{
                                if (column.field=='id') return null
                                return <EditableField
                                    key={index}
                                    name={column.header}
                                    isEditing={false}
                                    label={column.header}
                                    value={row[column.field]}
                                />
                            })}
                            <div className='itembutton'>
                                <Button variant="contained" color="primary" onClick={()=>handleRowClick(row)}>
                                    Подробнее
                                </Button>
                            </div>
                        </WhiteBox>)
                })}
            </div>)}
            </>
        :
        <Paper>
                {canSearch&&
                <div className="table">
                    {canAdd&&<div className="addButton">
                            <Button variant="contained" color="primary" onClick={handleAddClick}>
                                Добавить
                            </Button>
                        </div>}
                    <div className="searchdiv">
                        
                        <Select
                            value={searchFieldInput}
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
                            disabled={searchFieldInput===''? true:false}
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
                                        title={column.maxLength===undefined?undefined:row[column.field].length>column.maxLength?`${row[column.field]}`:undefined}
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
                ActionsComponent={TablePaginationActions}
            />
        </Paper>}
    </ThemeProvider>
    )
}

export default UniversalTable