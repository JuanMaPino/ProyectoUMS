import React, { useState, useEffect } from 'react';
import { RiDeleteBin6Line, RiEyeLine, RiPlaneFill, RiAddLine } from 'react-icons/ri';
import { useActividades } from '../context/ActividadContext'; // Ajusta la ruta según tu estructura
import Table from '../components/table/Table';
import TableHead from '../components/table/TableHead';
import TableBody from '../components/table/TableBody';
import TableRow from '../components/table/TableRow';
import TableCell from '../components/table/TableCell';
import Pagination from '../components/table/Pagination';
import CreateButton from '../components/table/CreateButton';
import SearchBar from '../components/table/SearchBar';
import Switch from '../components/table/Switch';
import ModalActividad from '../components/table/modals/ModalActividad'; // Ajustar el nombre del modal según tu estructura
import ViewActividad from '../components/table/views/ViewActividad'; // Ajustar el nombre del componente según tu estructura
import CardItem from '../components/table/CardItems/CardActividad'; // Ajustar el nombre del componente según tu estructura

const CRUDActividad = () => {
    const {
        actividades,
        createActividad,
        updateActividad,
        deleteActividad,
        disableActividad,
    } = useActividades();

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
        setCurrentPage(1); // Reset to first page on new search
    }, [searchTerm]);

    const fetchData = async () => {
        // Aquí no se necesita ya que el contexto ActividadProvider maneja la carga inicial
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
            await updateActividad(updatedItem.id_actividad, updatedItem);
            closeModal();
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const handleDeleteButtonClick = async (id) => {
        try {
            await deleteActividad(id);
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
        const item = actividades.find(item => item.id_actividad === id);
        if (item) {
            const updatedItem = {
                ...item,
                estado: item.estado === 'activo' ? 'inactivo' : 'activo'
            };
            await disableActividad(id); // Utilizando la función de cambio de estado del contexto
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
        ? actividades.filter(item =>
            item.id_actividad.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : actividades;

    const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div>
            <div className="flex flex-col lg:flex-row justify-between items-center mb-4 gap-4">
                <div className="flex items-center gap-2">
                    <CreateButton onClick={handleCreateClick} />
                    <SearchBar onSearch={handleSearch} />
                </div>
            </div>
            {actividades.length === 0 ? (
                <p className="text-center">No hay registros disponibles</p>
            ) : (
                <div>
                    <div className="hidden md:block">
                        <Table>
                            <TableHead>
                                <TableCell>Identificación</TableCell>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Tipo</TableCell>

                                <TableCell>Insumo</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableHead>
                            <TableBody>
                                {currentData.map((item, index) => (
                                    <TableRow key={index} isActive={item.estado === 'activo'}>
                                        <TableCell label="Identificación">
                                            <div>
                                                <p className="text-black">{item.id_actividad}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell label="Nombre">
                                            <div>
                                                <p className="text-black">{item.nombre}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell label="Tipo">{item.tipo}</TableCell>
                                        <TableCell label="Insumo">{item.insumo}</TableCell>
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
                            className="fixed bottom-4 right-2 bg-gradient-to-tr from-blue-200 to-blue-500 hover:from-blue-300 hover:to-blue-700 text-white font-bold py-3 px-3 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                        >
                            <RiAddLine size={24} />
                        </button>
                    </div>
                </div>
            )}
            {showModalForm && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-900 bg-opacity-50">
                    <ModalActividad onClose={closeModal} item={selectedItem} fetchData={fetchData} />
                </div>
            )}
            {showViewModal && selectedItem && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-900 bg-opacity-50">
                    <ViewActividad onClose={closeViewModal} item={selectedItem} />
                </div>
            )}
        </div>
    );
};

export default CRUDActividad;
