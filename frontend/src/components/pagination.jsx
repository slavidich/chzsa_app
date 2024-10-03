import React from "react";

function Pagination({totalPages, currentPage, onPageChange}){
    const handlePrevious = () => {
        if (currentPage > 1) {
          onPageChange(currentPage - 1);
        }
    };
    const handleNext = () => {
        if (currentPage < totalPages) {
          onPageChange(currentPage + 1);
        }
    };
    const handlePageClick = (page) => {
        onPageChange(page);
    };
    const renderPageNumbers = () =>{
        const pageNumbers = [];
        for (let i=1; i<=totalPages; i++){
            pageNumbers.push(
                <button
                    key={i}
                    onClick={()=>handlePageClick(i)}
                    className={i==currentPage? 'active': ''}    
                >
                    {i}
                </button>
            )
        }
        return pageNumbers;
    }

    return (
        <div>
            <button onClick={handlePrevious} disabled={currentPage === 1}>
                Previous
            </button>
            {renderPageNumbers()}
            <button onClick={handleNext} disabled={currentPage === totalPages}>
                Next
            </button>
        </div>
    )
}

export default Pagination