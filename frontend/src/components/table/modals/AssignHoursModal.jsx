import React, { useState, useEffect, useCallback } from 'react';
import { useTareas } from '../../../context/TareasContext';
import { useAyudantes } from '../../../context/AyudantesContext';
import { X, Plus, Trash2 } from 'lucide-react';

const AssignHoursModal = ({ onClose, item, onUpdate }) => {
  const { tareas, fetchTareas } = useTareas();
  const { updateAyudante } = useAyudantes();
  const [tareasDisponibles, setTareasDisponibles] = useState([]);
  const [tareasAsignadas, setTareasAsignadas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetchTareas();
    } catch (err) {
      setError('Error al cargar las tareas. Por favor, intente de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }, [fetchTareas]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (tareas.length > 0 && item.tareasAsignadas) {
      const asignadas = item.tareasAsignadas.map(tareaAsignada => {
        const tareaCompleta = tareas.find(t => t._id === tareaAsignada.tarea);
        return tareaCompleta
          ? { ...tareaAsignada, tarea: tareaCompleta }
          : { ...tareaAsignada, tarea: { _id: tareaAsignada.tarea, nombre: 'Tarea no encontrada' } };
      });
      setTareasAsignadas(asignadas);
      
      const disponibles = tareas.filter(tarea => 
        !asignadas.some(asignada => asignada.tarea._id === tarea._id)
      );
      setTareasDisponibles(disponibles);
    }
  }, [tareas, item.tareasAsignadas]);

  const handleAssignTarea = useCallback((tarea) => {
    setTareasAsignadas(prev => [...prev, { tarea, horas: tarea.cantidadHoras, estado: 'Creada' }]);
    setTareasDisponibles(prev => prev.filter(t => t._id !== tarea._id));
  }, []);

  const handleRemoveTarea = useCallback((tareaId) => {
    setTareasAsignadas(prev => {
      const tareaRemovida = prev.find(t => t.tarea._id === tareaId);
      if (tareaRemovida) {
        setTareasDisponibles(disponibles => [...disponibles, tareaRemovida.tarea]);
      }
      return prev.filter(t => t.tarea._id !== tareaId);
    });
  }, []);

  const handleUpdateEstado = useCallback((tareaId, nuevoEstado) => {
    setTareasAsignadas(prev => 
      prev.map(t => t.tarea._id === tareaId ? { ...t, estado: nuevoEstado } : t)
    );
  }, []);

  const handleSave = async () => {
    try {
      const updatedAyudante = {
        ...item,
        tareasAsignadas: tareasAsignadas.map(t => ({
          tarea: t.tarea._id,
          horas: t.horas,
          estado: t.estado
        })),
      };

      await updateAyudante(item._id, updatedAyudante);
      onUpdate(updatedAyudante);
      onClose();
    } catch (err) {
      setError('Error al guardar los cambios. Por favor, intente de nuevo.');
    }
  };

  const totalHoras = tareasAsignadas.reduce((total, tarea) => total + tarea.horas, 0);

  if (isLoading) {
    return <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <p className="text-xl font-semibold">Cargando...</p>
      </div>
    </div>;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Asignar Tareas a {item.nombre}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Cerrar">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Tareas Disponibles</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-4">
              {tareasDisponibles.map(tarea => (
                <div key={tarea._id} className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <h4 className="font-semibold text-lg mb-2">{tarea.nombre}</h4>
                  <p className="text-sm text-gray-600 mb-2">{tarea.accion}</p>
                  <p className="text-sm text-gray-600 mb-3">{tarea.cantidadHoras} horas</p>
                  <button
                    onClick={() => handleAssignTarea(tarea)}
                    className="flex items-center justify-center w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                    aria-label={`Asignar tarea ${tarea.nombre}`}
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
                <div key={tarea.tarea._id} className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{tarea.tarea.nombre}</h4>
                    <button
                      onClick={() => handleRemoveTarea(tarea.tarea._id)}
                      className="text-red-500 hover:text-red-700"
                      aria-label={`Eliminar tarea ${tarea.tarea.nombre}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{tarea.horas} horas</p>
                  <div className="flex items-center justify-between">
                    <select
                      value={tarea.estado}
                      onChange={(e) => handleUpdateEstado(tarea.tarea._id, e.target.value)}
                      className="p-2 border rounded text-sm"
                      aria-label={`Cambiar estado de la tarea ${tarea.tarea.nombre}`}
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
          {error && <p className="text-red-500 mt-4" role="alert">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default AssignHoursModal;