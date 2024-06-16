import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function BeneficiarioModal({ onClose, currentBeneficiario, fetchBeneficiarios }) {
  const [identificacion, setIdentificacion] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [cantidadFamiliares, setCantidadFamiliares] = useState('');
  const [error, setError] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (currentBeneficiario) {
      setIdentificacion(currentBeneficiario.identificacion || '');
      setNombre(currentBeneficiario.nombre || '');
      setTelefono(currentBeneficiario.telefono || '');
      setCorreoElectronico(currentBeneficiario.correoElectronico || '');
      setCantidadFamiliares(currentBeneficiario.cantidadFamiliares || '');
    }
  }, [currentBeneficiario]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (currentBeneficiario) {
        await axios.put(`http://localhost:3002/beneficiarios/${currentBeneficiario._id}`, {
          identificacion,
          nombre,
          telefono,
          correoElectronico,
          cantidadFamiliares,
        });
      } else {
        await axios.post('http://localhost:3002/beneficiarios', {
          identificacion,
          nombre,
          telefono,
          correoElectronico,
          cantidadFamiliares,
        });
      }
      fetchBeneficiarios();
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
        className="relative w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 antialiased shadow-2xl transform transition-all duration-300"
        data-dialog-mount="opacity-100 translate-y-0 scale-100"
        data-dialog-unmount="opacity-0 -translate-y-28 scale-90"
      >
        <div className="flex items-center p-4 font-sans text-2xl antialiased font-semibold leading-snug shrink-0 text-blue-gray-900 bg-gradient-to-r from-blue-300 to-blue-500 rounded-t-lg">
          {currentBeneficiario ? 'Editar Beneficiario' : 'Agregar Beneficiario'}
        </div>
        <div className="relative p-4 font-sans text-base antialiased font-light leading-relaxed border-t border-b border-t-blue-gray-100 border-b-blue-gray-100 text-blue-gray-500">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-4">
              <label className="block text-sm font-medium mb-1">Identificación</label>
              <input type="number" value={identificacion} onChange={(e) => setIdentificacion(e.target.value)} required className="w-full p-3 border rounded"/>
            </div>
            <div className="form-group mb-4">
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="w-full p-3 border rounded"/>
            </div>
            <div className="form-group mb-4">
              <label className="block text-sm font-medium mb-1">Teléfono</label>
              <input type="number" value={telefono} onChange={(e) => setTelefono(e.target.value)} required className="w-full p-3 border rounded"/>
            </div>
            <div className="form-group mb-4">
              <label className="block text-sm font-medium mb-1">Correo Electrónico</label>
              <input type="email" value={correoElectronico} onChange={(e) => setCorreoElectronico(e.target.value)} className="w-full p-3 border rounded"/>
            </div>
            <div className="form-group mb-4">
              <label className="block text-sm font-medium mb-1">Cantidad de Familiares</label>
              <input type="number" value={cantidadFamiliares} onChange={(e) => setCantidadFamiliares(e.target.value)} required className="w-full p-3 border rounded"/>
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={onClose} className="px-6 py-3 mr-1 font-sans text-xs font-bold text-red-500 uppercase transition-all rounded-lg middle none center hover:bg-red-500/10 active:bg-red-500/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">Cancelar</button>
              <button type="submit" className="middle none center rounded-lg bg-gradient-to-tr from-green-600 to-green-400 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-green-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BeneficiarioModal;
