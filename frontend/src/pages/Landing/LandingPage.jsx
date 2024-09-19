import React, { useState } from 'react'
import { Heart, Users, DollarSign, ArrowRight, AlertCircle, X } from 'lucide-react'
import picture from "../../assets/img/fundacio1.jpeg";
import Accion from "../../assets/img/Accion.jpg";

const Button = ({ children, className, variant, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md ${className} ${variant === 'outline' ? 'border border-current' : ''}`}
  >
    {children}
  </button>
)

//Cuadros de Proyectos
const Card = ({ children, className }) => (
  <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
    {children}
  </div>
)
//Targetas de texto de proyectos
const CardHeader = ({ children, className }) => (
  <div className={`p-4 ${className}`}>{children}</div>
)

const CardTitle = ({ children, className }) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
)

const CardContent = ({ children }) => (
  <div className="p-4">{children}</div>
)

const CardDescription = ({ children }) => (
  <p className="text-gray-600">{children}</p>
)

const Input = ({ placeholder, type, className, value, onChange, name }) => (
  <input
    type={type || 'text'}
    placeholder={placeholder}
    className={`w-full px-3 py-2 border rounded-md ${className}`}
    value={value}
    onChange={onChange}
    name={name}
  />
)

const Select = ({ children, value, onChange }) => (
  <div className="relative">
    <select
      className="w-full px-3 py-2 border rounded-md appearance-none"
      value={value}
      onChange={onChange}
    >
      {children}
    </select>
  </div>
)

const SelectItem = ({ value, children }) => (
  <option value={value}>{children}</option>
)

const DonationForm = ({ onClose }) => {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-white rounded-lg overflow-hidden shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X />
        </button>
        <div className="bg-blue-600 text-white p-6">
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
                  className={`mr-2 ${donationType === 'unica' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                  Donación Única
                </Button>
                <Button
                  onClick={() => setDonationType('mensual')}
                  className={donationType === 'mensual' ? 'bg-blue-600 text-white' : 'bg-gray-200'}
                >
                  Donación Mensual
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {['50000', '100000', '200000'].map((value) => (
                  <Button
                    key={value}
                    onClick={() => setAmount(value)}
                    className={amount === value ? 'bg-blue-600 text-white' : 'bg-gray-200'}
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
                    className="rounded-l-none"
                  />
                  <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md">
                    COP
                  </span>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={nextStep}>DONAR AHORA</Button>
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
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={nextStep}>QUIERO DONAR</Button>
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
                    className={paymentMethod === method ? 'bg-blue-600 text-white' : 'bg-gray-200'}
                  >
                    {method.toUpperCase()}
                  </Button>
                ))}
              </div>
              {paymentMethod === 'tarjeta' && (
                <div className="space-y-4">
                  <Select>
                    <SelectItem value="">Tipo de documento</SelectItem>
                    <SelectItem value="cc">Cédula de Ciudadanía</SelectItem>
                    <SelectItem value="ce">Cédula de Extranjería</SelectItem>
                  </Select>
                  <Input placeholder="Número de documento" />
                  <Input placeholder="Número de tarjeta" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="MM/AA" />
                    <Input placeholder="CVV" />
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={nextStep}>DONAR AHORA</Button>
                </div>
              )}
              {paymentMethod === 'pse' && (
                <div className="space-y-4">
                  <Select>
                    <SelectItem value="">Tipo de documento</SelectItem>
                    <SelectItem value="cc">Cédula de Ciudadanía</SelectItem>
                    <SelectItem value="ce">Cédula de Extranjería</SelectItem>
                  </Select>
                  <Input placeholder="Número de documento" />
                  <Select>
                    <SelectItem value="">Seleccione un banco</SelectItem>
                    <SelectItem value="bancolombia">Bancolombia</SelectItem>
                    <SelectItem value="davivienda">Davivienda</SelectItem>
                  </Select>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={nextStep}>DONAR AHORA</Button>
                </div>
              )}
              {paymentMethod === 'efectivo' && (
                <div className="space-y-4">
                  <Select>
                    <SelectItem value="">Seleccione un método de pago</SelectItem>
                    <SelectItem value="efecty">Efecty</SelectItem>
                    <SelectItem value="baloto">Baloto</SelectItem>
                  </Select>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={nextStep}>DONAR AHORA</Button>
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
    </div>
  )
}

const App = () => {
  const [showDonationForm, setShowDonationForm] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-white shadow-sm">
        <a className="flex items-center justify-center" href="#">
          <Heart className="h-6 w-6 text-blue-600" />
          <span className="ml-2 text-2xl font-bold text-gray-800">Fundación Un Mundo De Sonrisas</span>
        </a>
        <nav className="ml-auto flex gap-4 sm:gap-4">
          <a className="text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-300 rounded-md transition-colors px-3 py-2" href="#about">
            Sobre Nosotros
          </a>
          <a className="text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-300 rounded-md transition-colors px-3 py-2" href="#projects">
            Proyectos
          </a>
          <a className="text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-300 rounded-md transition-colors px-3 py-2" href="#donate">
            Donar
          </a>
          <a className="text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-300 rounded-md transition-colors px-3 py-2" href="#contact">
            Contacto
          </a>
          <a className="text-sm font-medium text-gray-600 hover:text-white transition-colors bg-gradient-to-br from-blue-200 to-blue-500 hover:from-blue-300 hover:to-blue-700 rounded-lg px-3 py-2" href="/login">
            Login
          </a>
        </nav>
      </header>
      <main className="flex-1">
        <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-blue-50 bg-cover"
          style={{ backgroundImage: `url(${picture})` }}>
          <div className="absolute inset-0 bg-black/50 backdrop-brightness-75"></div> {/* Filtro de brillo y opacidad */}

          <div className="relative container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-blue-600">
                  Juntos podemos cambiar vidas
                </h1>
                <p className="mx-auto max-w-[700px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Únete a nuestra misión de crear un mundo mejor. Cada acción cuenta, cada donación transforma vidas.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShowDonationForm(true)}>
                  Donar Ahora
                </Button>
                <Button variant="outline" className="text-white border-blue-600 hover:bg-blue-500 ">
                  Conoce Más
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section id="about" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 max-w-lg">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-blue-800">Nuestra Misión</h2>
                <p className="text-gray-600 md:text-lg/relaxed">
                  En La Fundación Un mundo de sonrisas, nos dedicamos a mejorar la vida de las personas más vulnerables.
                  Trabajamos incansablemente para proporcionar educación, atención médica y oportunidades
                  a quienes más lo necesitan.
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Descubre Cómo Ayudamos <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <img
                src={Accion}
                alt="Nuestra misión en acción"
                width={400}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>
        <section id="projects" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-8 text-blue-800">Nuestros Proyectos</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Educación para Todos",
                  description: "Construimos escuelas y proporcionamos materiales educativos en comunidades desfavorecidas.",
                  image: "https://res.cloudinary.com/doliz92a2/image/upload/v1726720771/Landing/obcztpmlmslihzi0ldyw.jpg"
                },
                {
                  title: "Comedor Comunitario",
                  description: "Compartimos comidas para las comunidades que mas lo necesitan.",
                  image: "https://res.cloudinary.com/doliz92a2/image/upload/v1726720892/Landing/zj020rdz2gwsreihltwe.jpg"
                },
                {
                  title: "FIestas Navideñas",
                  description: "Hacemos eventos con nuestra comunidad, los cuales son importantes como lo seria navidad.",
                  image: "https://res.cloudinary.com/doliz92a2/image/upload/v1726721840/Landing/obzinph2jxhme66eqkt8.jpg"
                }
              ].map((project, index) => (
                <Card key={index} className="overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    width={300}
                    height={200}
                    className="w-full object-cover h-48"
                  />
                  <CardHeader>
                    <CardTitle className="text-blue-700">{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{project.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-gray-600">Vidas Impactadas</CardTitle>
                  <Users className="w-4 h-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-700">10,000+</div>
                </CardContent>
              </Card>
              <Card className="bg-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-gray-600">Proyectos Completados</CardTitle>
                  <Heart className="w-4 h-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-700">50+</div>
                </CardContent>
              </Card>
              <Card className="bg-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-gray-600">Donantes Activos</CardTitle>
                  <Users className="w-4 h-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-700">5,000+</div>
                </CardContent>
              </Card>
              <Card className="bg-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-gray-600">Fondos Recaudados</CardTitle>
                  <DollarSign className="w-4 h-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-700">$1M+</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="donate" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-8 text-blue-800">Haz una Donación</h2>
            <div className="mx-auto max-w-sm space-y-4">
              <Select>
                <SelectItem value="">Selecciona un proyecto</SelectItem>
                <SelectItem value="educacion">Educación para Todos</SelectItem>
                <SelectItem value="salud">Salud Comunitaria</SelectItem>
                <SelectItem value="agua">Agua Limpia</SelectItem>
              </Select>
              <Input placeholder="Cantidad a donar" type="number" className="w-full" />
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShowDonationForm(true)}>Donar Ahora</Button>
            </div>
          </div>
        </section>
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-blue-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-8 text-blue-800">Contáctanos</h2>
            <div className="mx-auto max-w-sm space-y-4">
              <Input placeholder="Nombre" className="w-full" />
              <Input placeholder="Email" type="email" className="w-full" />
              <Input placeholder="Mensaje" className="w-full" />
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Enviar Mensaje</Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-white">
        <p className="text-xs text-gray-500">© 2023 Fundación Un Mundo De Sonrisas. Todos los derechos reservados.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a className="text-xs text-gray-500 hover:underline underline-offset-4" href="#">
            Términos de Servicio
          </a>
          <a className="text-xs text-gray-500 hover:underline underline-offset-4" href="#">
            Privacidad
          </a>
        </nav>
      </footer>
      {showDonationForm && <DonationForm onClose={() => setShowDonationForm(false)} />}
    </div>
  )
}

export default App