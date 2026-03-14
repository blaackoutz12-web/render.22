# Betano Pro - Instruções de Implantação no Render

Este projeto é um monorepo que utiliza `pnpm`. Siga as etapas abaixo para colocar o sistema no ar.

## 1. Preparar o Repositório Git

Abra o terminal na pasta do projeto e execute os seguintes comandos:

```bash
# Inicializa o repositório
git init

# Adiciona todos os arquivos
git add .

# Faz o primeiro commit
git commit -m "Initial commit for Render deployment"

# Crie um repositório NOVO e VAZIO no GitHub e execute:
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git branch -M main
git push -u origin main
```

## 2. Configurar no Render.com

1. No painel do Render, clique em **"New +"** e selecione **"Blueprint"**.
2. Conecte sua conta do GitHub e selecione o repositório que você acabou de criar.
3. O Render lerá o arquivo `render.yaml` automaticamente.
4. Você verá dois serviços sendo criados:
   - **betano-api**: O servidor backend (Node.js).
   - **betano-dashboard**: O frontend estático.

## 3. Variáveis de Ambiente Importantes

No `render.yaml`, predefinimos algumas configurações, mas você pode precisar ajustar:

- **DATABASE_URL**: Se o seu projeto usa banco de dados, você precisará adicionar uma instância do PostgreSQL no Render e copiar a URL interna para as variáveis de ambiente do serviço `betano-api`.
- **VITE_API_URL**: No serviço `betano-dashboard`, altere o valor para a URL real que o Render atribuir ao seu serviço de API (ex: `https://betano-api.onrender.com/api`).

## Notas sobre o `pnpm`
O Render detectará automaticamente o uso do `pnpm` por causa do arquivo `pnpm-workspace.yaml`. As versões das dependências principais estão centralizadas no `package.json` raiz para garantir consistência.
