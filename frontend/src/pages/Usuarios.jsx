import React, { useState, useEffect } from 'react';
import { useUsuarios } from '../context/UsuariosContext'; // Custom hook for user context
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
import FormModal from '../components/table/modals/ModalUsuario'; // User form modal
import ViewModal from '../components/table/views/ViewUsuario'; // User view modal
import FloatingButton from '../components/FloatingButton';
import CardItem from '../components/table/CardItems/CardItem';
import { showAlert, showToast } from '../components/table/alertFunctions';

const CRUDUser = () => {
    const {
        createUsuario,
        updateUsuario,
        deleteUsuario,
        usuarios,
        errors
    } = useUsuarios(); // Hook for managing users

    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModalForm, setShowModalForm] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const itemsPerPage = 10;

    useEffect(() => {
        const filtered = usuarios.filter(user =>
            user.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filtered);
        setCurrentPage(1); // Reset to first page on new search
    }, [usuarios, searchTerm]);

    const handleCreateClick = () => {
        setSelectedItem(null);
        setShowModalForm(true);
    };

    const handleSearch = (query) => {
        setSearchTerm(query);
    };

    const handleCreateOrUpdate = async (user) => {
        try {
            if (user._id) {
                await updateUsuario(user._id, user);
                showToast('Usuario actualizado exitosamente', 'success');
            } else {
                await createUsuario(user);
                showToast('Usuario creado exitosamente', 'success');
            }
        } catch (error) {
            console.error('Error saving user:', error);
        } finally {
            handleCloseModal();
        }
    };

    const handleDeleteButtonClick = async (id) => {
        try {
            await deleteUsuario(id);
            showToast('Usuario eliminado exitosamente', 'success');
        } catch (error) {
            console.error('Error deleting user:', error);
            showToast('Error al eliminar el usuario', 'error');
        }
    };

    const handleViewButtonClick = (user) => {
        setSelectedItem(user);
        setShowViewModal(true);
    };

    const handleEditButtonClick = (user) => {
        setSelectedItem(user);
        setShowModalForm(true);
    };

    const handleCloseModal = () => {
        setSelectedItem(null);
        setShowModalForm(false);
    };

    const closeViewModal = () => {
        setSelectedItem(null);
        setShowViewModal(false);
    };

    const handleSwitchChange = async (id) => {
        const item = usuarios.find(item => item._id === id);
        if (item) {
            showAlert(
                {
                    title: '¿Estás seguro?',
                    text: `El estado del usuario cambiará a ${item.active ? 'inactivo' : 'activo'}`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, cambiar',
                    cancelButtonText: 'Cancelar'
                },
                async () => {
                    const updatedItem = {
                        ...item,
                        active: !item.active
                    };
                    try {
                        await handleCreateOrUpdate(updatedItem);
                        showToast('Estado del usuario cambiado exitosamente', 'success');
                    } catch (error) {
                        console.error('Error updating item:', error);
                        showToast('Error al cambiar el estado del usuario', 'error');
                    }
                }
            );
        }
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div>
            <div className="flex flex-col lg:flex-row justify-between items-center mb-4 gap-4">
                <h1 className="text-3xl font-semibold text-left text-gray-800">Gestión de Usuarios</h1>
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
                            <TableHead cols={5}>
                                <TableCell>Usuario</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Rol</TableCell>
                                <TableCell className="pl-10">Estado</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableHead>
                            <TableBody>
                                {currentData.map((user, index) => (
                                    <TableRow key={index} isActive={user.active} cols={5}>
                                        <TableCell label="Usuario">{user.usuario}</TableCell>
                                        <TableCell label="Email">{user.email.substring(0,18) + '...'}</TableCell>
                                        <TableCell label="Rol">{user.tipo?.nombre}</TableCell>
                                        <TableCell label="Estado" className='pl-10'>
                                            <Switch
                                                name="active"
                                                checked={user.active}
                                                onChange={() => handleSwitchChange(user._id)}
                                            />
                                        </TableCell>
                                        <TableCell label="Acciones">
                                            <div className="flex gap-2">
                                                <TableActions
                                                    item={user}
                                                    handleViewButtonClick={handleViewButtonClick}
                                                    // handleEditButtonClick={handleEditButtonClick}
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
                        {currentData.map((user, index) => (
                            <CardItem
                                key={index}
                                item={user}
                                onEdit={handleEditButtonClick}
                                onView={handleViewButtonClick}
                                onDelete={handleDeleteButtonClick}
                                onSwitchChange={handleSwitchChange}
                                isActive={user.active}
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
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-900 bg-opacity-50 ">
                    <FormModal onClose={handleCloseModal} item={selectedItem} />
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

export default CRUDUser;
