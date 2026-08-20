import { useMemo } from "react";
import { Users } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { formatCurrency } from "../../utils/currency";

function ClientReport() {
  const {
    clients,
    projects,
    quotations,
    invoices,
  } = useApp();

  const clientStats = useMemo(() => {
    return clients.map((client) => {
      const clientProjects = projects.filter(
        (project) => project.client === client.name
      );

      const clientQuotations = quotations.filter(
        (quotation) => quotation.status !== "Draft" && quotation.client === client.name
      );

      const clientInvoices = invoices.filter(
        (invoice) => invoice.client === client.name
      );

      const quotationValue = clientQuotations.reduce(
        (sum, quotation) =>
          sum + Number(quotation.total || 0),
        0
      );

      const invoiceValue = clientInvoices.reduce(
        (sum, invoice) =>
          sum + Number(invoice.total || 0),
        0
      );

      return {
        name: client.name,
        projects: clientProjects.length,
        quotations: clientQuotations.length,
        invoices: clientInvoices.length,
        quotationValue,
        invoiceValue,
      };
    });
  }, [clients, projects, quotations, invoices]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mt-8">

      <div className="flex items-center gap-3 mb-6">
        <Users className="text-blue-600" size={28} />

        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Client Report
          </h2>

          <p className="text-slate-500">
            Overview of customer activity.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="text-left p-4">Client</th>

              <th className="text-center p-4">
                Projects
              </th>

              <th className="text-center p-4">
                Quotations
              </th>

              <th className="text-center p-4">
                Invoices
              </th>

              <th className="text-right p-4">
                Quotation Value
              </th>

              <th className="text-right p-4">
                Invoice Value
              </th>

            </tr>

          </thead>

          <tbody>

            {clientStats.map((client) => (
              <tr
                key={client.name}
                className="border-b hover:bg-slate-50"
              >
                <td className="p-4 font-medium">
                  {client.name}
                </td>

                <td className="text-center">
                  {client.projects}
                </td>

                <td className="text-center">
                  {client.quotations}
                </td>

                <td className="text-center">
                  {client.invoices}
                </td>

                <td className="text-right p-4">
                  {formatCurrency(client.quotationValue)}
                </td>

                <td className="text-right p-4 text-green-700 font-semibold">
                  {formatCurrency(client.invoiceValue)}
                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default ClientReport;
