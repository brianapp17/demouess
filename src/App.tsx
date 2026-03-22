import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, User, Loader2, Cpu, History, Zap, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

// Initialize Gemini
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface Message {
  role: 'user' | 'model';
  text: string;
}

const ARTICLES = [
  {
    id: 'how-it-works',
    title: '¿Cómo funciona la computación cuántica?',
    icon: <Cpu className="w-6 h-6" />,
    content: `
A diferencia de las computadoras clásicas que usan bits (0 o 1), las computadoras cuánticas utilizan **qubits**. 

### Conceptos Clave:
- **Superposición:** Un qubit puede existir en múltiples estados simultáneamente hasta que es medido.
- **Entrelazamiento:** Un fenómeno donde dos qubits se vinculan de tal manera que el estado de uno afecta instantáneamente al otro, sin importar la distancia.
- **Interferencia Cuántica:** Se utiliza para amplificar las probabilidades que conducen a la respuesta correcta y cancelar las incorrectas.
    `
  },
  {
    id: 'advances',
    title: 'Avances Recientes',
    icon: <Zap className="w-6 h-6" />,
    content: `
La carrera por la supremacía cuántica está en su punto más alto.

- **Google Sycamore:** En 2019, Google afirmó haber alcanzado la supremacía cuántica al realizar un cálculo en 200 segundos que a una supercomputadora clásica le tomaría 10,000 años.
- **IBM Osprey:** Con 433 qubits, IBM continúa empujando los límites de la escala cuántica.
- **Corrección de Errores:** Recientemente, se han logrado hitos importantes en la reducción de la "decoherencia", permitiendo cálculos más largos y complejos.
    `
  },
  {
    id: 'history',
    title: 'Datos Históricos',
    icon: <History className="w-6 h-6" />,
    content: `
La computación cuántica no es una idea nueva, tiene décadas de desarrollo teórico.

- **1981:** Richard Feynman propone que una computadora cuántica podría simular sistemas físicos que las computadoras clásicas no pueden.
- **1994:** Peter Shor desarrolla un algoritmo que podría factorizar números grandes rápidamente, amenazando la criptografía actual.
- **1998:** Se demuestra la primera computadora cuántica de 2 qubits.
    `
  }
];

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: [...messages, userMessage].map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction: "Eres un experto en computación cuántica. Responde de manera clara y educativa. Usa un tono profesional pero accesible.",
        }
      });

      const modelText = response.text || "Lo siento, no pude procesar tu solicitud.";
      setMessages(prev => [...prev, { role: 'model', text: modelText }]);
    } catch (error) {
      console.error("Error calling Gemini:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Hubo un error al conectar con el asistente cuántico." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a192f] text-slate-200 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Header */}
      <header className="border-b border-amber-500/20 bg-[#0a192f]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.4)]">
              <Cpu className="text-[#0a192f] w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-amber-400">
              Quantum<span className="text-blue-400">Horizon</span>
            </h1>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium uppercase tracking-widest text-slate-400">
            <a href="#articles" className="hover:text-amber-400 transition-colors">Artículos</a>
            <a href="#chatbot" className="hover:text-amber-400 transition-colors">Asistente</a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-24">
        {/* Hero Section */}
        <section className="text-center space-y-6 py-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold text-slate-100 leading-tight"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
              El Futuro es Cuántico
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto"
          >
            Descubre cómo la mecánica cuántica está revolucionando la forma en que procesamos información y resolvemos los problemas más complejos del universo.
          </motion.p>
        </section>

        {/* Articles Grid */}
        <section id="articles" className="space-y-12">
          <div className="flex items-center gap-4">
            <h3 className="text-3xl font-bold text-amber-400">Explora el Conocimiento</h3>
            <div className="h-px flex-1 bg-amber-500/20"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {ARTICLES.map((article, index) => (
              <motion.article 
                key={article.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#112240] p-8 rounded-2xl border border-blue-900/50 hover:border-amber-500/50 transition-all group shadow-xl"
              >
                <div className="w-12 h-12 bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 text-amber-400 group-hover:bg-amber-500 group-hover:text-[#0a192f] transition-all">
                  {article.icon}
                </div>
                <h4 className="text-xl font-bold mb-4 text-slate-100">{article.title}</h4>
                <div className="prose prose-invert prose-amber text-slate-400 text-sm leading-relaxed">
                  <ReactMarkdown>{article.content}</ReactMarkdown>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Chatbot Section */}
        <section id="chatbot" className="space-y-12">
          <div className="flex items-center gap-4">
            <h3 className="text-3xl font-bold text-amber-400">Asistente Cuántico</h3>
            <div className="h-px flex-1 bg-amber-500/20"></div>
          </div>
          
          <div className="bg-[#112240] rounded-3xl border border-blue-900/50 overflow-hidden shadow-2xl flex flex-col h-[600px]">
            {/* Chat Header */}
            <div className="p-6 bg-blue-900/20 border-b border-blue-900/50 flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                <MessageSquare className="text-[#0a192f] w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-100">Quantum AI</h4>
                <p className="text-xs text-blue-400">En línea • Basado en Gemini Flash Lite</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-blue-900 scrollbar-track-transparent">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                  <Bot className="w-12 h-12 text-amber-400" />
                  <p className="max-w-xs">Hola, soy tu asistente experto en computación cuántica. ¿En qué puedo ayudarte hoy?</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-amber-500'}`}>
                      {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-[#0a192f]" />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-blue-900/40 text-slate-200 border border-blue-800/50 rounded-tl-none'
                    }`}>
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 items-center bg-blue-900/20 p-4 rounded-2xl text-blue-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-xs font-medium uppercase tracking-widest">Calculando probabilidades...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-6 bg-[#0a192f]/50 border-t border-blue-900/50">
              <div className="relative flex items-center">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Pregunta sobre qubits, algoritmos o el futuro..."
                  className="w-full bg-[#112240] border border-blue-900/50 rounded-2xl py-4 pl-6 pr-16 focus:outline-none focus:border-amber-500 transition-all text-slate-100 placeholder:text-slate-500"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 p-3 bg-amber-500 text-[#0a192f] rounded-xl hover:bg-amber-400 disabled:opacity-50 disabled:hover:bg-amber-500 transition-all shadow-lg"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-amber-500/10 py-12 bg-[#0a192f]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-50">
            <Cpu className="text-amber-400 w-5 h-5" />
            <span className="text-sm font-bold tracking-tight">QuantumHorizon</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 Quantum Horizon. Explorando los límites de la realidad.</p>
          <div className="flex gap-6 text-slate-400">
            <a href="#" className="hover:text-amber-400 transition-colors text-xs uppercase tracking-widest">Privacidad</a>
            <a href="#" className="hover:text-amber-400 transition-colors text-xs uppercase tracking-widest">Términos</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
