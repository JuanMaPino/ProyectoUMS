import React from 'react';

const ViewFamiliar = ({ item }) => {
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
                            <span className="font-semibold">Documento:</span> {familiar.documentoFamiliar}
                        </p>
                        <p className="text-gray-700 mb-2">
                            <span className="font-semibold">Condición:</span> {familiar.condicionFamiliar}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewFamiliar;
