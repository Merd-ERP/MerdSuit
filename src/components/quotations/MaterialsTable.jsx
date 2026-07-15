function MaterialsTable({
  materials,
  addMaterial,
  updateMaterial,
  deleteMaterial,
}) {
  return (
    <>
      <div className="flex justify-between items-center mb-4">

        <h2 className="text-2xl font-bold">
          Materials
        </h2>

        <button
          onClick={addMaterial}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Material
        </button>

      </div>

      {materials.length === 0 && (
        <p className="text-gray-500 mb-4">
          No materials added yet.
        </p>
      )}

      {materials.map((material) => (
        <div
          key={material.id}
          className="grid grid-cols-5 gap-4 mb-3"
        >
          <input
            placeholder="Material"
            value={material.description}
            onChange={(e) =>
              updateMaterial(
                material.id,
                "description",
                e.target.value
              )
            }
            className="border rounded-lg p-2"
          />

          <input
            type="number"
            placeholder="Qty"
            value={material.quantity}
            onChange={(e) =>
              updateMaterial(
                material.id,
                "quantity",
                e.target.value
              )
            }
            className="border rounded-lg p-2"
          />

          <input
            type="number"
            placeholder="Unit Price"
            value={material.price}
            onChange={(e) =>
              updateMaterial(
                material.id,
                "price",
                e.target.value
              )
            }
            className="border rounded-lg p-2"
          />

          <input
            value={material.quantity * material.price}
            readOnly
            className="border rounded-lg p-2 bg-gray-100"
          />

          <button
            onClick={() => deleteMaterial(material.id)}
            className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Delete
          </button>
        </div>
      ))}
    </>
  );
}

export default MaterialsTable;