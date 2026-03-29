# 💰 Bolso Inteligente

O **Bolso Inteligente** é uma aplicação de gestão financeira pessoal moderna, focada em segurança, velocidade e experiência do usuário.

## 🚀 Tecnologias Utilizadas
- **React + TypeScript** (Vite)
- **Tailwind CSS** (UI moderna e responsiva)
- **Firebase Firestore** (Arquitetura de subcoleções para isolamento de dados)
- **Firebase Auth** (Autenticação segura)
- **Lucide React** (Ícones)

## 🏗️ Diferenciais Técnicos
- **Segurança de Dados:** Implementação de variáveis de ambiente para proteção de chaves de API e Security Rules no Firestore.
- **Escalabilidade:** Organização de banco de dados baseada em subcoleções (`users/{uid}/transactions`), garantindo performance mesmo com grande volume de dados.
- **UX Fluid:** Transições e modais customizados com Tailwind para uma experiência estilo "App de Banco".

## 🛠️ Como rodar o projeto localmente
1. Clone o repositório: `git clone https://github.com/Kaliandrik/bolso-inteligente.git`
2. Instale as dependências: `npm install`
3. Crie um arquivo `.env.local` com suas credenciais do Firebase.
4. Rode o projeto: `npm run dev`
