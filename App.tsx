import React, { useState, useEffect, useCallback } from 'react';
import { 
  Clipboard, 
  Play, 
  Settings2, 
  Sparkles, 
  LayoutDashboard,
  CheckCircle2,
  X,
  Loader2,
  HelpCircle,
  BookOpen,
  MousePointer2,
  ListChecks,
  Code2,
  UserRound,
  BrainCircuit,
  Copy,
  Undo2,
  Info,
  Zap,
  Target,
  FileText,
  Settings,
  KeyRound,
  ChevronRight,
  Trash2,
  Save,
  Layers,
  Edit3,
  MessageSquareQuote,
  MessageCircle,
  Newspaper,
  Check,
  Tag,
  LayoutGrid
} from 'lucide-react';
import { TechniqueType, PromptInputs, TechniqueInfo } from './types';
import { TECHNIQUES, PRESETS, getIcon, ROLES, EMOTIONS } from './constants';
import { runPrompt } from './services/geminiService';

// 전역 객체 타입 선언
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}

// 사용가이드 모달
const GuideModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-8 py-6 bg-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6" />
            <h3 className="text-xl font-bold">Prompt Flow 사용 가이드</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex gap-3">
              <MousePointer2 className="w-5 h-5 text-indigo-500 shrink-0" />
              <p className="text-sm text-slate-600 font-medium">1. 원하는 <strong>프롬프트 기법</strong>을 다중 선택하세요.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex gap-3">
              <Layers className="w-5 h-5 text-indigo-500 shrink-0" />
              <p className="text-sm text-slate-600 font-medium">2. 템플릿을 통해 <strong>수행 과제</strong>를 빠르게 설정하세요.</p>
            </div>
          </div>
          <div className="p-5 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <p className="text-sm text-rose-800 leading-relaxed font-semibold">
              팁: 각 기법 우측 상단에 있는 <span className="text-rose-600">빨간 물음표(?) 아이콘</span>을 클릭하면 해당 기법의 상세 설명과 실제 사용 예시를 확인할 수 있습니다.
            </p>
          </div>
        </div>
        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-center">
          <button onClick={onClose} className="px-12 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-200">
            시작하기
          </button>
        </div>
      </div>
    </div>
  );
};

// 설정 모달 (수동 입력 UI)
const SettingsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const savedKey = sessionStorage.getItem('CUSTOM_GEMINI_API_KEY') || '';
      setApiKeyInput(savedKey);
      setIsSaved(!!savedKey);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveKey = () => {
    if (apiKeyInput.trim()) {
      sessionStorage.setItem('CUSTOM_GEMINI_API_KEY', apiKeyInput.trim());
      setIsSaved(true);
      alert('API 키가 성공적으로 저장되었습니다.');
    } else {
      alert('API 키를 입력해 주세요.');
    }
  };

  const handleDeleteKey = () => {
    sessionStorage.removeItem('CUSTOM_GEMINI_API_KEY');
    setApiKeyInput('');
    setIsSaved(false);
    alert('API 키가 삭제되었습니다.');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-xl">
              <Settings className="w-5 h-5 text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">환경 설정</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Gemini API Key</label>
              {isSaved && (
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase flex items-center gap-1">
                  <Check className="w-3 h-3" /> Saved
                </span>
              )}
            </div>
            
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-slate-900">API 키 수동 입력</div>
                  <div className="text-[11px] text-slate-500">sessionStorage에 안전하게 보관됩니다.</div>
                </div>
              </div>

              <input 
                type="password" 
                placeholder="발급받은 Gemini API 키를 입력하세요"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
              />
              
              <div className="flex gap-2">
                <button 
                  onClick={handleSaveKey}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  저장하기
                </button>
                <button 
                  onClick={handleDeleteKey}
                  className="px-4 py-3 bg-slate-200 hover:bg-rose-500 hover:text-white text-slate-600 rounded-xl font-bold transition-all active:scale-95"
                  title="삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-[11px] text-slate-600 leading-relaxed">
                * 입력한 키는 브라우저를 닫으면 초기화됩니다. 무료 플랜 API 키를 권장합니다.
              </p>
            </div>
          </div>
        </div>
        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100">
          <button onClick={onClose} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all">
            설정 닫기
          </button>
        </div>
      </div>
    </div>
  );
};

// 기법 상세 모달
const TechniqueDetailModal: React.FC<{ technique: TechniqueInfo | null; onClose: () => void }> = ({ technique, onClose }) => {
  if (!technique) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 pb-0 flex justify-between items-start">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-indigo-600 text-white shadow-lg shadow-indigo-100">
            {getIcon(technique.icon, "w-8 h-8")}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-8 space-y-6">
          <div>
            <h3 className="text-2xl font-black text-slate-900 mb-1">{technique.title}</h3>
            <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest">{technique.subtitle}</p>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-tighter mb-2">원리 및 설명</h4>
              <p className="text-[15px] text-slate-600 leading-relaxed font-medium">{technique.detail?.concept}</p>
            </div>
            <div className="p-6 bg-indigo-50 rounded-[1.5rem] border border-indigo-100">
              <h4 className="text-xs font-black text-indigo-500 uppercase tracking-tighter mb-3 flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> 구체적인 실례
              </h4>
              <p className="text-[14px] text-slate-700 leading-relaxed italic font-bold">"{technique.detail?.example}"</p>
            </div>
          </div>
        </div>
        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100">
          <button onClick={onClose} className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all">
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [selectedTechniques, setSelectedTechniques] = useState<TechniqueType[]>([TechniqueType.ZERO_SHOT]);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [detailTechnique, setDetailTechnique] = useState<TechniqueInfo | null>(null);
  const [customRole, setCustomRole] = useState<string>('');
  const [isDirectInputMode, setIsDirectInputMode] = useState<boolean>(false);
  
  const [inputs, setInputs] = useState<PromptInputs>({
    productName: '',
    category: '',
    targetAudience: '',
    keyFeatures: '',
    task: '',
    steps: '1. 고객의 불편함 정의\n2. 제품의 고유 가치 제안\n3. 설득력 있는 증거 제시',
    examples: '입력: 새로운 가습기\n출력: 당신의 수면을 촉촉하게 지켜주는 안개 가습기\n---\n입력: 오가닉 샐러드\n출력: 바쁜 아침, 5분 만에 챙기는 내 몸의 활력',
    role: ROLES[0],
    perspective: '소비자의 실제 일상 환경',
    emotion: EMOTIONS[0],
    attitude: '전문적이지만 친근한 말투',
    goal: '신제품에 대한 신뢰 형성 및 첫 구매 유도',
    criteria: '사용자가 3초 이내에 핵심 편익을 이해해야 함'
  });

  const [assembledPrompt, setAssembledPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [apiResult, setApiResult] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<string>('프롬프트 복사');

  // 프롬프트 조립 로직
  const buildPrompt = useCallback(() => {
    const { productName, category, targetAudience, keyFeatures, task, steps, examples, role, perspective, emotion, attitude, goal, criteria } = inputs;
    let promptParts: string[] = [];

    if (selectedTechniques.includes(TechniqueType.ROLE)) {
      const finalRole = isDirectInputMode ? customRole : role;
      promptParts.push(`너는 **${finalRole || '(역할 지정)'}** 전문가야. 특히 **${perspective}**의 시각으로 문제를 분석하고 최적의 대안을 제시해줘.`);
    }

    promptParts.push(`## 대상 정보\n- **제품/브랜드**: ${productName || '(미입력)'}\n- **분류**: ${category || '(미입력)'}\n- **타깃 대상**: ${targetAudience || '(미입력)'}\n- **핵심 특징**: ${keyFeatures || '(미입력)'}`);

    if (selectedTechniques.includes(TechniqueType.STEP_BACK)) {
      promptParts.push(`## 상위 전략\n작업 시작 전, 우리의 궁극적 목표인 **${goal}**와 성공 기준인 **${criteria}**를 명확히 반영해.`);
    }

    promptParts.push(`## 요청 과제\n${task || '수행할 과제를 입력해주세요.'}`);

    if (selectedTechniques.includes(TechniqueType.COT)) {
      promptParts.push(`## 단계적 사고 절차\n다음의 로직을 따라 순차적으로 생각해서 결과를 도출해줘:\n${steps}`);
    }

    if (selectedTechniques.includes(TechniqueType.FEW_SHOT)) {
      promptParts.push(`## 참고 예시\n다음 형식과 어조를 가이드로 삼아줘:\n${examples}`);
    }

    if (selectedTechniques.includes(TechniqueType.EMOTION)) {
      promptParts.push(`## 감성 및 문체\n전체적으로 **${emotion}** 느낌이 나도록 하며, **${attitude}**를 유지해줘.`);
    }

    setAssembledPrompt(promptParts.join('\n\n'));
  }, [inputs, selectedTechniques, customRole, isDirectInputMode]);

  useEffect(() => { buildPrompt(); }, [buildPrompt]);

  const handleRunTest = async () => {
    setIsGenerating(true);
    try {
      const result = await runPrompt(assembledPrompt);
      if (result.includes("API 키") || result.includes("설정에서 키를 확인")) {
        setIsSettingsOpen(true);
      }
      setApiResult(result);
    } catch (error: any) {
      setApiResult("생성 중 오류가 발생했습니다. 설정에서 API 키를 확인해주세요.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter']">
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <TechniqueDetailModal technique={detailTechnique} onClose={() => setDetailTechnique(null)} />
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <Sparkles className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 leading-none mb-1 uppercase tracking-tighter">Prompt Flow</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Powered by Gemini 3</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsGuideOpen(true)}
              className="px-4 py-2.5 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-xl transition-all flex items-center gap-2 border border-slate-100 font-bold text-sm"
            >
              <HelpCircle className="w-4 h-4" />
              사용가이드
            </button>
            <div className="w-px h-6 bg-slate-200 mx-1"></div>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-slate-100"
              title="환경 설정"
            >
              <Settings2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Tools and Inputs */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Section 1: Technique Selection */}
          <section>
            <div className="flex items-center justify-between mb-5 px-1">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-indigo-500" />
                1. 프롬프트 기법 조합 <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full uppercase ml-1">(다중선택 가능)</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {TECHNIQUES.map((tech) => {
                const isSelected = selectedTechniques.includes(tech.type);
                return (
                  <div key={tech.type} className="relative group">
                    <button
                      onClick={() => {
                        setSelectedTechniques(prev => 
                          prev.includes(tech.type) 
                            ? (prev.length > 1 ? prev.filter(t => t !== tech.type) : prev) 
                            : [...prev, tech.type]
                        );
                      }}
                      className={`w-full p-5 rounded-3xl border-2 text-left transition-all h-full flex flex-col ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-50 shadow-md scale-[1.02]'
                          : 'border-white bg-white hover:border-slate-200 shadow-sm'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all ${
                        isSelected ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-400'
                      }`}>
                        {getIcon(tech.icon, "w-5 h-5")}
                      </div>
                      <div className="font-bold text-sm text-slate-900 mb-1 leading-tight">{tech.title}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{tech.subtitle}</div>
                      {isSelected && (
                        <div className="absolute bottom-4 right-4 animate-in zoom-in">
                          <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                        </div>
                      )}
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setDetailTechnique(tech); }}
                      className="absolute top-4 right-4 p-2 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all shadow-sm z-10 border border-rose-100"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 2: 수행 과제 템플릿 선택 */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-5 px-1">
              <Layers className="w-5 h-5 text-indigo-500" />
              2. 수행 과제 템플릿 선택
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setInputs(prev => ({ ...prev, task: preset.task }))}
                  className={`px-3 py-2.5 rounded-2xl border-2 transition-all text-xs font-bold flex items-center gap-2 shadow-sm ${
                    inputs.task === preset.task 
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-indigo-100' 
                      : 'border-white bg-white hover:border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="shrink-0">{getIcon(preset.icon, "w-4 h-4")}</div>
                  <span className="truncate">{preset.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Section 3: Information Inputs */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 px-1">
              <LayoutDashboard className="w-5 h-5 text-indigo-500" />
              3. 과제 정보 입력 (실례 기반)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-indigo-500" /> 제품/브랜드명
                </label>
                <input 
                  type="text" placeholder="실례: '포레스트' 유기농 차 세트"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium shadow-sm text-slate-900"
                  value={inputs.productName} onChange={(e) => setInputs({...inputs, productName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                  <LayoutGrid className="w-3.5 h-3.5 text-indigo-500" /> 카테고리
                </label>
                <input 
                  type="text" placeholder="실례: 건강 / 식품"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium shadow-sm text-slate-900"
                  value={inputs.category} onChange={(e) => setInputs({...inputs, category: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-rose-500" /> 타깃 대상
                </label>
                <input 
                  type="text" placeholder="실례: 홈카페를 즐기는 2030 여성, 선물 고민 중인 사회초년생"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium shadow-sm text-slate-900"
                  value={inputs.targetAudience} onChange={(e) => setInputs({...inputs, targetAudience: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-500" /> 핵심 특징 (강점)
                </label>
                <input 
                  type="text" placeholder="실례: 무농약 인증, 선물용 프리미엄 패키지, 블렌딩 티 5종"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium shadow-sm text-slate-900"
                  value={inputs.keyFeatures} onChange={(e) => setInputs({...inputs, keyFeatures: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                <ListChecks className="w-3.5 h-3.5 text-indigo-500" /> 수행할 핵심 과제
              </label>
              <textarea 
                rows={3} placeholder="실례: 인스타그램 광고용으로 클릭을 유도하는 짧은 카피 3가지를 작성해줘."
                className="w-full px-6 py-5 rounded-3xl border border-indigo-100 bg-indigo-50/20 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium leading-relaxed shadow-inner text-slate-900"
                value={inputs.task} onChange={(e) => setInputs({...inputs, task: e.target.value})}
              />
            </div>

            {/* Restored Conditional Sections based on active techniques */}
            <div className="pt-8 border-t border-slate-100 space-y-6">
              {selectedTechniques.includes(TechniqueType.ROLE) && (
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4 animate-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                      <UserRound className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 uppercase">페르소나 설정</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">역할 선택/입력</label>
                      <div className="relative group">
                        {isDirectInputMode ? (
                          <div className="relative flex items-center">
                            <input 
                              type="text" 
                              placeholder="직접 입력 (예: 마케팅 심리학자)" 
                              className="w-full px-4 py-3 pr-10 rounded-xl border border-indigo-200 text-sm bg-white font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none" 
                              value={customRole} 
                              onChange={(e) => setCustomRole(e.target.value)} 
                              autoFocus
                            />
                            <button 
                              onClick={() => { setIsDirectInputMode(false); setCustomRole(''); }}
                              className="absolute right-3 p-1 text-slate-400 hover:text-rose-500 transition-colors"
                              title="선택 목록으로 돌아가기"
                            >
                              <Undo2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <select 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none" 
                            value={inputs.role} 
                            onChange={(e) => {
                              if (e.target.value === '직접 입력') {
                                setIsDirectInputMode(true);
                              } else {
                                setInputs({...inputs, role: e.target.value});
                              }
                            }}
                          >
                            {ROLES.map(r => <option key={r} value={r} className="text-slate-900">{r}</option>)}
                          </select>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">전문가 분석 관점</label>
                      <input 
                        type="text" 
                        placeholder="분석 관점 (실례: 마케팅 심리학)" 
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none" 
                        value={inputs.perspective} 
                        onChange={(e) => setInputs({...inputs, perspective: e.target.value})} 
                      />
                    </div>
                  </div>
                </div>
              )}
              {selectedTechniques.includes(TechniqueType.COT) && (
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4 animate-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                      <BrainCircuit className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 uppercase">사고 단계(CoT) 설정</h4>
                  </div>
                  <textarea 
                    value={inputs.steps} 
                    onChange={e => setInputs({...inputs, steps: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white font-medium h-24 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              )}
              {selectedTechniques.includes(TechniqueType.FEW_SHOT) && (
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4 animate-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                      <Copy className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 uppercase">참고 예시(Few-shot) 제공</h4>
                  </div>
                  <textarea 
                    value={inputs.examples} 
                    onChange={e => setInputs({...inputs, examples: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white font-medium h-24 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              )}
              {selectedTechniques.includes(TechniqueType.STEP_BACK) && (
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4 animate-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                      <Undo2 className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 uppercase">상위 전략(Step-back)</h4>
                  </div>
                  <div className="space-y-4">
                    <input type="text" placeholder="근본 목표 (실례: 장기적 팬덤 형성)" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none" value={inputs.goal} onChange={(e) => setInputs({...inputs, goal: e.target.value})} />
                    <input type="text" placeholder="성공 기준 (실례: 진정성이 느껴지는 문체)" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none" value={inputs.criteria} onChange={(e) => setInputs({...inputs, criteria: e.target.value})} />
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[740px] sticky top-24 border border-slate-800">
            <div className="px-8 py-6 bg-slate-800/80 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5 mr-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">Live Assembler</span>
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(assembledPrompt);
                  setCopyStatus('복사 완료!');
                  setTimeout(() => setCopyStatus('프롬프트 복사'), 2000);
                }}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-black rounded-lg transition-all"
              >
                {copyStatus}
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 font-mono text-[13px] leading-relaxed text-slate-300 whitespace-pre-wrap scrollbar-hide bg-slate-900/50">
              {assembledPrompt || "// 과제 정보를 입력하면 프롬프트가 조립됩니다."}
            </div>

            <div className="p-8 bg-slate-800/50 border-t border-slate-700/50">
              <button 
                onClick={handleRunTest}
                disabled={isGenerating || !inputs.task}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95"
              >
                {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 fill-current" />}
                {isGenerating ? 'Gemini 분석 중...' : '프롬프트 테스트 실행'}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 결과 오버레이 모달 */}
      {apiResult && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="px-12 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center">
                  <Sparkles className="text-white w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">분석 결과물</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Google Gemini 3 Flash</p>
                </div>
              </div>
              <button onClick={() => setApiResult(null)} className="p-3 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                <X className="w-8 h-8" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-12 text-slate-700 leading-relaxed whitespace-pre-wrap text-lg font-medium">
              {apiResult}
            </div>
            <div className="p-10 bg-white border-t border-slate-100 flex justify-end gap-5">
              <button onClick={() => setApiResult(null)} className="px-10 py-5 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">닫기</button>
              <button onClick={() => { navigator.clipboard.writeText(apiResult); alert('복사되었습니다.'); }} className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
                <Clipboard className="w-6 h-6" /> 결과 복사
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;