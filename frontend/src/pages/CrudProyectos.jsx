// CRUDProyecto.js
import React, { useState, useEffect } from 'react';
import { RiAddLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import Table from '../components/table/Table';
import TableHead from '../components/table/TableHead';
import TableBody from '../components/table/TableBody';
import TableRow from '../components/table/TableRow';
import TableCell from '../components/table/TableCell';
import Pagination from '../components/table/Pagination';
import CreateButton from '../components/table/CreateButton';
import SearchBar from '../components/table/SearchBar';
import Switch from '../components/table/Switch';
import ModalProyecto from '../components/table/modals/ModalProyecto';
import ViewProyecto from '../components/table/views/ViewProyecto';
import { useProyectos } from '../context/ProyectosContext';
import CardItem from '../components/table/CardItems/CardItem';
import TableActions from '../components/table/TableActions';
import { showAlert, showToast } from '../components/table/alertFunctions';

const CRUDProyecto = () => {
    const {
        createProyecto,
        updateProyecto,
        deleteProyecto,
        disableProyecto,
        fetchProyectos,
        proyectos,
        errors
    } = useProyectos();

    const [currentPage, setCurrentPage] = useState(1);
    const [showModalForm, setShowModalForm] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const itemsPerPage = 10;
    const navigate = useNavigate(); // Instanciar useNavigate

    useEffect(() => {
        fetchProyectos();
        setCurrentPage(1);
    }, [fetchProyectos]);

    const handleCreateClick = () => {
        setSelectedItem(null);
        setShowModalForm(true);
    };

    const handleSearch = (query) => {
        setSearchTerm(query);
    };

    const handleCreateOrUpdate = async (item) => {
        if (item._id) {
            await updateProyecto(item._id, item);
        } else {
            await createProyecto(item);
        }
        closeModal();
    };

    const handleDeleteButtonClick = (id) => {
        showAlert(
            {
                title: '¿Estás seguro?',
                text: 'No podrás revertir esto',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            },
            async () => {
                try {
                    await deleteProyecto(id);
                    showToast('Proyecto eliminado', 'success');
                } catch (error) {
                    console.error('Error deleting project:', error);
                    showToast('Error al eliminar el proyecto', 'error');
                }
            }
        );
    };

    const handleViewButtonClick = (item) => {
        setSelectedItem(item);
        setShowViewModal(true);
    };

    const handleEditButtonClick = (item) => {
        setSelectedItem(item);
        setShowModalForm(true);
    };

    const handleSwitchChange = (id) => {
        showAlert(
            {
                title: '¿Deseas cambiar el estado?',
                text: 'Esta acción actualizará el estado del proyecto.',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, cambiar',
                cancelButtonText: 'Cancelar'
            },
            async () => {
                try {
                    await disableProyecto(id);
                    showToast('Estado del proyecto actualizado', 'success');
                } catch (error) {
                    console.error('Error updating project status:', error);
                    showToast('Error al actualizar el estado', 'error');
                }
            }
        );
    };

    const handleActivitiesClick = (id) => {
        navigate(`/projects/${id}/activities`);
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
        ? proyectos.filter(item =>
            item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : proyectos;

    const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div>
            <div className="flex flex-col lg:flex-row justify-between items-center mb-4 gap-4">
                <h1 className="text-3xl font-semibold text-left text-gray-800">Proyectos</h1>
                <div className="flex items-center gap-2">
                    <CreateButton onClick={handleCreateClick} />
                    <SearchBar onSearch={handleSearch} />
                </div>
            </div>
            {proyectos.length === 0 ? (
                <p className="text-center">No hay registros disponibles</p>
            ) : (
                <div>
                    <div className="hidden md:block">
                        <Table>
                            <TableHead cols={5}>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Descripción</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Acciones</TableCell>
                                <TableCell>Actividades</TableCell> {/* Nueva columna */}
                            </TableHead>
                            <TableBody>
                                {currentData.map((item, index) => (
                                    <TableRow key={index} isActive={item.estado === 'activo'} cols={5}>
                                        <TableCell label="Nombre">{item.nombre}</TableCell>
                                        <TableCell label="Descripción">{item.descripcion}</TableCell>
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
                                                    handleDeleteButtonClick={() => handleDeleteButtonClick(item._id)}
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell label="Actividades"> {/* Nueva celda */}
                                            <button
                                                onClick={() => handleActivitiesClick(item._id)}
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                            >
                                                Ver Actividades
                                            </button>
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
                                onDelete={() => handleDeleteButtonClick(item._id)}
                                onSwitchChange={() => handleSwitchChange(item._id)}
                                isActive={item.estado === 'activo'}
                            >
                                <button
                                    onClick={() => handleActivitiesClick(item._id)}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                                >
                                    Ver Actividades
                                </button>
                            </CardItem>
                        ))}
                        <Pagination
                            totalItems={filteredData.length}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                        />
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
                    <ModalProyecto onClose={closeModal} item={selectedItem} />
                </div>
            )}
            {showViewModal && selectedItem && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-900 bg-opacity-50">
                    <ViewProyecto onClose={closeViewModal} item={selectedItem} />
                </div>
            )}
        </div>
    );
};

export default CRUDProyecto;
