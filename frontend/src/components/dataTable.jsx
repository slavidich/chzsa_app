import React, { useEffect, useState } from "react";
import { Navigate } from 'react-router-dom';
import { refreshTokenIfNeeded } from './authUtils'; // 
import { mainAddress } from './app.jsx'; 
import axios from "axios";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    TableSortLabel,
    CircularProgress,
  } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import { theme } from './muiUtil';

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
    }finally{
        setLoading(false)
    }
}

function UniversalTable({columns, path, params, dispatch, pageSize = 10}){
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(pageSize);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    const fetchData = async () => {
        await getData({
            path: path,
            params:{
                ...params,
                page:page+1,
                sortField: sortField===''? undefined: sortField,
                sortOrder: sortOrder==='asc'? undefined: sortOrder
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
    }, [page, rowsPerPage, sortField, sortOrder, params]);

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

    return(<ThemeProvider theme={theme}>
        <Paper>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.field}
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
                                <TableRow key={index}>
                                {columns.map((column) => (
                                    <TableCell key={column.field}>{row[column.field]}</TableCell>
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
                page={page}
                onPageChange={handleChangePage}
                labelRowsPerPage={"Строк на страницу"} 
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    </ThemeProvider>
    )
}

export default UniversalTable