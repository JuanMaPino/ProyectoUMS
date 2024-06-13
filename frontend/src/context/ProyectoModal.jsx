import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ProyectoModal = ({ onClose, currentProyecto, fetchProyectos }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    fecha: '',
    tipoProyecto: '',
    descripcion: '',
    direccion: ''
  });
  const [error, setError] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (currentProyecto) {
      setFormData(currentProyecto);
    }
  }, [currentProyecto]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (currentProyecto) {
        await axios.put(`http://localhost:3002/proyectos/${currentProyecto._id}`, formData);
      } else {
        await axios.post('http://localhost:3002/proyectos', formData);
      }
      fetchProyectos();
      onClose();
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error);
      } else if (error.request) {
        setError('No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.');
      } else {
        setError('Ocurrió un error inesperado. Inténtalo de nuevo.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 backdrop-blur-sm bg-black bg-opacity-60">
      {error && <div className="error">{error}</div>}
      <div
        ref={modalRef}
        className="relative w-full max-w-md h-full max-h-[90vh] overflow-y-auto p-4 bg-white rounded-lg shadow-lg"
      >
        <h2 className="text-xl mb-4">{currentProyecto ? 'Editar Proyecto' : 'Agregar Proyecto'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block mb-1 text-sm font-bold text-gray-700">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1 text-sm font-bold text-gray-700">Fecha</label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1 text-sm font-bold text-gray-700">Tipo Proyecto</label>
            <input
              type="text"
              name="tipoProyecto"
              value={formData.tipoProyecto}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1 text-sm font-bold text-gray-700">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1 text-sm font-bold text-gray-700">Dirección</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-between">
            <button type="button" className="px-4 py-2 bg-gray-500 text-white rounded" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              {currentProyecto ? 'Guardar Cambios' : 'Agregar Proyecto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProyectoModal;
