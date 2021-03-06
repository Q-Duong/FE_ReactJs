import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { brandAPI, categoryAPI ,productAPI} from '../../../axios/exeAPI';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const UpdateProductForm = (props) => {
  const {activeProduct, onUpdateProduct, isShow, onCloseUpdateform} = props;
  const [categories, setCategories] =
        useState([{_id:"123",name:"???",image: "???"}]);
  const [brands, setBrands] =
        useState([{_id:"123",name:"???",image: "???"}]);
  // const [products, setProducts] =
  //       useState([{_id:"123",name:"???",image: "???"}]);
  const formRef = useRef(null);
  const [category, setCategory] = useState(activeProduct.categoryId);
  const [brand, setBrand] = useState(activeProduct.brandId);
  const [categoryID, setCategoryId] = useState(activeProduct.category);
  const [name, setName] = useState(activeProduct.name);
  const [unit, setUnit] = useState(activeProduct.unit);
  const [status, setStatus] = useState(activeProduct.status);
  const [description, setDescription] = useState(activeProduct.description);

  var selected = (categoryID === category) ? 'selected' : 'false';
  
  function handleClose ()  {
    if(onCloseUpdateform)
      onCloseUpdateform()
  };

  function handleUpdatedProduct() {
    if(onUpdateProduct)
      onUpdateProduct(formRef);
  }

  useEffect(()=> {
    async function getCategories() {
        const categories = await categoryAPI.getAll();
        setCategories(categories.data);
    }
    getCategories()
  },[])
  useEffect(()=> {
    async function getBrands() {
        const brands = await brandAPI.getAll();
        setBrands(brands.data);
    }
    getBrands()
  },[])

  useEffect(() => {
    setCategory(activeProduct.categoryId)
    setBrand(activeProduct.brandId)
    setName(activeProduct.name)
    setUnit(activeProduct.unit)
    setStatus(activeProduct.status)
    setDescription(activeProduct.description)
    
  },[activeProduct])

  return (
    
    <>                  
      <Modal show={isShow} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>C???p nh???t s???n ph???m</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form ref={formRef} enctype="multipart/form-data">
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Danh m???c</Form.Label>
              <select name="categoryId" class="form-control m-bot15">
                  {categories.map((category) => (
                      <option value={category._id}>{category.name}</option>
                  ))}
              </select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Th????ng hi???u</Form.Label>
              <select name="brandId" class="form-control m-bot15">
                  {brands.map((brand) => (
                      <option value={brand._id}>{brand.name}</option>
                  ))}
              </select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>T??n s???n ph???m</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="T??n s???n ph???m"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>H??nh ???nh</Form.Label>
              <Form.Control
                type="file"
                name="myFile"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>????n v??? t??nh</Form.Label>
              <Form.Control
                type="text"
                name="unit"
                placeholder="????n v??? t??nh"
                value={unit}
                onChange={(e) => {
                  setUnit(e.target.value);
                }}
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>T??nh tr???ng</Form.Label>
              <Form.Control
                type="text"
                name="status"
                placeholder="T??nh tr???ng"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
                autoFocus
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>M?? t??? s???n ph???m</Form.Label>
              {/* <Form.Control
                type="text"
                name="expireUnit"
                placeholder="????n v??? h???n d??ng"
                value={expireUnit}
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
                autoFocus
              /> */}
              <input type="text" name="description" value={description}  style={{display:"none"}} id="a" onChange={(e) => {
                  setDescription(e.target.value);}} />
              <CKEditor
                  editor={ ClassicEditor }
                  
                  
                  // onReady={ editor => {
                  //     // You can store the "editor" and use when it is needed.
                  //     console.log( 'Editor is ready to use!', editor );
                  // } }
                  onChange={ ( event, editor ) => {
                      const data = editor.getData();
                      document.getElementById("a").setAttribute("value",data);
                      
                      console.log( { event, editor, data } );
                  } }
                  onBlur={ ( event, editor ) => {
                      console.log( 'Blur.', editor );
                  } }
                  onFocus={ ( event, editor ) => {
                      console.log( 'Focus.', editor );
                  } }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdatedProduct}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
};

export default UpdateProductForm;
