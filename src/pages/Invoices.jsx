import { useState } from "react";
import MainLayout from "../layouts/MainLayout";

function Invoices() {
  const [invoice, setInvoice] = useState({
    number: "INV-0001",
    client: "",
    project: "",
    date: "",
    dueDate: "",
    total: "",
    paid: "",
    status: "Unpaid",
  });

  const balance =
    Number(invoice.total || 0) - Number(invoice.paid || 0);

  return (
    <MainLayout>
      <h1 className="text-4xl font-bold mb-6">
        Invoices
      </h1>

      <div className="bg-white rounded-xl shadow p-6">

        <div className="grid grid-cols-2 gap-4">

          <input
            value={invoice.number}
            readOnly
            className="border rounded-lg p-2 bg-gray-100"
          />

          <select
            value={invoice.status}
            onChange={(e)=>
              setInvoice({
                ...invoice,
                status:e.target.value
              })
            }
            className="border rounded-lg p-2"
          >
            <option>Unpaid</option>
            <option>Part Payment</option>
            <option>Paid</option>
          </select>

          <input
            placeholder="Client Name"
            value={invoice.client}
            onChange={(e)=>
              setInvoice({
                ...invoice,
                client:e.target.value
              })
            }
            className="border rounded-lg p-2"
          />

          <input
            placeholder="Project Name"
            value={invoice.project}
            onChange={(e)=>
              setInvoice({
                ...invoice,
                project:e.target.value
              })
            }
            className="border rounded-lg p-2"
          />

          <input
            type="date"
            value={invoice.date}
            onChange={(e)=>
              setInvoice({
                ...invoice,
                date:e.target.value
              })
            }
            className="border rounded-lg p-2"
          />

          <input
            type="date"
            value={invoice.dueDate}
            onChange={(e)=>
              setInvoice({
                ...invoice,
                dueDate:e.target.value
              })
            }
            className="border rounded-lg p-2"
          />

          <input
            type="number"
            placeholder="Invoice Total"
            value={invoice.total}
            onChange={(e)=>
              setInvoice({
                ...invoice,
                total:e.target.value
              })
            }
            className="border rounded-lg p-2"
          />

          <input
            type="number"
            placeholder="Amount Paid"
            value={invoice.paid}
            onChange={(e)=>
              setInvoice({
                ...invoice,
                paid:e.target.value
              })
            }
            className="border rounded-lg p-2"
          />

        </div>

        <div className="mt-8 flex justify-end">

          <div className="w-96 bg-gray-50 rounded-xl p-6 shadow">

            <div className="flex justify-between mb-2">
              <span>Total</span>
              <span>GH₵ {Number(invoice.total).toLocaleString()}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span>Paid</span>
              <span>GH₵ {Number(invoice.paid).toLocaleString()}</span>
            </div>

            <hr className="my-3"/>

            <div className="flex justify-between text-2xl font-bold text-green-700">
              <span>Balance</span>
              <span>GH₵ {balance.toLocaleString()}</span>
            </div>

          </div>

        </div>

      </div>

    </MainLayout>
  );
}

export default Invoices;