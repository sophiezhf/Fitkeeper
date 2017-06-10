# Fitkeeper

### introduction
> c'est une application qui nous aide à personnaliser un plan de l'entraînement grâce aux données récupérées via API Jawbone UP. L'utilisateur
peut suivre leur sommeil et leur activité sportive pour améliorer leur santé. 

## Installation requirements
* [Node.js](https://nodejs.org/en/)
* [Git Client](https://git-scm.com/) 

## Installation requirements
  `npm install ejs` 
  
  `npm install express`
  
  `npm install fs`
  
  `npm install https`
  
  `npm install jawbone-up`
  
  `npm install passport`
  
  `npm install passport-oauth`
  

## Environnement requirements
* [Serveur HTTPS](https://doc.ubuntu-fr.org/tutoriel/securiser_apache2_avec_ssl) (OPENSSL pre-install)
  
  `openssl req -new -key server.key > server.csr`
  
  `openssl req -x509 -days 365 -key server.key -in server.csr > server.crt`
  
## Compte Developer Jawbone
> [Créer votre compte ici](https://jawbone.com/up/developer) 

Remplissez votre clien_id et client_secret dans le fichier server.js;

Votre callbackURI doit commencer par HTTPS et correspondre au redirect_uri dans votre application Jawbone.
