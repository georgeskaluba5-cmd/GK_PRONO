GK PRONO V1

Fichiers:
- server.js : backend sécurisé qui appelle API-Football
- public/index.html : interface du site
- package.json : dépendance Express

Installation:
1. Installer Node.js 18+.
2. Ouvrir un terminal dans ce dossier.
3. Lancer: npm install
4. Définir la variable API_FOOTBALL_KEY avec ta clé API.
   Exemple Linux/macOS:
   export API_FOOTBALL_KEY="TA_CLE"
   Exemple Windows PowerShell:
   $env:API_FOOTBALL_KEY="TA_CLE"
5. Lancer: npm start
6. Ouvrir http://localhost:3000

IMPORTANT:
- Ne mets jamais ta clé API dans index.html.
- Ne l'envoie pas dans une conversation ou dans un dépôt public.
