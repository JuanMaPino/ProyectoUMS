import React, { useState, useEffect } from 'react';
import { RiDeleteBin6Line, RiEyeLine, RiAddLine } from 'react-icons/ri';
import { useInsumos } from '../context/InsumosContext';
import Table from '../components/table/Table';
import TableHead from '../components/table/TableHead';
import TableBody from '../components/table/TableBody';
import TableRow from '../components/table/TableRow';
import TableCell from '../components/table/TableCell';
import Pagination from '../components/table/Pagination';
import SearchBar from '../components/table/SearchBar';
import Switch from '../components/table/Switch';
import FormModal from '../components/table/modals/ModalInsumo';
import ViewModal from '../components/table/views/ViewInsumo';
import CardItem from '../components/table/CardItems/CardItem';

const CRUDInsumos = () => {
    const { insumos, createInsumo, updateInsumo, deleteInsumo, getAllInsumos } = useInsumos();
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModalForm, setShowModalForm] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const itemsPerPage = 6;

    useEffect(() => {
        getAllInsumos();
    }, []);

    useEffect(() => {
        // Filtro de insumos basado en nombre y fecha
        const filtered = insumos.filter(item =>
            item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            new Date(item.fecha).toLocaleDateString().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filtered);
        setCurrentPage(1); // Resetea a la primera página al cambiar el término de búsqueda
    }, [insumos, searchTerm]);

    const handleCreateClick = () => {
        setSelectedItem(null);
        setShowModalForm(true);
    };

    const handleSearch = (query) => {
        setSearchTerm(query);
    };

    const handleCreateOrUpdate = async (item) => {
        if (item._id) {
            await updateInsumo(item._id, item);
        } else {
            await createInsumo(item);
        }
        getAllInsumos(); // Vuelve a cargar todos los insumos después de la operación de crear o actualizar
        syncInsumosWithDonaciones(); // Actualiza la cantidad de insumos según las donaciones
        closeModal();
    };

    const handleDeleteButtonClick = async (id) => {
        try {
            await deleteInsumo(id);
            syncInsumosWithDonaciones(); // Actualiza la cantidad de insumos después de eliminar
        } catch (error) {
            console.error('Error deleting insumo:', error);
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

    const handleSwitchChange = async (id) => {
        const item = insumos.find(item => item._id === id);
        if (item) {
            const updatedItem = {
                ...item,
                estado: item.estado === 'activo' ? 'inactivo' : 'activo'
            };
            await updateInsumo(updatedItem._id, updatedItem);
        }
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

    const syncInsumosWithDonaciones = async () => {
        // Lógica para sincronizar los insumos con las cantidades de donaciones
        try {
            const response = await fetch('ruta-a-tu-api/donaciones'); // Ejemplo de ruta a la API de donaciones
            const donaciones = await response.json();

            const updatedInsumos = insumos.map(insumo => {
                const totalCantidad = donaciones
                    .filter(donacion => donacion.nombre.toLowerCase() === insumo.nombre.toLowerCase())
                    .reduce((acc, donacion) => acc + donacion.cantidad, 0);
                
                return {
                    ...insumo,
                    cantidad: totalCantidad
                };
            });

            setFilteredData(updatedInsumos); // Actualiza los insumos con las cantidades actualizadas
        } catch (error) {
            console.error('Error syncing insumos with donaciones:', error);
        }
    };

    return (
        <div className='ml-3'>
            <div className="flex flex-col lg:flex-row justify-between items-center mb-4 gap-4">
                <div className="flex items-center gap-2">
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
                                <TableCell>Nombre de Insumo</TableCell>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Cantidad</TableCell>
                                <TableCell>Condición</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableHead>
                            <TableBody>
                                {currentData.map((item, index) => (
                                    <TableRow key={index} isActive={item.estado === 'activo'}>
                                        <TableCell label="Nombre de Insumo">
                                            <div>
                                                <p className="text-black">{item.nombre}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell label="Fecha">
                                            <div>
                                                <span className="block">{new Date(item.fecha).toLocaleDateString()}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell label="Cantidad">{item.cantidad}</TableCell>
                                        <TableCell label="Condición" className={`py-1 px-2 text-black text-center`}>
                                            {item.condicion}
                                        </TableCell>
                                        <TableCell label="Estado">
                                            <Switch
                                                name="estado"
                                                checked={item.estado === 'activo'}
                                                onChange={() => handleSwitchChange(item._id)}
                                            />
                                        </TableCell>
                                        <TableCell label="Acciones">
                                            <div className="flex gap-1 mr-3">
                                                <button
                                                    onClick={() => handleViewButtonClick(item)}
                                                    className="rounded-lg transition-colors text-white bg-gradient-to-r from-cyan-200 from-10% to-cyan-600 hover:from-cyan-400 hover:to-cyan-600 p-2"
                                                >
                                                    <RiEyeLine />
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
                            <CardItem
                                key={index}
                                item={item}
                                onEdit={handleEditButtonClick}
                                onView={handleViewButtonClick}
                                onDelete={handleDeleteButtonClick}
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
                    <FormModal onClose={closeModal} item={selectedItem} onSubmit={handleCreateOrUpdate} />
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

export default CRUDInsumos;
