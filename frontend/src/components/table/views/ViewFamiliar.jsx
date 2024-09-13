import React from 'react';

const ViewFamiliar = ({ item, onClose }) => {
  return (
    <div className="bg-white rounded-lg shadow-2xl max-w-xl mx-auto mt-8 mb-1 mr-1 ml-7 p-8">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        Detalles de Familiares
      </h2>
      <div className="flex gap-4 flex-wrap">
        {item.familiares.map((familiar, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-2">{`Familiar ${index + 1}`}</h3>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Documento:</span> {familiar.documento}
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Nombre:</span> {familiar.nombre}
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Condicion Especial:</span> {familiar.condicionEspecial}
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Parentesco:</span> {familiar.parentesco}
            </p>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <button
          onClick={onClose}
          className="bg-gradient-to-tr from-red-400 from-10% to-red-600 hover:from-red-600 hover:to-red-600  text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ViewFamiliar;

