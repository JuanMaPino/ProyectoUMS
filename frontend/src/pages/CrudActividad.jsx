import React, { useState, useEffect } from 'react';
import { RiAddLine } from 'react-icons/ri';
import { useParams, useNavigate } from 'react-router-dom'; // Importar hooks de react-router-dom
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
import { showAlert, showToast } from '../components/table/alertFunctions';

const CRUDActividad = () => {
    const { proyectoId } = useParams();
    const navigate = useNavigate();

    const {
        actividades,
        getActividadesByProyecto,
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
        if (proyectoId) {
            getActividadesByProyecto(proyectoId);
        }
    }, [proyectoId, getActividadesByProyecto]);

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
                    await deleteActividad(id);
                    showToast('Actividad eliminada', 'success');
                } catch (error) {
                    console.error('Error deleting actividad:', error);
                    showToast('Error al eliminar la actividad', 'error');
                }
            }
        );
    };

    const handleSwitchChange = async (id) => {
        showAlert(
            {
                title: '¿Deseas cambiar el estado?',
                text: 'Esta acción actualizará el estado de la actividad.',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, cambiar',
                cancelButtonText: 'Cancelar'
            },
            async () => {
                try {
                    await disableActividad(id);
                    showToast('Estado de la actividad actualizado', 'success');
                } catch (error) {
                    console.error('Error updating actividad status:', error);
                    showToast('Error al actualizar el estado', 'error');
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
            (item.id_actividad ? item.id_actividad.toString().toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
            (item.nombre ? item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) : false)
        )
        : actividades;

    const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div>
            <div className="flex flex-col lg:flex-row justify-between items-center mb-4 gap-4">
                <h1 className="text-3xl font-semibold text-left text-gray-800">Actividad</h1>
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
                            <TableHead cols={5}>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Descripción</TableCell>
                                <TableCell>Tipo</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableHead>
                            <TableBody>
                                {currentData.map((item, index) => (
                                    <TableRow key={index} isActive={item.estado === 'activo'} cols={5}>
                                        <TableCell label="Nombre">
                                            <p className="text-black">{item.nombre}</p>
                                        </TableCell>
                                        <TableCell label="Descripción">
                                            <p className="text-black">{item.descripcion}</p>
                                        </TableCell>
                                        <TableCell label="Tipo">
                                            <p className='text-black'>{item.tipo}</p>
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
                                                    handleDeleteButtonClick={() => handleDeleteButtonClick(item._id)}
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
                                onDelete={() => handleDeleteButtonClick(item._id)}
                                onSwitchChange={() => handleSwitchChange(item._id)}
                                isActive={item.estado === 'activo'}
                            />
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
