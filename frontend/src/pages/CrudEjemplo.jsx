import React, { useState, useEffect } from 'react';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { useBeneficiarios } from '../context/BeneficiariosContext';
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
import Switch from '../components/table/Switch';
import FormModal from '../components/table/modals/ModalBeneficiario';
import ViewModal from '../components/table/views/ViewBeneficiario';
import ViewFamiliar from '../components/table/views/ViewFamiliar';
import { showAlert, showToast } from '../components/table/alertFunctions';
import CardItem from '../components/table/CardItems/CardItem';
import FloatingButton from '../components/FloatingButton';

const CRUDTable = () => {
    const { beneficiarios, createBeneficiario, updateBeneficiario, deleteBeneficiario } = useBeneficiarios();
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModalForm, setShowModalForm] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showFamiliarModal, setShowFamiliarModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const itemsPerPage = 10;

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const filtered = beneficiarios.filter(item =>
            item.identificacion.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.telefono.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
        // Ordenar los beneficiarios filtrados
        const sortedFilteredData = filtered.sort((a, b) => {
            if (a.estado === 'activo' && b.estado === 'inactivo') {
                return -1;
            }
            if (a.estado === 'inactivo' && b.estado === 'activo') {
                return 1;
            }
            return 0;
        });
        setFilteredData(sortedFilteredData);
        setCurrentPage(1);
    }, [beneficiarios, searchTerm]);

    const fetchData = async () => {
        try {
            // Método del contexto para obtener los datos
            // Ordenar los beneficiarios por estado, activos primero, luego inactivos
            const sortedBeneficiarios = beneficiarios.sort((a, b) => {
                if (a.estado === 'activo' && b.estado === 'inactivo') {
                    return -1;
                }
                if (a.estado === 'inactivo' && b.estado === 'activo') {
                    return 1;
                }
                return 0;
            });
            setFilteredData(sortedBeneficiarios);
            setCurrentPage(1);
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

    const handleUpdate = async (updatedItem) => {
        try {
            await updateBeneficiario(updatedItem._id, updatedItem);
            showToast('Beneficiario actualizado exitosamente', 'success');
            closeModal();
        } catch (error) {
            console.error('Error updating item:', error);
            showToast('Error al actualizar beneficiario', 'error');
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
                    await deleteBeneficiario(id);
                    showToast('Beneficiario eliminado exitosamente', 'success');
                } catch (error) {
                    console.error('Error deleting item:', error);
                    showToast('Error al eliminar beneficiario', 'error');
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

    const handleSwitchChange = async (id) => {
        const item = beneficiarios.find(item => item._id === id);
        if (item) {
            showAlert(
                {
                    title: '¿Estás seguro?',
                    text: `El estado del beneficiario cambiará a ${item.estado === 'activo' ? 'inactivo' : 'activo'}`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, cambiar',
                    cancelButtonText: 'Cancelar'
                },
                async () => {
                    const updatedItem = {
                        ...item,
                        estado: item.estado === 'activo' ? 'inactivo' : 'activo'
                    };
                    try {
                        await handleUpdate(updatedItem);
                        showToast('Estado del beneficiario cambiado exitosamente', 'success');
                    } catch (error) {
                        console.error('Error updating item:', error);
                        showToast('Error al cambiar el estado del beneficiario', 'error');
                    }
                }
            );
        }
    };

    const handleFamiliaresButtonClick = (item) => {
        setSelectedItem(item);
        setShowFamiliarModal(true);
    };

    const closeModal = () => {
        setSelectedItem(null);
        setShowModalForm(false);
    };

    const closeViewModal = () => {
        setSelectedItem(null);
        setShowViewModal(false);
    };

    const closeFamiliarModal = () => {
        setSelectedItem(null);
        setShowFamiliarModal(false);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div>
            <div className="flex flex-col lg:flex-row justify-between items-center mb-4 gap-4">
                <h1 className="text-3xl font-semibold text-left text-gray-800">Gestión de Beneficiarios</h1>
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
                            <TableHead cols={6}>
                                <TableCell className="pl-4">Identificación</TableCell>
                                <TableCell className="pl-4">Beneficiario</TableCell>
                                <TableCell className="pl-4">Correo Electrónico</TableCell>
                                <TableCell className="pl-8">Familiares</TableCell>
                                <TableCell className="pl-14">Estado</TableCell> {/* Ajustar padding */}
                                <TableCell className="pl-10">Acciones</TableCell> {/* Ajustar padding */}
                            </TableHead>
                            <TableBody>
                                {currentData.map((item, index) => (
                                    <TableRow key={index} isActive={item.estado === 'activo'} cols={6}>
                                        <TableCell label="Identificación" className="pl-4">
                                            <div>
                                                <p className="text-sm text-gray-600 pl-4">{item.identificacion}</p>
                                                <p className="text-sm text-gray-600 pl-4">{item.tipoDocumento.split(' ')[0]}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell label="Beneficiario">
                                            <div>
                                                <p className="text-sm text-gray-600 pl-4">{item.nombre.substring(0, 18) + '...'}</p>
                                                <p className="text-sm text-gray-600 pl-4">{item.telefono}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell label="Correo Electrónico" className="pl-4">{item.correoElectronico.substring(0, 18) + '...'}</TableCell>
                                        <TableCell label="Familiares" className="pl-14">
                                            <button
                                                onClick={() => handleFamiliaresButtonClick(item)}
                                                className="rounded-lg transition-colors text-white bg-gradient-to-r from-indigo-500 from-10% to-indigo-600 hover:from-indigo-700 hover:to-indigo-800 p-2"
                                            >
                                                <BsInfoCircle />
                                            </button>
                                        </TableCell>
                                        <TableCell label="Estado" className="pl-14">
                                            <Switch
                                                name="estado"
                                                checked={item.estado === 'activo'}
                                                onChange={() => handleSwitchChange(item._id)}
                                            />
                                        </TableCell>
                                        <TableCell label="Acciones" className="pl-10">
                                            <div className="flex gap-1 mr-3">
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
                    <FormModal onClose={closeModal} onSubmit={selectedItem ? handleUpdate : createBeneficiario} item={selectedItem} />
                </div>
            )}
            {showViewModal && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-900 bg-opacity-50">
                    <ViewModal onClose={closeViewModal} item={selectedItem} />
                </div>
            )}
            {showFamiliarModal && selectedItem && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-900 bg-opacity-50">
                    <ViewFamiliar onClose={closeFamiliarModal} item={selectedItem} />
                </div>
            )}
        </div>
    );
};

export default CRUDTable;
