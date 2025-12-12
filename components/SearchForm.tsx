import React, { useState } from 'react';
import { Search, MapPin, Briefcase, Loader2, Users, Route, Plus, Trash2, ArrowRight } from 'lucide-react';
import { SearchParams, RouteParams, ViewMode } from '../types';

// --- Home Selection Cards ---

interface HomeCardsProps {
  onSelectMode: (mode: ViewMode) => void;
}

export const HomeCards: React.FC<HomeCardsProps> = ({ onSelectMode }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto animate-fade-in-up">
      {/* Route Card */}
      <button 
        onClick={() => onSelectMode(ViewMode.ROUTE)}
        className="group relative flex flex-col items-start p-8 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 text-left"
      >
        <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-blue-600">
          <Route className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Roteirizar Rotas</h3>
        <p className="text-slate-500 leading-relaxed mb-6">
          Insira múltiplos endereços manualmente e deixe a IA organizar a sequência mais lógica e eficiente para sua viagem.
        </p>
        <div className="mt-auto flex items-center text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
          Começar Roteiro <ArrowRight className="ml-2 w-4 h-4" />
        </div>
      </button>

      {/* Prospect Card */}
      <button 
        onClick={() => onSelectMode(ViewMode.PROSPECT)}
        className="group relative flex flex-col items-start p-8 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 text-left"
      >
        <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-indigo-600">
          <Users className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Prospecção de Clientes</h3>
        <p className="text-slate-500 leading-relaxed mb-6">
          Encontre leads qualificados por setor e região, gere ganchos de vendas e localize-os no mapa instantaneamente.
        </p>
        <div className="mt-auto flex items-center text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform">
          Buscar Leads <ArrowRight className="ml-2 w-4 h-4" />
        </div>
      </button>
    </div>
  );
};

// --- Prospecting Form ---

interface ProspectFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
  onBack: () => void;
}

export const ProspectForm: React.FC<ProspectFormProps> = ({ onSearch, isLoading, onBack }) => {
  const [businessType, setBusinessType] = useState('');
  const [location, setLocation] = useState('');
  const [count, setCount] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (businessType && location) onSearch({ businessType, location, count });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <button onClick={onBack} className="text-sm text-slate-400 hover:text-indigo-600 mb-6 flex items-center gap-1 transition-colors">
        &larr; Voltar
      </button>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-600" /> Prospecção de Clientes
        </h2>
        <p className="text-slate-500 mt-1">Defina o perfil do cliente ideal e a região alvo.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Estabelecimento</label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-indigo-700 placeholder-slate-400"
              placeholder="Ex: Padarias, Restaurantes, Dentistas..."
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Localização Alvo</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-indigo-700 placeholder-slate-400"
              placeholder="Ex: Centro, São Paulo - SP"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Quantidade de Resultados</label>
          <select 
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-indigo-700"
          >
            <option value={3}>3 leads (Rápido)</option>
            <option value={5}>5 leads (Padrão)</option>
            <option value={10}>10 leads (Detalhado)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 mt-4"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          {isLoading ? "Gerando Lista..." : "Gerar Lista de Prospecção"}
        </button>
      </form>
    </div>
  );
};

// --- Route Planner Form ---

interface RoutePlannerFormProps {
  onPlan: (params: RouteParams) => void;
  isLoading: boolean;
  onBack: () => void;
}

export const RoutePlannerForm: React.FC<RoutePlannerFormProps> = ({ onPlan, isLoading, onBack }) => {
  const [addresses, setAddresses] = useState<string[]>(['', '']); // Start with 2 empty inputs

  const handleAddressChange = (index: number, value: string) => {
    const newAddresses = [...addresses];
    newAddresses[index] = value;
    setAddresses(newAddresses);
  };

  const addAddress = () => setAddresses([...addresses, '']);
  
  const removeAddress = (index: number) => {
    if (addresses.length > 2) {
      const newAddresses = addresses.filter((_, i) => i !== index);
      setAddresses(newAddresses);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validAddresses = addresses.filter(a => a.trim() !== '');
    if (validAddresses.length >= 2) {
      onPlan({ addresses: validAddresses });
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <button onClick={onBack} className="text-sm text-slate-400 hover:text-blue-600 mb-6 flex items-center gap-1 transition-colors">
        &larr; Voltar
      </button>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Route className="w-6 h-6 text-blue-600" /> Planejador de Rotas
        </h2>
        <p className="text-slate-500 mt-1">Adicione os endereços e deixe a IA organizar a melhor sequência.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {addresses.map((address, index) => (
          <div key={index} className="flex gap-2 items-center animate-fade-in">
             <div className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex-shrink-0">
               {index + 1}
             </div>
             <input
                type="text"
                className="flex-grow px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-indigo-700 placeholder-slate-400"
                placeholder={index === 0 ? "Ponto de partida (ex: Escritório)" : `Parada ${index} (ex: Av. Paulista, 1000)`}
                value={address}
                onChange={(e) => handleAddressChange(index, e.target.value)}
                required
             />
             {addresses.length > 2 && (
               <button
                 type="button"
                 onClick={() => removeAddress(index)}
                 className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                 title="Remover endereço"
               >
                 <Trash2 className="w-5 h-5" />
               </button>
             )}
          </div>
        ))}

        <div className="pt-2">
            <button
                type="button"
                onClick={addAddress}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
            >
                <Plus className="w-4 h-4" /> Adicionar novo endereço
            </button>
        </div>

        <div className="pt-6 border-t border-slate-100 mt-6">
            <button
            type="submit"
            disabled={isLoading || addresses.filter(a => a.trim() !== '').length < 2}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
            >
            {isLoading ? (
                <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Otimizando Rota...</span>
                </>
            ) : (
                <>
                <Route className="w-5 h-5" />
                <span>Gerar Rota Otimizada</span>
                </>
            )}
            </button>
        </div>
      </form>
    </div>
  );
};