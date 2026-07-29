function MaterialsTable({
  materials,
  addMaterial,
  updateMaterial,
  deleteMaterial,
}) {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Materials
        </h2>

        <button
          onClick={addMaterial}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold"
        >
          + Add Material
        </button>
      </div>

      {materials.length === 0 ? (
        <div className="border-2 border-dashed rounded-lg p-8 text-center text-gray-500">
          No materials added yet.
          <br />
          Click <strong>+ Add Material</strong> to begin.
        </div>
      ) : (
        <>
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 mb-3 font-semibold text-gray-700 border-b-2 pb-3">
            <div>Material</div>
            <div className="text-center">Quantity</div>
            <div className="text-center">Unit Price (GH₵)</div>
            <div className="text-right">Total (GH₵)</div>
            <div className="text-center">Action</div>
          </div>

          {materials.map((material) => (
            <div
              key={material.id}
              className="grid grid-cols-5 gap-4 mb-4 items-center"
            >
              {/* Material */}
              <input
                placeholder="Material Name"
                value={material.description}
                onChange={(e) =>
                  updateMaterial(
                    material.id,
                    "description",
                    e.target.value
                  )
                }
                className="border rounded-lg p-3"
              />

              {/* Quantity */}
              <input
                type="number"
                min="1"
                value={material.quantity}
                onChange={(e) =>
                  updateMaterial(
                    material.id,
                    "quantity",
                    e.target.value
                  )
                }
                className="border rounded-lg p-3 text-center"
              />

              {/* Unit Price */}
              <input
                type="number"
                min="0"
                value={material.price}
                onChange={(e) =>
                  updateMaterial(
                    material.id,
                    "price",
                    e.target.value
                  )
                }
                className="border rounded-lg p-3 text-right"
              />

              {/* Total */}
              <div className="border rounded-lg p-3 bg-gray-100 text-right font-semibold">
                GH₵ {(material.quantity * material.price).toLocaleString()}
              </div>

              {/* Delete */}
              <button
                onClick={() => deleteMaterial(material.id)}
                className="bg-red-600 hover:bg-red-700 text-white rounded-lg py-3 font-medium"
              >
                Delete
              </button>
            </div>
          ))}
        </>
      )}
    </>
  );
}

export default MaterialsTable;