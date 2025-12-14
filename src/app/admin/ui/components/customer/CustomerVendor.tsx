import { FindAllCustomerUseCase } from "@/app/customer/application/usecases/find-all-customer.usecase";
import { Customer } from "@/app/customer/domain/entities/customer.entity";
import { CustomerMapper } from "@/app/customer/domain/mapper/customer.mapper";
import { CustomerRepository } from "@/app/customer/infrastructure/customer-repository.impl";
import React, { useEffect, useState } from "react";
import {
  Users,
  Search,
  UserMinus,
  MapPin,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { api } from "@/app/lib/api";

const customerRep = new CustomerRepository(new CustomerMapper());
const findAllCustomerUseCase = new FindAllCustomerUseCase(customerRep);

export default function CustomerVendor({ vendorId }: { vendorId: string }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const CUSTOMER_PER_PAGE = 10;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await findAllCustomerUseCase.execute(
          vendorId,
          CUSTOMER_PER_PAGE,
          currentPage
        );
        console.log("data customer", res.data);
        setCustomers(res.data);
      } catch (error) {
        console.log("Erreur lors de la recuperation des données:", error);
      }
    };
    fetchCustomers();
  }, [vendorId, currentPage]);

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.user?.phone?.includes(searchTerm) ||
      customer.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === "all";

    return matchesSearch && matchesFilter;
  });

  const handleUnsubscribe = async (customerId: string) => {
    if (confirm("Êtes-vous sûr de vouloir désabonner ce client ?")) {
      try {
        await api.delete(`/customer/${customerId}`);
        setCustomers(customers.filter((c) => c.id !== customerId));
      } catch (error) {
        console.log("Erreur lors du désabonnement:", error);
      }
    }
  };

  const totalPages = Math.ceil(filteredCustomers.length / CUSTOMER_PER_PAGE);
  const startIndex = (currentPage - 1) * CUSTOMER_PER_PAGE;
  const paginatedCustomers = filteredCustomers.slice(
    startIndex,
    startIndex + CUSTOMER_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="bg-teal-600 p-3 rounded-xl">
                  <Users className="text-white" size={28} />
                </div>
                Mes Clients
              </h1>
              <p className="text-gray-600 mt-2">
                Gérez vos abonnés et suivez leur activité
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl px-6 py-3">
                <div className="text-sm text-green-600 font-medium">
                  Total Abonnés
                </div>
                <div className="text-3xl font-bold text-green-700">
                  {filteredCustomers.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Rechercher par nom, téléphone ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 text-gray-900 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  filterStatus === "all"
                    ? "bg-teal-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setFilterStatus("active")}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  filterStatus === "active"
                    ? "bg-teal-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Actifs
              </button>
            </div>
          </div>
        </div>

        {/* Liste des clients */}
        <div className="space-y-4">
          {paginatedCustomers.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Users className="mx-auto text-gray-300 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Aucun client trouvé
              </h3>
              <p className="text-gray-500">
                Aucun client ne correspond à votre recherche.
              </p>
            </div>
          ) : (
            paginatedCustomers.map((customer) => (
              <div
                key={customer.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-4 md:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Informations client */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Nom */}
                      <div className="flex items-start gap-3">
                        <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-2 rounded-lg">
                          <Users className="text-purple-600" size={20} />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 font-medium mb-1">
                            Nom
                          </div>
                          <div className="font-semibold text-gray-900">
                            {customer.user?.name || "Non renseigné"}
                          </div>
                        </div>
                      </div>

                      {/* Téléphone */}
                      <div className="flex items-start gap-3">
                        <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-2 rounded-lg">
                          <Phone className="text-blue-600" size={20} />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 font-medium mb-1">
                            Téléphone
                          </div>
                          <div className="font-medium text-gray-900">
                            {customer.user?.phone || "Non renseigné"}
                          </div>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="flex items-start gap-3">
                        <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-2 rounded-lg">
                          <Mail className="text-green-600" size={20} />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 font-medium mb-1">
                            Email
                          </div>
                          <div className="font-medium text-gray-900 truncate">
                            {customer.user?.email || "Non renseigné"}
                          </div>
                        </div>
                      </div>

                      {/* Ville */}
                      <div className="flex items-start gap-3">
                        <div className="bg-gradient-to-br from-orange-100 to-red-100 p-2 rounded-lg">
                          <MapPin className="text-orange-600" size={20} />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 font-medium mb-1">
                            Ville
                          </div>
                          <div className="font-medium text-gray-900">
                            {customer.user?.cityName || "Non renseigné"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 lg:flex-col">
                      <button
                        onClick={() => handleUnsubscribe(customer.id)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white font-medium rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
                      >
                        <UserMinus size={18} />
                        <span>Désabonner</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Affichage {startIndex + 1} -{" "}
                {Math.min(
                  startIndex + CUSTOMER_PER_PAGE,
                  filteredCustomers.length
                )}{" "}
                sur {filteredCustomers.length} clients
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          currentPage === page
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
