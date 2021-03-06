import React, { useEffect, useState } from 'react';
import CreateImportOrder from '../CreateImportOrder/CreateImportOrder'
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "./ImportOrderTable.css";
import { Button, Dropdown } from "react-bootstrap";
import { importOrderAPI } from '../../../axios/exeAPI';
import { TableCell } from '@mui/material';
import numberWithCommas from '../../../utils/numberWithCommas';
import formatDate from '../../../utils/formatDate';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import ImportOrderDetailTable from '../ImportOrderDetailTable/ImportOrderDetailTable';
import ProtectedRoute from '../../ProtectedRoute/ProtectedRoute';
import MyPagination from '../../Pagination/Pagination';

function ImportOrderTable(props) {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showTableForm, setShowTableForm] = useState(false);
    const [paginationOptions, setPaginationOptions] = useState({});
    const [importOrders, setImportOrder] = useState([]);
    const [activeImportOrderDetail, setActiveImportOrderDetail] = useState(null);
    const [activePage, setActivePage] = useState(1)

    function handleCreateFormClose() {
        setShowCreateForm(false)
    }

    function handleCreateFormShow() {
        setShowCreateForm(true)
    }

    function handleTableFormClose() {
        setShowTableForm(false)
    }

    function handleTableFormShow(detail) {
        setActiveImportOrderDetail(detail)
        setShowTableForm(true)
    }

    function handlePageChange(newPage) {
        if(newPage > 0)
            setActivePage(newPage)
    }

    useEffect(()=> {
        async function getImportOrder() {
            try {
                const res = await importOrderAPI.getAllPaginate(activePage);
                if(res.status === 200) {
                    console.log(res.data)
                    setImportOrder(res.data.docs);
                    setPaginationOptions({...res.data})
                } else{
                    console.log(res.data.message)
                }
            } catch (error) {
                console.log(error)
            }
        }
        getImportOrder()
        
    },[activePage])

    async function handleCreateImportOrder(data) {
       try {
            const createImportOrderData = {
                importOrderData: {
                    totalBill: data.total,
                    importOrderStatus: "Paid",
                    supplierId: data.activeSupplier
                },
                purchasedProducts: data.products
            }
            const res = await importOrderAPI.create(createImportOrderData)
            if(res.status === 201) {
                const tempImportOrders = [...importOrders];
                tempImportOrders.unshift(res.data)
                setImportOrder(tempImportOrders);
                setShowCreateForm(false)
            } else {
                console.log(res)
            }
       } catch (error) {
            console.log(error)
       }
    }
    return (
        <>
        <div className="Table">
            <h3>????n nh???p h??ng</h3>
            <ProtectedRoute permission={"create_importorders"}>
                <Button variant="primary" onClick={handleCreateFormShow}>
                    T???o ????n nh???p
                </Button>
            </ProtectedRoute>
            <TableContainer
                component={Paper}
                style={{ boxShadow: "0px 13px 20px 0px #80808029"}}
                className="tableContainer"
                
            >
                <Table  responsive="xl" sx={{ minWidth: 650 }} aria-label="simple table" >
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">M?? ????n nh???p</TableCell>
                            <TableCell align="left">Nh?? cung c???p</TableCell>
                            <TableCell align="left">T???ng ti???n</TableCell>
                            <TableCell align="left">Ng??y nh???p</TableCell>
                            <TableCell align="left">C??ng n???</TableCell>
                            <TableCell align="left">K??? h???n n???</TableCell>
                            <TableCell align="left">Chi ti???t h??a ????n</TableCell>
                            <TableCell align="left">T??c ?????ng</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody style={{ color: "white" }}>
                        {importOrders.map((importOrder) => (
                            <TableRow
                                key={importOrder._id}
                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                            <TableCell align="left">{importOrder._id}</TableCell>
                            <TableCell align="left">{importOrder.supplier.name}</TableCell>
                            <TableCell align="left">{numberWithCommas(importOrder.totalBill)}</TableCell>
                            <TableCell align="left">{formatDate(importOrder.createdAt)}</TableCell>
                            <TableCell align="left">{importOrder.loan}</TableCell>
                            <TableCell align="left">{importOrder.duration}</TableCell>
                            <TableCell align="left">
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        <FontAwesomeIcon icon={faCircleInfo} /> Chi ti???t
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {
                                            importOrder.details.map(detail => (
                                                <Dropdown.Item onClick={() => handleTableFormShow(detail)}>{detail.product.name}</Dropdown.Item>
                                            ))
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                            </TableCell>
                            <TableCell align="left" >
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        H??nh ?????ng
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <ProtectedRoute permission={"update_importorders"}>
                                            <Dropdown.Item onClick={() => {}}>
                                            C???p nh???t
                                            </Dropdown.Item>
                                        </ProtectedRoute>
                                        <ProtectedRoute permission={"delete_importorders"}>
                                            <Dropdown.Item onClick={() => {}}>
                                                X??a
                                            </Dropdown.Item>
                                        </ProtectedRoute>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <MyPagination paginationOptions={paginationOptions} onPageChange={handlePageChange}/>
            </TableContainer>
        </div>
            <CreateImportOrder
                isShow={showCreateForm}
                onCreateImportOrder={handleCreateImportOrder}
                onCloseCreateform={handleCreateFormClose}
            />
            <ImportOrderDetailTable
                isShow={showTableForm}
                onTableFormClose={handleTableFormClose}
                activeImportOrderDetail={activeImportOrderDetail}
            />
        </>
    );
}

export default ImportOrderTable;