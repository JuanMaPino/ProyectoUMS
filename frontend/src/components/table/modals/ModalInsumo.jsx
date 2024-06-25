// import React, { useState, useEffect } from 'react';

// const ModalInsumo = ({ onClose, onSubmit, item }) => {
//     const [formData, setFormData] = useState({
//         nombre: '',
//         fecha: '',
//         cantidad: '',
//         estado: 'activo'
//     });

//     useEffect(() => {
//         if (item) {
//             setFormData({
//                 nombre: item.nombre || '',
//                 fecha: new Date(item.fecha).toISOString().split('T')[0] || '',
//                 cantidad: item.cantidad || '',
//                 estado: item.estado || 'activo'
//             });
//         } else {
//             setFormData({
//                 nombre: '',
//                 fecha: '',
//                 cantidad: '',
//                 estado: 'activo'
//             });
//         }
//     }, [item]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prevState => ({ ...prevState, [name]: value }));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         onSubmit({ _id: item?._id, ...formData });
//     };

//     return (
//         <div className="bg-white p-6 rounded-lg shadow-lg">
//             <h2 className="text-2xl mb-4">{item ? 'Editar Insumo' : 'Crear Insumo'}</h2>
//             <form onSubmit={handleSubmit}>
//                 <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-bold mb-2">Nombre de insumo</label>
//                     <input
//                         type="text"
//                         name="nombre"
//                         value={formData.nombre}
//                         onChange={handleChange}
//                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         required
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-bold mb-2">Fecha</label>
//                     <input
//                         type="date"
//                         name="fecha"
//                         value={formData.fecha}
//                         onChange={handleChange}
//                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         required
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-bold mb-2">Cantidad</label>
//                     <input
//                         type="number"
//                         name="cantidad"
//                         value={formData.cantidad}
//                         onChange={handleChange}
//                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         required
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-bold mb-2">Estado</label>
//                     <select
//                         name="estado"
//                         value={formData.estado}
//                         onChange={handleChange}
//                         className="shadow appearance-none border rounded w-full py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         required
//                     >
//                         <option value="activo">Activo</option>
//                         <option value="inactivo">Inactivo</option>
//                     </select>
//                 </div>
//                 <div className="flex items-center justify-between">
//                     <button
//                         type="submit"
//                         className="bg-gradient-to-r from-blue-200 to-blue-500 hover:from-blue-300  hover:to-blue-700 text-white font-bold py-2 px-6  focus:outline-none focus:shadow-outline rounded-lg"
//                     >
//                         Guardar
//                     </button>
//                     <button
//                         onClick={onClose}
//                         className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-900 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline"
//                     >
//                         Cancelar
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default ModalInsumo;