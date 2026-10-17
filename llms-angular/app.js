// Dados: série "Agentic Engineering" (Angular Architects), snapshot de 26/ago/2026
const DEEPSWE = [
  ['Opus 5', 74], ['GPT‑5.6 Sol', 73], ['Fable 5', 70], ['GLM‑5.3', 69], ['Kimi K3', 69],
  ['Grok 4.6', 67], ['GPT‑5.6 Luna (max)', 67], ['GLM‑5.3 Flash', 63], ['DeepSeek V4 Pro', 63],
  ['Muse Spark 1.2', 55], ['DeepSeek V4 Flash', 53]
];

const MODELS = [
  { name: 'Fable 5 / 5.1', vendor: 'Anthropic', tag: 'qualidade', pos: '🥇',
    pros: 'Aguenta problemas longos e vagos, valida as próprias ideias, código de alta qualidade, visão forte.',
    cons: 'Lento (1–3 min por tarefa simples), caro (~€10/€50 por M tokens), retenção de 30 dias sem opt‑out.',
    use: 'Arquitetura, design, revisões e refatorações de longo prazo.' },
  { name: 'GPT‑5.6 Sol', vendor: 'OpenAI', tag: 'equilibrio', pos: '🥈',
    pros: 'Poucos tokens por tarefa, ~3x mais barato que o Fable por tarefa, uso incluído generoso, rápido.',
    cons: 'Mais sensível ao contexto: se partiu de premissa errada, abra uma thread nova.',
    use: 'Padrão do dia a dia: implementação focada, testes, merge conflicts, sub‑agente.' },
  { name: 'GLM‑5.3 Flash', vendor: 'Zhipu (Z.ai)', tag: 'barato', pos: '🥉',
    pros: 'Absurdamente rápido, ~€0,25 por tarefa, 63% no DeepSWE.',
    cons: 'Não é inteligência de fronteira.',
    use: 'Trabalho mecânico bem especificado: renomear, migrar APIs, gerar testes.' },
  { name: 'Opus 5', vendor: 'Anthropic', tag: 'qualidade', pos: '',
    pros: 'Líder do DeepSWE (74%), “mais bom gosto” da linha Claude.',
    cons: 'No dia a dia do autor não supera Fable 5 e Sol; caro demais como terceiro modelo fixo.',
    use: 'Alternativa dentro do mundo Claude (~2/3 do custo do Fable por tarefa em high).' },
  { name: 'Composer 2.5', vendor: 'Cursor', tag: 'barato', pos: '',
    pros: 'Muito rápido e barato; melhor ROI na época do lançamento (mai/2026).',
    cons: 'Só via Cursor; foi superado no verão.',
    use: 'Refatorações mecânicas dentro do Cursor.' },
  { name: 'Gemini 3.5 Flash', vendor: 'Google', tag: 'barato', pos: '',
    pros: 'Rápido às vezes.',
    cons: 'Usa idiomas antigos de Angular (signals e control flow); precisa de mais direcionamento.',
    use: 'Experimental; aguardar Gemini 3.5 Pro.' }
];

// Barras DeepSWE
const bars = document.getElementById('bars');
bars.innerHTML = DEEPSWE.map(([n, v]) =>
  `<div class="bar"><span class="bl">${n}</span><span class="bt"><span class="bf" style="width:${v / 80 * 100}%"></span></span><span class="bv">${v}%</span></div>`).join('');

// Cards de modelos com filtro
const cards = document.getElementById('cards');
function render(f) {
  cards.innerHTML = MODELS.filter(m => f === 'todos' || m.tag === f).map(m => `
    <article class="card">
      <h4>${m.pos} ${m.name} <small>${m.vendor}</small></h4>
      <p><b>Pontos fortes:</b> ${m.pros}</p>
      <p><b>Atenção:</b> ${m.cons}</p>
      <p><b>Use para:</b> ${m.use}</p>
    </article>`).join('');
}
render('todos');
document.getElementById('filters').addEventListener('click', e => {
  const b = e.target.closest('.chip'); if (!b) return;
  document.querySelectorAll('#filters .chip').forEach(c => c.classList.toggle('on', c === b));
  render(b.dataset.f);
});

// Calculadora de custo
const $ = id => document.getElementById(id);
function calc() {
  const [pin, pout] = $('cModel').value.split(',').map(Number);
  const inp = +$('cIn').value || 0, out = +$('cOut').value || 0, t = +$('cTurns').value || 1;
  const one = inp / 1e6 * pin + out / 1e6 * pout;
  const fmt = n => n.toLocaleString('pt-BR', { style: 'currency', currency: 'EUR' });
  $('cRes').innerHTML = `1 turno ≈ <strong>${fmt(one)}</strong> · ${t} turnos ≈ <strong>${fmt(one * t)}</strong>`;
}
['cModel', 'cIn', 'cOut', 'cTurns'].forEach(id => $(id).addEventListener('input', calc));
calc();

// Assistente de escolha
function advise() {
  const v = n => (document.querySelector(`input[name=${n}]:checked`) || {}).value;
  const [q1, q2, q3] = [v('q1'), v('q2'), v('q3')];
  const out = $('answer');
  if (!q1 || !q2 || !q3) { out.textContent = 'Responda as três perguntas para ver uma sugestão.'; return; }
  const plano = { baixo: 'Comece com um plano de ~€20 (OpenAI ou Anthropic) e suba só se bater nos limites.',
    medio: 'OpenAI + Anthropic (€20 cada) e, se quiser comparar, Cursor Pro; suba o provedor que virar gargalo para €100.',
    alto: 'Planos de €100–200 nos provedores que você mais usa. Para equipes, considere o Team Plan.' }[q2];
  const app = { app: 'App: T3 Code (open source, multi‑modelo) ou Codex app; Claude Desktop se viver no mundo Claude.',
    ide: 'IDE: use o plugin/extensão oficial (Claude Code, Codex) ou Cline; WebStorm com Junie para trabalho cuidadoso. Evite basear tudo em Copilot.',
    term: 'Terminal: opencode (primeira opção) ou Pi para quem gosta de customizar; CLIs do Codex e do Claude Code também servem.' }[q3];
  const modelo = q2 === 'baixo'
    ? 'Modelo: GPT‑5.6 Sol como padrão; GLM‑5.3 Flash (via OpenRouter) para o trabalho mecânico barato.'
    : 'Modelo: Sol como padrão; Fable para arquitetura, revisão e problemas vagos; GLM‑5.3 Flash para o braçal.';
  const priv = q1 === 'sim'
    ? '🟡 Código proprietário: use só termos aprovados (business/team/enterprise/API), nunca segredos, e verifique retenção — o Fable 5 exige 30 dias sem zero retenção.'
    : '🟢 Código público/estudo: planos pessoais servem; ainda assim, não coloque segredos no contexto.';
  out.innerHTML = [modelo, app, plano, priv, 'Sempre: guia de estilo + AGENTS.md + revisão humana de todo diff.']
    .map(s => `<p>${s}</p>`).join('');
}
document.querySelectorAll('.wizard input').forEach(i => i.addEventListener('change', advise));

// Link ativo no menu
const links = [...document.querySelectorAll('.links a')];
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(l => l.classList.toggle('on', l.getAttribute('href') === '#' + e.target.id));
}), { rootMargin: '-40% 0px -55% 0px' });
links.forEach(l => { const s = document.querySelector(l.getAttribute('href')); if (s) io.observe(s); });
