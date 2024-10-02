import React, { useState, useEffect } from 'react';
import { getAllTareasRequest, updateTareaRequest } from '../../../api/ApiTarea';
import { updateAyudanteRequest } from '../../../api/ApiAyudante';

const AssignHoursModal = ({ onClose, item, onUpdate }) => {
  const [tareas, setTareas] = useState([]);
  const [tareasAsignadas, setTareasAsignadas] = useState(item.tareasAsignadas || []);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTareas = async () => {
      try {
        const response = await getAllTareasRequest();
        setTareas(response.data);
      } catch (error) {
        console.error('Error al obtener las tareas:', error);
      }
    };
    fetchTareas();
  }, []);

  const handleAssignTarea = (tarea) => {
    const tareaExistente = tareasAsignadas.find(t => t.tarea?._id === tarea._id);
    if (!tareaExistente) {
      const newTarea = {
        tarea: tarea,
        horas: tarea.cantidadHoras,
        estado: 'Creada'
      };
      setTareasAsignadas([...tareasAsignadas, newTarea]);
    }
  };

  const handleRemoveTarea = (tareaId) => {
    setTareasAsignadas(tareasAsignadas.filter(t => t.tarea?._id !== tareaId));
  };

  const handleUpdateEstado = async (tareaId, nuevoEstado) => {
    const updatedTareas = tareasAsignadas.map(t => 
      t.tarea._id === tareaId ? { ...t, estado: nuevoEstado } : t
    );
    setTareasAsignadas(updatedTareas);

    try {
      await updateTareaRequest(tareaId, { Proceso: nuevoEstado });
    } catch (error) {
      console.error('Error al actualizar el estado de la tarea:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (tareasAsignadas.length === 0) {
        setError('No hay tareas asignadas para guardar.');
        return;
      }

      const updatedAyudante = {
        ...item,
        tareasAsignadas: tareasAsignadas.map(t => ({
          tarea: t.tarea?._id,
          horas: t.horas,
          estado: t.estado
        })),
      };

      await updateAyudanteRequest(item._id, updatedAyudante);

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
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Asignar Tareas a {item.nombre}</h2>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-700">Tareas Disponibles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tareas.map(tarea => (
              <div key={tarea._id} className="bg-gray-100 p-4 rounded-lg shadow">
                <h4 className="font-semibold text-lg mb-2">{tarea.nombre}</h4>
                <p className="text-sm text-gray-600 mb-2">{tarea.accion}</p>
                <p className="text-sm text-gray-600 mb-3">{tarea.cantidadHoras} horas</p>
                <button 
                  onClick={() => handleAssignTarea(tarea)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                >
                  Asignar
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-700">Tareas Asignadas</h3>
          {tareasAsignadas.map(tarea => (
            <div key={tarea.tarea?._id} className="bg-white border border-gray-200 p-4 rounded-lg shadow mb-3 flex justify-between items-center">
              <div>
                <h4 className="font-semibold">{tarea.tarea?.nombre}</h4>
                <p className="text-sm text-gray-600">{tarea.horas} horas</p>
                <p className="text-sm font-medium" style={{ color: tarea.estado === 'Creada' ? 'blue' : tarea.estado === 'En proceso' ? 'orange' : 'green' }}>
                  {tarea.estado}
                </p>
              </div>
              <div>
                <select 
                  value={tarea.estado} 
                  onChange={(e) => handleUpdateEstado(tarea.tarea?._id, e.target.value)}
                  className="mr-2 p-2 border rounded"
                >
                  <option value="Creada">Creada</option>
                  <option value="En proceso">En proceso</option>
                  <option value="Finalizada">Finalizada</option>
                </select>
                <button 
                  onClick={() => handleRemoveTarea(tarea.tarea?._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-300"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xl font-semibold mb-6">Total de Horas: {totalHoras}</p>

        <div className="flex justify-end">
          <button 
            onClick={onClose} 
            className="mr-4 px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-300"
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
  );
};

export default AssignHoursModal;
