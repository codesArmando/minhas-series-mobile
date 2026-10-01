# Minhas Séries

App mobile para acompanhar as séries que você está assistindo. Permite cadastrar uma série com título, plataforma, temporadas assistidas e nota de 1 a 5, filtrar a lista entre **todas**, **assistindo** e **concluídas**, ver os detalhes, marcar como concluída, editar e excluir. Os dados ficam salvos no próprio aparelho com SQLite, então continuam lá depois de fechar o app.

Feito com Expo (SDK 57), Expo Router, expo-sqlite e NativeWind.

## Como rodar

Pré-requisitos: Node.js instalado e o app **Expo Go** (versão mais recente) no celular.

```bash
npm install
npx expo start
```

Depois, leia o QR code exibido no terminal com o Expo Go (Android) ou com a câmera (iOS). O celular e o computador precisam estar na mesma rede.

## Teste de persistência (Etapa 8)

Link do video com o teste de persistência dos dados:

https://drive.google.com/file/d/1Llwg7U7b2nHduQdz5MuLj2KWoko_g6gw/view?usp=drive_link

## Diário do Copiloto

### Registro 1 — Etapa 2

**O que eu pedi:** Eu pedi para ela gerar as interfaces em 'src/types/serie.ts' para que fosse mais rápida a escrita. Passei todos os atributos da serie para ela se basear.

**O que a IA sugeriu (resumo):** Ela criou o 'serie' como interface, e os demais como types. Explicou que fez assim e utilizou o Omit<...> para ocultar os atributos de Serie que não seriam utilizados em 'CreateSerieInput' e 'UpdateSerieInput'.

**O que eu fiz:** aceitei, pois facilitou a escrita do código, tem uma vantagem de que se for incluído um novo atributo em 'Série' que é editável pelo usuário, ele será atribuido automaticamente aos types 'CreateSerieInput' e 'UpdateSerieInput' (só é um ponto de atenção ajustar essas funções caso o atributo precise ser ignorado).

### Registro 2 — Etapa 3

**O que eu pedi:** Eu pedi para ela gerar o script de criação do banco mantendo o 'PRAGMA journal_mode = WAL; CREATE TABLE IF NOT EXISTS serie'.

**O que a IA sugeriu (resumo):** Ela criou o script baseado nos atributos que repassei e adicionou umas regras de validação no atributo 'nota' definindo que ele deve ser um valor de 1 a 5 e no 'concluida' aplicando uma validação do valor ser 1 ou 0, visto que o SQLite não tem boolean, e defindo o valor padrão como 0 'assistindo'.

**O que eu fiz:** aceitei, pois essas validações adicionam uma camada de proteção impedindo que um valor incorreto seja gravado no banco.

### Registro 3 — Etapa 4

**O que eu pedi:** Eu pedi para sugestões de como realizar o tratamento do 'SerieFilter' no SQL.

**O que a IA sugeriu (resumo):** Ela criou trouxe exemplos que tratavam o filtro selecionado no código antes de enviar para a consulta SQL.

**O que eu fiz:** neguei, pois sabia que havia a possibilidade de tratar o fitlro com o CASE WHEN THEN pelo SQL.

### Registro 4 — Etapa 1

**O que eu pedi:** Eu pedi para ela rodar o projeto com 'npx expo start -c', analisar a stacktrace e me dizer o que eu tinha feito de errado na configuração inicial.

**O que a IA sugeriu (resumo):** Ela identificou que o erro 'Cannot find module babel-preset-expo' vinha do 'babel.config.js' que criei para o NativeWind, e que faltavam dependências obrigatórias do NativeWind ('react-native-reanimated', 'react-native-worklets') e do Expo Router ('react-native-safe-area-context', 'expo-linking', '@expo/metro-runtime'), porque eu tinha instalado os pacotes com 'npm install' em vez de 'npx expo install'. Também apontou que o '_layout.tsx' estava vazio, que o 'global.css' não era importado e que o 'index.ts' do template importava um 'App' que não existia.

**O que eu fiz:** apliquei as correções por conta própria e passei a usar 'npx expo install' para adicionar pacotes, já que ele resolve as versões compatíveis com o SDK.

### Registro 5 — Etapa 7

**O que eu pedi:** Depois de criar a tela de detalhe, o Expo Go passou a mostrar "Something went wrong" com o log "Failed to download remote update". Achei que o problema era o código novo e pedi para ela voltar o projeto para o commit da Etapa 6.

**O que a IA sugeriu (resumo):** Ela voltou para a Etapa 6 sem apagar nada ('git switch --detach'), mas avisou que a diferença entre os commits era só a tela de detalhe e que aquele erro acontece antes de qualquer tela rodar, indicando problema de conexão entre o celular e o PC. Sugeriu testar o endereço '/status' no navegador do celular, usar o modo '--tunnel' e, como o '@expo/ngrok' falhava ao instalar globalmente (o npm do sistema instala em '/usr/local', que exige sudo), instalar o ngrok como dependência do projeto. Ela também errou o nome do branch ('main' em vez de 'master') e corrigiu depois.

**O que eu fiz:** confirmei que a Etapa 6 também falhava e que o '/status' não abria no celular, então o problema era a rede e não o código. Resolvi roteando o 4G do celular para o PC, e o app voltou a abrir com todas as telas.
