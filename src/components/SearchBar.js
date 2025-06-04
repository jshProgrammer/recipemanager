import React from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

export default function SearchBar() {
return (
    <div className="bg-light p-4 rounded-4 my-4">
    <h3>Search recipes</h3>
    <p>What would you like to cook today? :)</p>

    <div className="mb-3 d-flex flex-wrap gap-2">
        {["Vegetarian", "Desert", "Fast", "Easy", "Healthy", "Simple"].map((tag) => (
        <span key={tag} className="badge border border-success text-success">
            {tag}
        </span>
        ))}
    </div>

    <Row className="g-3">
        <Col md={4}>
        <Form.Select>
            <option>Select desired ingredients</option>
        </Form.Select>
        </Col>
        <Col md={2}>
        <Form.Control type="number" placeholder="Maximum Price $" min="0" />
        </Col>
        <Col md={3}>
        <Form.Control type="number" placeholder="Maximum Preparation Time (min)" min="0" />
        </Col>
        <Col md={3}>
        <Button className="w-100" variant="success">
            Search
        </Button>
      </Col>  
    </Row>
    </div>

);
}