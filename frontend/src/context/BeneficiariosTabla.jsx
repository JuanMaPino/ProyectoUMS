import React, { useState, useEffect } from 'react';
import BeneficiarioModal from './BeneficiarioModal';
import VisualizarModal from './VisualizarModal';
import { PiAirplaneFill } from 'react-icons/pi';
import { MdDeleteSweep } from 'react-icons/md';
import { AiFillEye } from 'react-icons/ai';
import { BiSearch } from 'react-icons/bi';
import axios from 'axios';

const BeneficiariosTabla = () => {
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBeneficiario, setSelectedBeneficiario] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisualizarModalOpen, setIsVisualizarModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const beneficiariosPagina = 5;

  useEffect(() => {
    fetchBeneficiarios();
  }, []);

  const fetchBeneficiarios = async () => {
    try {
      const response = await axios.get('http://localhost:3002/beneficiarios');
      setBeneficiarios(response.data);
    } catch (error) {
      console.error('Error fetching beneficiaries:', error);
    }
  };

  const handleUpdate = async (updatedBeneficiario) => {
    try {
      await axios.put(`http://localhost:3002/beneficiarios/${updatedBeneficiario._id}`, updatedBeneficiario);
      fetchBeneficiarios();
      closeModal();
    } catch (error) {
      console.error('Error updating beneficiary:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/beneficiarios/${id}`);
      fetchBeneficiarios();
    } catch (error) {
      console.error('Error deleting beneficiary:', error);
    }
  };

  const handleEstadoChange = async (id) => {
    const beneficiario = beneficiarios.find(b => b._id === id);
    if (beneficiario) {
      const updatedBeneficiario = {
        ...beneficiario,
        estado: beneficiario.estado === 'activo' ? 'inactivo' : 'activo'
      };
      await handleUpdate(updatedBeneficiario);
    }
  };

  const handleEdit = (beneficiario) => {
    setSelectedBeneficiario(beneficiario);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedBeneficiario(null);
    setIsModalOpen(true);
  };

  const handleVisualizar = (beneficiario) => {
    setSelectedBeneficiario(beneficiario);
    setIsVisualizarModalOpen(true);
  };

  const closeModal = () => {
    setSelectedBeneficiario(null);
    setIsModalOpen(false);
  };

  const closeVisualizarModal = () => {
    setSelectedBeneficiario(null);
    setIsVisualizarModalOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredBeneficiarios = beneficiarios.filter((beneficiario) => {
    return beneficiario.identificacion.toString().includes(searchTerm);
  });

  const ultimoBeneficiario = currentPage * beneficiariosPagina;
  const primerBeneficiario = ultimoBeneficiario - beneficiariosPagina;
  const currentBeneficiarios = filteredBeneficiarios.slice(primerBeneficiario, ultimoBeneficiario);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section className="container mx-auto p-4 font-mono">
      <h2 className="flex p-2 text-2xl font-semibold">Beneficiarios</h2>
      <div className="flex justify-between items-center mb-4">
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={handleAdd}
        >
          Agregar Beneficiario
        </button>
        <div className="relative text-gray-600">
          <input
            type="text"
            placeholder="Buscar por identificación"
            value={searchTerm}
            onChange={handleSearchChange}
            className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none"
          />
          <button type="submit" className="absolute right-0 top-0 mt-3 mr-4">
            <BiSearch />
          </button>
        </div>
      </div>
      <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
                <th className="px-3 py-3 w-1/6">Identificación</th>
                <th className="px-3 py-3 w-1/3">Nombre</th>
                <th className="px-3 py-3 w-1/6">Teléfono</th>
                <th className="px-2 py-3 w-1/6">Estado</th> {/* Ajuste del ancho de la columna de estado */}
                <th className="px-2 py-3 w-1/6">Acciones</th> {/* Ajuste del ancho de la columna de acciones */}
              </tr>
            </thead>
            <tbody className="bg-white">
              {currentBeneficiarios.map((beneficiario) => (
                <tr key={beneficiario._id} className="text-gray-700">
                  <td className="px-3 py-3 border">{beneficiario.identificacion}</td>
                  <td className="px-3 py-3 border">
                    <div className="flex items-center text-xs">
                      <div className="relative w-6 h-6 mr-2 rounded-full md:block">
                        <img
                          className="object-cover w-full h-full rounded-full"
                          src="https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
                          alt={beneficiario.nombre}
                          loading="lazy"
                        />
                        <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                      </div>
                      <div>
                        <p className="font-semibold text-black">{beneficiario.nombre}</p>
                        <p className="text-xs text-gray-600">{beneficiario.correoElectronico}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 border">{beneficiario.telefono}</td>
                  <td className="px-4 py-3 border text-xs">
                    <button
                      className={`px-3 py-1 font-semibold leading-tight ${beneficiario.estado === 'activo' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'} rounded-sm`}
                      onClick={() => handleEstadoChange(beneficiario._id)}
                    >
                      {beneficiario.estado === 'activo' ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="px-1 py-3 border">
                    <button
                      className="font-medium text-xl px-1 text-yellow-600 dark:text-gray-500 hover:underline ml-2"
                      onClick={() => handleVisualizar(beneficiario)}
                    >
                      <AiFillEye />
                    </button>
                    <button
                      className="font-medium text-xl px-1 text-blue-600 dark:text-blue-500 hover:underline"
                      onClick={() => handleEdit(beneficiario)}
                    >
                      <PiAirplaneFill />
                    </button>
                    <button
                      className="font-medium text-xl px-1 text-red-600 dark:text-red-500 hover:underline ml-2"
                      onClick={() => handleDelete(beneficiario._id)}
                    >
                      <MdDeleteSweep />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(filteredBeneficiarios.length / beneficiariosPagina) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`mx-1 px-2 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {isModalOpen && (
        <BeneficiarioModal
          onClose={closeModal}
          currentBeneficiario={selectedBeneficiario}
          fetchBeneficiarios={fetchBeneficiarios}
        />
      )}

      {isVisualizarModalOpen && (
        <VisualizarModal
          onClose={closeVisualizarModal}
          beneficiario={selectedBeneficiario}
        />
      )}
    </section>
  );
};

export default BeneficiariosTabla;
