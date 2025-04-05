import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { IconChevronLeft, IconChevronRight, IconSearch } from '@douyinfe/semi-icons';

const TablePagination = ({ pageToSize, setPageToSize, setCurrentPage, startItem, endItem, currentPage, pageNumbers, isLastPage }) => {

    return (
        <div className="tablePagination">
            <div className="leftItems">
                <Dropdown className="bulkDropdown">
                    <Dropdown.Toggle id="dropdown-basic">{pageToSize}</Dropdown.Toggle>
                    <Dropdown.Menu>
                        {[10, 20, 30, 50, 100].map((size) => (
                            <Dropdown.Item onClick={() => { setPageToSize(size); setCurrentPage(0); }}>
                                {size}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
                <p className="item">Items per page</p>
                <p className="itemNumber">
                    {startItem} - {endItem}
                </p>
            </div>

            <div className="leftItems">
                <button className="pagArrow" onClick={() => setCurrentPage((prev) => prev - 1)} disabled={(currentPage + 1) === 1}>
                    <IconChevronLeft />
                </button>
                <div>
                    {pageNumbers.map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            disabled={(currentPage + 1) === page}
                        >
                            {page}
                        </button>
                    ))}
                </div>
                <button className="pagArrow" onClick={() => setCurrentPage((prev) => prev + 1)} disabled={isLastPage}>
                    <IconChevronRight />
                </button>
            </div>
        </div>
    )
}

export default TablePagination