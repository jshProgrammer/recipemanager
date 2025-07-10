import React, { useEffect, useState } from "react";
import "../../styles/ShoppingList.css"

function ShoppingList() {
    const [items, setItems] = useState([]);
    const [checked, setChecked] = useState(new Set());
    const [showConfirm, setShowConfirm] = useState(false);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("shoppingList")) || [];
        setItems(stored);
    }, []);

    const toggleCheck = (item) => {
        const newChecked = new Set(checked);
        if (newChecked.has(item)) newChecked.delete(item);
        else newChecked.add(item);
        setChecked(newChecked);
    };

    return (
        <div className="container mt-5">
            <h3 className="green fw-bold">Shopping List</h3>
            {items.length === 0 ? (
                <p className="text-muted">Your list is empty.</p>
            ) : (
                <>
                    <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Search ingredient..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value.toLowerCase())}
                    />

                    <ul className="list-group mb-3">
                        {items
                            .filter(item => item.toLowerCase().includes(filter))
                            .map((item, i) => (
                                <li key={i} className="list-group-item d-flex align-items-center">
                                    <input
                                        type="checkbox"
                                        className="form-check-input me-2"
                                        checked={checked.has(item)}
                                        onChange={() => toggleCheck(item)}
                                    />
                                    <span style={{textDecoration: checked.has(item) ? "line-through" : "none"}}>
                                {item}
                            </span>
                                </li>
                            ))}
                    </ul>
                </>
            )}
            {items.length > 0 && (
                <button className="btn btn-danger" onClick={() => setShowConfirm(true)}>
                    <i className="bi bi-trash me-2"></i> Clear list
                </button>
            )}

            {showConfirm && (
                <>
                    <div
                        className="position-fixed top-0 start-0 w-100 h-100"
                        style={{backgroundColor: "rgba(0,0,0,0.3)", zIndex: 1040}}
                    />

                    <div
                        className="position-fixed top-50 start-50 translate-middle"
                        style={{zIndex: 1050}}
                    >

                        <div className="card border-danger shadow" style={{width: "300px"}}>
                            <div className="card-header bg-danger text-white">
                                Confirm Deletion
                            </div>
                            <div className="card-body">
                                <p className="card-text">Are you sure you want to clear your shopping list?</p>
                                <div className="d-flex justify-content-end gap-2">
                                    <button className="btn btn-sm btn-secondary" onClick={() => setShowConfirm(false)}>
                                        Cancel
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => {
                                            localStorage.removeItem("shoppingList");
                                            setItems([]);
                                            setChecked(new Set());
                                            setShowConfirm(false);
                                        }}
                                    >
                                        Yes, clear it
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default ShoppingList;