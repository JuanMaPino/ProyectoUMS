import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RiDeleteBin6Line, RiEyeLine, RiPlaneFill, RiAddLine } from 'react-icons/ri'; // Importar RiAddLine para el botón
import { useBeneficiarios } from '../context/BeneficiariosContext'; // Importar el contexto y el hook
import Table from '../components/table/Table';
import TableHead from '../components/table/TableHead';
import TableBody from '../components/table/TableBody';
import TableRow from '../components/table/TableRow';
import TableCell from '../components/table/TableCell';
import Pagination from '../components/table/Pagination';
import CreateButton from '../components/table/CreateButton';
import SearchBar from '../components/table/SearchBar';
import Switch from '../components/table/Switch';
import FormModal from '../components/table/modals/ModalBeneficiario';
import ViewModal from '../components/table/views/ViewBeneficiario';
import CardItem from '../components/table/CardItems/CardItem';

const CRUDTable = () => {
  const { beneficiarios, createBeneficiario, updateBeneficiario, deleteBeneficiario } = useBeneficiarios(); // Extraer métodos del contexto
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModalForm, setShowModalForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const itemsPerPage = 6;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = beneficiarios.filter(item =>
      item.identificacion.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.telefono.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page on new search
  }, [beneficiarios, searchTerm]);

  const fetchData = async () => {
    try {
      // Ya no se usa axios directamente aquí, se usa el método del contexto
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleCreateClick = () => {
    setSelectedItem(null);
    setShowModalForm(true);
  };

  const handleSearch = (query) => {
    setSearchTerm(query);
  };

  const handleUpdate = async (updatedItem) => {
    try {
      await updateBeneficiario(updatedItem._id, updatedItem); // Utilizar método del contexto para actualizar
      closeModal();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDeleteButtonClick = async (id) => {
    try {
      await deleteBeneficiario(id); // Utilizar método del contexto para eliminar
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleViewButtonClick = (item) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const handleEditButtonClick = (item) => {
    setSelectedItem(item);
    setShowModalForm(true);
  };

  const handleSwitchChange = async (id) => {
    const item = beneficiarios.find(item => item._id === id);
    if (item) {
      const updatedItem = {
        ...item,
        estado: item.estado === 'activo' ? 'inactivo' : 'activo'
      };
      await handleUpdate(updatedItem);
    }
  };

  const closeModal = () => {
    setSelectedItem(null);
    setShowModalForm(false);
  };

  const closeViewModal = () => {
    setSelectedItem(null);
    setShowViewModal(false);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className='ml-3'>
      <div className="flex flex-col lg:flex-row justify-between items-center mb-4 gap-4">
        <div className="flex items-center gap-2">
          <CreateButton onClick={handleCreateClick} />
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
      {filteredData.length === 0 ? (
        <p className="text-center">No hay registros disponibles</p>
      ) : (
        <div>
          <div className="hidden md:block">
            <Table>
              <TableHead>
                <TableCell>Identificación</TableCell>
                <TableCell>Beneficiario</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Condición</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableHead>
              <TableBody>
                {currentData.map((item, index) => (
                  <TableRow key={index} isActive={item.estado === 'activo'}>
                    <TableCell label="Identificación">
                      <div>
                        <p className="text-black">{item.tipoDocumento.split(' ')[0]}</p>
                        <p className="text-xs text-gray-600">{item.identificacion}</p>
                      </div>
                    </TableCell>
                    <TableCell label="Beneficiario">
                      <div>
                        <p className="text-black">{item.nombre.substring(0, 18) + '...'}</p>
                        <p className="text-xs text-gray-600">{item.correoElectronico.substring(0, 18) + '...'}</p>
                      </div>
                    </TableCell>
                    <TableCell label="Teléfono">{item.telefono}</TableCell>
                    <TableCell label="Estatus" className={`py-1 px-2 text-black text-center`}>
                      {item.estado}
                    </TableCell>
                    <TableCell label="Estado">
                      <Switch
                        name="estado"
                        checked={item.estado === 'activo'}
                        onChange={() => handleSwitchChange(item._id)}
                      />
                    </TableCell>
                    <TableCell label="Acciones">
                      <div className="flex gap-1 mr-3">
                        <button
                          onClick={() => handleViewButtonClick(item)}
                          className="rounded-lg transition-colors text-white bg-gradient-to-r from-cyan-200 from-10% to-cyan-600 hover:from-cyan-400 hover:to-cyan-600 p-2"
                        >
                          <RiEyeLine />
                        </button>
                        <button
                          onClick={() => handleEditButtonClick(item)}
                          className={`rounded-lg transition-colors text-white ${item.estado === 'activo' ? 'bg-gradient-to-r from-violet-500 to-blue-600 hover:from-violet-700 hover:to-blue-800' : 'bg-gray-300 cursor-not-allowed'} p-2`}
                          disabled={item.estado !== 'activo'}
                        >
                          <RiPlaneFill />
                        </button>
                        <button
                          onClick={() => handleDeleteButtonClick(item._id)}
                          className={`rounded-lg transition-colors text-white ${item.estado === 'activo' ? 'bg-gradient-to-r from-rose-400 from-10% to-red-600 hover:from-rose-700 hover:to-red-700' : 'bg-gray-300 cursor-not-allowed'} p-2`}
                          disabled={item.estado !== 'activo'}
                        >
                          <RiDeleteBin6Line />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <Pagination
                totalItems={filteredData.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </Table>
          </div>
          <div className="md:hidden">
            {currentData.map((item, index) => (
              <CardItem
                key={index}
                item={item}
                onEdit={handleEditButtonClick}
                onView={handleViewButtonClick}
                onDelete={handleDeleteButtonClick}
                onSwitchChange={handleSwitchChange}
                isActive={item.estado === 'activo'}
              />
            ))}
            <Pagination
              totalItems={filteredData.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
            {/* Botón flotante para crear */}
            <button
              onClick={handleCreateClick}
              className="fixed bottom-4 right-2 bg-gradient-to-tr from-blue-200 to-blue-500  hover:from-blue-300  hover:to-blue-700 text-white font-bold py-3 px-3 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              <RiAddLine size={24} />
            </button>
          </div>
        </div>
      )}
      {showModalForm && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-900 bg-opacity-50 ">
          <FormModal onClose={closeModal} item={selectedItem} fetchData={fetchData} />
        </div>
      )}
      {showViewModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-900 bg-opacity-50 ">
          <ViewModal onClose={closeViewModal} item={selectedItem} />
        </div>
      )}
    </div>
  );
};

export default CRUDTable;
