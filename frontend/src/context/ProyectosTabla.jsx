import React, { useState, useEffect } from 'react';
import ProyectoModal from './ProyectoModal';
import VisualizarModal from './VisualizarModal';
import { PiAirplaneFill } from 'react-icons/pi';
import { MdDeleteSweep } from 'react-icons/md';
import { AiFillEye } from 'react-icons/ai';
import { BiSearch } from 'react-icons/bi';
import axios from 'axios';

const ProyectosTabla = () => {
  const [proyectos, setProyectos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProyecto, setSelectedProyecto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisualizarModalOpen, setIsVisualizarModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const proyectosPagina = 5;

  useEffect(() => {
    fetchProyectos();
  }, []);

  const fetchProyectos = async () => {
    try {
      const response = await axios.get('http://localhost:3002/proyectos');
      setProyectos(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleUpdate = async (updatedProyecto) => {
    try {
      await axios.put(`http://localhost:3002/proyectos/${updatedProyecto._id}`, updatedProyecto);
      fetchProyectos();
      closeModal();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/proyectos/${id}`);
      fetchProyectos();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleEdit = (proyecto) => {
    setSelectedProyecto(proyecto);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedProyecto(null);
    setIsModalOpen(true);
  };

  const handleVisualizar = (proyecto) => {
    setSelectedProyecto(proyecto);
    setIsVisualizarModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProyecto(null);
    setIsModalOpen(false);
  };

  const closeVisualizarModal = () => {
    setSelectedProyecto(null);
    setIsVisualizarModalOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProyectos = proyectos.filter((proyecto) => {
    return proyecto.nombre.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const ultimoProyecto = currentPage * proyectosPagina;
  const primerProyecto = ultimoProyecto - proyectosPagina;
  const currentProyectos = filteredProyectos.slice(primerProyecto, ultimoProyecto);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section className="container mx-auto p-4 font-mono">
      <h2 className="flex p-2 text-2xl font-semibold">Proyectos</h2>
      <div className="flex justify-between items-center mb-4">
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={handleAdd}
        >
          Agregar Proyecto
        </button>
        <div className="relative text-gray-600">
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={searchTerm}
            onChange={handleSearchChange}
            className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none"
          />
          <button type="submit" className="absolute right-0 top-0 mt-3 mr-4">
            <BiSearch />
          </button>
        </div>
      </div>
      <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
                <th className="px-3 py-3 w-1/6">Nombre</th>
                <th className="px-3 py-3 w-1/6">Fecha</th>
                <th className="px-3 py-3 w-1/6">Tipo Proyecto</th>
                <th className="px-3 py-3 w-1/6">Descripción</th>
                <th className="px-3 py-3 w-1/6">Dirección</th>
                <th className="px-2 py-3 w-1/6">Acciones</th> {/* Ajuste del ancho de la columna de acciones */}
              </tr>
            </thead>
            <tbody className="bg-white">
              {currentProyectos.map((proyecto) => (
                <tr key={proyecto._id} className="text-gray-700">
                  <td className="px-3 py-3 border">{proyecto.nombre}</td>
                  <td className="px-3 py-3 border">{proyecto.fecha}</td>
                  <td className="px-3 py-3 border">{proyecto.tipoProyecto}</td>
                  <td className="px-3 py-3 border">{proyecto.descripcion}</td>
                  <td className="px-3 py-3 border">{proyecto.direccion}</td>
                  <td className="px-1 py-3 border">
                    <button
                      className="font-medium text-xl px-1 text-yellow-600 dark:text-gray-500 hover:underline ml-2"
                      onClick={() => handleVisualizar(proyecto)}
                    >
                      <AiFillEye />
                    </button>
                    <button
                      className="font-medium text-xl px-1 text-blue-600 dark:text-blue-500 hover:underline"
                      onClick={() => handleEdit(proyecto)}
                    >
                      <PiAirplaneFill />
                    </button>
                    <button
                      className="font-medium text-xl px-1 text-red-600 dark:text-red-500 hover:underline ml-2"
                      onClick={() => handleDelete(proyecto._id)}
                    >
                      <MdDeleteSweep />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(filteredProyectos.length / proyectosPagina) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`mx-1 px-2 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {isModalOpen && (
        <ProyectoModal
          onClose={closeModal}
          currentProyecto={selectedProyecto}
          fetchProyectos={fetchProyectos}
        />
      )}

      {isVisualizarModalOpen && (
        <VisualizarModal
          onClose={closeVisualizarModal}
          proyecto={selectedProyecto}
        />
      )}
    </section>
  );
};

export default ProyectosTabla;
