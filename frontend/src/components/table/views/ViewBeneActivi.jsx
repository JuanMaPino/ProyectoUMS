import React from 'react';

const ViewBeneActivi = ({ beneficiarios = [], onClose }) => {
  console.log(beneficiarios);  // Verificar qué beneficiarios se están recibiendo

  return (
    <div className="bg-white rounded-lg shadow-2xl max-w-xl mx-auto mt-8 mb-1 mr-1 ml-7 p-8">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        Detalles de Beneficiarios
      </h2>

      <div className="text-center mb-4">
        <p className="text-xl font-semibold">
          {`Cantidad de beneficiarios: ${beneficiarios.length}`}
        </p>
      </div>

      <div className="overflow-y-auto max-h-80 flex gap-4 flex-wrap justify-center mb-6">
        {beneficiarios.length > 0 ? (
          beneficiarios.map((beneficiario, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg w-full text-center">
              <p className="text-gray-700 text-lg font-semibold">
                {beneficiario.nombre || 'Nombre no disponible'}  {/* mensaje por defecto */}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-700 text-lg font-semibold">No hay beneficiarios disponibles</p>
        )}
      </div>

      <div className="flex justify-center">
        <button
          onClick={onClose}
          className="bg-gradient-to-tr from-red-400 to-red-600 hover:from-red-600 hover:to-red-600 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ViewBeneActivi;
