# ⌨️ Ditalografo Turbo

App de digitação com estética DOS para aprender a digitar de forma divertida.
Visual inspirado no MS-DOS/Windows 3.1: fundo azul, fonte monospace, bordas ASCII.

## Funcionalidades

- **18 lições progressivas** — de posição dos dedos a frases completas com acentuação
- **Teclado visual interativo** — destaca a tecla correta e o dedo a usar
- **Modo Cronômetro** — 60 segundos para digitar o máximo de palavras
- **Chuva de Palavras** — jogo onde palavras caem e você precisa digitá-las antes que cheguem ao chão
- **5 temas de palavras** — Geral, Pokémon, Jogos, Ciência e Esportes
- **3 níveis de dificuldade** na Chuva (Fácil, Normal, Difícil)
- **15 conquistas** desbloqueáveis (velocidade, precisão, sequência de dias…)
- **Perfis individuais** para Felipe e Maria — progresso salvo no navegador
- **Streak diário** — incentivo para praticar todo dia
- **Heatmap de erros** e gráfico de evolução de WPM

## Rodar localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:5173/datilografo/](http://localhost:5173/datilografo/) no navegador.

## Deploy

```bash
npm run deploy
```

Publica automaticamente no GitHub Pages via branch `gh-pages`.

**URL pública:** [https://albertobarros12.github.io/datilografo/](https://albertobarros12.github.io/datilografo/)

## Tecnologias

- [React 18](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- Sem backend — progresso salvo em `localStorage`
- CSS 100% inline (sem dependências de estilo externas)

---

Feito com ❤️ para Felipe e Maria
