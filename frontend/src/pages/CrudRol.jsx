import React, { useState, useEffect } from 'react';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { useRoles } from '../context/RolesContext';
import { BsInfoCircle } from "react-icons/bs";
import Table from '../components/table/Table';
import TableHead from '../components/table/TableHead';
import TableBody from '../components/table/TableBody';
import TableRow from '../components/table/TableRow';
import TableCell from '../components/table/TableCell';
import TableActions from '../components/table/TableActions';
import Pagination from '../components/table/Pagination';
import CreateButton from '../components/table/CreateButton';
import SearchBar from '../components/table/SearchBar';
import FormModal from '../components/table/modals/ModalRol';
import { showAlert, showToast } from '../components/table/alertFunctions';
import CardItem from '../components/table/CardItems/CardItem';
import FloatingButton from '../components/FloatingButton';

const CRUDRoles = () => {
    const { roles, createRol, updateRol, deleteRol } = useRoles();
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModalForm, setShowModalForm] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const itemsPerPage = 10;

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const filtered = roles.filter(item =>
            item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [roles, searchTerm]);

    const fetchData = async () => {
        try {
            // Método del contexto para obtener los datos
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

    const handleCreateOrUpdate = async (item) => {
        try {
            if (item._id) {
                await updateRol(item._id, item);
                showToast('Rol actualizado exitosamente', 'success');
            } else {
                await createRol(item);
                showToast('Rol agregado exitosamente', 'success'); // Mensaje de éxito al agregar
            }
            closeModal();
        } catch (error) {
            console.error('Error creando o actualizando el rol:', error);
            showToast('Error al crear o actualizar rol', 'error');
        }
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
                    await deleteRol(id);
                    showToast('Rol eliminado exitosamente', 'success'); // Mensaje de éxito al eliminar
                } catch (error) {
                    console.error('Error al eliminar el rol:', error);
                    showToast('Error al eliminar rol', 'error');
                }
            }
        );
    };

    const handleEditButtonClick = (item) => {
        setSelectedItem(item);
        setShowModalForm(true);
    };

    const closeModal = () => {
        setSelectedItem(null);
        setShowModalForm(false);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div>
            <div className="flex flex-col lg:flex-row justify-between items-center mb-4 gap-4">
                <h1 className="text-3xl font-semibold text-left text-gray-800">Roles</h1>
                <div className="flex items-center gap-2">
                    <SearchBar onSearch={handleSearch} />
                    <CreateButton onClick={handleCreateClick} />
                </div>
            </div>
            {filteredData.length === 0 ? (
                <p className="text-center">No hay registros disponibles</p>
            ) : (
                <div>
                    <div className="hidden md:block">
                        <Table>
                            <TableHead cols={3}>
                                <TableCell className="pl-4">Nombre</TableCell>
                                <TableCell className="pl-4">Descripción</TableCell>
                                <TableCell className="pl-10">Acciones</TableCell>
                            </TableHead>
                            <TableBody>
                                {currentData.map((item, index) => (
                                    <TableRow key={index} cols={3}>
                                        <TableCell label="Nombre" className="pl-4">
                                            <p className="text-sm text-gray-600 pl-4">{item.nombre}</p>
                                        </TableCell>
                                        <TableCell label="Descripción">
                                            <p className="text-sm text-gray-600 pl-4">{item.descripcion.substring(0, 50) + '...'}</p>
                                        </TableCell>
                                        <TableCell label="Acciones" className="pl-10">
                                            <div className="flex gap-1 mr-3">
                                                <TableActions
                                                    item={item}
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
                                onDelete={handleDeleteButtonClick}
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
                    <FormModal onClose={closeModal} onSubmit={handleCreateOrUpdate} item={selectedItem} />
                </div>
            )}
        </div>
    );
};

export default CRUDRoles;
