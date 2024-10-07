import React, { useEffect, useState } from "react";
import { Navigate } from 'react-router-dom';
import { refreshTokenIfNeeded } from './authUtils'; // 
import { mainAddress } from './app.jsx'; 
import axios from "axios";
import { TextField, Select, MenuItem, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, Paper, CircularProgress, TableSortLabel, ThemeProvider } from '@mui/material';
import "../styles/dataTable.scss"
import { theme } from './muiUtil';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ModalWindow from "./ModalWindow.jsx";
import DialogContent from "@mui/material/DialogContent";

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

function UniversalTable({columns, path, params, dispatch, pageSize = 10, defaultSortField='id', defaultSortOrder='asc', refreshKey=null,
                        canAdd=false, actionOnAdd=undefined, 
                        canSearch=false, 
                        canDelete = false, actionOnDelete=undefined,
                        canChange = false, actionOnChange=undefined}){
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(pageSize);
    const [sortField, setSortField] = useState(defaultSortField);
    const [sortOrder, setSortOrder] = useState(defaultSortOrder);
    const [searchField, setSearchField] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [showModal, setShowModal] = useState(false)
    const [showingItem, setShowingItem] = useState({})
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
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
                page:page+1,
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
        //console.log(types)
        fetchData();
    }, [page, rowsPerPage, sortField, sortOrder, params, searchField, refreshKey]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    
    const handleSort = (field) => {
        const isAsc = sortField === field && sortOrder === 'asc';
        setSortOrder(isAsc ? 'desc' : 'asc');
        setSortField(field);
    };
    const handleSearch = () => {
        setPage(0);  // При новом поиске возвращаемся на первую страницу
        fetchData();
    };
    const handleSearchCancel = async ()=>{
        setPage(0);
        setSearchValue('')
        setSearchField('')
    }

    return(<ThemeProvider theme={theme}>
        <Paper>
                {canSearch&&
                <div className="table">
                    {canAdd&&<div className="addButton">
                            <Button variant="contained" color="primary" onClick={actionOnAdd}>
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
                                Выберите поле для поиска
                            </MenuItem>
                            {columns.map((column) => (
                                <MenuItem key={column.field} value={column.field}>
                                    {column.header}
                                </MenuItem>
                            ))}
                        </Select>
                        <TextField
                            label="Поиск"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            disabled={searchField===''? true:false}
                        />
                        <Button variant="contained" onClick={handleSearch} disabled={searchValue!=''?false:true}>
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
                            {(canDelete || canChange) && <TableCell>Действия</TableCell>}
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
                                    style={{ 
                                        backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'white', // Чередуем цвета строк
                                        
                                      }}
                                >
                                    {columns.map((column) => (
                                        <TableCell key={column.field}
                                        className={windowWidth <= column.hideWhenWidth ? 'hidden-column' : ''}
                                        >{row[column.field]}</TableCell>
                                    ))}
                               
                                        <TableCell>
                                            <Button variant="outlined" onClick={()=> {setShowModal(true); setShowingItem(row)}}><VisibilityIcon/></Button>
                                            {canChange && <Button variant="contained" onClick={()=>actionOnChange(row)}><EditIcon/></Button>}
                                            {canDelete && <Button variant="outlined" color="error"><DeleteForeverIcon/></Button>}
                                        </TableCell>
                                    
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
                page={page}
                onPageChange={handleChangePage}
                labelRowsPerPage={"Строк на страницу"} 
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
        <ModalWindow showModal={showModal} headerText={'Просмотр'} closeModal={()=>{setShowModal(false); }}>
                    {columns.map((column) => (
                        <>
                            <Typography key={column} variant="subtitle1" color="textSecondary">
                                {column.header}
                            </Typography>
                            <Typography variant="body1">
                                {showingItem ? showingItem[column.field] : '—'}
                            </Typography>
                        </>
                    ))}
        </ModalWindow>
    </ThemeProvider>
    )
}

export default UniversalTable