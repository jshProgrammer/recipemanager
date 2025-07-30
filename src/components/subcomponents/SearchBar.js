import React from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

export default function SearchBar({id}) {
return (
    
    <div className="mb-4" id={id}>
    <h3>Search recipes</h3>
    <div className="mb-3 position-relative">
        <Form.Control
            type="text"
            placeholder="What would you like to cook today? :)"
            style={{ paddingRight: "40px" }}
        />
        <Button
            className="position-absolute top-50 translate-middle-y"
            style={{ right: "10px", padding: "0.375rem 0.75rem" }}
            variant="link"
            tabIndex={-1}
        >
            <i className="bi bi-search green"></i>
        </Button>
    </div>

    <Row>
        <Col md={3}>
         <p>Fast Select:</p>
        </Col>
        <Col md={9}>
            <div className="mb-3 d-flex flex-wrap gap-2">
                {["Vegetarian", "Desert", "Fast", "Easy", "Healthy", "Simple"].map((tag) => (
                <span key={tag} className="badge border borderGreen text-black">
                    {tag}
                </span>
                ))}
            </div>
        </Col>
    </Row>

    <Row className="g-3">
        <Col md={4}>
        <Form.Select>
            <option>Select desired ingredients</option>
        </Form.Select>
        </Col>
        <Col md={3}>
        <Form.Control type="number" placeholder="Maximum Preparation Time (min)" min="0" />
        </Col>
        <Col md={3}>
        <Button className="w-100 backgroundGreen btn">
            Search
        </Button>
      </Col>  
    </Row>
    </div>

);
}