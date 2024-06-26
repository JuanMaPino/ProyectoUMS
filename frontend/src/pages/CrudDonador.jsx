import React, { useState, useEffect } from 'react';
import { RiDeleteBin6Line, RiEyeLine, RiPencilFill, RiAddLine } from 'react-icons/ri';
import { useDonadores } from '../context/DonadoresContext'; // Adjust the path according to your structure
import Table from '../components/table/Table';
import TableHead from '../components/table/TableHead';
import TableBody from '../components/table/TableBody';
import TableRow from '../components/table/TableRow';
import TableCell from '../components/table/TableCell';
import Pagination from '../components/table/Pagination';
import CreateButton from '../components/table/CreateButton';
import SearchBar from '../components/table/SearchBar';
import Switch from '../components/table/Switch';
import ModalDonador from '../components/table/modals/ModalDonador';
import ViewDonador from '../components/table/views/ViewDonador';
import CardItem from '../components/table/CardItems/CardDonador';
import FloatingButton from '../components/FloatingButton';

const CRUDDonador = () => {
    const {
        donadores,
        createDonador,
        updateDonador,
        deleteDonador,
        disableDonador,
    } = useDonadores();

    const [currentPage, setCurrentPage] = useState(1);
    const [showModalForm, setShowModalForm] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const itemsPerPage = 6;

    useEffect(() => {
        setCurrentPage(1); // Reset to first page on new search
    }, [searchTerm]);

    const handleCreateClick = () => {
        setSelectedItem(null);
        setShowModalForm(true);
    };

    const handleSearch = (query) => {
        setSearchTerm(query);
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    const handleUpdate = async (updatedItem) => {
        try {
            await updateDonador(updatedItem._id, updatedItem);
            closeModal();
        } catch (error) {
            console.error('Error updating item:', error);
            // Add user-friendly error handling here
        }
    };

    const handleDeleteButtonClick = async (id) => {
        try {
          console.log(`Intentando eliminar donador con ID: ${id}`);
          await deleteDonador(id);
          console.log('Donador eliminado exitosamente');
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
        const item = donadores.find(item => item._id === id);
        if (item) {
            const updatedItem = {
                ...item,
                estado: item.estado === 'activo' ? 'inactivo' : 'activo'
            };
            await disableDonador(id); // Utilizing the state change function from context
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
    const filteredData = searchTerm
        ? donadores.filter(item =>
            item.identificacion.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.telefono && item.telefono.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        )
        : donadores;

    const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div>
            <div className="flex flex-col lg:flex-row justify-between items-center mb-4 gap-4">
                <h1 className="text-3xl font-semibold text-left text-gray-800">Donadores</h1>
                <div className="flex items-center gap-2">
                    <SearchBar onSearch={handleSearch} />
                    <CreateButton onClick={handleCreateClick} />
                </div>
            </div>
            {donadores.length === 0 ? (
                <p className="text-center">No hay registros disponibles</p>
            ) : (
                <div>
                    <div className="hidden md:block">
                        <Table>
                            <TableHead>
                                <TableCell>Identificación</TableCell>
                                <TableCell>Donador</TableCell>
                                <TableCell>Contacto</TableCell>
                                <TableCell>Estatus</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableHead>
                            <TableBody>
                                {currentData.map((item, index) => (
                                    <TableRow key={index} isActive={item.estado === 'activo'}>
                                        <TableCell label="Identificación">
                                            <div>
                                                <p className="text-black">{item.identificacion}</p>
                                                <p className="text-xs text-gray-600">{item.tipoDocumen}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell label="Donador">
                                            <div>
                                                <p className="text-black">{item.nombre}</p>
                                                <p className="text-black">{item.nombreEmpresa}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell label="Contacto">
                                            <div>
                                                <p className="text-black">{item.correoElectronico.substring(0, 18) + '...'}</p>
                                                <p className=" text-black">{item.contacto}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell label="Estatus" className={`py-1 px-2 text-black text-center`}>
                                            {capitalizeFirstLetter(item.estado || item)}
                                        </TableCell>
                                        <TableCell label="Estado">
                                            <Switch
                                                name="estado"
                                                checked={item.estado === 'activo'}
                                                onChange={() => handleSwitchChange(item._id)}
                                            />
                                        </TableCell>
                                        <TableCell label="Acciones">
                                            <div className="flex gap-2">
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
                                                    <RiPencilFill />
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
                        <FloatingButton onClick={handleCreateClick} />
                    </div>
                </div>
            )}
            {showModalForm && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-900 bg-opacity-50">
                    <ModalDonador onClose={closeModal} onSubmit={selectedItem ? handleUpdate : createDonador} item={selectedItem} />
                </div>
            )}
            {showViewModal && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-900 bg-opacity-50">
                    <ViewDonador onClose={closeViewModal} item={selectedItem} />
                </div>
            )}
        </div>
    );
};

export default CRUDDonador;
