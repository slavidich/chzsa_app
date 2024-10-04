import React from "react";
import Pagination from '@mui/material/Pagination';
import { ThemeProvider } from '@emotion/react';
import { theme } from './muiUtil';

function MyPagination({totalPages, currentPage, setCurrentPage}){
    const handlePageChange= (e, value) =>{
        setCurrentPage(value);
    }
    return (<ThemeProvider theme={theme}>
        {totalPages>1?<div className="pagination">
                <Pagination count={totalPages} page={currentPage} onChange={handlePageChange}></Pagination>
            </div>:<></>}
            </ThemeProvider>
    )
}
export default MyPagination