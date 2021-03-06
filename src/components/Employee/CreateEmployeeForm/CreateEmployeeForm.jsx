import React, { useRef } from 'react';
import { Button, Form, Modal } from "react-bootstrap";

function CreateEmployeeForm(props) {
    const {onCreateEmployee, isShow, onCloseCreateform} = props;
    const formRef = useRef(null);
  
  function handleClose ()  {
    onCloseCreateform()
  };

  function handleCreateEmployee() {
    if(onCreateEmployee)
      onCreateEmployee(formRef);
  }

    return (
        <>
            <Modal show={isShow} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Thêm nhân viên</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form ref={formRef} enctype="multipart/form-data">
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Tên nhân viên</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        placeholder="Tên nhân viên"
                        autoFocus
                    />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="text"
                        name="email"
                        placeholder="Email"
                        autoFocus
                    />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>SĐT</Form.Label>
                    <Form.Control
                        type="text"
                        name="phone"
                        placeholder="SĐT"
                        autoFocus
                    />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Mật khẩu</Form.Label>
                    <Form.Control
                        type="text"
                        name="password"
                        placeholder="Mật khẩu"
                        autoFocus
                    />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Quyền</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        placeholder="Quy"
                        autoFocus
                    />
                    </Form.Group>
                </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
                <Button variant="primary" onClick={handleCreateEmployee}>
                    Thêm
                </Button>
                </Modal.Footer>
            </Modal>
        </>  
    );
}

export default CreateEmployeeForm;