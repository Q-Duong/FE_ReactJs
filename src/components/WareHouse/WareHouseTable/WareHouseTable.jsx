import React, { useEffect, useState } from 'react';
import { wareHouseAPI } from '../../../axios/exeAPI';

import DeleteWareHouseForm from '../DeleteWareHouseForm/DeleteWareHouseForm';
import UpdateWareHouseForm from '../UpdateWareHouseForm/UpdateWareHouseForm';

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "./WareHouseTable.css";
import numberWithCommas from '../../../utils/numberWithCommas';
import formatDate from '../../../utils/formatDate';
import ProtectedRoute from '../../ProtectedRoute/ProtectedRoute';
import { Button, Col, Dropdown, Row, Form } from 'react-bootstrap';
import MyPagination from '../../Pagination/Pagination';

function WareHouseTable() {
    const [wareHouses, setWareHouses] = useState([]);
    const [paginationOptions, setPaginationOptions] = useState({})
    const [filterOptions, setFilterOptions] = useState({})
    const [activeWareHouse, setactiveWareHouse] = useState(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [showDeleteForm, setShowDeleteForm] = useState(false);
    const [activePage, setActivePage] = useState(1)

    function handleUpdateFormClose() {
        setShowUpdateForm(false)
    };

    function handleUpdateFormShow(wareHouse) {
        setactiveWareHouse(wareHouse)
        console.log(wareHouse)
        setShowUpdateForm(true)
    };


    function handleDeleteFormClose() {
        setShowDeleteForm(false)
    };

    function handleDeleteFormShow(wareHouse) {
        setactiveWareHouse(wareHouse)
        console.log(wareHouse)
        setShowDeleteForm(true)
    };



    async function handleUpdatedWareHouse(formRef) {
        try {
            const wareHouseId = activeWareHouse._id
            const productId = activeWareHouse.product._id
            const updateForm = formRef.current
            const updateFormData = new FormData(updateForm)
            const updateFormObject = Object.fromEntries(updateFormData)
            // updateFormObject.products =  updateFormData.getAll('products')

            const data = JSON.stringify(updateFormObject)
            const res = await wareHouseAPI.update({ wareHouseId, productId, wareHouse: data });
            let tempWareHouses = [...wareHouses];
            const updatedWareHouse = res.data;
            tempWareHouses = tempWareHouses.map(wareHouse => wareHouse._id === updatedWareHouse._id ? updatedWareHouse : wareHouse);
            setWareHouses(tempWareHouses);
            setShowUpdateForm(false)
        } catch (error) {
            alert(error.response.data.message)
        }
    }


    async function handleDeleteWareHouse(id) {
        try {
            const res = await wareHouseAPI.delete(id);
            const deletedWareHouse = res.data;
            if (res.status === 200) {
                let tempWareHouses = [...wareHouses];
                tempWareHouses = tempWareHouses.filter(wareHouse => wareHouse._id !== deletedWareHouse._id)
                setWareHouses(tempWareHouses);
                setShowDeleteForm(false);
            }
            else {
                console.log(res.data.message)
            }
        } catch (error) {
            console.log(error)
        }
    };

    function handlePageChange(newPage) {
        if (newPage > 0)
            setActivePage(newPage)
    }

    async function handleFilterSubmit(e) {
        try {
            e.preventDefault()
            const filterForm = e.target
            const filterFormData = new FormData(filterForm)

            const filterObj = {};
            filterFormData.forEach((value, key) => filterObj[key] = value);
            setFilterOptions(filterObj)

        } catch (error) {
            alert(error.response.data.message)
        }
    }

    useEffect(() => {
        async function getWareHouses() {
            const wareHouses = await wareHouseAPI.getAll(activePage,filterOptions);
            setWareHouses(wareHouses.data.docs);
            setactiveWareHouse(wareHouses.data.docs[0])
            setPaginationOptions({ ...wareHouses.data })
        }
        getWareHouses()
    }, [activePage,filterOptions])

    return (
        <>
            <div className="Table">
                <h3>Kho h??ng</h3>
                <Row>
                    <Form className="FormFilter" onSubmit={(e) => handleFilterSubmit(e)}>
                        <Col lg="12" xs="12">
                            <div className="filter_title">B??? l???c</div>
                        </Col>
                        <Col lg="4" xs="12">
                            <div className="filter-name">
                                <input type="text" name="name" placeholder="T??n s???n ph???m" className="input_name" />
                            </div>
                        </Col>
                        <Col lg="3" xs="12">
                            <Col lg="6" xs="6" className="display">
                                <div className="filter-date">
                                    <input type="date" name="fromDate" placeholder="T??n s???n ph???m" className="input_date" />
                                </div>
                            </Col>
                            <Col lg="6" xs="6" className="display">
                                <div className="filter-date">
                                    <input type="date" name="toDate" placeholder="T??n s???n ph???m" className="input_date" />
                                </div>
                            </Col>
                        </Col>
                        <Col lg="4" xs="12">
                            <div className="filter-active">
                                <div class='py'>
                                    <label className="label-left">
                                        <input type="radio" class="option-input radio" name="active" value='' />
                                        T???t c???
                                    </label>
                                    <label className="label-left">
                                        <input type="radio" class="option-input radio" name="active" value={true}/>
                                        ??ang b??n
                                    </label>
                                    <label className="label-left">
                                        <input type="radio" class="option-input radio" name="active" value={false} />
                                        Ch??a b??n
                                    </label>

                                </div>
                            </div>
                        </Col>
                        <Col lg="1" xs="12">
                            <div className="filter-button">
                                <Button type="submit" className="fil-button">L???c</Button>
                            </div>
                        </Col>
                    </Form>
                </Row>
                <TableContainer
                    component={Paper}
                    style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
                    className="a"
                >

                    <Table sx={{ minWidth: 650 }} aria-label="simple table" >
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">M?? l??</TableCell>
                                <TableCell align="left">T??n s???n ph???m</TableCell>
                                <TableCell align="left">Ng??y nh???p</TableCell>
                                <TableCell align="left">Ng??y h???t h???n</TableCell>
                                <TableCell align="left">Gi?? nh???p</TableCell>
                                <TableCell align="left">Gi?? b??n</TableCell>
                                <TableCell align="left">SL nh???p</TableCell>
                                <TableCell align="left">SL b??n</TableCell>
                                <TableCell align="left">Tr???ng th??i</TableCell>
                                <TableCell align="left">T??c ?????ng</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody style={{ color: "white" }}>
                            {wareHouses.map((wareHouse) => (
                                <TableRow
                                    key={wareHouse._id}
                                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                >
                                    <TableCell align="left">{wareHouse._id}</TableCell>
                                    <TableCell align="left">{wareHouse.product.name}</TableCell>
                                    <TableCell align="left">{formatDate(wareHouse.createdAt)}</TableCell>
                                    <TableCell align="left">{formatDate(wareHouse.expireIn)}</TableCell>
                                    <TableCell align="left">{numberWithCommas(wareHouse.stockPrice)}</TableCell>
                                    <TableCell align="left">{wareHouse.soldPrice > 0 ? numberWithCommas(wareHouse.soldPrice) : 'ch??a c?? gi?? b??n'}</TableCell>
                                    <TableCell align="left">{wareHouse.stockQuantity}</TableCell>
                                    <TableCell align="left">{wareHouse.soldQuantity}</TableCell>
                                    <TableCell align="left">{wareHouse.active ? '???? ???????c b??n' : 'ch??a ???????c b??n'}</TableCell>
                                    <TableCell align="left" className="Details">
                                        <Dropdown>
                                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                                H??nh ?????ng
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                <Dropdown.Item ></Dropdown.Item>
                                                <Dropdown.Item onClick={() => { handleUpdateFormShow(wareHouse) }}>
                                                    C???p nh???t
                                                </Dropdown.Item>
                                                <Dropdown.Item onClick={() => { handleDeleteFormShow(wareHouse) }}>X??a</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <MyPagination paginationOptions={paginationOptions} onPageChange={handlePageChange} />
                </TableContainer>
            </div>

            <UpdateWareHouseForm
                activeWareHouse={activeWareHouse}
                isShow={showUpdateForm}
                onUpdateWareHouse={handleUpdatedWareHouse}
                onCloseUpdateform={handleUpdateFormClose}
            />
            <DeleteWareHouseForm
                activeWareHouse={activeWareHouse}
                isShow={showDeleteForm}
                onDeleteWareHouse={handleDeleteWareHouse}
                onCloseDeleteform={handleDeleteFormClose}
            />
        </>
    );
}

export default WareHouseTable;