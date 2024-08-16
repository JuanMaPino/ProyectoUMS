import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { RiEyeLine, RiDeleteBin6Line } from 'react-icons/ri';
import Table from '../components/table/Table';
import TableHead from '../components/table/TableHead';
import TableBody from '../components/table/TableBody';
import TableRow from '../components/table/TableRow';
import TableCell from '../components/table/TableCell';
import TableActions from '../components/table/TableActions';
import Pagination from '../components/table/Pagination';
import CreateButton from '../components/table/CreateButton';
import SearchBar from '../components/table/SearchBar';
import FormModal from '../components/table/modals/ModalDonacion';
import ViewModal from '../components/table/views/ViewDonacion';
import CardDonacion from '../components/table/CardItems/CardDonacion';
import FloatingButton from '../components/FloatingButton';
import { showToast } from '../components/table/alertFunctions'; // Ajusta la ruta según tu estructura

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

    const itemsPerPage = 10;

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
            item.donadorNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        try {
            if (item._id) {
                await updateDonacion(item._id, item);
                showToast('Donación actualizada exitosamente.', 'success');
            } else {
                await createDonacion(item);
                showToast('Donación creada exitosamente.', 'success');
            }
            closeModal();
        } catch (error) {
            console.error('Error al guardar la donación:', error.response ? error.response.data : error.message);
            showToast('Error al guardar la donación.', 'error');
        }
    };

    const handleAnularButtonClick = async (id) => {
        try {
            const item = donaciones.find(item => item._id === id);
            if (item) {
                await anularDonacion(id);
                showToast('Donación anulada exitosamente.', 'success');
            } else {
                console.error('Error al anular donación: No se encontró la donación.');
                showToast('Error al anular la donación.', 'error');
            }
        } catch (error) {
            console.error('Error al anular donación:', error);
            showToast('Error al anular la donación.', 'error');
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
                <h1 className="text-3xl font-semibold text-left text-gray-800">Gestión de Donaciones</h1>
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
                            <TableHead cols={4}>
                                <TableCell>Donador</TableCell>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Tipo</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableHead>
                            <TableBody>
                                {currentData.map((item, index) => (
                                    <TableRow
                                        key={index}
                                        isMonetario={item.tipo === 'Monetaria'}
                                        tipo={item.tipo}
                                        cols={4}
                                    >
                                        <TableCell label="Donador">
                                            <div>
                                                <p className=" text-black">{item.donadorNombre}</p>
                                                <p className="text-xs text-black">{item.donadorIdentificacion.toString().substring(0, 12)}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>{item.fecha}</TableCell>
                                        <TableCell>{item.tipo}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <TableActions
                                                    item={item}
                                                    handleViewButtonClick={handleViewButtonClick}
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

        </div>
    );
};

export default CRUDDonaciones;
