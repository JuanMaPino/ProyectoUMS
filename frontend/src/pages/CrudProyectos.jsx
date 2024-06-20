import React, { useState, useEffect } from 'react';
import { RiDeleteBin6Line, RiEyeLine, RiPlaneFill, RiAddLine } from 'react-icons/ri';
import Table from '../components/table/Table';
import TableHead from '../components/table/TableHead';
import TableBody from '../components/table/TableBody';
import TableRow from '../components/table/TableRow';
import TableCell from '../components/table/TableCell';
import Pagination from '../components/table/Pagination';
import CreateButton from '../components/table/CreateButton';
import SearchBar from '../components/table/SearchBar';
import Switch from '../components/table/Switch';
import FormModal from '../components/table/modals/ModalProyecto'; // Adapted for Proyecto
import ViewModal from '../components/table/views/ViewProyecto'; // Adapted for Proyecto
import CardItem from '../components/table/CardItems/CardItem';
import { useProjects } from '../context/ProyectosContext'; // Import the context

const CRUDProyecto = () => {
    const { 
        createProject, 
        updateProject, 
        getAllProjects, 
        disableProject, 
        deleteProject, // Utilizar deleteProject desde el contexto
        projects, 
        errors 
    } = useProjects(); // Use the context
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModalForm, setShowModalForm] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const itemsPerPage = 6;

    useEffect(() => {
        const filtered = projects.filter(item =>
            item.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filtered);
        setCurrentPage(1); // Reset to first page on new search
    }, [projects, searchTerm]);

    const handleCreateClick = () => {
        setSelectedItem(null);
        setShowModalForm(true);
    };

    const handleSearch = (query) => {
        setSearchTerm(query);
    };

    const handleCreateOrUpdate = async (item) => {
        if (item._id) {
            await updateProject(item._id, item);
        } else {
            await createProject(item);
        }
        closeModal();
    };

    const handleDeleteButtonClick = async (id) => {
        try {
            await deleteProject(id);
        } catch (error) {
            console.error('Error deleting project:', error);
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
                                <TableCell>Código</TableCell>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Descripción</TableCell>
                                <TableCell>Fechas</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableHead>
                            <TableBody>
                                {currentData.map((item, index) => (
                                    <TableRow key={index} isActive={item.estado === 'activo'}>
                                        <TableCell label="Código">{item.codigo}</TableCell>
                                        <TableCell label="Nombre">{item.nombre}</TableCell>
                                        <TableCell label="Descripción">{item.descripcion}</TableCell>
                                        <TableCell label="Fechas">
                                            <div>
                                                <span className="block">Inicio: {new Date(item.fechaInicio).toLocaleDateString()}</span>
                                                <span className="block">Fin: {new Date(item.fechaFin).toLocaleDateString()}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell label="Estado">
                                            <Switch
                                                name="estado"
                                                checked={item.estado === 'activo'}
                                                onChange={() => disableProject(item._id)}
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
                                                    <RiPlaneFill />
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
                                onSwitchChange={disableProject}
                                isActive={item.estado === 'activo'}
                            />
                        ))}
                        <Pagination
                            totalItems={filteredData.length}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                        />
                        {/* Botón flotante para crear */}
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
                    <FormModal onClose={closeModal} item={selectedItem} onSave={handleCreateOrUpdate} />
                </div>
            )}
            {showViewModal && selectedItem && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-900 bg-opacity-50">
                    <ViewModal onClose={closeViewModal} item={selectedItem} />
                </div>
            )}
            {errors.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-red-500 text-white text-center">
                    {errors.map((error, index) => (
                        <p key={index}>{error}</p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CRUDProyecto;
