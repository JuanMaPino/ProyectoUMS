import React, { useState, useEffect } from 'react';
import {
    RiDeleteBin6Line,
    RiEyeLine,
    RiPencilFill,
    RiAddLine
} from 'react-icons/ri';
import { useDonadores } from '../context/DonadoresContext'; // Ajusta la ruta según tu estructura
import Table from '../components/table/Table';
import TableHead from '../components/table/TableHead';
import TableBody from '../components/table/TableBody';
import TableRow from '../components/table/TableRow';
import TableActions from '../components/table/TableActions';
import TableCell from '../components/table/TableCell';
import Pagination from '../components/table/Pagination';
import CreateButton from '../components/table/CreateButton';
import SearchBar from '../components/table/SearchBar';
import Switch from '../components/table/Switch';
import ModalDonador from '../components/table/modals/ModalDonador';
import ViewDonador from '../components/table/views/ViewDonador';
import CardItem from '../components/table/CardItems/CardDonador';
import FloatingButton from '../components/FloatingButton';
import { showToast } from '../components/table/alertFunctions'; // Ajusta la ruta según donde está definido showAlert

const CRUDDonador = () => {
    const {
        donadores,
        createDonador,
        updateDonador,
        deleteDonador,
        disableDonador
    } = useDonadores();

    const [currentPage, setCurrentPage] = useState(1);
    const [showModalForm, setShowModalForm] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const itemsPerPage = 10;

    useEffect(() => {
        setCurrentPage(1); // Resetear a la primera página en una nueva búsqueda
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
            showToast({ title: 'Donador actualizado', icon: 'success' });
            closeModal();
        } catch (error) {
            console.error('Error updating item:', error);
            showToast({ title: 'Error al actualizar el donador', icon: 'error' });
        }
    };

    const handleDeleteButtonClick = async (id) => {
        try {
            await deleteDonador(id);
            showToast({ title: 'Donador eliminado', icon: 'success' });
        } catch (error) {
            console.error('Error deleting item:', error);
            showToast({ title: 'Error al eliminar el donador', icon: 'error' });
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
        const item = donadores.find((item) => item._id === id);
        if (item) {
            const updatedItem = {
                ...item,
                estado: item.estado === 'activo' ? 'inactivo' : 'activo'
            };
            await disableDonador(id); // Utilizando la función de cambio de estado del contexto
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
    
    // Ordenar los donadores para que los inactivos estén al final
    const sortedDonadores = donadores.sort((a, b) => {
        if (a.estado === 'inactivo' && b.estado === 'activo') {
            return 1;
        }
        if (a.estado === 'activo' && b.estado === 'inactivo') {
            return -1;
        }
        return 0;
    });

    const filteredData = searchTerm
        ? sortedDonadores.filter(
              (item) =>
                  item.identificacion
                      .toString()
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                  item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (item.telefono &&
                      item.telefono
                          .toString()
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()))
          )
        : sortedDonadores;

    const currentData = filteredData.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    return (
        <div>
            <div className="flex flex-col lg:flex-row justify-between items-center mb-4 gap-4">
                <h1 className="text-3xl font-semibold text-left text-gray-800">
                Gestión de Donadores
                </h1>
                <div className="flex items-center gap-2">
                    <CreateButton onClick={handleCreateClick} />
                    <SearchBar onSearch={handleSearch} />
                </div>
            </div>
            {donadores.length === 0 ? (
                <p className="text-center">No hay registros disponibles</p>
            ) : (
                <div>
                    <div className="hidden md:block">
                        <Table>
                            <TableHead cols={6}>
                                <TableCell>Identificación</TableCell>
                                <TableCell>Donador</TableCell>
                                <TableCell>Contacto</TableCell>
                                <TableCell>Estatus</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableHead>
                            <TableBody>
                                {currentData.map((item, index) => (
                                    <TableRow
                                        key={index}
                                        isActive={item.estado === 'activo'}
                                        cols={6}
                                    >
                                        <TableCell label="Identificación">
                                            <div>
                                                <p className="text-black">
                                                    {item.identificacion}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    {item.tipoDocumen}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell label="Donador">
                                            <div>
                                                <p className="text-black">
                                                    {item.nombre}
                                                </p>
                                                <p className="text-black">
                                                    {item.nombreEmpresa}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell label="Contacto">
                                            <div>
                                                <p className="text-black">
                                                    {item.correoElectronico.substring(
                                                        0,
                                                        18
                                                    ) + '...'}
                                                </p>
                                                <p className=" text-black">
                                                    {item.contacto}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell
                                            label="Estatus"
                                            className={`py-1 px-2 text-black text-center`}
                                        >
                                            {capitalizeFirstLetter(
                                                item.estado || item
                                            )}
                                        </TableCell>
                                        <TableCell label="Estado">
                                            <Switch
                                                name="estado"
                                                checked={
                                                    item.estado === 'activo'
                                                }
                                                onChange={() =>
                                                    handleSwitchChange(
                                                        item._id
                                                    )
                                                }
                                            />
                                        </TableCell>
                                        <TableCell label="Acciones">
                                            <div className="flex gap-2">
                                                <TableActions
                                                    item={item}
                                                    handleViewButtonClick={
                                                        handleViewButtonClick
                                                    }
                                                    handleEditButtonClick={
                                                        handleEditButtonClick
                                                    }
                                                    handleDeleteButtonClick={
                                                        handleDeleteButtonClick
                                                    }
                                                />
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
                    <ModalDonador
                        onClose={closeModal}
                        onSubmit={selectedItem ? handleUpdate : createDonador}
                        item={selectedItem}
                    />
                </div>
            )}
            {showViewModal && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-900 bg-opacity-50">
                    <ViewDonador
                        onClose={closeViewModal}
                        item={selectedItem}
                    />
                </div>
            )}
        </div>
    );
};

export default CRUDDonador;
