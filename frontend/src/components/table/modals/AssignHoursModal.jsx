import React, { useState, useEffect } from 'react';
import { useTareas } from '../../../context/TareasContext';
import { useAyudantes } from '../../../context/AyudantesContext';
import { X, Plus, Trash2 } from 'lucide-react';

const AssignHoursModal = ({ onClose, item, onUpdate }) => {
  const { tareas, fetchTareas } = useTareas();
  const { updateAyudante } = useAyudantes();
  const [tareasAsignadas, setTareasAsignadas] = useState(item.tareasAsignadas || []);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTareas();
  }, [fetchTareas]);

  const handleAssignTarea = (tarea) => {
    const tareaExistente = tareasAsignadas.find(t => t.tarea?._id === tarea._id);
    if (!tareaExistente) {
      const newTarea = {
        tarea: tarea,
        horas: tarea.cantidadHoras,
        estado: 'Creada'
      };
      setTareasAsignadas(prevTareas => [...prevTareas, newTarea]);
    }
  };

  const handleRemoveTarea =(tareaId) => {
      alert(tareaId);
    setTareasAsignadas(prevTareas => prevTareas.filter(t => t.tarea?._id !== tareaId));
  };

  const handleUpdateEstado = (tareaId, nuevoEstado) => {
    setTareasAsignadas(prevTareas => prevTareas.map(t =>
      t.tarea?._id === tareaId ? { ...t, estado: nuevoEstado } : t
    ));
  };

  const handleSave = async () => {
    try {
      const updatedAyudante = {
        ...item,
        tareasAsignadas: tareasAsignadas.map(t => ({
          tarea: t.tarea?._id,
          horas: t.horas,
          estado: t.estado
        })),
      };

      await updateAyudante(item?._id, updatedAyudante);

      if (typeof onUpdate === 'function') {
        onUpdate(updatedAyudante);
      }

      onClose();
    } catch (error) {
      console.error('Error al actualizar el ayudante:', error);
      setError('No se pudo guardar las asignaciones.');
    }
  };

  const totalHoras = tareasAsignadas.reduce((total, tarea) => total + tarea.horas, 0);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Asignar Tareas a {item.nombre}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Tareas Disponibles</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-4">
              {tareas.map(tarea => (
                <div key={tarea._id} className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <h4 className="font-semibold text-lg mb-2">{tarea.nombre}</h4>
                  <p className="text-sm text-gray-600 mb-2">{tarea.accion}</p>
                  <p className="text-sm text-gray-600 mb-3">{tarea.cantidadHoras} horas</p>
                  <button
                    onClick={() => handleAssignTarea(tarea)}
                    className="flex items-center justify-center w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                  >
                    <Plus size={18} className="mr-2" /> Asignar
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Tareas Asignadas</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-4">
              {tareasAsignadas.map(tarea => (
                <div key={tarea.tarea?._id} className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{tarea.tarea?.nombre}</h4>
                    <h4 className="font-semibold">{tarea.tarea?._id}</h4>
                    <button
                      onClick={() => handleRemoveTarea(tarea.tarea?._id)}
                      className="text-red-500 hover:text-red-700"
                    >

                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{tarea.horas} horas</p>
                  <div className="flex items-center justify-between">
                    <select
                      value={tarea.estado}
                      onChange={(e) => handleUpdateEstado(tarea.tarea?._id, e.target.value)}
                      className="p-2 border rounded text-sm"
                    >
                      <option value="Creada">Creada</option>
                      <option value="En proceso">En proceso</option>
                      <option value="Finalizada">Finalizada</option>
                    </select>
                    <span className="text-sm font-medium px-2 py-1 rounded" style={{ 
                      backgroundColor: tarea.estado === 'Creada' ? 'rgba(59, 130, 246, 0.1)' : 
                                       tarea.estado === 'En proceso' ? 'rgba(245, 158, 11, 0.1)' : 
                                       'rgba(16, 185, 129, 0.1)',
                      color: tarea.estado === 'Creada' ? 'rgb(29, 78, 216)' : 
                             tarea.estado === 'En proceso' ? 'rgb(180, 83, 9)' : 
                             'rgb(6, 95, 70)'
                    }}>
                      {tarea.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t p-6">
          <p className="text-xl font-semibold mb-4">Total de Horas: {totalHoras}</p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-300"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
            >
              Guardar
            </button>
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default AssignHoursModal;