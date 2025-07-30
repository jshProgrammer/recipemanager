import React, { useEffect, useState } from "react";
import "../../styles/ShoppingList.css"

function ShoppingList() {
    const [items, setItems] = useState([]);
    const [checked, setChecked] = useState(new Set());
    const [showConfirm, setShowConfirm] = useState(false);
    const [filter, setFilter] = useState("");
    const [item, setItem] = useState("");

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("shoppingList")) || [];
        setItems(stored);

        const storedChecked = JSON.parse(localStorage.getItem("shoppingListChecked"));
        setChecked(new Set(Array.isArray(storedChecked) ? storedChecked : []));
    }, []);

    const toggleCheck = (item) => {
        const newChecked = new Set(checked);
        if (newChecked.has(item)) newChecked.delete(item);
        else newChecked.add(item);
        setChecked(newChecked);

        localStorage.setItem("shoppingListChecked", JSON.stringify([...newChecked]));
    };

    const updateItems = (item) => {
        const trimmed = item.trim();
        if (!trimmed) return;

        const current = JSON.parse(localStorage.getItem("shoppingList")) || [];
        const updated = Array.from(new Set([...current, trimmed]));
        localStorage.setItem("shoppingList", JSON.stringify(updated));

        setItem("");
        setItems(updated);
    };

    const removeItem = (toRemove) => {
        const updatedItems = items.filter(item => item !== toRemove);
        const updatedChecked = new Set(checked);
        updatedChecked.delete(toRemove);

        setItems(updatedItems);
        setChecked(updatedChecked);

        localStorage.setItem("shoppingList", JSON.stringify(updatedItems));
        localStorage.setItem("shoppingListChecked", JSON.stringify([...updatedChecked]));
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
                                <li key={i}
                                    className="list-group-item d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <input
                                            type="checkbox"
                                            className="form-check-input me-2"
                                            checked={checked.has(item)}
                                            onChange={() => toggleCheck(item)}
                                        />
                                        <span style={{textDecoration: checked.has(item) ? "line-through" : "none"}}>
                                        {item}
                                        </span>
                                    </div>

                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        style={{lineHeight: 1}}
                                        onClick={() => removeItem(item)}
                                        title="Remove item"
                                    >
                                        &minus;
                                    </button>
                                </li>
                            ))}
                    </ul>
                </>
            )}
            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Add ingredient..."
                    value={item}
                    onChange={(e) => setItem(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && updateItems(item)}
                />
                <button
                    className="btn btn-green"
                    type="button"
                    onClick={() => updateItems(item)}
                >
                    Add
                </button>
            </div>

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
                                            localStorage.removeItem("shoppingListChecked");
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