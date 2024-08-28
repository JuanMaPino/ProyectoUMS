import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
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
import FormModal from '../components/table/modals/ModalProyecto';
import ViewModal from '../components/table/views/ViewProyecto';
import FloatingButton from '../components/FloatingButton';

const CRUDProyecto = () => {
    const navigate = useNavigate(); // Define navigate usando useNavigate
    const {
        createProyecto,
        updateProyecto,
        getAllProyectos,
        disableProyecto,
        deleteProyecto,
        proyectos,
        errors
    } = useProyectos();

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
        const filtered = proyectos.filter(item =>
            item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filtered);
        setCurrentPage(1); // Reset to first page on new search
    }, [proyectos, searchTerm]);

    const fetchData = async () => {
        try {
            await getAllProyectos();
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
            await updateProyecto(item._id, item);
        } else {
            await createProyecto(item);
        }
        closeModal();
    };

    const handleDeleteButtonClick = async (id) => {
        try {
            await deleteProyecto(id);
        } catch (error) {
            console.error('Error deleting proyecto:', error);
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

    const handleViewActividadesButtonClick = (item) => {
        setSelectedItem(item._id);
        navigate(`/actividades`); // Redirige a la ruta con el ID del proyecto
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div>
            <div className="flex flex-col lg:flex-row justify-between items-center mb-4 gap-4">
                <h1 className="text-3xl font-semibold text-left text-gray-800">Gestión de Proyectos</h1>
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
                                <TableCell>Nombre</TableCell>
                                <TableCell>Descripción</TableCell>
                                <TableCell>Fecha de Inicio</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableHead>
                            <TableBody>
                                {currentData.map((item, index) => (
                                    <TableRow key={index} isActive={item.estado === 'activo'} cols={5}>
                                        <TableCell label="Nombre">{item.nombre}</TableCell>
                                        <TableCell label="Descripción">{item.descripcion}</TableCell>
                                        <TableCell label="Fecha de Inicio">{item.fechaInicio}</TableCell>
                                        <TableCell label="Estado">{item.estado}</TableCell>
                                        <TableCell label="Acciones">
                                            <div className="flex gap-2">
                                                <TableActions
                                                    item={item}
                                                    handleViewButtonClick={handleViewButtonClick}
                                                    handleEditButtonClick={handleEditButtonClick}
                                                    handleDeleteButtonClick={handleDeleteButtonClick}
                                                    handleViewActividadesButtonClick={handleViewActividadesButtonClick}
                                                />
                                            </div>
                                        </TableCell>


                                        <TableCell label="Actividades"> {/* Nueva celda */}
                                            <button
                                                onClick={handleActivitiesClick}
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                            >
                                                Ver Actividades
                                            </button>
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
                                onDelete={() => handleDeleteButtonClick(item._id)}
                                onSwitchChange={() => handleSwitchChange(item._id)}
                                isActive={item.estado === 'activo'}
                            >
                                <button
                                    onClick={handleActivitiesClick}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                                >
                                    Ver Actividades
                                </button>
                            </CardItem>
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

export default CRUDProyecto;
