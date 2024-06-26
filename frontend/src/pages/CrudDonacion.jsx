import React, { useState, useEffect } from 'react';
import { RiEyeLine , RiDeleteBin6Line} from 'react-icons/ri';
import Table from '../components/table/Table';
import TableHead from '../components/table/TableHead';
import TableBody from '../components/table/TableBody';
import TableRow from '../components/table/TableRow';
import TableCell from '../components/table/TableCell';
import Pagination from '../components/table/Pagination';
import CreateButton from '../components/table/CreateButton';
import SearchBar from '../components/table/SearchBar';
import FormModal from '../components/table/modals/ModalDonacion';
import ViewModal from '../components/table/views/ViewDonacion';
import CardDonacion from '../components/table/CardItems/CardDonacion';
import FloatingButton from '../components/FloatingButton';

import { useDonaciones } from '../context/DonacionesContext';
import { useDonadores } from '../context/DonadoresContext';

const CRUDDonaciones = () => {
    const { 
        createDonacion, 
        updateDonacion, 
        getAllDonaciones,  
        anularDonacion,  
        donaciones, 
        errors: donacionesErrors 
    } = useDonaciones();
    const { donadores, errors: donadoresErrors } = useDonadores();
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModalForm, setShowModalForm] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const itemsPerPage = 6;

    useEffect(() => {
        getAllDonaciones();
    }, []);

    useEffect(() => {
        const combinedData = donaciones.map(donacion => {
            const donador = donadores.find(d => d._id === donacion.donador);
            return {
                ...donacion,
                donadorIdentificacion: donador ? donador.identificacion : 'Desconocido',
                donadorNombre: donador ? donador.nombre : 'Desconocido'
            };
        });

        const filtered = combinedData.filter(item =>
            item.fecha.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.donacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.donadorNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||// Busca también en el nombre del donador
            item.donadorIdentificacion.toString().includes(searchTerm) 
        );
        setFilteredData(filtered);
        setCurrentPage(1); // Reset to first page on new search
    }, [donaciones, donadores, searchTerm]);

    const handleCreateClick = () => {
        setSelectedItem(null);
        setShowModalForm(true);
    };

    const handleSearch = (query) => {
        setSearchTerm(query);
    };

    const handleCreateOrUpdate = async (item) => {
        if (item._id) {
            await updateDonacion(item._id, item);
        } else {
            await createDonacion(item);
        }
        closeModal();
    };

    const handleDeleteButtonClick = async (id) => {
        try {
            await deleteDonacion(id);
        } catch (error) {
            console.error('Error deleting donacion:', error);
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

    const closeModal = () => {
        setSelectedItem(null);
        setShowModalForm(false);
    };

    const closeViewModal = () => {
        setSelectedItem(null);
        setShowViewModal(false);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div>
            <div className="flex flex-col lg:flex-row justify-between items-center mb-4 gap-4">
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
                            <TableHead>
                                <TableCell>Donador</TableCell>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Tipo</TableCell>
                                <TableCell>Insumo</TableCell>
                                <TableCell>Cantidad</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableHead>
                            <TableBody>
                                {currentData.map((item, index) => (
                                    <TableRow
                                        key={index}
                                        isMonetario={item.tipo === 'Monetaria'}
                                        tipo={item.tipo}
                                    >
                                        <TableCell label="Donador">
                                            <div>
                                            <p className=" text-black">{item.donadorNombre}</p>
                                                <p className="text-xs text-black">{item.donadorIdentificacion.toString().substring(0, 12)}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>{item.fecha}</TableCell>
                                        <TableCell>{item.tipo}</TableCell>
                                        <TableCell>{item.donacion}</TableCell>
                                        <TableCell>{item.cantidad}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleViewButtonClick(item)}
                                                    className="rounded-lg transition-colors text-white bg-gradient-to-r from-cyan-200 from-10% to-cyan-600 hover:from-cyan-400 hover:to-cyan-600 p-2"
                                                >
                                                    <RiEyeLine />
                                                </button>
                                                <button
                                                  name="estado"
                                                  checked={item.estado === 'activa'}
                                                   onChange={() => handleSwitchChange(item._id)} 
                                                    className={`rounded-lg transition-colors text-white bg-gradient-to-r from-rose-400 from-10% to-red-600 hover:from-rose-700 hover:to-red-700' : 'bg-gray-300 cursor-not-allowed'} p-2`}
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
                            <CardDonacion
                                key={index}
                                item={item}
                                onView={handleViewButtonClick}
                                isMonetario={item.tipo === 'Monetaria' || 'Material'}
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
                    <FormModal onClose={closeModal} item={selectedItem} onSave={handleCreateOrUpdate} />
                </div>
            )}
            {showViewModal && selectedItem && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-900 bg-opacity-50">
                    <ViewModal onClose={closeViewModal} item={selectedItem} />
                </div>
            )}
            {(donacionesErrors.length > 0 || donadoresErrors.length > 0) && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-red-500 text-white text-center">
                    {[...donacionesErrors, ...donadoresErrors].map((error, index) => (
                        <p key={index}>{error}</p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CRUDDonaciones;
