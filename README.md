# Eduardo Nunes — Portfólio

Site estático (HTML, CSS e JS puros, sem build) publicado no GitHub Pages em https://eduardonunes.dev.

## Publicação

Todo push na `master` publica sozinho pelo workflow `.github/workflows/pages.yml`:

1. `.github/version-assets.sh` acrescenta `?v=<hash>` nos CSS/JS referenciados pelos HTMLs (cache busting).
2. A pasta do site é montada sem `.git`, `.github` e `README.md`.
3. O resultado é enviado ao GitHub Pages.

O workflow não usa segredos, só as permissões padrão de deploy do Pages.

## Estrutura

- `index.html`, `404.html`: páginas.
- `assets/css/portfolio.css`, `assets/js/portfolio.js`: estilo e comportamento.
- `assets/data/linkedin-posts.json`: posts do LinkedIn exibidos no site (atualizado à mão).
- Seção **GitHub** (`#github`): o navegador lê os repositórios públicos de `DevEduNunes` pela API do GitHub (cache de 1 h). Entram os que têm descrição, não são fork nem arquivados (fora o próprio site). As tecnologias vêm das linguagens do repositório + *topics*; para ajustar, edite a descrição/topics no GitHub. Se a API falhar, a seção e o item do menu somem.
- `assets/fonts`, `assets/images`: fontes locais e imagens (dashboards em `.webp`).

## Domínio e DNS

- `CNAME` na raiz aponta para `eduardonunes.dev`.
- DNS no Cloudflare: 4 registros `A` do GitHub Pages (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153) e `CNAME www` para `devedununes.github.io`.
- `contato@eduardonunes.dev` é um alias (Cloudflare Email Routing); o endereço real não fica no repositório.

## Cuidados

- Não versionar chaves, tokens, `.env`, dados de clientes ou números pessoais.
- Os commits usam o e-mail `noreply` do GitHub.
