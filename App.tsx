
import React, { useState, useCallback, useMemo } from 'react';
import { TableParser } from './components/TableParser';
import { TableItem, AIAdvice } from './types';
import { getDBAAdvice } from './services/geminiService';
import { 
  Database, 
  Trash2, 
  RefreshCcw, 
  Copy, 
  Check, 
  AlertTriangle, 
  ShieldCheck, 
  Cpu,
  ChevronDown,
  ChevronUp,
  FileCode,
  Sparkles
} from 'lucide-react';

const App: React.FC = () => {
  const [rawInput, setRawInput] = useState<string>(`Table Names
WebServiceDataPresenters
WSPrePopulateMapping
DATASOURCEXSLT
MashupQueryParameter
MashupParamMapping
MashupDataSourceField
MashupDataSource
BusinessRuleEnforcement
AlertRuleVisibility
AlertRules
Level3Field
MultiLevelField
Level1Field
LevelFieldDetails
CustomfieldLookup
ObjectSchema
ControlFormat
StatusCodeAssignment 
StatusCodeMaster 
ItemVisibility 
flow.SwitchFlowMapping
flow.TransitionActor
flow.Transition
flow.FlowTransition
flow.FlowStepField
flow.FlowSteps
flow.FlowStage
flow.FlowActor
flow.FlowLane
flow.FlowDefinition
flow.FlowVersions
UILayoutMaster
UILayoutAssignment
FieldHelp
CalendarLayoutxml
LayoutViewMaster
UICustomLayout
LayoutGroupRoleMapping
LayoutGroupView
LayoutGroupStatusCodes
LayoutRelatedItems
LayoutFragment
ListingUtrmapping
LayoutAssignmentRule
CardsDependencyTable
LayoutBindingMappings
LayoutVisibility
LayoutStateMaster
CIS_Schedule
CIS_ScheduledJob
CIS_TaskExecutable
CIS_Mapping_Block
CIS_Task
CIS_Pass
CIS_Job
Az_RoleMember
Az_Role
Rpt_Query
ItemVisibility
RptScopeFilterVisiblity
ReportFilterOptions
Rpt_favorites
RunningReportFilter
ANALYTICSCONTROLCONFIG
UICustomHomeLayout
RPT_Categories
RPT_CategoryDisplayOrder
RPT_FilterCategory
RPT_ViewCategories
ViewFilterMapping
ViewOrder
CustomGraphFilter
GraphFilterCollection
FilterPolicy
ProfileCard
Cards
ProcessAction
ProcessInstance
ProcessMapping
Process
ProcessMandatoryRules
TranslatorActions
OptionVisibility
Journey
ServiceModelLinkVisibility
ServiceModelLinks
QuickLinkWidgets
QuickLinks`);

  const [parsedTables, setParsedTables] = useState<TableItem[]>([]);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [aiAdvice, setAiAdvice] = useState<AIAdvice | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'scripts' | 'tables'>('scripts');

  const handleParsed = useCallback((tables: TableItem[]) => {
    setParsedTables(tables);
  }, []);

  const scripts = useMemo(() => {
    const vacuum = parsedTables.map(t => `VACUUM (FULL, ANALYZE) "${t.schema ? t.schema + '"."' + t.name : t.name}";`).join('\n');
    const reindex = parsedTables.map(t => `REINDEX TABLE "${t.schema ? t.schema + '"."' + t.name : t.name}";`).join('\n');
    return {
      vacuum,
      reindex,
      combined: `-- DATABASE MAINTENANCE SCRIPT\n-- Generated for ${parsedTables.length} tables\n\n-- [PART 1] VACUUM FULL\n${vacuum}\n\n-- [PART 2] REINDEX\n${reindex}`
    };
  }, [parsedTables]);

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const generateAIAdvice = async () => {
    if (parsedTables.length === 0) return;
    setIsAiLoading(true);
    const advice = await getDBAAdvice(parsedTables.map(t => t.rawName));
    setAiAdvice(advice);
    setIsAiLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-xl py-8 px-4 sm:px-6 lg:px-8 mb-8 border-b-4 border-indigo-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-500 p-3 rounded-xl shadow-lg shadow-indigo-500/20">
              <Database className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">DB Maintenance Script Pro</h1>
              <p className="text-slate-400 font-medium">PostgreSQL Vacuum & Reindex Automation</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setRawInput('')}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-semibold transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Clear Input
            </button>
            <button 
              onClick={generateAIAdvice}
              disabled={isAiLoading || parsedTables.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Sparkles className={`w-4 h-4 ${isAiLoading ? 'animate-spin' : ''}`} />
              {isAiLoading ? 'Analyzing...' : 'Get AI DBA Insights'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Input Section */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-slate-400" />
                  Table Names Input
                </h3>
                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full">
                  {parsedTables.length} Detected
                </span>
              </div>
              <textarea
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                placeholder="Paste your table names here, one per line..."
                className="w-full h-[600px] p-6 focus:ring-0 focus:outline-none text-slate-600 font-mono text-sm resize-none bg-slate-50/30"
              />
              <TableParser input={rawInput} onParsed={handleParsed} />
            </div>
            
            {/* AI Advice Card */}
            {aiAdvice && (
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
                   <Cpu className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6" />
                    AI DBA Analysis
                  </h3>
                  <div className="space-y-4">
                    <section>
                      <h4 className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-1">Summary</h4>
                      <p className="text-sm leading-relaxed text-indigo-50">{aiAdvice.summary}</p>
                    </section>
                    <section>
                      <h4 className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-1">Recommendations</h4>
                      <ul className="text-sm space-y-1">
                        {aiAdvice.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-300 shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </section>
                    <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                      <h4 className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-300" />
                        Risk Assessment
                      </h4>
                      <p className="text-sm italic">{aiAdvice.riskAssessment}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Output Section */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
              <div className="flex border-b border-slate-200">
                <button
                  onClick={() => setActiveTab('scripts')}
                  className={`flex-1 px-6 py-4 text-sm font-bold transition-all ${activeTab === 'scripts' ? 'text-indigo-600 bg-indigo-50/50 border-b-2 border-indigo-500' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  Maintenance Scripts
                </button>
                <button
                  onClick={() => setActiveTab('tables')}
                  className={`flex-1 px-6 py-4 text-sm font-bold transition-all ${activeTab === 'tables' ? 'text-indigo-600 bg-indigo-50/50 border-b-2 border-indigo-500' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  Detected Tables List
                </button>
              </div>

              <div className="flex-1">
                {activeTab === 'scripts' ? (
                  <div className="p-6 space-y-8">
                    {/* Combined Script */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Combined Maintenance Script</h4>
                        <button 
                          onClick={() => copyToClipboard(scripts.combined, 'combined')}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${copiedType === 'combined' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                          {copiedType === 'combined' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          {copiedType === 'combined' ? 'Copied!' : 'Copy All'}
                        </button>
                      </div>
                      <div className="relative group">
                        <pre className="bg-slate-900 text-slate-300 p-6 rounded-xl text-sm overflow-auto max-h-[500px] border border-slate-800 shadow-inner scrollbar-hide">
                          <code>{scripts.combined}</code>
                        </pre>
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                           <FileCode className="w-8 h-8 text-slate-800" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Individual Vacuum */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vacuum Only</h4>
                          <button 
                            onClick={() => copyToClipboard(scripts.vacuum, 'vacuum')}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-500"
                            title="Copy Vacuum Script"
                          >
                            {copiedType === 'vacuum' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                        <pre className="bg-slate-50 border border-slate-200 p-4 rounded-lg text-xs overflow-auto h-32 text-slate-600">
                          {scripts.vacuum}
                        </pre>
                      </div>

                      {/* Individual Reindex */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reindex Only</h4>
                          <button 
                            onClick={() => copyToClipboard(scripts.reindex, 'reindex')}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-500"
                            title="Copy Reindex Script"
                          >
                            {copiedType === 'reindex' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                        <pre className="bg-slate-50 border border-slate-200 p-4 rounded-lg text-xs overflow-auto h-32 text-slate-600">
                          {scripts.reindex}
                        </pre>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[700px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                      {parsedTables.length === 0 ? (
                        <div className="col-span-2 py-20 flex flex-col items-center justify-center text-slate-400">
                          <Database className="w-12 h-12 mb-4 opacity-20" />
                          <p>No tables detected yet.</p>
                        </div>
                      ) : (
                        parsedTables.map((table) => (
                          <div 
                            key={table.id} 
                            className="group flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl hover:border-indigo-200 hover:bg-indigo-50/30 transition-all shadow-sm"
                          >
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-400 mb-0.5 uppercase tracking-tighter">
                                {table.schema || 'public'}
                              </span>
                              <span className="text-sm font-semibold text-slate-700 font-mono">
                                {table.name}
                              </span>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <RefreshCcw className="w-4 h-4 text-indigo-400" />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
               <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                 <AlertTriangle className="w-4 h-4 text-amber-500" />
                 Important Reminders
               </h4>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                   <p className="text-xs font-bold text-slate-500 mb-1">LOCKING</p>
                   <p className="text-xs text-slate-600 leading-relaxed">
                     <code className="text-red-500">VACUUM FULL</code> requires an exclusive lock. 
                     The table will be inaccessible during operation.
                   </p>
                 </div>
                 <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                   <p className="text-xs font-bold text-slate-500 mb-1">DISK SPACE</p>
                   <p className="text-xs text-slate-600 leading-relaxed">
                     Ensure you have at least 1.5x the size of the table available in free disk space.
                   </p>
                 </div>
                 <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                   <p className="text-xs font-bold text-slate-500 mb-1">ANALYZE</p>
                   <p className="text-xs text-slate-600 leading-relaxed">
                     Our script includes <code className="text-indigo-600">ANALYZE</code> to update 
                     the query planner statistics immediately.
                   </p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 py-3 text-center text-xs text-slate-400 font-medium z-50">
        Database maintenance tool built with Gemini 3 for Senior DBAs
      </footer>
    </div>
  );
};

export default App;
