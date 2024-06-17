import React from 'react';

const ViewProyecto = ({ onClose, item }) => {
    return (
        <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-lg font-semibold mb-4">Detalles del Proyecto</h2>
            <div className="mb-4">
                <label className="block font-semibold">Código</label>
                <p>{item.codigo}</p>
            </div>
            <div className="mb-4">
                <label className="block font-semibold">Nombre</label>
                <p>{item.nombre}</p>
            </div>
            <div className="mb-4">
                <label className="block font-semibold">Descripción</label>
                <p>{item.descripcion}</p>
            </div>
            <div className="mb-4">
                <label className="block font-semibold">Fecha de Inicio</label>
                <p>{new Date(item.fechaInicio).toLocaleDateString()}</p>
            </div>
            <div className="mb-4">
                <label className="block font-semibold">Fecha de Fin</label>
                <p>{new Date(item.fechaFin).toLocaleDateString()}</p>
            </div>
            <div className="mb-4">
                <label className="block font-semibold">Estado</label>
                <p>{item.estado}</p>
            </div>
            <div className="flex justify-end">
                <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cerrar</button>
            </div>
        </div>
    );
};

export default ViewProyecto;
