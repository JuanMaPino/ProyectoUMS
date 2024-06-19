import React from 'react';
// import { getAllBeneficiariosRequest } from '../../../api/ApiBeneficiario'; 

// useEffect(() => {
//     const fetchBeneficiario = async () => {
//       try {
//         const res = await getAllBeneficiariosRequest();
//         setRoles(res.data);
//       } catch (error) {
//         console.error("Failed to fetch roles:", error);
//       }
//     };

//     fetchBeneficiario();
//   }, []);
// useEffect(() => {
//     getAllProjects();
// }, []);

const ViewProyecto = ({ onClose, item }) => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Detalles del Proyecto</h2>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700"><span className="font-semibold">Código:</span></label>
                    <p className="text-gray-800">{item.codigo}</p>
                </div>
                <div>
                    <label className="block text-gray-700"><span className="font-semibold">Nombre:</span></label>
                    <p className="text-gray-800">{item.nombre}</p>
                </div>
                <div>
                    <label className="block text-gray-700"><span className="font-semibold">Descripción:</span></label>
                    <p className="text-gray-800">{item.descripcion}</p>
                </div>
                <div>
                    <label className="block text-gray-700"><span className="font-semibold">Fecha de Inicio:</span></label>
                    <p className="text-gray-800">{new Date(item.fechaInicio).toLocaleDateString()}</p>
                </div>
                <div>
                    <label className="block text-gray-700"><span className="font-semibold">Fecha de Fin:</span></label>
                    <p className="text-gray-800">{new Date(item.fechaFin).toLocaleDateString()}</p>
                </div>
                <div>
                    <label className="block text-gray-700"><span className="font-semibold">Estado:</span></label>
                    <p className="text-gray-800">{item.estado}</p>
                </div>
            </div>
            <div className="mt-6 flex justify-center">
                <button
                    onClick={onClose}
                    className="bg-gradient-to-tr from-yellow-400 from-10% to-orange-600 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-2 px-6 rounded-xl focus:outline-none focus:shadow-outline"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default ViewProyecto;
