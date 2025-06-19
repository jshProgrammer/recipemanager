
import "../../styles/KeyValueTable.css";
export default function KeyValueTable({ rows=[], headerLeft=null, headerRight=null, editable = false, onChange }) {
    
    const handleChange = (index, field, value) => {
        const updated = [...rows];
        updated[index] = { ...updated[index], [field]: value };
        onChange && onChange(updated);
    };

    const addRow = () => {
        const updated = [...rows, { key: "", value: "" }];
        onChange && onChange(updated);
    };

    const removeRow = (index) => {
        const updated = rows.filter((_, i) => i !== index);
        onChange && onChange(updated);
    };

    console.log('KeyValueTable rows:', rows); // Debug log


    return (
        <table className="table table-sm table-striped">
            {headerLeft != null && headerRight != null && <thead>
                <tr>
                    <th>{headerLeft}</th>
                    <th>{headerRight}</th>
                </tr>
            </thead>}
            <tbody>
                {rows.map((row, index) => (
                    <tr key={index}>
                        <td>
                            {editable ? (
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    value={row.key}
                                    placeholder="Enter your key here"
                                    onChange={(e) => handleChange(index, "key", e.target.value)}
                                />
                            ) : (
                                row.key
                            )}
                        </td>
                        <td>
                            {editable ? (
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    value={row.value}
                                    placeholder="Enter your value here"
                                    onChange={(e) => handleChange(index, "value", e.target.value)}
                                />
                            ) : (
                                row.value
                            )}
                        </td>
                        {editable && (
                            <td>
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => removeRow(index)}
                                    title="Remove row"
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
            {editable && (
                <tfoot>
                    <tr>
                        <td colSpan="3">
                            <button
                                className="btn btn-sm btn-outline-success"
                                onClick={addRow}
                                title="Add new row"
                            >
                                <i className="bi bi-plus-circle"></i> Add Row
                            </button>
                        </td>
                    </tr>
                </tfoot>
            )}
        </table>
    );
}