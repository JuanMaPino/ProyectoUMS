import React, { useState, useEffect } from 'react';
import { RiUserHeartFill, RiUserStarFill } from 'react-icons/ri'; // Importamos los iconos
import { useAyudantes } from '../context/AyudantesContext';
import Table from '../components/table/Table';
import TableHead from '../components/table/TableHead';
import TableBody from '../components/table/TableBody';
import TableRow from '../components/table/TableRow';
import TableCell from '../components/table/TableCell';
import Pagination from '../components/table/Pagination';
import CreateButton from '../components/table/CreateButton';
import SearchBar from '../components/table/SearchBar';
import Switch from '../components/table/Switch';
import FormModal from '../components/table/modals/ModalAyudante';
import ViewModal from '../components/table/views/ViewAyudante';
import CardAyudante from '../components/table/CardItems/CardAyudante';
import FloatingButton from '../components/FloatingButton';
import { RiDeleteBin6Line, RiEyeLine, RiPencilFill } from 'react-icons/ri';

const CRUDAyudante = () => {
    const {
        createAyudante,
        updateAyudante,
        getAllAyudantes,
        disableAyudante,
        deleteAyudante,
        ayudantes,
        errors
    } = useAyudantes();

    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModalForm, setShowModalForm] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const itemsPerPage = 10;

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const filtered = ayudantes.filter(item =>
            item.identificacion.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.telefono.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filtered);
        setCurrentPage(1); // Reset to first page on new search
    }, [ayudantes, searchTerm]);

    const fetchData = async () => {
        try {
            await getAllAyudantes();
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

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div>
            <div className="flex flex-col lg:flex-row justify-between items-center mb-4 gap-4">
                <h1 className="text-3xl font-semibold text-left text-gray-800">Ayudantes</h1>
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
                            <TableHead>
                                <TableCell>Rol</TableCell> {/* Nueva columna para el cambio de rol */}
                                <TableCell>Identificación</TableCell>
                                <TableCell>Ayudante</TableCell>
                                <TableCell>Correo Electronico</TableCell>
                                <TableCell className="pl-10">Estado</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableHead>
                            <TableBody>
                                {currentData.map((item, index) => (
                                    <TableRow key={index} isActive={item.estado === 'activo'}>
                                         <TableCell label="Rol">
                                            <button
                                                onClick={() => handleRoleChange(item._id)}
                                                className={`flex items-center rounded-full p-2 transition-colors ${
                                                    item.rol === 'alfabetizador' ? 'bg-blue-300 text-white hover:bg-blue-400' : 'bg-cyan-300 text-white hover:bg-cyan-400'
                                                }`}
                                                disabled={item.estado !== 'activo'}
                                            >
                                                {item.rol === 'alfabetizador' ? (
                                                    <>
                                                        <RiUserHeartFill size={20} />
                                                        <span className="ml-2">A</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <RiUserStarFill size={20} />
                                                        <span className="ml-2">V</span>
                                                    </>
                                                )}
                                            </button>
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
                                        <TableCell label="Correo Electronico">{item.correoElectronico.substring(0, 18) + '...'}</TableCell>
                                        <TableCell label="Estado" className="pl-10">
                                            <Switch
                                                name="estado"
                                                checked={item.estado === 'activo'}
                                                onChange={() => disableAyudante(item._id)}
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
                                                    <RiPencilFill />
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
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-900 bg-opacity-50 ">
                    <FormModal onClose={handleCloseModal} item={selectedItem} fetchData={fetchData} />
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

export default CRUDAyudante;
