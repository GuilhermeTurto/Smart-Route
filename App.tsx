import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { HomeCards, ProspectForm, RoutePlannerForm } from './components/SearchForm';
import { ResultDisplay } from './components/ResultDisplay';
import { findProspects, optimizeRoute } from './services/geminiService';
import { GenerationResult, SearchParams, RouteParams, AppStatus, ViewMode } from './types';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.HOME);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Reset state when going back to home
  const goBack = () => {
    setViewMode(ViewMode.HOME);
    setStatus(AppStatus.IDLE);
    setResult(null);
    setErrorMsg(null);
  };

  const handleProspectSearch = async (params: SearchParams) => {
    setStatus(AppStatus.LOADING);
    setResult(null);
    setErrorMsg(null);

    try {
      const data = await findProspects(
        params.businessType,
        params.location,
        params.count
      );
      setResult(data);
      setStatus(AppStatus.SUCCESS);
    } catch (err) {
      console.error(err);
      setErrorMsg("Falha ao gerar lista. Verifique sua conexão e tente novamente.");
      setStatus(AppStatus.ERROR);
    }
  };

  const handleRoutePlan = async (params: RouteParams) => {
    setStatus(AppStatus.LOADING);
    setResult(null);
    setErrorMsg(null);

    try {
        const data = await optimizeRoute(params.addresses);
        setResult(data);
        setStatus(AppStatus.SUCCESS);
    } catch (err) {
        console.error(err);
        setErrorMsg("Falha ao otimizar rota. Verifique sua conexão e tente novamente.");
        setStatus(AppStatus.ERROR);
    }
  };

  return (
    <Layout>
      {/* Home Screen */}
      {viewMode === ViewMode.HOME && (
        <div className="py-8">
           <div className="text-center mb-12">
             <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Bem-vindo ao SmartRoute</h2>
             <p className="text-slate-600 text-lg max-w-2xl mx-auto">
               Sua plataforma inteligente para otimizar vendas de campo. Escolha abaixo como deseja começar hoje.
             </p>
           </div>
           <HomeCards onSelectMode={setViewMode} />
        </div>
      )}

      {/* Prospecting Mode */}
      {viewMode === ViewMode.PROSPECT && (
        <>
            <ProspectForm 
                onSearch={handleProspectSearch} 
                isLoading={status === AppStatus.LOADING} 
                onBack={goBack}
            />
        </>
      )}

      {/* Route Mode */}
      {viewMode === ViewMode.ROUTE && (
        <>
            <RoutePlannerForm 
                onPlan={handleRoutePlan}
                isLoading={status === AppStatus.LOADING}
                onBack={goBack}
            />
        </>
      )}

      {/* Error Message */}
      {status === AppStatus.ERROR && (
        <div className="max-w-2xl mx-auto mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 text-red-800 animate-in fade-in slide-in-from-top-4">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      {/* Results */}
      {status === AppStatus.SUCCESS && result && (
        <ResultDisplay result={result} />
      )}
    </Layout>
  );
}