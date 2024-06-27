import React, { useState, useEffect } from 'react';
import { RiDeleteBin6Line, RiEyeLine, RiPencilFill, RiAddLine } from 'react-icons/ri';
import { useActividades } from '../context/ActividadContext';
import { useInsumos } from '../context/InsumosContext';
import { useTareas } from '../context/TareasContext';
import Table from '../components/table/Table';
import TableHead from '../components/table/TableHead';
import TableBody from '../components/table/TableBody';
import TableRow from '../components/table/TableRow';
import TableCell from '../components/table/TableCell';
import TableActions from '../components/table/TableActions';
import Pagination from '../components/table/Pagination';
import CreateButton from '../components/table/CreateButton';
import SearchBar from '../components/table/SearchBar';
import Switch from '../components/table/Switch';
import ModalActividad from '../components/table/modals/ModalActividad';
import ViewActividad from '../components/table/views/ViewActividad';
import CardItem from '../components/table/CardItems/CardActividad';
import { Link } from 'react-router-dom';

const CRUDActividad = () => {
    const {
        actividades,
        createActividad,
        updateActividad,
        deleteActividad,
        disableActividad,
    } = useActividades();
    
    const { insumos } = useInsumos();
    const { tareas } = useTareas();

    const [currentPage, setCurrentPage] = useState(1);
    const [showModalForm, setShowModalForm] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const itemsPerPage = 10;

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

    const handleCreateOrUpdate = async (item) => {
        if (item._id) {
            await updateActividad(item._id, item);
        } else {
            await createActividad(item);
        }
        closeModal();
    };

    const handleDeleteButtonClick = async (id) => {
        try {
            await deleteActividad(id);
        } catch (error) {
            console.error('Error deleting actividad:', error);
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
        const item = actividades.find(item => item._id === id);
        if (item) {
            await disableActividad(id); 
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
                <h1 className="text-3xl font-semibold text-left text-gray-800">Actividad</h1>
                <div className="flex items-center gap-2">
                    <Link to="/proyectos" className="flex items-center gap-2 transition ease-in-out delay-150 bg-gradient-to-r from-blue-200 to-blue-500 hover:from-blue-300 hover:to-blue-700 text-white px-3 py-2 rounded-xl">
                        Volver
                    </Link>
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
                                <TableCell>Descripción</TableCell>
                                <TableCell>Tarea</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableHead>
                            <TableBody>
                                {currentData.map((item, index) => (
                                    <TableRow key={index} isActive={item.estado === 'activo'}>
                                        <TableCell label="Identificación">
                                            <p className="text-black">{item.id_actividad}</p>
                                        </TableCell>
                                        <TableCell label="Nombre">
                                            <p className="text-black">{item.nombre}</p>
                                        </TableCell>
                                        <TableCell label="Descripción">
                                            <p className="text-black">{item.descripcion}</p>
                                        </TableCell>
                                        <TableCell label="Tarea">
                                            <p className="text-black">
                                                {tareas.find(t => t._id === item.tarea)?.nombre || 'Desconocido'}
                                            </p>
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
                                                <TableActions
                                                item={item}
                                                handleViewButtonClick={handleViewButtonClick}
                                                handleEditButtonClick={handleEditButtonClick}
                                                handleDeleteButtonClick={handleDeleteButtonClick}
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
                    <ModalActividad onClose={closeModal} item={selectedItem} tareas={tareas} insumos={insumos} />
                </div>
            )}
            {showViewModal && selectedItem && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-900 bg-opacity-50">
                    <ViewActividad onClose={closeViewModal} item={selectedItem} tareas={tareas} insumos={insumos} />
                </div>
            )}
        </div>
    );
};

export default CRUDActividad;
