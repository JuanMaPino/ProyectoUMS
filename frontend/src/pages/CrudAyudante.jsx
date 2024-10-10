import React, { useState, useEffect } from 'react';
import { RiUserHeartFill } from 'react-icons/ri';
import { RiPlayListAddLine } from 'react-icons/ri';
import { useAyudantes } from '../context/AyudantesContext';
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
import FormModal from '../components/table/modals/ModalAyudante';
import ViewModal from '../components/table/views/ViewAyudante';
import CardAyudante from '../components/table/CardItems/CardAyudante';
import FloatingButton from '../components/FloatingButton';
import { RiDeleteBin6Line, RiEyeLine, RiPencilFill } from 'react-icons/ri';
import AssignHoursModal from '../components/table/modals/AssignHoursModal';

const CRUDAyudante = () => {
    const {
        ayudantes,
        createAyudante,
        updateAyudante,
        getAllAyudantes,
        disableAyudante,
        deleteAyudante
    } = useAyudantes();

    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModalForm, setShowModalForm] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAssignHoursModal, setShowAssignHoursModal] = useState(false);
    const [selectedAyudanteForHours, setSelectedAyudanteForHours] = useState(null);

    const itemsPerPage = 10;

    useEffect(() => {
        getAllAyudantes();
    }, []);

    useEffect(() => {
        const filtered = ayudantes.filter(item =>
            item.identificacion.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.telefono.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );

        const sortedData = [...filtered].sort((a, b) => {
            if (a.estado === 'activo' && b.estado === 'inactivo') return -1;
            if (a.estado === 'inactivo' && b.estado === 'activo') return 1;
            return 0;
        });

        setFilteredData(sortedData);
        setCurrentPage(1);
    }, [ayudantes, searchTerm]);

    const handleCreateClick = () => {
        setSelectedItem(null);
        setShowModalForm(true);
    };

    const handleSearch = (query) => {
        setSearchTerm(query);
    };

    const handleCreateOrUpdate = async (item) => {
        if (item._id) {
            await updateAyudante(item._id, item);
        } else {
            await createAyudante(item);
        }
        closeModal();
    };

    const handleDeleteButtonClick = async (id) => {
        try {
            await deleteAyudante(id);
        } catch (error) {
            console.error('Error deleting ayudante:', error);
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

    const handleCloseModal = () => {
        setSelectedItem(null);
        setShowModalForm(false);
    };

    const closeViewModal = () => {
        setSelectedItem(null);
        setShowViewModal(false);
    };

    const handleRoleChange = async (id) => {
        const updatedItem = ayudantes.find(item => item._id === id);
        updatedItem.rol = updatedItem.rol === 'alfabetizador' ? 'voluntario' : 'alfabetizador';
        await updateAyudante(id, updatedItem);
    };

    const handleAssignHoursButtonClick = (item) => {
        setSelectedAyudanteForHours(item);
        setShowAssignHoursModal(true);
    };

    const closeAssignHoursModal = () => {
        setSelectedAyudanteForHours(null);
        setShowAssignHoursModal(false);
    };

    const handleUpdateAyudante = async (updatedAyudante) => {
        await updateAyudante(updatedAyudante._id, updatedAyudante);
        getAllAyudantes(); // Actualiza la lista de ayudantes después de la modificación
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div>
            <div className="flex flex-col lg:flex-row justify-between items-center mb-4 gap-4">
                <h1 className="text-3xl font-semibold text-left text-gray-800">Gestión de Ayudantes</h1>
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
                            <TableHead cols={6}>
                                <TableCell>Rol</TableCell>
                                <TableCell>Identificación</TableCell>
                                <TableCell>Ayudante</TableCell>
                                <TableCell>Correo Electrónico</TableCell>
                                <TableCell className="pl-10">Estado</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableHead>
                            <TableBody>
                                {currentData.map((item, index) => (
                                    <TableRow key={index} isActive={item.estado === 'activo'} cols={6}>
                                        <TableCell label="Rol">
                                            <TableActions
                                                item={item}
                                                handleRoleChange={handleRoleChange}
                                            />
                                        </TableCell>
                                        <TableCell label="Identificación">
                                            <div>
                                                <p className="text-sm text-gray-600">{item.identificacion}</p>
                                                <p className="text-sm text-gray-600">{item.tipoDocumento.split(' ')[0]}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell label="Ayudante">
                                            <div>
                                                <p className="text-gray-600">{item.nombre}</p>
                                                <p className="text-sm text-gray-600">{item.telefono}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell label="Correo Electrónico">
                                            {item.correoElectronico.substring(0, 18) + '...'}
                                        </TableCell>
                                        <TableCell label="Estado" className='pl-10'>
                                            <Switch
                                                name="estado"
                                                checked={item.estado === 'activo'}
                                                onChange={() => disableAyudante(item._id)}
                                            />
                                        </TableCell>
                                        <TableCell label="Acciones">
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => handleAssignHoursButtonClick(item)}
                                                    className={`rounded-lg transition-colors text-white ${item.estado === 'activo' ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-700 hover:to-indigo-800' : 'bg-gray-300 cursor-not-allowed'} p-2`}
                                                    disabled={item.estado !== 'activo'}
                                                    title="Asignar Horas"
                                                >
                                                    <RiPlayListAddLine />
                                                </button>
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
                            <CardAyudante
                                key={index}
                                item={item}
                                onEdit={handleEditButtonClick}
                                onView={handleViewButtonClick}
                                onDelete={handleDeleteButtonClick}
                                onSwitchChange={disableAyudante}
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
                    <FormModal
                        onClose={handleCloseModal}
                        onSubmit={handleCreateOrUpdate}
                        item={selectedItem}
                    />
                </div>
            )}
            {showViewModal && selectedItem && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-900 bg-opacity-50">
                    <ViewModal
                        onClose={closeViewModal}
                        item={selectedItem}
                    />
                </div>
            )}
            {showAssignHoursModal && selectedAyudanteForHours && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-900 bg-opacity-50">
                    <AssignHoursModal 
                        onClose={closeAssignHoursModal} 
                        item={selectedAyudanteForHours} 
                        onUpdate={handleUpdateAyudante}
                    />
                </div>
            )}
        </div>
    );
};

export default CRUDAyudante;