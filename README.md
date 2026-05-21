# Aplicativo de Gestão de Resíduos

Aplicativo web criado com base na apresentação **Apresentacao_Gestao_Ambiental_BRACELL 17.05.26.pptx**.

## Como usar

1. Abra o arquivo `index.html` no navegador.
2. Use a seção **Controle de Resíduos** para cadastrar registros.
3. Acompanhe os indicadores na seção **Dashboard Ambiental**.
4. Consulte os planos e as fotos originais em **Planos de Ação** e **Galeria Técnica**.

## Publicação no Streamlit

1. Use o arquivo `streamlit_app.py` como ponto de entrada.
2. Instale dependências com `pip install -r requirements.txt`.
3. Execute localmente com `streamlit run streamlit_app.py`.
4. Na plataforma Streamlit Cloud, selecione `streamlit_app.py` como *Main file path*.

## Estrutura

- `index.html`: layout do aplicativo.
- `styles.css`: estilos visuais e responsividade.
- `app.js`: regras de negócio, filtros, cadastro e dashboard.
- `data/slides-data.js`: dados da apresentação (36 slides).
- `assets/images/`: imagens extraídas da apresentação.
- `streamlit_app.py`: versão para publicação no Streamlit.

## Observação

Os registros criados no formulário ficam salvos no navegador (`localStorage`) deste computador.
