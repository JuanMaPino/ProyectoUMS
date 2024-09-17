import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProyectos } from '../context/ProyectosContext';
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
import ViewBeneActivi from '../components/table/views/ViewBeneActivi'; // Importar el nuevo modal
import CardItem from '../components/table/CardItems/CardActividad';
import { showAlert, showToast } from '../components/table/alertFunctions';

const CRUDActividad = () => {
    const { proyectoId } = useParams();
    const navigate = useNavigate();

    const {
        proyectos,
        actividades,
        fetchActividades,
        createProyecto,
        updateProyecto,
        deleteProyecto,
        disableProyecto,
        fetchProyectos,
        updateActividad
    } = useProyectos();

    const [currentPage, setCurrentPage] = useState(1);
    const [showModalForm, setShowModalForm] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showBeneficiariosModal, setShowBeneficiariosModal] = useState(false); // Estado para el modal de beneficiarios
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const itemsPerPage = 10;

    useEffect(() => {
        if (proyectoId) {
            fetchActividades(proyectoId);
        }
    }, [proyectoId, fetchActividades]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleCreateClick = () => {
        setSelectedItem(null);
        setShowModalForm(true);
    };

    const handleSearch = (query) => {
        setSearchTerm(query);
    };

    const handleCreateOrUpdate = async (item) => {
        try {
            const proyecto = proyectos.find(p => p._id === proyectoId);
            if (item._id) {
                await updateActividad(proyectoId, item._id, item);
                showToast('Actividad actualizada', 'success');
            } else {
                item.proyectoId = proyectoId;
                await updateProyecto(proyectoId, {
                    ...proyecto,
                    actividades: [...proyecto.actividades, item]
                });
                showToast('Actividad creada', 'success');
            }
            closeModal();
        } catch (error) {
            console.error('Error saving activity:', error);
            showToast('Error al guardar la actividad', 'error');
        }
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
                    const proyecto = proyectos.find(p => p._id === proyectoId);
                    await updateProyecto(proyectoId, {
                        ...proyecto,
                        actividades: proyecto.actividades.filter(a => a._id !== id)
                    });
                    showToast('Actividad eliminada', 'success');
                } catch (error) {
                    console.error('Error deleting activity:', error);
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
                    const proyecto = proyectos.find(p => p._id === proyectoId);
                    const actividad = proyecto.actividades.find(a => a._id === id);
                    const updatedActividad = {
                        ...actividad,
                        estado: actividad.estado === 'activo' ? 'inactivo' : 'activo'
                    };
                    await updateActividad(proyectoId, id, updatedActividad);
                    fetchActividades(proyectoId);
                    showToast('Estado de la actividad actualizado', 'success');
                } catch (error) {
                    console.error('Error updating activity status:', error);
                    showToast('Error al actualizar el estado', 'error');
                }
            }
        );
    };

    const handleViewButtonClick = (item) => {
        setSelectedItem(item);
        setShowViewModal(true);
    };

    const handleViewBeneficiariosClick = (item) => {
        console.log(item);  // Verifica si 'item' contiene los beneficiarios correctamente
        setSelectedItem(item);
        setShowBeneficiariosModal(true); // Mostrar el modal de beneficiarios
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

    const closeBeneficiariosModal = () => {
        setSelectedItem(null);
        setShowBeneficiariosModal(false); // Cerrar modal de beneficiarios
    };

    const proyecto = proyectos.find(p => p._id === proyectoId);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const filteredData = searchTerm
        ? actividades.filter(item =>
            (item.nombre ? item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
            (item.descripcion ? item.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) : false)
        )
        : actividades;

    const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div>
            <div className="flex flex-col lg:flex-row justify-between items-center mb-4 gap-4">
                <h1 className="text-3xl font-semibold text-left text-gray-800">Gestión de Actividades</h1>
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
                                                handleViewBeneficiariosClick={handleViewBeneficiariosClick}
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
                                onEdit={() => handleEditButtonClick(item)}
                                onView={() => handleViewButtonClick(item)}
                                onDelete={() => handleDeleteButtonClick(item._id)}
                            />
                        ))}
                    </div>
                </div>
            )}
            {showModalForm && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-900 bg-opacity-50">
                    <ModalActividad
                        onClose={closeModal}
                        item={selectedItem}
                        onSubmit={handleCreateOrUpdate}
                        proyectoId={proyectoId}
                    />
                </div>
            )}
            {showViewModal && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-900 bg-opacity-50">
                    <ViewActividad
                        onClose={closeViewModal}
                        item={selectedItem}
                    />
                </div>
            )}
            {showBeneficiariosModal && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-900 bg-opacity-50">
                    <ViewBeneActivi
                        onClose={closeBeneficiariosModal}
                        beneficiarios={selectedItem?.beneficiarios || []} // Pasar beneficiarios al modal
                    />
                </div>
            )}
        </div>
    );
};

export default CRUDActividad;
