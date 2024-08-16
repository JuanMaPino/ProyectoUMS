import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useActividades } from '../context/ActividadContext'; // Verifica la ruta aquí
import Table from '../components/table/Table';
import TableHead from '../components/table/TableHead';
import TableBody from '../components/table/TableBody';
import TableRow from '../components/table/TableRow';
import TableCell from '../components/table/TableCell';
import Pagination from '../components/table/Pagination';
import CreateButton from '../components/table/CreateButton';
import SearchBar from '../components/table/SearchBar';
import Switch from '../components/table/Switch';
import ModalActividad from '../components/table/modals/ModalActividad';
import ViewActividad from '../components/table/views/ViewActividad';
import { showAlert, showToast } from '../components/table/alertFunctions';

const Activities = () => {
    const { id } = useParams();
    const {
        createActividad,
        updateActividad,
        deleteActividad,
        disableActividad,
        fetchActividadesByProjectId,
        actividades,
        errors
    } = useActividades();

    const [currentPage, setCurrentPage] = useState(1);
    const [showModalForm, setShowModalForm] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const itemsPerPage = 10;

    useEffect(() => {
        fetchActividadesByProjectId(id);
        setCurrentPage(1);
    }, [fetchActividadesByProjectId, id]);

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
            await createActividad({ ...item, proyectoId: id });
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
                    await deleteActividad(id);
                    showToast('Actividad eliminada', 'success');
                } catch (error) {
                    console.error('Error deleting activity:', error);
                    showToast('Error al eliminar la actividad', 'error');
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
                    console.error('Error updating activity status:', error);
                    showToast('Error al actualizar el estado', 'error');
                }
            }
        );
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
            item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : actividades;

    const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div>
            <div className="flex flex-col lg:flex-row justify-between items-center mb-4 gap-4">
                <h1 className="text-3xl font-semibold text-left text-gray-800">Actividades</h1>
                <div className="flex items-center gap-2">
                    <CreateButton onClick={handleCreateClick} />
                    <SearchBar onSearch={handleSearch} />
                </div>
            </div>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Descripción</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {currentData.map(item => (
                        <TableRow key={item._id}>
                            <TableCell>{item.nombre}</TableCell>
                            <TableCell>{item.descripcion}</TableCell>
                            <TableCell>
                                <Switch
                                    checked={item.estado}
                                    onChange={() => handleSwitchChange(item._id)}
                                />
                            </TableCell>
                            <TableCell>
                                <button onClick={() => handleViewButtonClick(item)}>Ver</button>
                                <button onClick={() => handleEditButtonClick(item)}>Editar</button>
                                <button onClick={() => handleDeleteButtonClick(item._id)}>Eliminar</button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Pagination
                currentPage={currentPage}
                totalItems={filteredData.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
            />

            {showModalForm && (
                <ModalActividad
                    isOpen={showModalForm}
                    onRequestClose={closeModal}
                    onSubmit={handleCreateOrUpdate}
                    errors={errors}
                    initialData={selectedItem}
                />
            )}

            {showViewModal && (
                <ViewActividad
                    isOpen={showViewModal}
                    onRequestClose={closeViewModal}
                    data={selectedItem}
                />
            )}
        </div>
    );
};

export default Activities;
