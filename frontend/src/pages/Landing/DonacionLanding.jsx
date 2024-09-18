import React, { useState } from 'react'
import { AlertCircle } from 'lucide-react'

const Button = ({ children, onClick, className }) => (
  <button onClick={onClick} className={`px-4 py-2 rounded ${className}`}>
    {children}
  </button>
)

const Input = ({ placeholder, type = "text", value, onChange }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="w-full px-3 py-2 border rounded"
  />
)

const Select = ({ placeholder, options, value, onChange }) => (
  <select
    value={value}
    onChange={onChange}
    className="w-full px-3 py-2 border rounded"
  >
    <option value="">{placeholder}</option>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
)

export default function DonationForm() {
  const [step, setStep] = useState(1)
  const [donationType, setDonationType] = useState('unica')
  const [amount, setAmount] = useState('100000')
  const [paymentMethod, setPaymentMethod] = useState('tarjeta')
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    acceptTerms: false,
  })

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <div className="w-full max-w-md mx-auto bg-[#E6FFFF] rounded-lg overflow-hidden shadow-lg">
      <div className="bg-[#00BFFF] text-white p-6">
        <h2 className="text-2xl font-bold text-center">Ayúdanos a transformar vidas</h2>
      </div>
      <div className="p-6">
        {step === 1 && (
          <>
            <p className="text-blue-800 mb-4 text-center">
              Hay más de 1.380 niños en situaciones de vulnerabilidad que podrás ser transformados con tu ayuda.
            </p>
            <div className="mb-4">
              <Button
                onClick={() => setDonationType('unica')}
                className={`mr-2 ${donationType === 'unica' ? 'bg-[#00BFFF] text-white' : 'bg-gray-200'}`}
              >
                Donación Única
              </Button>
              <Button
                onClick={() => setDonationType('mensual')}
                className={donationType === 'mensual' ? 'bg-[#00BFFF] text-white' : 'bg-gray-200'}
              >
                Donación Mensual
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {['50000', '100000', '200000'].map((value) => (
                <Button
                  key={value}
                  onClick={() => setAmount(value)}
                  className={amount === value ? 'bg-[#00BFFF] text-white' : 'bg-gray-200'}
                >
                  ${parseInt(value).toLocaleString()}
                </Button>
              ))}
            </div>
            <div className="mb-4">
              <p className="text-sm text-blue-800 mb-2">También puedes elegir otro monto:</p>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                  $
                </span>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Ingrese monto"
                />
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md">
                  COP
                </span>
              </div>
            </div>
            <Button className="w-full bg-[#FFA500] hover:bg-[#FF8C00] text-white" onClick={nextStep}>DONAR AHORA</Button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-bold mb-4">Información personal</h2>
            <div className="space-y-4">
              <Input placeholder="Nombre" name="name" value={formData.name} onChange={handleInputChange} />
              <Input placeholder="Apellido" name="lastName" value={formData.lastName} onChange={handleInputChange} />
              <Input placeholder="Correo electrónico" type="email" name="email" value={formData.email} onChange={handleInputChange} />
              <Input placeholder="Número celular" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                />
                <label htmlFor="terms" className="text-sm text-gray-700">Acepto los términos y condiciones</label>
              </div>
              <Button className="w-full bg-[#FFA500] hover:bg-[#FF8C00] text-white" onClick={nextStep}>QUIERO DONAR</Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-xl font-bold mb-4">Información de pago</h2>
            <p className="mb-4">¿Cómo deseas hacer tu donación?</p>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {['tarjeta', 'pse', 'efectivo'].map((method) => (
                <Button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={paymentMethod === method ? 'bg-[#00BFFF] text-white' : 'bg-gray-200'}
                >
                  {method.toUpperCase()}
                </Button>
              ))}
            </div>
            {paymentMethod === 'tarjeta' && (
              <div className="space-y-4">
                <Select
                  placeholder="Tipo de documento"
                  options={[
                    { value: 'cc', label: 'Cédula de Ciudadanía' },
                    { value: 'ce', label: 'Cédula de Extranjería' }
                  ]}
                />
                <Input placeholder="Número de documento" />
                <Input placeholder="Número de tarjeta" />
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="MM/AA" />
                  <Input placeholder="CVV" />
                </div>
                <Button className="w-full bg-[#FFA500] hover:bg-[#FF8C00] text-white" onClick={nextStep}>DONAR AHORA</Button>
              </div>
            )}
            {paymentMethod === 'pse' && (
              <div className="space-y-4">
                <Select
                  placeholder="Tipo de documento"
                  options={[
                    { value: 'cc', label: 'Cédula de Ciudadanía' },
                    { value: 'ce', label: 'Cédula de Extranjería' }
                  ]}
                />
                <Input placeholder="Número de documento" />
                <Select
                  placeholder="Seleccione un banco"
                  options={[
                    { value: 'bancolombia', label: 'Bancolombia' },
                    { value: 'davivienda', label: 'Davivienda' }
                  ]}
                />
                <Button className="w-full bg-[#FFA500] hover:bg-[#FF8C00] text-white" onClick={nextStep}>DONAR AHORA</Button>
              </div>
            )}
            {paymentMethod === 'efectivo' && (
              <div className="space-y-4">
                <Select
                  placeholder="Seleccione un método de pago"
                  options={[
                    { value: 'efecty', label: 'Efecty' },
                    { value: 'baloto', label: 'Baloto' }
                  ]}
                />
                <Button className="w-full bg-[#FFA500] hover:bg-[#FF8C00] text-white" onClick={nextStep}>DONAR AHORA</Button>
              </div>
            )}
          </>
        )}

        {step === 4 && (
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Lo sentimos</h2>
            <p className="mb-4">No pudimos completar tu donación. Por favor, revise el mensaje de abajo.</p>
            <p className="text-red-500 mb-4">Request failed with status code 400</p>
            <Button className="w-full bg-red-500 hover:bg-red-600 text-white" onClick={() => setStep(1)}>REGRESAR</Button>
          </div>
        )}

        <p className="text-xs text-center mt-4 text-blue-800">#transformandogeneraciones</p>
      </div>
    </div>
  )
}