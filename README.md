# NLP-FER-CHATBOT

Za potrebe predmeta **Obrada prirodnog jezika** na **FER**-u u Zagrebu izrađena je web-aplikacija koja postepeno prikazuje mogućnosti i dobre prakse izrade _chatbotova_ koristeći razvojni okvir [LangChain](https://js.langchain.com/docs/introduction/).

Za izradu aplikacije korišten je razvojni okvir [Next.js](https://nextjs.org/).

## Dostupne rute

- `/no-markdown` - interakcija s modelom bez podrške za oblikovanje u formatu _Markdown_

- `/markdown` - interakcija s modelom s podrškom za oblikovanje u formatu _Markdown_
- `/message-persistence` - interakcija s modelom s perzistencijom razgovora - više poruka, pamćenje
- `/prompt-templates` - interakcija s modelom uz korištenje upitnih predložaka razvojnog okvira _LangChain_
- `/manage-history` - interakcija s modelom uz upravljanje poviješću razgovora
- `/stream` - interakcija s modelom u obliku toka - odgovor pristiže kako ga model generira

**Svaka ruta sadrži značajke prethodne rute**

## Postavljanje

1. klonirati projekt
2. generirati svoj API ključ za **Mistral AI**
3. postaviti varijablu okruženja `MISTRAL_API_KEY=generirani-ključ`
4. instalirati potrebne pakete - npr. `npm i`

## Pokretanje

za potrebe razvoja koristiti `npm run dev`

za potrebe korištenja i istraživanja koristiti:

1. `npm run build` - izgradnja aplikacije
2. `npm run start` - pokretanje izgrađene aplikacije
