import React from 'react';

const VisualizarModal = ({ onClose, beneficiario }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-semibold mb-4 text-center">Detalles del Beneficiario</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Identificación:</label>
          <p className="text-lg">{beneficiario.identificacion}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nombre:</label>
          <p className="text-lg">{beneficiario.nombre}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Teléfono:</label>
          <p className="text-lg">{beneficiario.telefono}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Correo Electrónico:</label>
          <p className="text-lg">{beneficiario.correoElectronico}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Cantidad de Familiares:</label>
          <p className="text-lg">{beneficiario.cantidadFamiliares}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Estado:</label>
          <p className="text-lg">{beneficiario.estado}</p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisualizarModal;
