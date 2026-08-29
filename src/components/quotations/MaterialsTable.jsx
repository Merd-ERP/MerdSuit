import { formatCurrency, getCompanyCurrency } from "../../utils/currency";

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
          <div className="mb-3 hidden grid-cols-[minmax(0,2fr)_minmax(90px,0.7fr)_minmax(120px,1fr)_minmax(120px,1fr)_minmax(90px,0.7fr)] gap-4 border-b-2 pb-3 font-semibold text-gray-700 md:grid">
            <div>Material</div>
            <div className="text-center">Quantity</div>
            <div className="text-center">Unit Price ({getCompanyCurrency()})</div>
            <div className="text-right">Total ({getCompanyCurrency()})</div>
            <div className="text-center">Action</div>
          </div>

          {materials.map((material) => (
            <div
              key={material.id}
              className="mb-4 grid gap-3 rounded-xl border border-slate-200 p-4 md:grid-cols-[minmax(0,2fr)_minmax(90px,0.7fr)_minmax(120px,1fr)_minmax(120px,1fr)_minmax(90px,0.7fr)] md:items-center md:border-0 md:p-0"
            >
              {/* Material */}
              <label className="grid min-w-0 gap-1 text-sm font-medium text-slate-700 md:block">
                <span className="md:hidden">Material or Service</span>
                <input
                  placeholder="Material or Service"
                  value={material.description}
                  onChange={(e) => updateMaterial(material.id, "description", e.target.value)}
                  className="w-full min-w-0 rounded-lg border p-3"
                />
              </label>

              {/* Quantity */}
              <label className="grid min-w-0 gap-1 text-sm font-medium text-slate-700 md:block">
                <span className="md:hidden">Quantity</span>
                <input
                  type="number"
                  min="0.01"
                  step="any"
                  value={material.quantity}
                  onChange={(e) => updateMaterial(material.id, "quantity", e.target.value)}
                  className="w-full min-w-0 rounded-lg border p-3 text-center"
                />
              </label>

              {/* Unit Price */}
              <label className="grid min-w-0 gap-1 text-sm font-medium text-slate-700 md:block">
                <span className="md:hidden">Unit Price ({getCompanyCurrency()})</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Enter unit price"
                  value={material.price}
                  onChange={(e) => updateMaterial(material.id, "price", e.target.value)}
                  className="w-full min-w-0 rounded-lg border p-3 text-right"
                />
              </label>

              {/* Total */}
              <div className="min-w-0">
                <span className="mb-1 block text-sm font-medium text-slate-700 md:hidden">Item Total</span>
                <div className="rounded-lg border bg-gray-100 p-3 text-right font-semibold">
                  {Number.isFinite(Number(material.quantity) * Number(material.price))
                    ? formatCurrency(Number(material.quantity) * Number(material.price))
                    : "Invalid"}
                </div>
              </div>

              {/* Delete */}
              <button
                onClick={() => deleteMaterial(material.id)}
                className="w-full rounded-lg bg-red-600 py-3 font-medium text-white hover:bg-red-700 md:w-auto"
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
